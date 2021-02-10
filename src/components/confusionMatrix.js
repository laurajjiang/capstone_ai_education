import React, { useEffect } from "react";
import * as d3 from "d3";
import data from "./predict.json";
import "./App.css";

export default function ConfusionMatrix() {
  useEffect(() => {
    // let width = 960,
    //   height = 600;
    // console.log("Loading JavaScript...");
    // let conf_data = data;
    // console.log(data);

    // console.log("Loaded Data:");

    /* I've temporarily left out the 'getType' function, since the names of these
    types are not included in the JSON file that is given to the JavaScript. More functionality can be incldued later to bring the names in as well as the raw data. Type will be represented by the given numeric identifier for now. */

    /* extractTypes: identifies different types each data point can be identified
    as, based off of the 'true_label' attribute in JSON file
    given: JSON file
    returns: dictionary of possible values for 'true_label' */
    function extractTypes(data) {
      let lookup = {};
      let items = data;
      let result = [];

      for (let item, i = 0; (item = items[i++]); ) {
        let name = item.true_label;

        if (!(name in lookup)) {
          lookup[name] = 1;
          result.push(name);
        }
      }

      return lookup;
    }

    // d3.json("http://[::]:8000/predict.js", function (d) {
    // console.log(data); // Ensuring that data is properly read in.
    // console.log(Object.keys(extractTypes(data))); // Logging list of possible types

    // # of Categories x # of Categories Table
    let tableDimension = Object.keys(extractTypes(data)).length;
    let table = new Array(tableDimension);
    let dataset = [];
    for (let i = 0; i < tableDimension; i++) {
      table[i] = new Array(tableDimension);
      for (let j = 0; j < tableDimension; j++) {
        table[i][j] = 0;
      }
    }

    for (let i = 0; i < data.length; i += 1) {
      table[parseInt(data[i]["true_label"])][
        parseInt(data[i]["predicted_label"])
      ] += 1;
      dataset.push([
        data[i]["true_label"],
        data[i]["predicted_label"],
        data[i]["text"],
        data[i]["index"],
      ]);
    }

    //console.log(table); // Reporting current state of table values.

    let w = 550;
    let h = 550; // These are dimensions?

    // Create SVG element
    let svg = d3
      .select("body") // This could be problematic later
      .select("#matrix")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    let rect = svg.selectAll("rect").data(dataset).enter().append("rect");

    // Give these a more descriptive name later
    let counters = new Array(tableDimension * tableDimension).fill(0);
    let ycounters = new Array(tableDimension * tableDimension).fill(0);

    let confusing = h / tableDimension;

    // JSON Object Format Guide:
    // d[0] = true_label ; d[1] = predicted_label ; d[2] = text
    rect
      .attr("x", function (d, i) {
        let matrixnum = parseInt(d[1]) * tableDimension + parseInt(d[0]);

        console.log("MATRIXNUM:", matrixnum);
        let inmatrixcol = counters[matrixnum] % 16;

        counters[matrixnum]++;

        return 10 + d[0] * confusing + inmatrixcol * 16;
      })
      .attr("y", function (d, i) {
        let matrixnum = parseInt(d[1] * tableDimension) + parseInt(d[0]);
        let hm = Math.floor(ycounters[matrixnum] / 16);

        ycounters[matrixnum]++;

        return 10 + d[1] * confusing + hm * 16;
      })
      .attr("id", function (d) {
        return "rect" + d[3];
      })
      .attr("width", function (d) {
        return 15;
      })
      .attr("height", function (d) {
        return 15;
      })
      .attr("opacity", function (d) {
        return 0.85;
      })
      .attr("fill", function (d) {
        return "pink";
      })
      .attr("class", function (d) {
        let predicted_label = "predicted_label_" + d[1];
        let true_label = "true_label_" + d[0];

        return true_label + " " + predicted_label;
      });

    d3.select("#review")
      .select("testList")
      .selectAll("rect")
      .data(
        dataset.filter((d) => d[0] !== d[1]),
        function (d) {
          return d[3];
        }
      )
      .enter()
      .append("li")
      .attr("id", function (d) {
        return "text" + d[3];
      })
      .html(function (d) {
        table = "<table><tr>";

        table += "<td> True: ";
        table += parseInt(d[0]); //getType(d[0]);
        table += "</td>";

        table += "<td> Predict: ";
        table += parseInt(d[1]); //getType(d[1]);
        table += "</td>";

        table += "<td>" + d[2].substr(0, 200);
        table += "</td>";
        table += "</tr> </table>";

        return table;
      });

    rect.on("click", function (d_on) {
      d3.select("#review").select("#testList").html("");

      if (!this.classList.contains("past")) {
        d3.selectAll(".past").attr("fill", "pink").classed("past", false);

        d3.selectAll(".reclick").attr("fill", "pink").classed("reclick", false);
      }

      if (!this.classList.contains("reclick")) {
        d3.selectAll(".reclick").attr("fill", "pink").classed("reclick", false);
      }

      d3.select(this);

      let x = "." + this.classList[0];
      let y = "." + this.classList[1];
      let test = x + y;

      let x1 = x.charAt(x.length - 1);
      let y1 = y.charAt(y.length - 1);

      if (this.classList.contains("past")) {
        d3.select(this).classed("reclick", true);
        let Id = this.id;
        let textId = "#text" + Id.substring(4);
      }

      d3.selectAll(test).attr("fill", "purple").classed("past", "true");

      d3.select("#review")
        .select("#testList")
        .selectAll("rect")
        .data(
          dataset.filter((d) => d[0] == x1).filter((d) => d[1] == y1),
          function (d) {
            return d[3];
          }
        )
        .enter()
        .append("li")
        .attr("id", function (d) {
          return "text" + d[3];
        })
        .html(function (d) {
          table = "<table><tr>";

          table += "<td> True: ";
          table += parseInt(d[0]); //getType(d[0]);
          table += "</td>";

          table += "<td> Predict: ";
          table += parseInt(d[1]); //getType(d[1]);
          table += "</td>";

          table += "<td>" + d[2].substr(0, 200);
          table += "</td>";
          table += "</tr> </table>";

          return table;
        });

      d3.select("#review")
        .select("testList")
        .selectAll("li")
        .on("mouseover", function (d_on) {
          d3.select(this).classed("lighthigh", true);
          let id = this.id;
          let rectId = "#rect" + id.substring(4);
          d3.selectAll(rectId).attr("fill", "green");
        })
        .on("mouseout", function (d_on) {
          d3.select(this).classed("lighthigh", false);
          let id = this.id;
          let rectId = "#rect" + id.substring(4);
          d3.selectAll(rectId).attr("fill", "purple");
        });
    });

    d3.select("#review")
      .select("#testList")
      .selectAll("li")
      .on("mouseover", function (d_on) {
        d3.select(this).classed("lighthigh", true);
        let id = this.id;
        let rectId = "#rect" + id.substring(4);
        d3.selectAll(rectId).attr("fill", "green");
      })
      .on("mouseout", function (d_on) {
        d3.select(this).classed("lighthigh", false);
        let id = this.id;
        let rectId = "#rect" + id.substring(4);
        d3.selectAll(rectId).attr("fill", "pink");
      });

    d3.select("#slider").on("change", function () {
      console.log("SLIDER");
      d3.select("svg").remove();
      var currentValue = this.value;
      d3.select("#textInput").text(currentValue);
      for (var i = 0; i < data.length; i += 1) {
        // i+=1 or i++ ?
        var ugh = data[i]["confidence_score"][0];
        console.log(ugh);
        if (ugh < currentValue) {
          table[parseInt(data[i]["true_label"])][
            parseInt(data[i]["predicted_label"])
          ] += 1;
          dataset.push([
            data[i]["true_label"],
            data[i]["predicted_label"],
            data[i]["text"],
            data[i]["index"],
          ]);
        }
      }
    });
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <input
          id='slider'
          type='range'
          min='0'
          max='1'
          step='.1'
          defaultValue='.5'
          style={{ maxWidth: "50%" }}
        />
        <h2 id='textInput'>0.5</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div id='matrix'> </div>
        <div id='review'>
          <h1>Selected Data</h1>
          <ul id='testList'></ul>
        </div>
      </div>
    </div>
  );
}
