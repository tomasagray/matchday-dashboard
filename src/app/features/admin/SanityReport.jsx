import React, {useState} from "react";
import {copyToClipboard} from "../../utils";
import {toast} from "react-toastify";
import {DatabaseTable} from "../../components/DatabaseTable";
import {AccordionHeader} from "../../components/AccordionHeader";
import {AccordionDisplay} from "../../components/AccordionDisplay";
import md5 from "md5";


export const SanityReport = (props) => {

    const dim = {color: '#888', marginLeft: '1rem'}

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
    const onCopyEntries = async (e, entries, joiner = "\n") => {
        e.stopPropagation()
        if (entries.length === 0) {
            toast('Nothing to copy', {autoClose: 500})
            return
        }
        let formatted = entries.reduce((a, b) => a + joiner + b)
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
                <AccordionHeader onClick={onToggleArtDbDisplay} isExpanded={isArtDbDisplayed}>
                    <span>Dangling database entries</span>
                    <span style={dim}>{artwork['danglingDbEntries'].length}</span>
                    <button
                        className="Floating-copy-button"
                        onClick={
                            (e) => onCopyEntries(e, artwork['danglingDbEntries'].map(entry => entry.id), ", ")
                        }>
                        <img src="/img/icon/copy/copy_16.png" alt="Copy"/>
                    </button>
                </AccordionHeader>
                <AccordionDisplay isShown={isArtDbDisplayed}>
                    {
                        artwork['danglingDbEntries'].length > 0 ?
                            <DatabaseTable
                                titles={['ID', 'File', 'Filesize', 'Media Type', 'Width', 'Height', 'Created', 'Modified']}
                                rows={artwork['danglingDbEntries']}
                            /> :
                            <span style={dim}>None</span>
                    }
                </AccordionDisplay>
                <AccordionHeader onClick={onToggleArtFilesDisplay} isExpanded={isArtFilesDisplayed}>
                    <span>Dangling Artwork files</span>
                    <span style={dim}>{artwork['danglingFiles'].length}</span>
                    <button
                        className="Floating-copy-button"
                        onClick={(e) => onCopyEntries(e, artwork['danglingFiles'])}>
                        <img src="/img/icon/copy/copy_16.png" alt="Copy"/>
                    </button>
                </AccordionHeader>
                <AccordionDisplay isShown={isArtFilesDisplayed}>
                    {
                        artwork['danglingFiles'].length > 0 ?
                            <>
                                {
                                    artwork['danglingFiles'].map(file =>
                                        <span key={md5(file)} className="Dangling-file-entry">{file}</span>
                                    )
                                }
                            </> :
                            <span style={dim}>None</span>
                    }
                </AccordionDisplay>
            </div>
            <div>
                <h4>Video</h4>
                <p>
                    VideoStreamLocator count: <span style={dim}>{video['totalStreamLocators']}</span>&nbsp;&nbsp;
                    VideoStreamLocatorPlaylist count: <span style={dim}>{video['totalLocatorPlaylists']}</span>
                </p>
                <AccordionHeader onClick={onToggleLocatorsDisplayed} isExpanded={isVideoLocatorsDisplayed}>
                    <span>Dangling VideoStreamLocators</span>
                    <span style={dim}>{video['danglingStreamLocators'].length}</span>
                    <button
                        className="Floating-copy-button"
                        onClick={
                            (e) => onCopyEntries(e, video['danglingStreamLocators'].map(locator => locator['streamLocatorId']), ", ")
                        }>
                        <img src="/img/icon/copy/copy_16.png" alt="Copy"/>
                    </button>
                </AccordionHeader>
                <AccordionDisplay isShown={isVideoLocatorsDisplayed}>
                    {
                        video['danglingStreamLocators'].length > 0 ?
                            <DatabaseTable
                                rows={video['danglingStreamLocators']}
                                titles={['Timestamp', 'ID', 'Path', 'Video Files', 'State']}
                            /> :
                            <span style={dim}>None</span>
                    }
                </AccordionDisplay>
                <AccordionHeader onClick={onTogglePlaylistsDisplayed} isExpanded={isPlaylistsDisplayed}>
                    <span>Dangling VideoStreamLocatorPlaylists</span>
                    <span style={dim}>{video['danglingPlaylists'].length}</span>
                    <button
                        className="Floating-copy-button"
                        onClick={(e) => onCopyEntries(e, video['danglingPlaylists'].map(playlist => playlist.id), ", ")}>
                        <img src="/img/icon/copy/copy_16.png" alt="Copy"/>
                    </button>
                </AccordionHeader>
                <AccordionDisplay isShown={isPlaylistsDisplayed}>
                    {
                        video['danglingPlaylists'].length > 0 ?
                            <DatabaseTable
                                rows={video['danglingPlaylists']}
                                titles={['Video File Source', 'Stream Locators', 'Storage Location', 'Timestamp', 'ID', 'State']}
                            /> :
                            <span style={dim}>None</span>
                    }
                </AccordionDisplay>
            </div>
        </>
    )
}