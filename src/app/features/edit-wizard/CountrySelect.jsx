import React, {useEffect} from "react";
import {Option} from "../../components/controls/Option";
import Select from "../../components/controls/Select";
import {CountryTile} from "../../components/CountryTile";
import {useFetchAllCountriesQuery} from "../../slices/api/countryApiSlice";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {SmallSpinner} from "../../components/Spinner";

export const CountrySelect = (props) => {

    // handlers
    const onSelectCountry = (e, country) => {
        onSelect && onSelect(country)
    }

    // state
    let { selected, onSelect} = props

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

    return (
        isCountriesLoading ?
            <SmallSpinner /> :
            isCountriesSuccess ?
            <Select onChange={onSelectCountry} placeholder="No country set" selectedValue={selected}>
                {
                    countries.map(country => {
                        let {name, _links} = country
                        return (
                            <Option value={name} key={name}>
                                <CountryTile name={name} flag={_links.flag.href} />
                            </Option>
                        )
                    })
                }
            </Select> :
            null
    )
}
