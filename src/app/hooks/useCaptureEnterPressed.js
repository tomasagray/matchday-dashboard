import {useEffect} from "react";

export const useCaptureEnterPressed = (props) => {

    let {isFocused, action, ref} = props

    useEffect(() => {
        const listener = (e) => {
            const value = e.target.value
            let isValueValid = value !== ''
            let isEnterButton = e.code === 'Enter' || e.code === 'NumpadEnter'
            if (isFocused && isEnterButton && isValueValid) {
                e.preventDefault()
                action(value)
                ref.current?.blur()
            }
        }
        document.addEventListener('keydown', listener)
        // cleanup on component unmount
        return () => document.removeEventListener('keydown', listener)
    }, [action, isFocused, ref])
}
