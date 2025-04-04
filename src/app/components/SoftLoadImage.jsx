import React, {useState} from "react";

export const SoftLoadImage = (props) => {

    // handlers
    const onImageLoaded = () => setIsLoaded(true)
    const onImageLoadError = () => setIsLoaded(false)

    // state
    let {hash, placeholderUrl, imageUrl, className} = props
    let [isLoaded, setIsLoaded] = useState(false)

    // components
    let imageClass = 'Soft-load-image ' + (!isLoaded ? 'not-displayed' : '')
    let placeholderClass = 'Soft-load-image placeholder ' + (isLoaded ? 'not-displayed' : '')

    return (
        <div className={"Soft-load-container " + (className ?? '')}>
            <img src={placeholderUrl} className={placeholderClass} alt={"..."}/>
            <img
                src={imageUrl}
                className={imageClass}
                alt=""
                onLoad={onImageLoaded}
                onError={onImageLoadError}
            />
        </div>
    );
}
