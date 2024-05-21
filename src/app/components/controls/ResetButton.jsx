import React from "react";
import {SmallSpinner} from "../Spinner";
import {IconButton} from "./IconButton";

export const ResetButton = (props) => {

  const {onClick, style, disabled, isLoading, children} = props
  let content = isLoading ? <SmallSpinner/> : children ?? 'Reset'
  let className = 'Reset-button' + (isLoading ? ' loading' : '')
  return (
      <IconButton
          iconUrl={'/img/icon/refresh/refresh_32.png'}
          onClick={onClick}
          disabled={disabled}
          className={className}
          style={style}>
          {content}
      </IconButton>
  )
}