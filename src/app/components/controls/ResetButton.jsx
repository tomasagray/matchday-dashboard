import React from "react";
import {SmallSpinner} from "../Spinner";

export const ResetButton = (props) => {

  const {onClick, style, disabled, isLoading, children} = props
  let content = isLoading ? <SmallSpinner/> : children ?? 'Reset'
  let className = 'Reset-button' + (isLoading ? ' loading' : '')
  return (
      <button className={className} onClick={onClick} style={style}
              disabled={disabled}>
        {content}
        <img src={process.env.PUBLIC_URL + '/img/icon/refresh/refresh_16.png'}
             alt={"Reset"} style={{marginLeft: '.7em'}}/>
      </button>
  )
}