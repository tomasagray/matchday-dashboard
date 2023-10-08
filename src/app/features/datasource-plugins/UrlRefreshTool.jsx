import React, {useEffect, useRef} from "react";
import {ClearButton} from "../../components/controls/ClearButton";
import {useCaptureEnterPressed} from "../../hooks/useCaptureEnterPressed";

export const UrlRefreshTool = (props) => {

    // props
    let {
        refreshUrl,
        onUpdateRefreshUrl,
        onClearRefreshUrl,
        onSubmit
    } = props
    let urlRef = useRef()

    // hooks
    useEffect(() => {
        urlRef.current?.focus()
    }, [urlRef])
    useCaptureEnterPressed({ref: urlRef, isFocused: true, action: onSubmit})

    return (
        <div className={"Refresh-tool-container"}>
            <input
                id="Data-source-refresh-url"
                type="url"
                placeholder="Enter refresh URL..."
                value={refreshUrl}
                onChange={onUpdateRefreshUrl}
                ref={urlRef}
            />
            <ClearButton onClick={onClearRefreshUrl}/>
        </div>
    )
}
