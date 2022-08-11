const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';


export default class NewApiForFetch{
    constructor(){
        this.searchQuery = ''
        this.page = 1
    }

    async goFetch() {
        const URL = `https://pixabay.com/api/`

        const searchParam = new URLSearchParams({
            key: "29157383-7b7a3db408c81f6fc8c1e0e94",
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            per_page: '40'
        })
        try {
        const response = await axios.get(`${URL}?q=${this.searchQuery}&${searchParam}&page=${this.page}`)
        this.page += 1
            
        if (response.data.total === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }
            return response
        } catch (error) {
            console.error(error);
        }
    }

    get query() {
        return this.searchQuery
    }
    set query(newQuery) {
        this.searchQuery = newQuery
    }
    resetPage() {
        this.page = 1
    }
    
}

Notify.init({
    width: '700px',
    fontSize: '30px',
    borderRadius: '10px',
    position: 'center-top',
    fontAwesomeIconSize: '64px',
});