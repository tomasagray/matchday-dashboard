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
            <p className="Info-message">Click below to delete '<span>{entityName}</span>'</p>
            <div className="Delete-entity-display">
                <SoftLoadImage placeholderUrl={placeholderUrl} imageUrl={imageUrl} />
                <DeleteButton onClick={onDelete} isLoading={isDeleting} />
            </div>
        </div>
    )
}
