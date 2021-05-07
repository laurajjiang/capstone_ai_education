import React, { useEffect } from "react";
import * as d3 from "d3";
import dataSet from "./barcodes.json";
import "./barcode.css";

/** This component creates the visualization for the barcodes used in the text/sentiment classification chapter. */

export default function BarcodeVis() {
  /** Basic sorting algorithm.
   * @param {array} array - array of values to be sorted.
   */

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

  /** Updates the table based off of currently selected epoch, filtered word, or number of sentences.
   */

  function changedValues() {
    let x = d3.select("#myInput").property("value").toUpperCase();
    let currentEpoch = d3.select("#epoch_slider").property("value");
    let numSelectedSentences = d3.select("#num_sentences").property("value");

    d3.selectAll("#epochNum").text(currentEpoch);
    d3.selectAll("#sentNum").text(numSelectedSentences);

    let dataByEpoch = dataSet[currentEpoch];

    d3.selectAll("table").remove();

    let valuesPerEpoch = [];
    for (let i = 0; i < numSelectedSentences; i++) {
      if (dataByEpoch[i]["Test Sentence"].toUpperCase().search(x) > -1) {
        valuesPerEpoch.push([
          dataByEpoch[i]["Epoch"],
          dataByEpoch[i]["Index"],
          dataByEpoch[i]["Test Label"],
          dataByEpoch[i]["Test Prediction"],
          dataByEpoch[i]["Test Confidence Score"],
          dataByEpoch[i]["Test Sentence"],
          dataByEpoch[i]["Intermediate Values"],
          dataByEpoch[i]["Test Prediction"],
        ]);
      }
    }
    createTable(valuesPerEpoch);
  }

  /** Calculates cosine similarity, based off of this thread: https://stackoverflow.com/questions/51362252/javascript-cosine-similarity-function
   * @param {int} A - current epoch
   * @param {int} B -
   */

  function cosinesim(A, B) {
    let dotproduct = 0;
    let mA = 0;
    let mB = 0;
    for (let i = 0; i < A.length; i++) {
      console.log(i, ":", A[i], B[i][1]);
      dotproduct += A[i] * B[i][1];
      mA += A[i] * A[i];
      mB += B[i][1] * B[i][1];
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    let similarity = dotproduct / (mA * mB);
    console.log(mA, mB, similarity, dotproduct);
    return Math.abs(similarity);
  }

  /** Builds the SVG to represent the barcodes.
   * @param {float} cosineValue - the cosine similarity value for a particular barcode.
   */

  function createSVG(cosineValue) {
    const w = 3;
    const h = 20;

    let dataVisualizations = document.createElement("div");

    let svg = d3
      .select(dataVisualizations)
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    let elem = svg.selectAll("div").data([cosineValue]);

    let dataElements = elem.enter().append("g");

    dataElements
      .append("rect")
      .attr("width", 3)
      .attr("height", 20)
      .style("opacity", 0.5 + cosineValue * 10)
      .style("fill", "#4078a9");

    return dataVisualizations;
  }

  /** Builds the overall table to hold the barcode visualization.
   * @param {Object} data - overall sentence data (JSON) to be used in this visualization
   */

  function createTable(updatedSentenceData) {
    let div = d3.select(".tables");
    // append a table to the div
    let table = div.append("table").attr("id", "sample").classed("table", true);

    // append a body to the table
    let tbody = table.append("tbody");

    // table body rows
    let tableBodyRows = tbody
      .selectAll("tr")
      .data(updatedSentenceData)
      .enter()
      .append("tr");

    /** sentence array structure:
     * sentenceData[0] = epoch
     * sentenceData[1] = index
     * sentenceData[2] = test label
     * sentenceData[3] = test prediction
     * sentenceData[4] = confidence score
     * sentenceData[5] = sentence (string)
     * sentenceData[6] = intermediate values
     * sentenceData[7] = current prediction
     */

    tableBodyRows
      .selectAll("td")
      .data(function (sentenceData) {
        return [sentenceData];
      })
      .enter()
      .append("td")
      .attr("class", "sent")
      .text(function (sentenceData) {
        return sentenceData[7] + " - " + sentenceData[5];
      });

    tableBodyRows
      .selectAll("td")
      .data(function (sentenceData) {
        return sentenceData[6];
      })
      .enter()
      .append("td")
      .attr("class", function (_, id) {
        return "bar " + id;
      })
      .append(function (cosineValue) {
        return createSVG(cosineValue);
      });

    tableBodyRows.on("click", function (_, sentenceData) {
      d3.selectAll("#highlighted").attr("id", this).classed("sent", true);
      let w = d3.select(this).select(".sent").attr("id", "highlighted");
      let bars = Object.entries(sentenceData[6]);
      let changed_indicies = argsort(bars);
      let sorted_bars = bars.sort(function (a, b) {
        console.log(a, b);
        return b - a;
      });

      // delete the current table & remake it except with different ordering for the barcode (done on line 207)
      d3.selectAll(".bar").remove();
      d3.selectAll(".cosinesim").remove();

      let visibleSentences = [];
      let cosineSimilarities = [];

      tableBodyRows.selectAll("td").data(function (sentence) {
        let temp_array = [];
        for (let i = 0; i < sentence[6].length; i++) {
          temp_array.push(sentence[6][changed_indicies[i]]);
        }
        visibleSentences.push(temp_array);
        console.log("sorted", sorted_bars);
        let similarity = cosinesim(temp_array, Object.values(sorted_bars));
        cosineSimilarities.push(similarity);
        return [];
      });

      tableBodyRows.each(function (sentence, index) {
        d3.select(this).data(function (_) {
          updatedSentenceData = [...sentence];
          updatedSentenceData[8] = cosineSimilarities[index];
          return [updatedSentenceData];
        });
      });

      tableBodyRows.each(function (_, epoch) {
        d3.select(this)
          .append("td")
          .attr("class", "cosinesim")
          .text(function (_) {
            return cosineSimilarities[epoch].toFixed(3);
          });
      });

      tableBodyRows
        .selectAll("td")
        .data(function (_, epoch) {
          return visibleSentences[epoch];
        })
        .enter()
        .append("td")
        .attr("class", function (_, id) {
          return "bar " + id;
        })
        .append(function (cosineValue) {
          return createSVG(cosineValue);
        });

      tableBodyRows.sort(function (sentenceOne, sentenceTwo) {
        if (sentenceOne[8] < sentenceTwo[8]) {
          return 1;
        } else if (sentenceOne[8] > sentenceTwo[8]) {
          return -1;
        } else {
          return 0;
        }
      });
    });
  }

  useEffect(() => {
    const epoch_val = d3.select("#epoch_slider").property("value");
    d3.selectAll("#epochNum").text(epoch_val);

    const sentences_val = d3.select("#num_sentences").property("value");
    d3.selectAll("#sentNum").text(sentences_val);

    let dataByEpoch = dataSet[epoch_val];

    let maxSentences = document.getElementById("num_sentences");
    let numEpochs = document.getElementById("epoch_slider");

    maxSentences.max = (Math.min(Object.keys(dataSet[0]).length - 1), 300);
    numEpochs.max = Object.keys(dataSet).length - 1;
    let i;
    let valuesPerEpoch = [];
    for (i = 0; i < 10; i++) {
      valuesPerEpoch.push([
        dataByEpoch[i]["Epoch"],
        dataByEpoch[i]["Index"],
        dataByEpoch[i]["Test Label"],
        dataByEpoch[i]["Test Prediction"],
        dataByEpoch[i]["Test Confidence Score"],
        dataByEpoch[i]["Test Sentence"],
        dataByEpoch[i]["Intermediate Values"],
        dataByEpoch[i]["Test Prediction"],
      ]);
    }

    createTable(valuesPerEpoch);
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
            max={Object.entries(dataSet).length}
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
            max={Object.entries(dataSet[0]).length - 1}
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
