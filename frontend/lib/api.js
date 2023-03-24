import useSWR from "swr"

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function useAllEvents () {
    return useSWR('/api/allEvents', fetcher)
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
