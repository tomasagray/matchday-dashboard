import React, {useState} from "react";
import {copyToClipboard} from "../../utils";
import {toast} from "react-toastify";

export const SanityReport = (props) => {

    const dim = {color: '#888'}
    // handlers
    const onToggleArtDbDisplay = () => {
        setIsArtDbDisplayed(!isArtDbDisplayed)
    }
    const onToggleArtFilesDisplay = () => {
        setIsArtFilesDisplayed(!isArtFilesDisplayed)
    }
    const onToggleLocatorsDisplayed = () => {
        setIsVideoLocatorsDisplayed(!isVideoLocatorsDisplayed)
    }
    const onTogglePlaylistsDisplayed = () => {
        setIsPlaylistsDisplayed(!isPlaylistsDisplayed)
    }
    const onCopyEntries = async (entries) => {
        let formatted = entries.map(entry => entry + "\n").reduce((a, b) => a + b)
        copyToClipboard(formatted)
            .then(() => toast('Copied data to clipboard', {autoClose: 1000}))
            .catch(err => console.error('ERROR copying text to clipboard', err))
    }

    // state
    let {report} = props
    let {artworkSanityReport: artwork, videoSanityReport: video} = report
    let [isArtDbDisplayed, setIsArtDbDisplayed] = useState(false)
    let [isArtFilesDisplayed, setIsArtFilesDisplayed] = useState(false)
    let [isVideoLocatorsDisplayed, setIsVideoLocatorsDisplayed] = useState(false)
    let [isPlaylistsDisplayed, setIsPlaylistsDisplayed] = useState(false)

    return (
        <>
            <h3>Sanity report</h3>
            <p style={{marginBottom: '2rem'}}>
                Timestamp: <span style={dim}>{report.timestamp}</span>
            </p>
            <div style={{marginBottom: '2rem'}}>
                <h4>Artwork</h4>
                <p>
                    Database entries: <span style={dim}>{artwork['totalDbEntries']}</span>&nbsp;&nbsp;
                    File count: <span style={dim}>{artwork['totalFiles']}</span>
                </p>
                <button className="Accordion-button" onClick={onToggleArtDbDisplay}>
                    Dangling database entries &nbsp; &nbsp;
                    <span style={dim}>{artwork['danglingDbEntries'].length}</span>
                </button>
                <div className={"Dangling-entry-display" + (isArtDbDisplayed ? ' displayed' : '')}>
                    {
                        artwork['danglingDbEntries'].length > 0 ?
                            <>
                                {
                                    artwork['danglingDbEntries'].map(entry =>
                                        <span key={entry} className="Dangling-entry">{entry}</span>
                                    )
                                }
                                <button
                                    className="Floating-copy-button"
                                    onClick={() => onCopyEntries(artwork['danglingDbEntries'])}>
                                    <img src="/img/icon/copy/copy_16.png" alt="Copy"/>
                                </button>
                            </> :
                            <span style={dim}>None</span>
                    }
                </div>
                <button className="Accordion-button" onClick={onToggleArtFilesDisplay}>
                    Dangling Artwork files &nbsp; &nbsp;
                    <span style={dim}>{artwork['danglingFiles'].length}</span>
                </button>
                <div className={"Dangling-entry-display" + (isArtFilesDisplayed ? ' displayed' : '')}>
                    {
                        artwork['danglingFiles'].length > 0 ?
                            <>
                                {
                                    artwork['danglingFiles'].map(file =>
                                        <span key={file} className="Dangling-entry">{file}</span>
                                    )
                                }
                                <button
                                    className="Floating-copy-button"
                                    onClick={() => onCopyEntries(artwork['danglingFiles'])}>
                                    <img src="/img/icon/copy/copy_16.png" alt="Copy"/>
                                </button>
                            </> :
                            <span style={dim}>None</span>
                    }
                </div>
            </div>
            <div>
                <h4>Video</h4>
                <p>
                    VideoStreamLocator count: <span style={dim}>{video['totalStreamLocators']}</span>&nbsp;&nbsp;
                    VideoStreamLocatorPlaylist count: <span style={dim}>{video['totalLocatorPlaylists']}</span>
                </p>
                <button className="Accordion-button" onClick={onToggleLocatorsDisplayed}>
                    Dangling VideoStreamLocators &nbsp; &nbsp;
                    <span style={dim}>{video['danglingStreamLocators'].length}</span>
                </button>
                <div className={"Dangling-entry-display" + (isVideoLocatorsDisplayed ? ' displayed' : '')}>
                    {
                        video['danglingStreamLocators'].length > 0 ?
                            <>
                                {
                                    video['danglingStreamLocators'].map(locator =>
                                        <span key={locator} className="Dangling-entry">{locator}</span>
                                    )
                                }
                                <button
                                    className="Floating-copy-button"
                                    onClick={() => onCopyEntries(video['danglingStreamLocators'])}>
                                    <img src="/img/icon/copy/copy_16.png" alt="Copy"/>
                                </button>
                            </> :
                            <span style={dim}>None</span>
                    }
                </div>
                <button className="Accordion-button" onClick={onTogglePlaylistsDisplayed}>
                    Dangling VideoStreamLocatorPlaylists &nbsp; &nbsp;
                    <span style={dim}>{video['danglingPlaylists'].length}</span>
                </button>
                <div className={"Dangling-entry-display" + (isPlaylistsDisplayed ? ' displayed' : '')}>
                    {
                        video['danglingPlaylists'].length > 0 ?
                            <>
                                {
                                    video['danglingPlaylists'].map(playlist =>
                                        <span key={playlist} className="Dangling-entry">{playlist}</span>
                                    )
                                }
                                <button
                                    className="Floating-copy-button"
                                    onClick={() => onCopyEntries(video['danglingPlaylists'])}>
                                    <img src="/img/icon/copy/copy_16.png" alt="Copy"/>
                                </button>
                            </> :
                            <span style={dim}>None</span>
                    }
                </div>
            </div>
        </>
    )
}