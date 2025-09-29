import React, {useEffect, useRef, useState} from "react";

export const ContentBar = (props) => {

    // handlers
    const onPrevClick = () => {
        console.log('prev')
        setCurrentSlide(currentSlide - 1)
    }
    const onNextClick = () => {
        console.log('next')
        console.log('currentSlide', currentSlide)
        setCurrentSlide(currentSlide + 1)
    }

    let {title, items} = props

    // state
    let [isPrevDisabled, setIsPrevDisabled] = useState(false)
    let [isNextDisabled, setIsNextDisabled] = useState(false)
    let [offset, setOffset] = useState(0)
    // slide = section of itemList <= in width as contentBar
    let [slideCount, setSlideCount] = useState(0)
    let [currentSlide, setCurrentSlide] = useState(0)
    const contentBar = useRef(null)
    const itemList = useRef(null)

    useEffect(() => {
        if (contentBar.current !== null && itemList.current !== null) {
            let {offsetWidth: contentBarWidth} = contentBar.current
            let {offsetWidth: itemListWidth} = itemList.current

            // determine slide count
            const slides = Math.floor(itemListWidth / contentBarWidth) - 1
            setSlideCount(slides)
            // set carousel position
            setOffset(contentBarWidth * currentSlide * -1)

            // previous button
            if (currentSlide <= 0) {
                setIsPrevDisabled(true)
            } else {
                setIsPrevDisabled(false)
            }

            // next button
            if (currentSlide <= slideCount) {
                setIsNextDisabled(false)
            } else {
                setIsNextDisabled(true)
            }
        }
    }, [
        props,
        contentBar,
        itemList,
        currentSlide,
        slideCount,
        setIsPrevDisabled,
        setIsNextDisabled
    ])

    // components
    let itemDisplay = items ?
        items.map((item, idx) => <li key={idx} className="Item-slide">{item}</li> ) :
        null

    return (
        <div className="Content-bar">
            <div className="Content-bar-header">
                <h3 className="Content-bar-title"> {title} </h3>
                <div className="Content-bar-controls">
                    <button className="Content-bar-control prev" onClick={onPrevClick}
                            disabled={isPrevDisabled}>
                        <img src={'/img/icon/link-arrow/link-arrow_16.png'} alt='Previous'
                            style={{transform: 'scaleX(-1)'}}/>
                    </button>
                    <button className="Content-bar-control next" onClick={onNextClick}
                            disabled={isNextDisabled}>
                        <img src={'/img/icon/link-arrow/link-arrow_16.png'} alt='Next'/>
                    </button>
                </div>
            </div>

            <div className="Content-bar-content" ref={contentBar}>
                <div className="Item-carousel">
                    <ul className="Item-list" ref={itemList} style={{left: offset}}>
                        {itemDisplay}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ContentBar
