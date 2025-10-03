import React from "react";
import {SoftLoadImage} from "../../components/SoftLoadImage";
import {DeleteButton} from "../../components/controls/DeleteButton";

export const DeleteWizard = (props) => {

    let {
        entityName,
        placeholderUrl,
        imageUrl,
        onDelete,
        isDeleting,
    } = props

    return (
        <div className="Delete-wizard">
            <p className="Info-message">Click below to delete </p>
            <h2 style={{marginBottom: '2rem', textAlign: 'center'}}>{entityName}</h2>
            <div className="Delete-entity-display">
                <SoftLoadImage placeholderUrl={placeholderUrl} imageUrl={imageUrl}/>
                <DeleteButton onClick={onDelete} isLoading={isDeleting}/>
            </div>
        </div>
    )
}
