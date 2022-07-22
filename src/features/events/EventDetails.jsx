import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {useFetchMatchByIdQuery} from "./eventApiSlice";
import {FillSpinner, Spinner} from "../../components/Spinner";
import {PlayButton} from "../../components/controls/PlayButton";
import {EditButton} from "../../components/controls/EditButton";
import Select from "../../components/controls/Select";
import {useFetchVideoSourcesForEventQuery} from "./videoSourceApiSlice";
import {Option} from "../../components/controls/Option";
import dateformat from "dateformat";
import {VideoPlayer} from "./VideoPlayer";

export const EventDetails = () => {

    const onPlayVideo = () => {
        console.log('clicked play video button EventDetail')
        setShowVideoPlayer(true)
    }
    const onHideVideoPlayer = () => {
        setShowVideoPlayer(false)
    }
    const onEditEvent = () => {
        console.log('edit event')
    }
    const onSelectVideoSource = (source) => () => {
        setSelectedVideoSource(source)
    }

    const params = useParams()
    const {eventId} = params
    const {data: event, isLoading} = useFetchMatchByIdQuery(eventId)
    const {data: videoSources, isLoading: isVideoSourcesLoading} = useFetchVideoSourcesForEventQuery(eventId)
    const videoSourceOptions =
        isVideoSourcesLoading ?
            <Spinner text='' /> :
            Object.values(videoSources.entities).map(videoSource =>
            <Option onClick={onSelectVideoSource(videoSource)} value={videoSource.channel} key={videoSource.id}>
                {videoSource.channel}
            </Option>
    )

    let [selectedVideoSource, setSelectedVideoSource] = useState()
    let [showVideoPlayer, setShowVideoPlayer] = useState(false)
    const date = event ? new Date(event['date']) : new Date()
    const formattedDate = dateformat(date, 'dd/mm/yy')
    const videoSrc = selectedVideoSource ? selectedVideoSource['_links']['transcode_stream'].href : null

    return (
        <>
            {
                isLoading ?
                    <FillSpinner /> :
                    <div className="Content-container">
                        <VideoPlayer src={videoSrc} hidden={!showVideoPlayer}
                                     onClose={onHideVideoPlayer} title={event['title']} subtitle={formattedDate} />
                        <h2 className="Event-detail-header">
                            {event['competition'].name} &nbsp;&nbsp;
                            <span className={"Team-name"}>{event['homeTeam'].name}</span>
                            <span style={{color: '#888'}}> vs.&nbsp;</span>
                            <span className={"Team-name"}>{event['awayTeam'].name}</span>
                        </h2>
                        <div className="Event-details-container">
                            <div className="Event-poster-container">
                                <img src={process.env.PUBLIC_URL + '/img/_vs-poster.png'} alt={event.title} />
                            </div>
                            <div>
                                <span style={{color: '#aaa'}}>{formattedDate}</span><br/>
                                {event['fixture']['title']} {event['fixture']['fixtureNumber']}<br/>
                                {selectedVideoSource?.duration}
                            </div>
                        </div>
                        <div className="Event-button-container">
                            <PlayButton onClick={onPlayVideo} disabled={selectedVideoSource === undefined} />
                            <Select placeholder="Select source" selectedValue={selectedVideoSource?.channel}>
                                {videoSourceOptions}
                            </Select>
                            <EditButton onClick={onEditEvent} />
                        </div>
                        <div className="Video-source-metadata">
                            {
                                selectedVideoSource ?
                                Object.entries(selectedVideoSource)
                                    .filter(([field,]) => field !== '_links' && field !== 'id')
                                    .map(([field, value]) =>
                                        <div className="Video-source-metadata-field" key={field}>
                                            <div className={"Video-source-metadata-field-name"}>
                                                {
                                                    field.replace(/([A-Z])/g, " $1")
                                                        .replace(/^./, str => str.toUpperCase())
                                                }
                                            </div>
                                            <div className={"Video-source-metadata-field-value"}>
                                                {value}
                                            </div>
                                        </div>
                                ) : null
                            }
                        </div>
                    </div>
            }
        </>
    )
}
