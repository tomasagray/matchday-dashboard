import React, {useEffect} from "react";
import {useAttemptAutoHealMutation, useGenerateSanityReportMutation} from "../../slices/api/adminApiSlice";
import {downloadData, getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {SanityReport} from "./SanityReport";
import {DownloadButton} from "../../components/controls/DownloadButton";
import {IconButton} from "../../components/controls/IconButton";
import {SmallSpinner} from "../../components/Spinner";


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

const HealButton = (props) => {
    let {isLoading, onClick} = props
    let content = <>
        <span>Attempt auto-heal</span>
        {
            isLoading ? <SmallSpinner style={{marginLeft: '.5rem'}}/> : null
        }
    </>
    return (
        <IconButton
            onClick={onClick}
            iconUrl={'/img/icon/heal/heal_32.png'}
            disabled={isLoading}
            className={'Heal-button'}>
            {content}
        </IconButton>
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
    const onAutoHeal = () => {
        autoHeal(report)
    }

    const [generate, {
        data: generated,
        isLoading: isGenerating,
        isSuccess: isGenerated,
        isError: isGenerateError,
        error: generateError
    }] = useGenerateSanityReportMutation()
    const [autoHeal, {
        data: healed,
        isLoading: isHealing,
        isSuccess: isHealed,
        isError: isHealError,
        error: healError
    }] = useAttemptAutoHealMutation()
    let report = healed ?? generated
    let reportExists = (isGenerated || isHealed) && report !== undefined && report !== null
    let requiresHealing = report?.requiresHealing ?? false
    let isInFlight = isGenerating || isHealing

    // toast messages
    useEffect(() => {
        if (isGenerateError) {
            let msg = 'Error generating sanity report: ' + getToastMessage(generateError)
            toast.error(msg)
        }
        if (isHealed) {
            toast('Successfully healed system')
        }
        if (isHealError) {
            let msg = 'Error healing system: ' + getToastMessage(healError)
            toast.error(msg)
        }
    }, [isGenerateError, isHealed, isHealError, generateError, healError])

    return (
        <>
            <h1 style={{marginBottom: '1rem'}}>Sanity Report</h1>
            <p style={{color: '#aaa'}}>Click the button below to generate a System Sanity Check report.</p>
            <div style={{display: 'flex', alignItems: 'center', marginTop: '1rem'}}>
                <GenerateButton isLoading={isInFlight} onClick={onGenerateReport}/>
                {
                    reportExists ?
                        <DownloadButton onClick={() => onDownloadReport(report)} disabled={isInFlight}/> : null
                }
                {
                    requiresHealing ? <HealButton onClick={onAutoHeal} isLoading={isInFlight}/> : null
                }
            </div>
            <div className="Sanity-report-display">
                {
                    reportExists ? <SanityReport report={report}/> : null
                }
            </div>
        </>
    )
}