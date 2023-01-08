import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import * as API from '../data/api';
import { AppWrap } from './Wrapper/AppWrap.styled';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Error } from './Error/Error';
import { showToast } from 'utils/toaster';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const totalPages = totalHits / 12;

  useEffect(() => {
    if (searchQuery) {
      return;
    }
    const fetchEditorsChoiceImages = async () => {
      try {
        setIsLoading(true);
        const images = await API.editorsChoiceImages(page);
        setImages(prevState => [...prevState, ...images.data]);
        setTotalHits(images.totalHits);
        if (page === 1) {
          showToast(
            'Look how many cool pics our editors have chosen for you!',
            'editorsChoice'
          );
        }
        setError('');
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEditorsChoiceImages();
  }, [searchQuery, page]);
  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const images = await API.queryImages(searchQuery, page);
        setImages(prevState => [...prevState, ...images.data]);
        setTotalHits(images.totalHits);
        if (!images.data.length) {
          return showToast(
            `Sorry, we couldn't find any ${searchQuery}`,
            'nothingFound'
          );
        }
        if (page === 1) {
          showToast(
            `Hooray! We have found ${images.totalHits} photos of ${searchQuery}`,
            'found'
          );
        }
        setError('');
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, [searchQuery, page]);
  const onSubmit = data => {
    const normalizedQuery = data.searchQuery.trim().toLowerCase();
    if (normalizedQuery === searchQuery) {
      return showToast(
        `There are no another ${searchQuery} images for you, but you can try to find something else`,
        'repeatedQuery'
      );
    }
    setSearchQuery(normalizedQuery);
    setImages([]);
    setPage(1);
  };
  const loadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const showImgGallery = images.length > 0;
  const showLoadMoreBtn = images.length > 0 && totalPages > page;
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AppWrap>
        <Searchbar onSubmit={onSubmit} />
        {showImgGallery && <ImageGallery images={images} />}
        {isLoading && <Loader />}
        {showLoadMoreBtn && <Button onClick={loadMore} />}
        {error && <Error textError={error} />}
      </AppWrap>
    </>
  );
};
