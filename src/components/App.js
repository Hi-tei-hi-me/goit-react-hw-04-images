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
  const [isLoading, setIsLoading] = useState({ isLoading: false });
  const totalPages = totalHits / 12;

  useEffect(() => {
    const fetchEditorsChoiceImages = async () => {
      try {
        setIsLoading({ isLoading: true });
        const images = await API.editorsChoiceImages();
        setImages([...images.data]);
        setTotalHits(images.totalHits);
        setError('');
        showToast(
          'Look how many cool pics our editors have chosen for you!',
          'editorsChoice'
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading({ isLoading: false });
      }
    };
    fetchEditorsChoiceImages();
  }, []);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading({ isLoading: true });
        const images = await API.queryImages(searchQuery, page);
        setImages(prevState => [...prevState, ...images.data]);
        if (!images.data.length) {
          return showToast(
            `Sorry, we couldn't find any ${searchQuery}`,
            'nothingFound'
          );
        }
        if (images.data.length && page === 1) {
          showToast(
            `Hooray! We have found ${images.totalHits} photos of ${searchQuery}`,
            'found'
          );
        }
        setTotalHits(images.totalHits);
        setError('');
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading({ isLoading: false });
      }
    };
    fetchImages();
  }, [searchQuery, page]);
  const onSubmit = ({ searchQuery }) => {
    if (searchQuery === setSearchQuery) {
      return showToast(
        `There are no another ${searchQuery} images for you, but you can try to find something else`,
        'repeatedQuery'
      );
    }
    setSearchQuery(searchQuery);
    setImages([]);
    setPage(1);
  };
  const loadMore = () => {
    setPage(prevState => prevState + 1);
  };
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AppWrap>
        <Searchbar onSubmit={onSubmit} />
      </AppWrap>
      {isLoading && <Loader />}
      {images.length > 0 && (
        <AppWrap>
          <ImageGallery images={images} />
          {totalPages > page && <Button onClick={loadMore} />}
        </AppWrap>
      )}
      {error && <Error textError={error} />}
    </>
  );
};
