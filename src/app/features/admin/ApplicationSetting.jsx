import React from "react";

export const ApplicationSetting = (props) => {

  let {
    type,
    title,
    style,
    disabled,
    original,
    current,
    onChange,
    children
  } = props

  let className = 'Settings-input' + (original === current ? '' : ' modified')
  return (
      <>
        <div className="App-setting-container">
          <label htmlFor={title}>{title}</label>
          <input type={type} className={className} id={title}
                 style={style}
                 disabled={disabled}
                 value={current ?? ''}
                 onChange={onChange}/>
          {children}
        </div>
      </>
  )
}