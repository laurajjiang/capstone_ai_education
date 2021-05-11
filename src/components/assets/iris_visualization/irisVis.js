import React, { useEffect } from "react";
import * as d3 from "d3";
import dataSet from "./iris.json";
import "./iris.css";

/* This component renders the iris visualization used in the logistic regression and basic neural network classification. */

export default function IrisVis() {
  /** Determines the color selected for each filled circle in our visualization.
   * @param {string} value - type of iris
   */

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

  /**
   * Creates SVG of the bar and filled circle in the iris visualizations.
   * @param {int | string} data - the piece of data being visualized. */

  function createSVG(data) {
    const w = 75;
    const h = 30;

    let dataVisualizations = document.createElement("div");

    let svg = d3
      .select(dataVisualizations)
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    let elem = svg.selectAll("div").data([data]);

    let dataElements = elem.enter().append("g");

    if (checkNumberIfFloat(data) || Number.isInteger(data)) {
      /* append bar for sepal/petal length/width elements  */

      let scaledElement = data / 7;
      dataElements
        .append("rect")
        .attr("x", 25)
        .attr("y", 10)
        .attr("width", 60 * scaledElement)
        .attr("height", 15)
        .style("fill", "#4078a9");
    } else {
      /* append filled circle representing iris type */

      dataElements
        .append("circle")
        .attr("cx", 35)
        .attr("cy", 15)
        .attr("r", 10)
        .style("fill", colorPicker);
    }
    return dataVisualizations;
  }

  useEffect(() => {
    let div = d3.select("body").select("#tables");

    // append a table to the div
    let table = div
      .append("table")
      .attr("id", "sample")
      .classed("table display", true);

    // append a header to the table
    let thead = table.append("thead");

    // append a body to the table
    let tbody = table.append("tbody");
    // append a row to the header
    let theadRow = thead.append("tr").attr("class", "headerRowStyle");

    /* return a selection of cell elements in the header row
     * attribute (join) data to the selection
     * update (enter) the selection with nodes that have data
     * append the cell elements to the header row
     * return the text string for each item in the data array */

    let regexNames = [];
    Object.keys(dataSet[0]).forEach((name) =>
      regexNames.push(name.replace(/_/g, " "))
    );

    theadRow
      .selectAll("th")
      .data(regexNames)
      .enter()
      .append("th")
      .text(function (title) {
        return title;
      });

    // table body rows
    let tableBodyRows = tbody
      .selectAll("tr")
      .data(dataSet)
      .enter()
      .append("tr")
      .attr("class", "tableRowStyle");

    //table body row cells
    tableBodyRows
      .selectAll("td")
      .data(function (dataEntry) {
        return Object.values(dataEntry);
      })
      .enter()
      .append("td")
      .text(function (text) {
        return text;
      })
      .append(function (value) {
        return createSVG(value);
      });
  });

  return (
    <div className='container'>
      <div id='tables'></div>
    </div>
  );
}
