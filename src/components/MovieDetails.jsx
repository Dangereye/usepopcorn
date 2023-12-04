import { useState, useEffect } from 'react';

import StarRating from './StarRating';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

export default function MovieDetails({
  selectedId,
  setSelectedId,
  watched,
  setWatched,
}) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  function handleAddToWatchedList() {
    const newMovie = {
      ...movie,
      imdbRating: Number(movie.imdbRating),
      userRating,
      Runtime: Number(movie.Runtime.split(' ').at(0)),
    };

    setWatched([...watched, newMovie]);
    setSelectedId(null);
  }
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
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]);

  console.log('Watched: ', watched);
  console.log('Movie: ', movie);
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
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button
                      className='btn-add'
                      onClick={handleAddToWatchedList}
                    >
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  <span>⭐</span>
                  {watchedUserRating} User rating
                </p>
              )}
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
