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

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(() => {
    const storedMovies = JSON.parse(localStorage.getItem('watched'));
    return storedMovies;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setError('');
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error('Something went wrong fetching movies.');

        const data = await res.json();

        if (data.Response === 'False') throw new Error('Movie not found!');
        setSelectedId(null);
        setMovies(data.Search);
        setError('');
      } catch (err) {
        console.error(err.message);
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

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
