import {useEffect} from "react";

export const useValidateForm = (flags, validSetter) => {
    useEffect(() => {
        let isFormValid = flags.reduce((isValid, flag) => isValid && flag)
        validSetter(isFormValid)
    }, [flags, validSetter])
}
