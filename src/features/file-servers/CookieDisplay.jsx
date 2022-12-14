import React from "react";
import {useSelector} from "react-redux";
import {selectCookiesForUser} from "../../slices/fileServerUserSlice";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {DownloadButton} from "../../components/controls/DownloadButton";
import {OKButton} from "../../components/controls/OKButton";

export const CookieDisplay = (props) => {

    const onDownloadCookies = () => {
        const a = document.createElement('a')
        let data =
            cookies.map(cookie =>
                Object.entries(cookie)
                    .filter(([key]) => key !== 'id')
                    .map(([, value]) => value !== null ? `${value}\t` : "\t")
                    .reduce((line, value) => {
                        line += value
                        return line
                    }))
                .reduce((file, line) => {
                    file += "\n" + line
                    return file
                })
        a.href = 'data:text;charset=utf-8,' + data
        a.setAttribute('download', `cookies_${userId}.txt`)
        a.click()
        onHide()
    }

    const {userId, show, onHide} = props
    const cookies = useSelector(state => selectCookiesForUser(state, userId))
    const hayCookies = cookies.length > 0

    return (
        <Modal show={show}>
            <Header onHide={onHide}>
                Cookies
            </Header>
            <Body>
            {
                hayCookies ?
                    <div className={"Cookie-display"}>
                        <table className={"Cookie-display-table"}>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Domain</th>
                                <th>Secure</th>
                                <th>Path</th>
                                <th>SameSite</th>
                                <th>HttpOnly</th>
                                <th>MaxAge</th>
                                <th>Name</th>
                                <th>Value</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                cookies.map(cookie =>
                                    <tr key={cookie.id}>
                                        {
                                            Object.entries(cookie).map(([key, value]) => {
                                                let elementKey = `${cookie.id}-${key}-${value}`
                                                if (value === true) {
                                                    return <td style={{color: 'lightgreen'}} key={elementKey}>
                                                        true </td>
                                                } else if (value === false) {
                                                    return <td style={{color: 'red'}} key={elementKey}>false</td>
                                                }
                                                return <td key={elementKey}>{value}</td>
                                            })
                                        }
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div> :
                    <p>There are no cookies for this user</p>
            }
            </Body>
            <Footer>
                {hayCookies ? <DownloadButton onClick={onDownloadCookies}/> : null}
                <OKButton onClick={onHide}/>
            </Footer>
        </Modal>
    )
}
