import React, {useEffect, useState} from "react";
import EventTile from "./EventTile";
import {EmptyMessage} from "../../components/EmptyMessage";
import {AddNewButton} from "../../components/controls/AddNewButton";
import {AddEditMatchWizard} from "./AddEditMatchWizard";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {CancelButton} from "../../components/controls/CancelButton";
import {SaveButton} from "../../components/controls/SaveButton";
import {useDispatch, useSelector} from "react-redux";
import {finishEditMatch, selectEditedMatchForUpload, selectIsEditedMatchValid} from "../../slices/matchSlice";
import {useAddMatchMutation} from "../../slices/api/eventApiSlice";
import {toast} from "react-toastify";
import {getToastMessage, setBackgroundImage} from "../../utils";


export const EventsDisplay = (props) => {

    // handlers
    const dispatch = useDispatch()
    const onShowAddModal = () => {
        setIsAddModalShown(true)
    }
    const onHideAddModal = () => {
        setIsAddModalShown(false)
        dispatch(finishEditMatch())
    }
    const onSaveMatch = async () => {
        await addMatch(uploadMatch)
        setIsAddModalShown(false)
        dispatch(finishEditMatch())
    }

    // state
    let {events} = props
    let [isAddModalShown, setIsAddModalShown] = useState(false)
    let {isValid, reason} = useSelector(state => selectIsEditedMatchValid(state))
    let uploadMatch = useSelector(state => selectEditedMatchForUpload(state))

    // hooks
    let [
        addMatch, {
            isLoading: isAdding,
            isSuccess: isAddSuccess,
            isError: isAddError,
            error: addError
        }
    ] = useAddMatchMutation()

    // toast messages
    useEffect(() => {
        if (isAddSuccess) {
            toast('Successfully added new match')
        }
        if (isAddError) {
            let msg = 'Error adding new match: ' + getToastMessage(addError)
            toast.error(msg)
        }
    }, [isAddSuccess, isAddError, addError])

    // components
    setBackgroundImage('none')
    return (
        <>
            <Modal show={isAddModalShown}>
                <Header onHide={onHideAddModal}>
                    Add new Match
                </Header>
                <Body>
                    <AddEditMatchWizard/>
                </Body>
                <Footer>
                    <div className={'Wizard-footer-container'}>
                        {
                            !isValid ?
                                <div className={'Wizard-reason-container'}>
                                    <img src={'/img/icon/info/info_32.png'} alt={'Info'}/>
                                    <span>{reason}</span>
                                </div> :
                                null
                        }
                        <div className={'Wizard-button-container'}>
                            <CancelButton onClick={onHideAddModal}/>
                            <SaveButton
                                onClick={onSaveMatch}
                                isLoading={isAdding}
                                disabled={!isValid}/>
                        </div>
                    </div>
                </Footer>
            </Modal>
            <div>
                <div className={'Entity-header'}>
                    <h1>Events</h1>
                    <AddNewButton onClick={onShowAddModal}/>
                </div>
                <div className={"Event-display"}>
                    {
                        events && Object.keys(events.entities).length > 0 ?
                            Object.values(events.entities)
                                .sort((e1, e2) => e2.date.localeCompare(e1.date))
                                .map(event => <EventTile event={event} key={event['eventId']}/>) :
                            <EmptyMessage noun="events"/>
                    }
                </div>
            </div>
        </>
    )
}
