import React from "react";
import Modal, {Body, Header} from "../../components/Modal";
import dayjs from "dayjs";

export const VideoStreamingErrorDisplay = (props) => {

    let {isShown, onHide, error} = props

    return (
        <>
            <Modal show={isShown}>
                <Header onHide={onHide}>
                    Video streaming error
                </Header>
                <Body>
                    <table className="Error-message-table">
                        <tbody>
                        <tr>
                            <td>message</td>
                            <td>{error?.message}</td>
                        </tr>
                        <tr>
                            <td>occurred</td>
                            <td>
                                {
                                    dayjs(error?.timestamp).format('YYYY-MM-DD HH:mm:ss')
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>stacktrace</td>
                            <td className="Stacktrace-display">
                                {
                                    error?.stackTrace.length > 0 ?
                                        <pre> {
                                            JSON.stringify(error?.stackTrace, null, 1)
                                        } </pre> :
                                        <span style={{color: '#888'}}>none</span>
                                }
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Body>
            </Modal>
        </>
    )
}