export const JsonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}

export const serverAddressCookie = '__Server-address'

export const infiniteQueryOptions = {
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => lastPageParam + 1,
}
