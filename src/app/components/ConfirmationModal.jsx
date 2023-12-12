import React from "react";
import Modal, {Body, Footer, Header} from "./Modal";
import {CancelButton} from "./controls/CancelButton";
import {DeleteButton} from "./controls/DeleteButton";


export const ConfirmationModal = (props) => {

    let {isShown, onCancel, onConfirm, children} = props

    const style = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    }

    return (
        <Modal show={isShown}>
            <Header onHide={onCancel}>
                Confirm delete Video Source
            </Header>
            <Body style={{height: '25vh'}}>
                <div style={style}>
                    {children}
                </div>
            </Body>
            <Footer>
                <CancelButton onClick={onCancel}/>
                <DeleteButton onClick={onConfirm}/>
            </Footer>
        </Modal>
    )
}