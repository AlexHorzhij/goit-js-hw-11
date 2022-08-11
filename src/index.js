import { Notify } from 'notiflix/build/notiflix-notify-aio';

import NewApiForFetch from './js/js-api';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', });

const newFetchApi = new NewApiForFetch()

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('input'),
    subBtn: document.querySelector('.search-btn'),
    gallery: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more'),
    btnDiv: document.querySelector('.btn-div')
}

refs.form.addEventListener('submit', onSubmit)
refs.loadBtn.addEventListener('click', loadMore)

function loadMore() {
    newFetchApi.goFetch().then((data) => {
        const respArr = data.data.hits
        markupCards(respArr)
        console.log(newFetchApi.page)

        const pageCount = Math.ceil(data.data.totalHits / 40)
        const currentPage = newFetchApi.page

        if (pageCount < currentPage) {
            refs.loadBtn.classList.add('is-hidden')
            Notify.info("We're sorry, but you've reached the end of search results.")
        }
    }).catch(error => console.log("error"))
}

function onSubmit(e) {
    e.preventDefault()
    refs.gallery.innerHTML = ""
    refs.loadBtn.classList.add('is-hidden')
    newFetchApi.resetPage()

    newFetchApi.query = refs.input.value.trim()
    newFetchApi.goFetch().then((data) => {
        Notify.success(`Hooray! We found ${data.data.totalHits} images.`);

        const respArr = data.data.hits
        const pageCount = Math.ceil(data.data.totalHits / 40)
        const currentPage = newFetchApi.page

        if (pageCount >= currentPage) {
            refs.loadBtn.classList.remove('is-hidden')
        }

        markupCards(respArr)
    }).catch(error => console.log(error))
}

function markupCards(dataArr) {
    const markup = dataArr.reduce((acc, item) => {return acc +
    `<a href=${item.largeImageURL}>
        <div class="photo-card">
        <div class="thumb">
            <img src=${item.webformatURL} alt=${item.tags} loading="lazy" />
        </div>
        <div class="info">
            <p class="info-item">
            <b>Likes</b> ${item.likes}
            </p>
            <p class="info-item">
            <b>Views</b> ${item.views}
            </p>
            <p class="info-item">
            <b>Comments</b> ${item.comments}
            </p>
            <p class="info-item">
            <b>Downloads</b> ${item.downloads}
            </p>
        </div>
        </div>
    </a>`
}, "")
    refs.gallery.insertAdjacentHTML("beforeend", markup)
}


Notify.init({
    width: '700px',
    fontSize: '30px',
    borderRadius: '10px',
    position: 'center-top',
    fontAwesomeIconSize: '64px',
});


// function hideLoadBtn() {
//     const pageCount = data.data.totalHits / 40
//     const currentPage = newFetchApi.page

//             if ( pageCount < currentPage) {
            
//         }

//     refs.loadBtn.classList.add('is-hidden')
//     Notify.failure("We're sorry, but you've reached the end of search results.")
// }
