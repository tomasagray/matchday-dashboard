import React from "react";
import {Option} from "../../components/controls/Option";
import Select from "../../components/controls/Select";
import {CountryTile} from "../../components/CountryTile";

export const CountrySelect = (props) => {

    // handlers
    const onSelectCountry = (e, country) => {
        onSelect && onSelect(country)
    }

    // state
    let {countries, selected, onSelect} = props

    // components
    let options = countries.map(country => {
        let {name, _links} = country
        let {flag} = _links
        return (
            <Option value={name} key={name}>
                <CountryTile name={name} flag={flag.href} />
            </Option>
        )
    })

    return (
        <Select onChange={onSelectCountry} placeholder="No country set" selectedValue={selected}>
            {options}
        </Select>
    )
}
