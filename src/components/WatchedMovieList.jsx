import WatchedMovie from './WatchedMovie';

export default function WatchedMovieList({ watched, setWatched }) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          watched={watched}
          setWatched={setWatched}
        />
      ))}
    </ul>
  );
}
