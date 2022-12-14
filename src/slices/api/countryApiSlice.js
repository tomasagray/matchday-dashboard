import {apiSlice} from "./apiSlice";

export const countryApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            fetchAllCountries: builder.query({
                query: () => '/countries/all',
                transformResponse: (response) => {
                    let {_embedded} = response
                    if (_embedded) {
                        let {countries} = _embedded
                        return countries
                    }
                }
            }),
        })
    }
})

export const {
    useFetchAllCountriesQuery,
} = countryApiSlice
