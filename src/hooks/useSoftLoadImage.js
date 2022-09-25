import {useEffect, useRef} from "react";
import axios from "axios";

export const useSoftLoadImage = (placeholderUrl, imageUrl) => {

    // TODO: make this return <img>
    let result = useRef({
        data: placeholderUrl,
        isSuccess: false,
        isLoading: false,
        isError: false,
        error: null
    })
    
    useEffect(() => {
        if (!imageUrl) {
            return
        }
        console.log('loading image from: ', imageUrl);
        result.current = {
            ...result.current,
            isLoading: true
        }
        axios.get(imageUrl)
            .then(() => {
                result.current = {
                    ...result.current,
                    isSuccess: true,
                    isLoading: false,
                    data: imageUrl
                }
            }).catch(error => {
                result.current = {
                    ...result.current,
                    isError: true,
                    isLoading: false,
                    error
                }
        })
    }, [result, imageUrl, placeholderUrl])
    return result.current
}
