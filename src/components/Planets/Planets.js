import Planet from 'components/Planet/Planet';
import { useState } from 'react';
import { useQuery } from 'react-query';

const fetchPlanets = (page = 0) =>
  fetch(`http://swapi.dev/api/planets/?page=` + page).then((res) => res.json());

const Planets = () => {
  const [page, setPage] = useState(1);
  const { isLoading, isError, error, data, isFetching, isPreviousData } =
    useQuery(['planets', page], () => fetchPlanets(page), {
      keepPreviousData: true,
    });

  return (
    <div>
      <h2>Planets</h2>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error: {error.message} </div>
        ) : (
          <div>
            {data.results.map((planet) => (
              <Planet key={planet.name} planet={planet} />
            ))}
          </div>
        )}
        <span>Current Page: {page}</span>
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 0))}
          disabled={page === 0}
        >
          Previous Page
        </button>{' '}
        <button
          onClick={() => {
            if (!isPreviousData && data.hasMore) {
              setPage((old) => old + 1);
            }
          }}
          // Disable the Next Page button until we know a next page is available
          disabled={isPreviousData || !data?.hasMore}
        >
          Next Page
        </button>
        {isFetching ? <span> Loading...</span> : null}{' '}
      </div>
    </div>
  );
};

export default Planets;
