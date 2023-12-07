import { useEffect, useState } from 'react';

export default function useMovies(query, setSelectedId) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
  }, [query, setSelectedId]);

  return { movies, isLoading, error };
}
