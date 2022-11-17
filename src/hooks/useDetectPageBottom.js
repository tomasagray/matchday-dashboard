import {useEffect} from "react";


export const useDetectPageBottom = (action) => {
    const pageElement = 'Content-stage'
    const contentStage = document.getElementById(pageElement)

    useEffect(() => {
        const handlePageScroll = () => {
            let isAtBottom = contentStage.scrollTop + contentStage.clientHeight >= contentStage.scrollHeight
            if (isAtBottom) {
                action && action()
            }
        }
        contentStage?.addEventListener('scroll', handlePageScroll)
        return () => contentStage?.removeEventListener('scroll', handlePageScroll)
    }, [contentStage, action])
}
