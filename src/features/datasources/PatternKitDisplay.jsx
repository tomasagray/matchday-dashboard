import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {patternKitDeleted, patternKitUpdated, selectPatternKitById} from "./dataSourceSlice";
import {FloatingMenu} from "../../components/FloatingMenu";
import {MenuItem} from "../../components/MenuItem";
import {PatternKitFieldEditor} from "./PatternKitFieldEditor";
import Modal, {Body, Dialog, Footer, Header} from "../../components/Modal";
import {CancelButton} from "../../components/CancelButton";
import {OKButton} from "../../components/OKButton";

export const PatternKitDisplay = (props) => {

    const dispatch = useDispatch()
    const onPatternValChanged = (value) => {
        let data = {
            field: 'pattern',
            value: value
        }
        dispatch(patternKitUpdated({patternKitId, data}))
    }
    const onFieldValueChanged = (e, fields) => {
        let data = {
            field: 'fields',
            value: fields
        }
        dispatch(patternKitUpdated({patternKitId, data}))
    }
    const onMenuButtonClick = (e) => {
        e.preventDefault()
        setEditMenuHidden(false)
    }
    const onClickEditButton = () => {
        console.log('edit button clicked')
        setEditMenuHidden(true)
    }
    const onClickDeleteButton = () => {
        setShowDeleteConfirmModal(true)
        setEditMenuHidden(true)
    }
    const onHideDeleteConfirmModal = (e) => {
        e.preventDefault()
        setShowDeleteConfirmModal(false)
    }
    const onDeletePatternKit = () => {
        setShowDeleteConfirmModal(false)
        dispatch(patternKitDeleted({patternKitId}))
    }

    let {patternKitId} = props
    let patternKit = useSelector(state => selectPatternKitById(state, patternKitId))
    let {fields, pattern, clazz} = patternKit
    // state
    let [editMenuHidden, setEditMenuHidden] = useState(true)
    let [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)

    return (
        <>
            <Modal show={showDeleteConfirmModal}>
                <Dialog>
                    <Header onHide={onHideDeleteConfirmModal}>CONFIRM: Delete Pattern Kit?</Header>
                    <Body>
                        Are you sure you want to <strong style={{color: 'red'}}>PERMANENTLY DELETE</strong>&nbsp;
                        this Pattern Kit?
                    </Body>
                    <Footer>
                        <CancelButton clickHandler={onHideDeleteConfirmModal}/>
                        <OKButton clickHandler={onDeletePatternKit}>DELETE</OKButton>
                    </Footer>
                </Dialog>
            </Modal>
            <div>
                <button onClick={onMenuButtonClick} className="Edit-menu-button">&#8942;</button>
                <FloatingMenu hidden={editMenuHidden} onClickOutside={setEditMenuHidden}>
                    <MenuItem onClick={onClickEditButton} backgroundColor="green">
                        <p>Edit</p>
                        <img src={process.env.PUBLIC_URL + '/img/edit-pencil/edit-pencil_32.png'} alt="Edit"/>
                    </MenuItem>
                    <MenuItem onClick={onClickDeleteButton} backgroundColor="darkred">
                        <p>Delete</p>
                        <img src={process.env.PUBLIC_URL + '/img/delete/delete_32.png'} alt="Delete"/>
                    </MenuItem>
                </FloatingMenu>
            </div>
            <div className="Pattern-kit" key={patternKitId}>
                <PatternKitFieldEditor pattern={pattern} type={clazz} fields={fields}
                                       patternHandler={onPatternValChanged} fieldHandler={onFieldValueChanged}/>
            </div>
        </>
    )
}
