export default function WatchedMovie({ movie, watched, setWatched }) {
  function handleRemoveWatchedMovie(id) {
    setWatched((watched) =>
      watched.filter((watchedMovie) => watchedMovie.imdbID !== movie.imdbID)
    );
  }
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.Runtime} min</span>
        </p>
        <button className='btn-delete' onClick={handleRemoveWatchedMovie}>
          x
        </button>
      </div>
    </li>
  );
}
