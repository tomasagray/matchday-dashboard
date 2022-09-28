import {useEffect, useRef} from "react";

export const useSoftLoadImage = (props) => {

    let {placeholderUrl, imageUrl, className} = props
    let result = useRef({
        data: <img src={placeholderUrl} alt="..." className={className} />,
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
        fetch(imageUrl)
            .then((response) => {
                console.log('fetch done', response)
                result.current = {
                    ...result.current,
                    isSuccess: response.ok,
                    isError: !response.ok,
                    isLoading: false,
                    data: <img src={imageUrl} alt="" className={className} />
                }
            }).catch(error => {
                result.current = {
                    ...result.current,
                    isError: true,
                    isLoading: false,
                    error
                }
        })
        return () => {
            console.log('cleaning up....', result.current)
        }
    }, [result, imageUrl, placeholderUrl, className])
    return result.current
}
