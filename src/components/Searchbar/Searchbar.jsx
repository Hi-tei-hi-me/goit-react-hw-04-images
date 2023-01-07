import { useState } from 'react';
import { RiSearchEyeLine } from 'react-icons/ri';
import {
  Header,
  SearchForm,
  SearchBtn,
  SearchBtnLabel,
  SearchFormInput,
} from './Searchbar.styled';
import { showToast } from 'utils/toaster';

/* <header class="searchbar">
  <form class="form">
    <button type="submit" class="button">
      <span class="button-label">Search</span>
    </button>

    <input
      class="input"
      type="text"
      autocomplete="off"
      autofocus
      placeholder="Search images and photos"
    />
  </form>
</header>; */

export const Searchbar = ({ onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const reset = () => {
    setSearchQuery('');
  };
  const handleChange = evt => {
    const { value } = evt.target;
    setSearchQuery(value);
  };
  const handleSubmit = evt => {
    evt.preventDefault();
    if (searchQuery.trim().toLowerCase() === '') {
      return showToast(
        'You should enter keyword if you want to find something',
        'incorrectQuery'
      );
    }
    onSubmit({ searchQuery });
    reset();
  };
  return (
    <Header>
      <SearchForm onSubmit={handleSubmit}>
        <SearchBtn type="submit">
          <SearchBtnLabel>Search</SearchBtnLabel>
          <RiSearchEyeLine size={25} />
        </SearchBtn>
        <SearchFormInput
          type="text"
          autoFocus
          autocomplete="off"
          placeholder="Search images of..."
          value={searchQuery}
          onChange={handleChange}
        />
      </SearchForm>
    </Header>
  );
};
