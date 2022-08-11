import { Notify } from 'notiflix/build/notiflix-notify-aio';

import NewApiForFetch from './js/js-api';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const newFetchApi = new NewApiForFetch()

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('input'),
    subBtn: document.querySelector('.search-btn'),
    gallery: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more'),
    btnDiv: document.querySelector('.btn-div'),
    body: document.querySelector('body'),
    info: document.querySelector('.load-info')
}

refs.form.addEventListener('submit', onSubmit)
// refs.loadBtn.addEventListener('click', loadMore)
window.addEventListener('scroll', autoLoadContent)


// LOAD WITH BUTTON
// function loadMore() {
//     newFetchApi.goFetch().then((data) => {
//         const respArr = data.data.hits
//         markupCards(respArr)
//         scrollGallery()

//         const pageCount = Math.ceil(data.data.totalHits / 40)
//         const currentPage = newFetchApi.page

//         if (pageCount < currentPage) {
//             refs.loadBtn.classList.add('is-hidden')
//             Notify.info("We're sorry, but you've reached the end of search results.")
//         }
//     }).catch(error => console.log("error"))
// }

// function scrollGallery() {
//     const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect()

//     window.scrollBy({
//         top: cardHeight * 2,
//         behavior: "smooth",
//     });
// }

// function onSubmit(e) {
//     e.preventDefault()
//     refs.gallery.innerHTML = ""
//     refs.loadBtn.classList.add('is-hidden')
//     newFetchApi.resetPage()

//     newFetchApi.query = refs.input.value.trim()
//     newFetchApi.goFetch().then((data) => {
//         Notify.success(`Hooray! We found ${data.data.totalHits} images.`);

//         const respArr = data.data.hits
//         const pageCount = Math.ceil(data.data.totalHits / 40)
//         const currentPage = newFetchApi.page

//         if (pageCount >= currentPage) {
//             refs.loadBtn.classList.remove('is-hidden')
//         }
//         markupCards(respArr)
//     }).catch(error => console.log(error))
// }

function autoLoadContent() {
    const rect = document.documentElement.getBoundingClientRect()
    if (rect.bottom < document.documentElement.clientHeight+150) {
        loadMoreInfinity()
    }
}

function loadMoreInfinity() {
    newFetchApi.goFetch().then((data) => {
        const respArr = data.data.hits
        markupCards(respArr)  
        
    }).catch(error => {
        console.log(error)
    })
    refs.info.classList.remove('is-hidden')
}

function onSubmit(e) {
    e.preventDefault()
    refs.gallery.innerHTML = ""
    newFetchApi.resetPage()
    refs.info.classList.add('is-hidden')

    newFetchApi.query = refs.input.value.trim()
    newFetchApi.goFetch().then((data) => {
        const respArr = data.data.hits
        markupCards(respArr)
    if (data.data.total !== 0) {
    Notify.success(`Hooray! We found ${data.data.totalHits} images.`);
    }
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
    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh()
}

Notify.init({
    width: '700px',
    fontSize: '30px',
    borderRadius: '10px',
    // position: 'right-top',
    position: 'right-top',
    fontAwesomeIconSize: '64px',
});



