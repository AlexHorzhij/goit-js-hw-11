import { Notify } from 'notiflix/build/notiflix-notify-aio';

import NewApiForFetch from './js/js-api';

const newFetchApi = new NewApiForFetch()
console.log(newFetchApi)

// // Описаний в документації
// import SimpleLightbox from "simplelightbox";
// // Додатковий імпорт стилів
// import "simplelightbox/dist/simple-lightbox.min.css";

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
    newFetchApi.query = refs.input.value.trim()
    newFetchApi.goFetch().then((data) => {
        const respArr = data.data.hits
        markupCards(respArr)
        console.log(newFetchApi.page)

        if (data.data.totalHits < newFetchApi.page) {
            hideLoadBtn()
        }
    })
}

function hideLoadBtn() {
    refs.loadBtn.classList.add('is-hidden')
    Notify.failure("We're sorry, but you've reached the end of search results.")
}

function onSubmit(e) {
    e.preventDefault()
    refs.gallery.innerHTML = ""
    refs.loadBtn.classList.add('is-hidden')
    newFetchApi.resetPage()

    newFetchApi.query = refs.input.value.trim()
    newFetchApi.goFetch().then((data) => {
        Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
        console.log(data)
        const respArr = data.data.hits
        markupCards(respArr)
    }).catch(error => console.log("error"))
    refs.loadBtn.classList.remove('is-hidden')
}

function markupCards(dataArr) {
        const markup = dataArr.reduce((acc, item) => {return acc +
        `<a href="${item.largeImageURL}">
        <div class="photo-card">
        <div class="thumb">
             <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
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
        </div></a>`
    }, "")
    refs.gallery.insertAdjacentHTML("beforeend", markup)
    // refresh()
}




// var lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', });

