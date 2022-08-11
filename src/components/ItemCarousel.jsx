import React, {createRef} from "react";

class ItemCarousel extends React.Component {

    constructor(props) {
        super(props)
        this.carousel = createRef()
        this.itemList = createRef()
        this.itemDisplay = props.items ?
            props.items?.map((item, idx) => {
                return (
                    <li key={idx} className="Item-slide">{item}</li>
                )
            }) :
            null
    }

    getAdvancePosition() {
        let carouselRect = this.carousel.current.getBoundingClientRect();
        let listRect = this.itemList.current.getBoundingClientRect();

        let diff = listRect.right - carouselRect.right + carouselRect.left;
        if (diff > 0) {
            let stepsRemaining = diff / carouselRect.width;
            if (stepsRemaining >= 1) {
                return {
                    x: listRect.x - carouselRect.width,
                    disableNext: false,
                };
            }
            return {
                x: listRect.x - diff,
                disableNext: true,
            };
        }
        return {
            x: listRect.x,
            disableNext: true,
        };
    }

    getReversePosition() {
        let carouselRect = this.carousel.current.getBoundingClientRect();
        let listRect = this.itemList.current.getBoundingClientRect();

        let diff = listRect.left - carouselRect.left;
        if (diff < 0) {
            let stepsRemaining = Math.abs(diff / carouselRect.width);
            if (stepsRemaining >= 1) {
                return {
                    x: listRect.left + carouselRect.width,
                    disablePrev: false,
                };
            }
            return {
                x: listRect.left - diff - carouselRect.x,
                disablePrev: true,
            };
        }
        return {
            x: listRect.left,
            disablePrev: true,
        };
    }


    render() {
        if (this.props.items === undefined) {
            return null;
        }

        return (
            <div className="Item-carousel" ref={this.carousel}>
                <ul className="Item-list" ref={this.itemList} style={{left: this.props.x}}>
                    {this.itemDisplay}
                </ul>
            </div>
        );
    }
}

export default ItemCarousel
