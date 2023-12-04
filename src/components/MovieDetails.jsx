import { useState, useEffect } from 'react';

import StarRating from './StarRating';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

export default function MovieDetails({ selectedId, setSelectedId }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API}&i=${selectedId}`
        );

        if (!res.ok) throw new Error('Oops! Something went wrong.');
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]);
  return (
    <div className='details'>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage mesage={error} />
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={() => setSelectedId(null)}>
              &larr;
            </button>
            <img src={movie.Poster} alt={movie.Title} />
            <div className='details-overview'>
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐</span>
                {movie.imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className='rating'>
              <StarRating maxRating={10} size={24} />
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
