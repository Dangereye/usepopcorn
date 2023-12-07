import { useState, useEffect } from 'react';

// Components
import Header from './components/Header';
import Search from './components/Search';
import NumResults from './components/NumResults';
import Main from './components/Main';
import ToggleBox from './components/ToggleBox';
import MovieList from './components/MovieList';
import WatchedSummary from './components/WatchedSummary';
import WatchedMovieList from './components/WatchedMovieList';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import MovieDetails from './components/MovieDetails';

// Hooks
import useMovies from './hooks/useMovies';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(() => {
    const storedMovies = JSON.parse(localStorage.getItem('watched'));
    return storedMovies;
  });

  const { movies, isLoading, error } = useMovies(query, setSelectedId);

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

  return (
    <>
      <Header>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Header>
      <Main>
        <ToggleBox>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <MovieList movies={movies} setSelectedId={setSelectedId} />
          )}
        </ToggleBox>
        <ToggleBox>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              watched={watched}
              setWatched={setWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} setWatched={setWatched} />
            </>
          )}
        </ToggleBox>
      </Main>
    </>
  );
}
