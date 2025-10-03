import React, {useEffect} from "react";
import {useFetchAllCompetitionsQuery} from "../../slices/api/competitionApiSlice";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {FillSpinner} from "../../components/Spinner";
import {EmptyMessage} from "../../components/EmptyMessage";
import {SoftLoadImage} from "../../components/SoftLoadImage";
import {ErrorMessage} from "../../components/ErrorMessage";

export const CompetitionSelect = (props) => {

    const CompetitionSelectTile = (props) => {

        const placeholderUrl = '/img/default_competition_poster.png'
        let {competition, onClick, isSelected} = props
        let {name: competitionName, _links: links} = competition
        let imageUrl = links['emblem'].href

        return (
            <div
                className={"Competition-select-tile" + (isSelected ? " selected" : "")}
                onClick={onClick}
            >
                <SoftLoadImage
                    placeholderUrl={placeholderUrl}
                    imageUrl={imageUrl}
                    className="Entity-poster"
                />
                <div className="Limited-label">{competitionName?.name}</div>
            </div>
        )
    }

    // props
    let {onSelectCompetition, selectedCompetition} = props

    // hooks
    const {
        data: competitions,
        isLoading,
        isSuccess,
        isError,
        error
    } = useFetchAllCompetitionsQuery()

    // toast messages
    useEffect(() => {
        if (isError) {
            let msg = 'Could not load competition data: ' + getToastMessage(error)
            toast.error(msg)
        }
    }, [error, isError])

    return (
        <>
            {
                isError ?
                    <ErrorMessage>Could not load competitions data.</ErrorMessage> :
                    isLoading ?
                        <FillSpinner/> :
                        isSuccess && competitions ?
                            <div className="Entity-display Competition-select">
                                {
                                    Object.values(competitions).map(competition => {
                                        const id = competition.id
                                        return (
                                            <CompetitionSelectTile
                                                key={id}
                                                competition={competition}
                                                onClick={onSelectCompetition(competition)}
                                                isSelected={id === selectedCompetition?.id}
                                            />
                                        )
                                    })
                                }
                            </div> :
                            <EmptyMessage noun="competitions"/>
            }
        </>
    )
}
