import React, { useEffect } from "react";
import * as d3 from "d3";
import dataSet from "./assets/iris.json";

export default function IrisVis() {
  function colorPicker(value) {
    if (value == "Iris-setosa") {
      return "#7aa25c";
    } else if (value == "Iris-versicolor") {
      return "#f4f85e";
    } else {
      return "#d84b2a";
    }
  }

  function checkNumberIfFloat(value) {
    return Number(value) === value && value % 1 !== 0;
  }

  useEffect(() => {
    console.log("useEffect hook");
    console.log(dataSet.length);
    var div = d3.select("body").select("#tables");

    // append a table to the div
    var table = div
      .append("table")
      .attr("id", "sample")
      .classed("table display", true);

    // append a header to the table
    var thead = table.append("thead");

    // append a body to the table
    var tbody = table.append("tbody");
    // append a row to the header
    var theadRow = thead.append("tr").attr("class", "headerRowStyle");

    // return a selection of cell elements in the header row
    // attribute (join) data to the selection
    // update (enter) the selection with nodes that have data
    // append the cell elements to the header row
    // return the text string for each item in the data array

    console.log(dataSet[0]);
    console.log(Object.keys(dataSet[0]));
    theadRow
      .selectAll("th")
      .data(Object.keys(dataSet[0]))
      .enter()
      .append("th")
      .text(function (d) {
        return d;
      });

    // table body rows
    var tableBodyRows = tbody
      .selectAll("tr")
      .data(dataSet)
      .enter()
      .append("tr")
      .attr("class", "tableRowStyle");

    //table body row cells
    tableBodyRows
      .selectAll("td")
      .data(function (d) {
        return Object.values(d);
      })
      .enter()
      .append("td")
      .text(function (d) {
        return d;
      })
      .append(function (d) {
        console.log(d);
        return createSVG(d);
      });
  });

  function createSVG(d) {
    var w = 75;
    var h = 75;

    var kpi = document.createElement("div");

    var svg = d3.select(kpi).append("svg").attr("width", w).attr("height", h);

    var elem = svg.selectAll("div").data([d]);

    var elemEnter = elem.enter().append("g");

    if (checkNumberIfFloat(d) || Number.isInteger(d)) {
      var la = d / 7;
      elemEnter
        .append("rect")
        .attr("x", 25)
        .attr("y", 10)
        .attr("width", 60 * la)
        .attr("height", 20)
        .style("fill", "#4078a9");

      elemEnter
        .append("text")
        .style("fill", "blue")
        .attr("dy", 30)
        .attr("dx", 25);
    } else {
      elemEnter
        .append("circle")
        .attr("cx", 28)
        .attr("cy", 25)
        .attr("r", 20)
        .style("fill", colorPicker);

      elemEnter
        .append("text")
        .style("fill", "blue")
        .attr("dy", 30)
        .attr("dx", 25);
    }
    return kpi;
  }

  return <div id='tables'></div>;
}