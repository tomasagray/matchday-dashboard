import React, {useEffect} from "react";

export const useClickOutsideComponent = (ref, action) => {
    useEffect(() => {

        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                action(e)
            }
        }

        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [ref])
}
