import useSWR from "swr"

const fetcher = async (...args) => {
  const response = await fetch(...args);
  if (response.status === 404) {
    console.warn('Data not found (404)');
    return { notFound: true };
  }
  if (!response.ok) {
    console.error('Error fetching data:', response.status, response.statusText);
    throw new Error(`Error fetching data: ${response.statusText}`);
  }
  const text = await response.text();
  console.log('Response text:', text);
  return JSON.parse(text);
};

export function useAllEvents() {
  const { data, error } = useSWR('/api/allEvents', fetcher);

  return {
    data,
    notFound: data && data.notFound,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useStardiscRegistryByAccount (account) {
    return useSWR(`/api/stardisc_registry/${account}`, fetcher)
}

export function useBlockEvents () {
    return useSWR('/api/blockEvents', fetcher)
}

export function useGameCompleteEvents () {
    return useSWR('/api/gameEvents', fetcher)
}
