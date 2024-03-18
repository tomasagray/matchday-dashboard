import React, {useEffect} from "react";
import {useGenerateSanityReportMutation} from "../../slices/api/adminApiSlice";
import {downloadData, getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {SanityReport} from "./SanityReport";
import {DownloadButton} from "../../components/controls/DownloadButton";


const GenerateButton = (props) => {
    let {isLoading, onClick} = props
    let style = {
        width: '8rem',
        marginRight: '1rem',
        cursor: isLoading ? 'wait' : 'pointer',
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
    const onDownloadReport = (report) => {
        let timestamp = Math.floor(Date.now() / 1000);
        let filename = `matchday_sanity_report_${timestamp}.json`
        let reportData = JSON.stringify(report, null, 1)

        console.log('Downloading sanity report...', filename)
        downloadData(reportData, filename)
    }

    const [generate, {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useGenerateSanityReportMutation()
    let reportExists = isSuccess && data !== undefined && data !== null

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
            <div style={{display: 'flex', alignItems: 'center', marginTop: '1rem'}}>
                <GenerateButton isLoading={isLoading} onClick={onGenerateReport}/>
                {
                    reportExists ? <DownloadButton onClick={() => onDownloadReport(data)}/> : null
                }
            </div>
            <div className="Sanity-report-display">
                {
                    reportExists ? <SanityReport report={data}/> : null
                }
            </div>
        </>
    )
}