import {useState} from "react";

export const useFetch = () => {

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    const initialState = {
        data: null,
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: null,
    }
    let [state, setState] = useState(initialState)

    const fetchData = async (url) => {
        setState({
            ...initialState,
            isLoading: true,
        })
        await fetch(url, {headers})
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(data => {
                            setState({
                                data,
                                isLoading: false,
                                isSuccess: true,
                                isError: false,
                                error: null,
                            })
                        })
                }
            })
            .catch(error => {
                setState({
                    data: null,
                    isLoading: false,
                    isSuccess: false,
                    isError: true,
                    error,
                })
            })
    }
    return [fetchData, state]
}