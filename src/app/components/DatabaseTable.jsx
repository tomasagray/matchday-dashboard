import React from "react";
import md5 from "md5";


export const DatabaseTable = (props) => {

    let {titles, rows} = props

    return (
        <div className="Database-table-container">
            <table className="Database-table">
                <thead>
                <tr>
                    {
                        titles.map(title => <th key={md5(title)}>{title}</th>)
                    }
                </tr>
                </thead>
                <tbody>
                {
                    rows.map(entry =>
                        <tr key={md5(entry)}>
                            {
                                Object.values(entry).map(value =>
                                    <td key={md5(entry) + md5(value ?? 'null')}>
                                        {
                                            typeof value === 'object' ?
                                                JSON.stringify(value) :
                                                value
                                        }
                                    </td>
                                )
                            }
                        </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    )
}