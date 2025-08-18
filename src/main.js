import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formEl = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.button-load');

let query = '';
let page = 1;
const perPage = 15;
let totalHits = 0;

formEl.addEventListener('submit', async e => {
  e.preventDefault();

  query = e.target.elements['search-text'].value.trim();

  if (!query) {
    iziToast.warning({
      message: 'Please enter a search term!',
    });
    return;
  }

  page = 1;
  hideLoadMoreButton();
  clearGallery();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page, perPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    createGallery(data.hits);

    if (totalHits > perPage) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(query, page, perPage);
    createGallery(data.hits);

    const { height: cardHeight } = document
      .querySelector('.gallery-item')
      .getBoundingClientRect();
    window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });

    if (page * perPage >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    hideLoader();
  }
});
