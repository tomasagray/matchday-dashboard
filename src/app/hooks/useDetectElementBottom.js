import {useEffect} from "react";

export const useDetectElementBottom = (contentStage, action) => {

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
