import * as d3 from 'd3'
import React, { useRef, useEffect } from 'react'
import axios from "axios";
import {fetchRepresentative, fetchUserRiding} from '../../../Components/Navbar'
export default class Testing {
    constructor(element,data) {

        console.log('data'+data)
        let text = ""
        const width = 150
        const height = 150
        const thickness = 40
        const duration = 750
        const padding = 10
        const opacity = .8
        let opacityHover = 1
        let otherOpacityOnHover = .8
        let tooltipMargin = 13
        let radius = Math.min(width, height) / 2

        //The d3.pie() function takes in a dataset and creates handy data for us to generate a pie chart in the SVG.
        // It calculates the start angle and end angle for each wedge of the pie chart.
        // These start and end angles can then be used to create actual paths for the wedges in the SVG.
        // basically it takes the data and outputs an array for each element
        const createPie = d3
            .pie()
            .value(d => d.value)
            .sort(null)
        // creates a path for each element
        const createArc = d3
            .arc()
            .innerRadius(radius-20)
            .outerRadius(radius)

        const colors = d3.scaleOrdinal(d3.schemeCategory10)

        // adding svg element
        const svg = d3.select(element).append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox','0 0 300 300')
            .attr('class','pieChart')

        let g= svg.append('g')
            .attr('transform','translate('+(width/2)+','+(height/2)+')')

        let arcs = g.selectAll('arc')
            .data(createPie(data[0].lower))
            .enter()
            .append('g')
            .attr('class','arc')

        arcs.append('path')
            .attr('fill',(d,i)=> {return colors(i)})
            .attr('d',createArc)
            .style('opacity', opacity)
            .style('stroke', 'white')
            .on("mouseover", function(d) {
                d3.selectAll('path')
                    .style("opacity", otherOpacityOnHover);
                d3.select(this)
                    .style("opacity", opacityHover);

                let g = d3.select("svg")
                    .style("cursor", "pointer")
                    .append("g")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                g.append("text")
                    .attr("class", "name-text")
                    .text(`${d.data.name} (${d.data.value})`)
                    .attr('text-anchor', 'middle')

                let text = g.select("text");
                let bbox = text.node().getBBox();
                let padding = 2;
                g.insert("rect", "text")
                    .attr("x", bbox.x - padding)
                    .attr("y", bbox.y - padding)
                    .attr("width", bbox.width + (padding*2))
                    .attr("height", bbox.height + (padding*2))
                    .style("fill", "white")
                    .style("opacity", 0.75);
            })
            .on("mousemove", function(d) {
                let mousePosition = d3.mouse(this);
                let x = mousePosition[0] + width/2;
                let y = mousePosition[1] + height/2 - tooltipMargin;

                let text = d3.select('.tooltip text');
                let bbox = text.node().getBBox();
                if(x - bbox.width/2 < 0) {
                    x = bbox.width/2
                }
                else if(width - x - bbox.width/2 < 0) {
                    x = width - bbox.width/2
                }
                if(y - bbox.height/2 < 0) {
                    y = bbox.height + tooltipMargin * 2
                }
                else if(height - y - bbox.height/2 < 0) {
                    y = height - bbox.height/2
                }
                d3.select('.tooltip')
                    .style("opacity", 1)
                    .attr('transform',`translate(${x}, ${y})`)
            })
            .on("mouseout", function(d) {
                d3.select("svg")
                    .style("cursor", "none")
                    .select(".tooltip").remove()
                d3.selectAll('path')
                    .style("opacity", opacity)
            })
            .on("touchstart", function(d) {
                d3.select("svg")
                    .style("cursor", "none");
            })
            .each(function(d, i) { this._current = i })

    }
}

export async function getBillsByCategory (category,rep) {
    let result = ''
    const user = JSON.parse(localStorage.getItem('user'))
    const { email } = user
    await axios
        .post('http://localhost:5000/api/bills/getBillsByCategoryForRep', { rep: rep, category: category})
        .then(res => {
            result = res
        })
        .catch(err => console.error(err))
    return result
}
export function segColor (c) { return { yes: '#43D0C4', no: '#de425b', abstain: '#f68155' }[c] }