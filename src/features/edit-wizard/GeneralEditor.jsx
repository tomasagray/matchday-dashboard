import React, {useEffect} from "react";
import {useFetchAllCountriesQuery} from "../../slices/countryApiSlice";
import {SmallSpinner} from "../../components/Spinner";
import {getToastMessage} from "../../app/utils";
import {toast} from "react-toastify";
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

    // hooks
    let {
        data: countries,
        isLoading: isCountriesLoading,
        isSuccess: isCountriesSuccess,
        isError: isCountriesError,
        error: countriesError,
    } = useFetchAllCountriesQuery()

    // toast messages
    useEffect(() => {
        if (isCountriesError) {
            let msg = 'Failed loading countries data: ' + getToastMessage(countriesError)
            toast.error(msg)
        }
    }, [countriesError, isCountriesError])

    // components
    let synonymTags = synonyms?.map(synonym =>
        <Tag key={synonym.name} onDelete={onDeleteSynonym}>
            {synonym.name}
        </Tag>
    )

    return (
        <>
            <div className="General-editor">
                <div className="Editor-field">
                    <label htmlFor="general-editor-title">Title</label>
                    <input type="text" value={title ?? ''} name="general-editor-title" onChange={onTitleModified} />
                </div>

                <div className="Editor-field">
                    <label>Synonyms</label>
                    <TagField editorValue={newTagValue} onAddTag={onAddSynonym} onEditTag={onEditSynonym}>
                        {synonymTags}
                    </TagField>
                </div>

                <div className="Editor-field">
                    <label>Country</label>
                    {
                        isCountriesLoading ?
                            <SmallSpinner /> :
                            isCountriesSuccess ?
                                <CountrySelect countries={countries} selected={country} onSelect={onSelectCountry} /> :
                                null
                    }
                </div>
            </div>
        </>
    )
}
