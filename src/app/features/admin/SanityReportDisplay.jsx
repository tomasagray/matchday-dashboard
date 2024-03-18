import React, {useEffect} from "react";
import {useGenerateSanityReportMutation} from "../../slices/api/adminApiSlice";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {SanityReport} from "./SanityReport";


const GenerateButton = (props) => {
    let {isLoading, onClick} = props
    let style = {
        width: '8rem',
        margin: '1rem 0',
        cursor: isLoading ? 'wait' : 'default',
    }
    return (
        <button
            disabled={isLoading}
            className="Small-button"
            onClick={onClick}
            style={style}>
            Generate
        </button>
    )
}

export const SanityReportDisplay = () => {

    // handlers
    const onGenerateReport = async () => {
        console.log('generating report...')
        await generate()
        console.log('done generating report')
    }

    const [generate, {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useGenerateSanityReportMutation()

    // toast messages
    useEffect(() => {
        if (isError) {
            let msg = 'Error generating sanity report: ' + getToastMessage(error)
            toast.error(msg)
        }
    }, [isError, error])

    return (
        <>
            <h1 style={{marginBottom: '1rem'}}>Sanity Report</h1>
            <p style={{color: '#aaa'}}>Click the button below to generate a System Sanity Check report.</p>
            <GenerateButton isLoading={isLoading} onClick={onGenerateReport}/>
            <div className="Sanity-report-display">
                {
                    isSuccess && data !== undefined ?
                        <SanityReport report={data}/> :
                        null
                }
            </div>
        </>
    )
}