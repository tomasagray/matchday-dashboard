import React, {useEffect, useRef, useState} from "react";
import TeamTile from "../teams/TeamTile";
import {useFetchAllTeamsQuery} from "../../slices/api/teamApiSlice";
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
    const onShowTeamMenu = () => {
        setIsTeamMenuHidden(!isTeamMenuHidden)
    }
    const onHideTeamMenu = () => {
        setIsTeamMenuHidden(true)
    }

    // state
    let {selectedTeam, onSelectTeam} = props
    let [next, setNext] = useState()
    let [isTeamMenuHidden, setIsTeamMenuHidden] = useState(true)
    let {
        data: teams,
        isLoading,
        isSuccess,
        isError,
        error
    } = useFetchAllTeamsQuery(next)
    let nextUrl = teams?.next
    let selectedRef = useRef()
    let teamsRef = useRef()
    useDetectElementBottom(teamsRef.current, () => setNext(nextUrl))

    // toast messages
    useEffect(() => {
        if (isError) {
            let msg = 'Error loading Teams data: ' + getToastMessage(error)
            toast.error(msg)
        }
        selectedRef.current?.scrollIntoView()
    }, [selectedRef, error, isError])

    return (
        <div className="Team-select">
            <TeamTile team={selectedTeam} onClick={onShowTeamMenu} />
            <FloatingMenu
                hidden={isTeamMenuHidden}
                onClickOutside={onHideTeamMenu}
            >
                <div className="Team-select-menu">
                    <div className="Team-select-arrow"><div></div></div>
                    <div className="Team-select-container" ref={teamsRef}>
                        {
                            isLoading ?
                                <CenteredSpinner/> :
                                isSuccess ?
                                    Object.values(teams.entities).map(team => {
                                        const isSelected = selectedTeam.id === team.id
                                        const className = "Team-tile-selector" + (isSelected ? " selected" : "")
                                        return (
                                            <div
                                                className={className}
                                                ref={isSelected ? selectedRef : null}
                                                key={team.id}
                                            >
                                                <TeamTile team={team} key={team.id} onClick={handleSelectTeam}/>
                                            </div>
                                        )
                                        }
                                    ) :
                                    <ErrorMessage>{error}</ErrorMessage>
                        }
                    </div>
                </div>
            </FloatingMenu>
        </div>
    )
}
