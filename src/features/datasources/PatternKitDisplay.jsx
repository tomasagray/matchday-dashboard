import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {patternKitDeleted, patternKitUpdated, selectPatternKitById} from "./dataSourceSlice";
import {PatternKitFieldEditor} from "./PatternKitFieldEditor";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {CancelButton} from "../../components/CancelButton";
import {getClassName} from "../../Utils";
import {DeleteButton} from "../../components/DeleteButton";

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

    const onClickDeleteButton = (e) => {
        e.preventDefault()
        setShowDeleteConfirmModal(true)
    }
    const onHideDeleteConfirmModal = (e) => {
        e.preventDefault()
        setShowDeleteConfirmModal(false)
    }
    const deletePatternKit = (e) => {
        e.preventDefault()
        setShowDeleteConfirmModal(false)
        dispatch(patternKitDeleted({patternKitId}))
    }

    let {patternKitId} = props
    let patternKit = useSelector(state => selectPatternKitById(state, patternKitId))
    let {fields, pattern, clazz} = patternKit
    let type = getClassName(clazz)
    // state
    let [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)

    return (
        <>
            <Modal show={showDeleteConfirmModal}>
                <Header onHide={onHideDeleteConfirmModal}>
                    CONFIRM: <span style={{color: '#aaa'}}>Delete Pattern Kit?</span>
                </Header>
                <Body>
                    Are you sure you want to <strong style={{color: 'red'}}>PERMANENTLY DELETE</strong>&nbsp;
                    this Pattern Kit?
                </Body>
                <Footer>
                    <CancelButton clickHandler={onHideDeleteConfirmModal}/>
                    <DeleteButton onClick={deletePatternKit} />
                </Footer>
            </Modal>

            <div className="Pattern-kit" key={patternKitId}>
                <div className={"Pattern-kit-header"}>
                    <p>
                        <strong>PKID</strong> : <span style={{color: '#ccc'}}>{patternKitId}</span>
                    </p>
                    <p>
                        <strong>Type</strong> : <span style={{color: '#ccc'}}>{type}</span>
                    </p>
                    <button className={"Pattern-kit-delete-button"} onClick={onClickDeleteButton}>
                        <img src={process.env.PUBLIC_URL + '/img/delete/delete_16.png'} alt={'Delete'}/>
                        Delete
                    </button>
                </div>
                <PatternKitFieldEditor pattern={pattern} type={clazz} fields={fields}
                                       patternHandler={onPatternValChanged} fieldHandler={onFieldValueChanged}/>
            </div>
        </>
    )
}
