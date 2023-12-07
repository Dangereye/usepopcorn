import { useEffect, useState } from 'react';

export default function useLocalStorage() {
  const [watched, setWatched] = useState(() => {
    const storedMovies = JSON.parse(localStorage.getItem('watched'));
    return storedMovies;
  });

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

  return [watched, setWatched];
}
