import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;

// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', });


const URL = `https://pixabay.com/api/`

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('input'),
    subBtn: document.querySelector('.search-btn'),
    gallery: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more'),
}

const searchParam = new URLSearchParams({
    key: "29157383-7b7a3db408c81f6fc8c1e0e94",
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: '40'
})

refs.form.addEventListener('submit', onSubmit)

function onSubmit(e) {
    e.preventDefault()
    refs.gallery.innerHTML = ""

    const search = refs.input.value.trim()
    goFetch(search).then((data) => {
        const respArr = data.data.hits
        console.log(respArr)
        markupCards(respArr)
    })
}

// function loadMore() {
    
// }

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

async function goFetch(search) {

    let page = 1
    try {
        const response = await axios.get(`${URL}?q=${search}&${searchParam}&page=${page}`)
        if (response.data.total === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }
        return response
    } catch (error) {
        console.error(error);
    }
}

