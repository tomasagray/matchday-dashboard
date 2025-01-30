import React from "react";
import {Chart} from "react-google-charts";


export const BandwidthDisplay = (props) => {

    const {bandwidth} = props

    const remaining = bandwidth * 100
    const used = 100 - remaining

    const data = [
        ['Label', 'Percent'],
        ['Remaining', remaining],
        ['Used', used],
    ]

    const options = {
        is3D: true,
        pieStartAngle: 90, // Rotates the chart
        legend: {
            position: "bottom",
            alignment: "center",
            textStyle: {
                color: "#ccc",
                fontSize: 12,
            },
        },
        backgroundColor: 'transparent',
        colors: ["#6e86ff", "#222"],
    }

    return (
        <Chart
            chartType="PieChart"
            data={data}
            options={options}
            width="100%"
            height="200px"
        />
    )
}