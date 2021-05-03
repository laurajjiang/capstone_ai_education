import React, { useEffect } from "react";
import * as d3 from "d3";
import largedataset from "./barcodes.json";
import "./barcode.css";

export default function BarcodeVis() {
  function argsort(array) {
    const arrayObject = array.map((value, idx) => {
      return { value, idx };
    });
    arrayObject.sort((a, b) => {
      if (a.value < b.value) {
        return 1;
      }

      if (a.value > b.value) {
        return -1;
      }
      return 0;
    });

    const argIndices = arrayObject.map((data) => data.idx);

    return argIndices;
  }

  function changedValues() {
    var x = d3.select("#myInput").property("value").toUpperCase();
    var epoch_val = d3.select("#epoch_slider").property("value");
    var sentences_val = d3.select("#num_sentences").property("value");

    d3.selectAll("#epochNum").text(epoch_val);
    d3.selectAll("#sentNum").text(sentences_val);

    let dataSet = largedataset[epoch_val];

    d3.selectAll("table").remove();
    var i;
    var test = [];
    for (i = 0; i < sentences_val; i++) {
      if (dataSet[i]["Test Sentence"].toUpperCase().search(x) > -1) {
        test.push([
          dataSet[i]["Epoch"],
          dataSet[i]["Index"],
          dataSet[i]["Test Label"],
          dataSet[i]["Test Prediction"],
          dataSet[i]["Test Confidence Score"],
          dataSet[i]["Test Sentence"],
          dataSet[i]["Intermediate Values"],
          dataSet[i]["Test Prediction"],
        ]);
      }
    }
    createTable(test);
  }

  function automatic() {
    console.log();
    var epoch_val = d3.select("#epoch_slider").property("value");
    d3.selectAll("#epochNum").text(epoch_val);

    var sentences_val = d3.select("#num_sentences").property("value");
    d3.selectAll("#sentNum").text(sentences_val);

    let dataSet = largedataset[epoch_val];

    var max_sent = document.getElementById("num_sentences");
    var ep_num = document.getElementById("epoch_slider");

    max_sent.max = (Math.min(Object.keys(largedataset[0]).length - 1), 300);
    ep_num.max = Object.keys(largedataset).length - 1;
    var i;
    var test = [];
    for (i = 0; i < 10; i++) {
      test.push([
        dataSet[i]["Epoch"],
        dataSet[i]["Index"],
        dataSet[i]["Test Label"],
        dataSet[i]["Test Prediction"],
        dataSet[i]["Test Confidence Score"],
        dataSet[i]["Test Sentence"],
        dataSet[i]["Intermediate Values"],
        dataSet[i]["Test Prediction"],
      ]);
    }

    createTable(test);
  }

  // https://stackoverflow.com/questions/51362252/javascript-cosine-similarity-function
  function cosinesim(A, B) {
    var dotproduct = 0;
    var mA = 0;
    var mB = 0;
    for (let i = 0; i < A.length; i++) {
      console.log(i, ":", A[i], B[i][1]);
      dotproduct += A[i] * B[i][1];
      mA += A[i] * A[i];
      mB += B[i][1] * B[i][1];
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = dotproduct / (mA * mB);
    console.log(mA, mB, similarity, dotproduct);
    return Math.abs(similarity);
  }

  function createSVG(d) {
    var w = 3;
    var h = 20;

    var kpi = document.createElement("div");

    var svg = d3.select(kpi).append("svg").attr("width", w).attr("height", h);

    var elem = svg.selectAll("div").data([d]);

    var elemEnter = elem.enter().append("g");

    elemEnter
      .append("rect")
      .attr("width", 3)
      .attr("height", 20)
      .style("opacity", 0.5 + d * 10)
      .style("fill", "#4078a9");

    return kpi;
  }

  function createTable(test) {
    var div = d3.select(".tables");
    // append a table to the div
    var table = div.append("table").attr("id", "sample").classed("table", true);

    // append a body to the table
    var tbody = table.append("tbody");

    // table body rows
    var tableBodyRows = tbody.selectAll("tr").data(test).enter().append("tr");

    tableBodyRows
      .selectAll("td")
      .data(function (d) {
        return [d];
      })
      .enter()
      .append("td")
      .attr("class", "sent")
      .text(function (d) {
        return d[7] + " - " + d[5];
      });

    tableBodyRows
      .selectAll("td")
      .data(function (d) {
        return d[6];
      })
      .enter()
      .append("td")
      .attr("class", function (d, i) {
        return "bar " + i;
      })
      .append(function (d) {
        return createSVG(d);
      });

    tableBodyRows.on("click", function (f, i) {
      console.log("f", f, "i", i);
      d3.selectAll("#highlighted").attr("id", this).classed("sent", true);
      let w = d3.select(this).select(".sent").attr("id", "highlighted");
      let bars = Object.entries(i[6]);
      let changed_indicies = argsort(bars);
      let sorted_bars = bars.sort(function (a, b) {
        return b - a;
      });

      // here we basically delete the current table & remake it except with different ordering for the barcode (done on line 207)
      d3.selectAll(".bar").remove();
      d3.selectAll(".cosinesim").remove();

      let big_array = [];
      let answers = [];

      tableBodyRows.selectAll("td").data(function (d) {
        let temp_array = [];
        var ugh = 0;
        for (ugh = 0; ugh < d[6].length; ugh++) {
          temp_array.push(d[6][changed_indicies[ugh]]);
        }
        big_array.push(temp_array);
        console.log("sorted", sorted_bars);
        var answer = cosinesim(temp_array, Object.values(sorted_bars));
        answers.push(answer);
        return [];
      });

      tableBodyRows.each(function (k, l) {
        d3.select(this).data(function (d) {
          test = [...k];
          test[8] = answers[l];
          return [test];
        });
      });

      tableBodyRows.each(function (k, l) {
        d3.select(this)
          .append("td")
          .attr("class", "cosinesim")
          .text(function (d, i) {
            return answers[l].toFixed(3);
          });
      });

      tableBodyRows
        .selectAll("td")
        .data(function (d, i) {
          return big_array[i];
        })
        .enter()
        .append("td")
        .attr("class", function (d, i) {
          return "bar " + i;
        })
        .append(function (d) {
          return createSVG(d);
        });

      tableBodyRows.sort(function (a, b) {
        if (a[8] < b[8]) {
          return 1;
        } else if (a[8] > b[8]) {
          return -1;
        } else {
          return 0;
        }
      });
    });
  }

  useEffect(() => {
    automatic();
  });

  return (
    <div>
      <div id='container'>
        <div class='left'>
          <h3> Epoch #:</h3>
          <h4 id='epochNum'></h4>
          <input
            class='slider'
            id='epoch_slider'
            type='range'
            min='0'
            max={Object.entries(largedataset).length}
            step='1'
            defaultValue='0'
            onChange={(e) => changedValues()}
          />
        </div>
        <div class='left'>
          <h3> Number of Sentences:</h3>
          <h4 id='sentNum'></h4>
          <input
            class='slider'
            id='num_sentences'
            type='range'
            min='0'
            max={Object.entries(largedataset[0]).length - 1}
            step='10'
            defaultValue='10'
            onChange={(e) => changedValues()}
          />
        </div>
      </div>
      <input
        type='text'
        id='myInput'
        placeholder='Search for a word'
        style={{ width: "auto" }}
      />
      <button onClick={(e) => changedValues()}>Filter</button>
      <div class='tables'></div>
    </div>
  );
}
