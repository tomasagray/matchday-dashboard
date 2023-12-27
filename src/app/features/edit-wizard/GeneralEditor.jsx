import React from "react";
import {CountrySelect} from "./CountrySelect";
import {Tag, TagField} from "../../components/controls/TagField";


export const GeneralEditor = (props) => {

    // handlers
    const onTitleModified = (e) => {
        onEditTitle && onEditTitle(e.target.value)
    }

    // state
    let {
        title,
        synonyms,
        country,
        newTagValue,
        onEditTitle,
        onEditSynonym,
        onAddSynonym,
        onDeleteSynonym,
        onSelectCountry,
    } = props

    // components
    let synonymTags = synonyms?.map(synonym =>
        <Tag key={synonym.id + synonym.name} onDelete={() => onDeleteSynonym(synonym)}>
            {synonym.name}
        </Tag>
    )

    return (
        <>
            <div className="General-editor">
                <div className="Editor-field">
                    <label htmlFor="general-editor-title">Name</label>
                    <input type="text" value={title ?? ''} name="general-editor-title" onChange={onTitleModified}/>
                </div>

                <div className="Editor-field">
                    <label>Synonyms</label>
                    <TagField editorValue={newTagValue} onAddTag={onAddSynonym} onEditTag={onEditSynonym}>
                        {synonymTags}
                    </TagField>
                </div>

                <div className="Editor-field">
                    <label>Country</label>
                    <CountrySelect selected={country} onSelect={onSelectCountry} />
                </div>
            </div>
        </>
    )
}
