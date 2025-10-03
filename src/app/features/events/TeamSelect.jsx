import React, {useEffect, useRef, useState} from "react";
import TeamTile from "../teams/TeamTile";
import {useFetchAllTeamsInfiniteQuery} from "../../slices/api/teamApiSlice";
import {CenteredSpinner} from "../../components/Spinner";
import {ErrorMessage} from "../../components/ErrorMessage";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {FloatingMenu} from "../../components/FloatingMenu";
import {useDetectElementBottom} from "../../hooks/useDetectElementBottom";

export const TeamSelect = (props) => {

    //handlers
    const handleSelectTeam = (team) => {
        if (onSelectTeam) {
            onSelectTeam(team)
            setIsTeamMenuHidden(true)
        }
    }
    const onShowTeamMenu = _ => setIsTeamMenuHidden(!isTeamMenuHidden)
    const onHideTeamMenu = _ => setIsTeamMenuHidden(true)
    const handleMenuBottom = async _ => teams?.next && await fetchMoreTeams()

    // state
    let {selectedTeam, onSelectTeam, isFloatRight} = props
    let selectedRef = useRef()
    let teamsRef = useRef()
    let [isTeamMenuHidden, setIsTeamMenuHidden] = useState(true)
    let {
        data,
        isLoading,
        isSuccess,
        isError,
        error,
        fetchNextPage: fetchMoreTeams,
    } = useFetchAllTeamsInfiniteQuery()
    let teams = data?.pages.reduce((prev, next) => {
        return {
            teams: [...prev.teams, ...next.teams],
            next: next.next,
        }
    })

    useDetectElementBottom(teamsRef.current, handleMenuBottom)

    // toast messages
    useEffect(() => {
        if (isError) {
            let msg = 'Error loading Teams data: ' + getToastMessage(error)
            toast.error(msg)
        }
    }, [selectedRef, error, isError])

    // components
    const placeholderTeam = {
        id: null,
        name: {name: 'Select Team'},
    }
    return (
        <div className="Team-select">
            {
                selectedTeam ?
                    <TeamTile team={selectedTeam} onClick={onShowTeamMenu}/> :
                    <TeamTile team={placeholderTeam} onClick={onShowTeamMenu}/>
            }
            <FloatingMenu
                hidden={isTeamMenuHidden}
                onClickOutside={onHideTeamMenu}
            >
                <div className={'Team-select-menu' + (isFloatRight ? ' right' : '')}>
                    <div className="Team-select-arrow">
                        <div></div>
                    </div>
                    <div className="Team-select-container" ref={teamsRef}>
                        {
                            isLoading ?
                                <CenteredSpinner/> :
                                isSuccess ?
                                    Object.values(teams?.teams)
                                        .map(team => {
                                                const isSelected = selectedTeam?.id === team?.id
                                                const className = "Team-tile-selector" + (isSelected ? " selected" : "")
                                                return (
                                                    <div
                                                        className={className}
                                                        ref={isSelected ? selectedRef : null}
                                                        key={team?.id}
                                                    >
                                                        <TeamTile team={team} key={team.id} onClick={handleSelectTeam}/>
                                                    </div>
                                                )
                                            }
                                        ) :
                                    <ErrorMessage>{error?.error}</ErrorMessage>
                        }
                    </div>
                </div>
            </FloatingMenu>
        </div>
    )
}
