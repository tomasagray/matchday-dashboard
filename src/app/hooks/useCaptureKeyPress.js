import {useEffect} from "react";

export const useCaptureKeyPress = (props) => {

    let {key, action} = props

    useEffect(() => {
        const listener = (e) => {
            let isWatchedKey = e.key === key
            if (isWatchedKey && e.ctrlKey) {
                e.preventDefault()
                action(e)
            }
        }
        document.addEventListener('keydown', listener)
        // cleanup on component unmount
        return () => document.removeEventListener('keydown', listener)
    }, [action, key])
}
