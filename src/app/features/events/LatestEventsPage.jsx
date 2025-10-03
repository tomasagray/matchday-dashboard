import React, {useEffect, useState} from "react";
import {useAddMatchMutation, useFetchAllEventsInfiniteQuery} from "../../slices/api/eventApiSlice";
import {EventsDisplay} from "./EventsDisplay";
import {useDispatch, useSelector} from "react-redux";
import {finishEditMatch, selectEditedMatchForUpload, selectIsEditedMatchValid} from "../../slices/matchSlice";
import {FillSpinner} from "../../components/Spinner";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {ErrorMessage} from "../../components/ErrorMessage";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {AddEditMatchWizard} from "./AddEditMatchWizard";
import {SaveButton} from "../../components/controls/SaveButton";
import {CancelButton} from "../../components/controls/CancelButton";
import {AddNewButton} from "../../components/controls/AddNewButton";


export const LatestEventsPage = () => {

    // handlers
    const dispatch = useDispatch()
    const onShowAddModal = () => setIsAddModalShown(true)
    const onHideAddModal = () => {
        setIsAddModalShown(false)
        dispatch(finishEditMatch())
    }
    const onSaveMatch = async () => {
        await addMatch(uploadMatch)
        setIsAddModalShown(false)
        dispatch(finishEditMatch())
    }

    // hooks
    const {
        data: events,
        isLoading,
        isError,
        error,
        fetchNextPage: fetchMoreEvents,
    } = useFetchAllEventsInfiniteQuery()
    const [
        addMatch, {
            isLoading: isAdding,
            isSuccess: isAddSuccess,
            isError: isAddError,
            error: addError
        }
    ] = useAddMatchMutation()

    // state
    let [isAddModalShown, setIsAddModalShown] = useState(false)
    let {isValid, reason} = useSelector(state => selectIsEditedMatchValid(state))
    let uploadMatch = useSelector(state => selectEditedMatchForUpload(state))

    // toast messages
    useEffect(() => {
        if (isError) {
            let msg = 'Error loading Events: ' + getToastMessage(error)
            toast.error(msg)
        }
        if (isAddSuccess) {
            toast('Successfully added new match')
        }
        if (isAddError) {
            let msg = 'Error adding new match: ' + getToastMessage(addError)
            toast.error(msg)
        }
    }, [isError, error, isAddSuccess, isAddError, addError])

    // components
    return (
        <div style={{height: '100%'}}>
            {
                isError ?
                    <ErrorMessage>Could not load latest events.</ErrorMessage> :
                    isLoading ?
                        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                            <FillSpinner/>
                        </div> :
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
                                <EventsDisplay events={events} fetchMore={fetchMoreEvents}/>
                            </div>
                        </>
            }
        </div>
    )
}
