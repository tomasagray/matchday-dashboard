import {ClearButton} from "../../components/controls/ClearButton";
import React, {useEffect, useRef} from "react";
import {useCaptureEnterPressed} from "../../hooks/useCaptureEnterPressed";

export const LabelRefreshTool = (props) => {

    // handlers
    const onReset = (e) => {
        onClearRefreshLabel && onClearRefreshLabel(e)
    }

    // state
    let {refreshLabel, onUpdateRefreshLabel, onClearRefreshLabel, onSubmit} = props
    let labelRef = useRef(null)

    // hooks
    useEffect(() => {
        labelRef.current?.focus()
    }, [labelRef])
    useCaptureEnterPressed({ref: labelRef, isFocused: true, action: onSubmit})

    return (
        <div className={"Refresh-tool-container"}>
            <input
                ref={labelRef}
                id="Data-source-refresh-label"
                type="text"
                value={refreshLabel}
                onChange={onUpdateRefreshLabel}
                placeholder="Enter a search term"
            />
            <ClearButton onClick={onReset}/>
        </div>
    )
}
