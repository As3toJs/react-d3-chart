import React, { Component } from 'react';
import * as d3 from "d3";
import chartData from './BarChartData';
import './BarChart.css';

export default class BarChart extends Component {
  constructor(props) {
    super(props);
    console.log(chartData);
    this.state = {
      data: chartData,
      width: 600,
      height: 400,
      margin: { top: 20, right: 30, bottom: 10, left: 60 }
    };
  }

  componentDidMount() {
    this.svg = d3.select(this.chartRef)
      .attr("width", this.state.width)
      .attr("height", this.state.height)
      .append('g')
      .attr('class', 'chart-inner');

    this.processing();
  }

  processing() {
    const { xScale, yScale } = this.getScales();
    const { margin, data, width } = this.state;

    const bars = this.svg.selectAll('g')
      .data(data, (d) => {
        return d.label;
      });

    const enterGElements = bars
      .enter()
      .append('g')
      .attr('class', 'added')
      .attr('transform', (x) => `translate(${xScale(x.label)}, 0)`);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    //Multiple bars
    enterGElements
      .append('rect')
      .attr("width", xScale.bandwidth())
      .attr('y', (d) => {
        if (d.val > 0) {
          return yScale(d.val)
        } else {
          return yScale(0);
        }
      })
      .attr('fill', 'tomato')
      .attr("height", (d) => Math.abs(yScale(d.val) - yScale(0)))
      .on("mouseover", function (d) {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`Frequency: <span>${d.id}</span>`)
          .style('left', `${d3.event.layerX}px`)
          .style('top', `${(d3.event.layerY - 28)}px`);
        // console.log("id :", d.id)
        d3.select(this).attr("fill", 'red');
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style('opacity', 0);
        d3.select(this).attr("fill", () => 'tomato');
      });

    // Draw a line 
    var valueLine = d3.line()
      .x(d => lineXScale(d.label))
      .y(d => {
        console.log(d.maxVal);
        return yScale(Number(20))
      });

    const lineXScale = d3.scaleBand()
      .domain(data.map((d) => d.label))
      .rangeRound([margin.left, width + margin.right])

    var nest = d3.nest()
      .key(function (d) {
        return d.val;
      })
      .entries(data)

    this.svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueLine);

    // xAsis and yAxis
    this.svg.append("g")
      .attr("transform", "translate(0," + yScale(0) + ")")
      .call(d3.axisBottom(xScale));

    this.svg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(yScale));
  }

  getScales() {
    const { margin, width, height, data } = this.state;
    const minY = d3.min(data, d => d.val);
    const maxY = d3.max(data, d => d.val)

    const xScale = d3.scaleBand()
      .domain(data.map((d) => d.label))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([minY, maxY])
      .rangeRound([height - margin.bottom, margin.top])

    return { xScale, yScale };
  }

  render() {
    return (
      <svg ref={(r) => this.chartRef = r}></svg>
    );
  }
};
