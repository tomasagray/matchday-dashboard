import React from 'react'

export const Spinner = ({size = '64px', text = 'Loading...'}) => {

    const header = (text && text !== '') ?
        <div style={{margin: '1rem'}}>
            <h4>{text}</h4>
        </div> :
        null

    return (
        <div className="spinner" style={{width: size, height: size}}>
            {header}
            <div className="loader">
                <img src={process.env.PUBLIC_URL + '/img/icon/spinner/spinner_128.png'} alt="spinner"/>
            </div>
        </div>
    )
}

export const SmallSpinner = (transform = '') => {
    const style = {
        display: 'flex',
        justifyContent: 'center',
        transform: transform.transform,
    }
    return (
        <div style={style}>
            <Spinner size={'16px'} text={''} />
        </div>
    )
}

export const FillSpinner = ({size = '64px', text=''}) => {
    const style = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    }
    return (
        <div  style={{flex: '1', height: '100%'}}>
            <div style={style}>
                <Spinner size={size} text={text} />
            </div>
        </div>
    )
}

export const CenteredSpinner = () => {
    return (
        <div className="Centered-spinner">
            <Spinner text='' size={'32px'}/>
        </div>
    )
}
