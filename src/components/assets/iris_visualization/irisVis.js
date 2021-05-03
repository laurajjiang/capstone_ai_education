import React, { useEffect } from "react";
import * as d3 from "d3";
import dataSet from "./iris.json";
import "./iris.css";

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

    let regexNames = [];
    Object.keys(dataSet[0]).forEach((name) =>
      regexNames.push(name.replace(/_/g, " "))
    );

    theadRow
      .selectAll("th")
      .data(regexNames)
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
    var h = 30;

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
        .attr("height", 15)
        .style("fill", "#4078a9");
    } else {
      elemEnter
        .append("circle")
        .attr("cx", 35)
        .attr("cy", 15)
        .attr("r", 10)
        .style("fill", colorPicker);
    }
    return kpi;
  }

  return (
    <div className='container'>
      <div id='tables'></div>
    </div>
  );
}
