import {Option} from "../../components/Option";
import Select from "../../components/Select";
import React from "react";

const patternGroupMatcher = new RegExp(/(\(\S+\))/g)
const getGroupOptions = (pattern) => {
    let groups = []
    if (pattern) {
        groups.push({group: 0, pattern})
        let patternGroups = pattern.match(patternGroupMatcher)
        if (patternGroups) {
            for (let i = 0; i < patternGroups.length; i++) {
                groups.push({group: i + 1, pattern: patternGroups[i]});
            }
        }
    }
    return groups.map(group =>
        <Option value={group.group} key={group.group}>
            {group.group}: <span style={{color: '#888'}}>{group.pattern}</span>
        </Option>
    )
}

export const PatternKitFieldRow = (props) => {

    let {pattern, field, fields, fieldHandler} = props
    const onChange = (e, value) => {
        fieldHandler(e, {fieldName, value})
    }

    let groupId = field[0]
    let fieldName = field[1]
    let matchingField = fields ? Object.entries(fields).find(field => field[1] === fieldName) : null
    let selectedItem = matchingField ? matchingField[0] : null
    let options = getGroupOptions(pattern)
    let isDisabled = pattern === ''

    return (
        <tr key={groupId}>
            <td className={"fieldName"}>
                <code>{fieldName}</code>
            </td>
            <td>
                <Select disabled={isDisabled} placeholder={'Select a regex group'} selectedIndex={selectedItem}
                        onChange={onChange}>
                    {options}
                </Select>
            </td>
        </tr>
    )
}
