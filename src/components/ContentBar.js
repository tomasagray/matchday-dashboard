import React from "react";
import ItemCarousel from "./ItemCarousel";

class ContentBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: 0,
            carouselX: 0,
            nextDisabled: false,
            prevDisabled: true,
        };
        this.ref = React.createRef();
        this.carousel = React.createRef();

        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
    }

    handlePrevClick() {
        let steps = this.state.steps;
        if (steps < 0) {
            let carouselOffset = this.carousel.current.getReversePosition();
            console.log('revOffset', carouselOffset)
            this.setState({
                steps: steps + 1,
                carouselX: carouselOffset.x,
                nextDisabled: false,
                prevDisabled: carouselOffset.disablePrev
            });
        } else {
            this.setState({
                prevDisabled: true,
            })
        }
    }

    handleNextClick() {
        let carouselOffset = this.carousel.current.getAdvancePosition();
        console.log('advance', carouselOffset)
        if (carouselOffset !== this.state.carouselX) {
            this.setState(currentState => ({
                steps: currentState.steps - 1,
                carouselX: carouselOffset.x,
                prevDisabled: false,
                nextDisabled: carouselOffset.disableNext,
            }));
        } else {
            this.setState({
                nextDisabled: true,
            })
        }
    }

    render() {
        return (
            <div className="Content-bar" ref={this.ref}>
                <div className="Content-bar-header">
                    <h2 className="Content-bar-title"> {this.props.title} </h2>
                    <div className="Content-bar-controls">
                        <button className="Content-bar-control prev" onClick={this.handlePrevClick}
                                disabled={this.state.prevDisabled}> &lt; </button>
                        <button className="Content-bar-control next" onClick={this.handleNextClick}
                                disabled={this.state.nextDisabled}> &gt; </button>
                    </div>
                </div>
                <div className="Content-bar-content">
                    <ItemCarousel ref={this.carousel} items={this.props.items} x={this.state.carouselX}
                                  steps={this.state.steps}/>
                </div>
            </div>
        );
    }
}

export default ContentBar;
