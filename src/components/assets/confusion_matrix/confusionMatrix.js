import React, { useEffect } from "react";
import * as d3 from "d3";
import "./matrix.css";

export default function ConfusionMatrix({ data }) {
  let rawJSONData = null; // Data from JSON read operation
  let currentConfSetting = 0.5; // Set confidence score minimum to default
  let currentEpochSetting = 1; // Set epoch setting to default
  let lastEpochIndex = 0; // Max value that epoch slider can reach
  let totalItems = null; // Total number of boxes that should appear
  let possibleOutputValues = null; // Possible values that predictions may produce
  let tableDimension = null; // Dimensions of table (square so x and y are same)
  let dataset = []; // JSON is read into this array
  let datasubset = []; // Selected values from dataset
  let table = null; // Reference for how many boxes should be in each matrix cell
  let svg = null; // SVG graphic
  let rect = null; // Rectangles which are put into above graphic
  let w = 750; // Width of matrix
  let h = 750; // Height of matrix
  let counters = null; // Current 'x' position when placing rects
  let ycounters = null; // Curent 'y' position when placing rects
  let cellDimension = null; // Height and width to make each cell on matrix
  let blockStackDimension = null; // How many cubes to place on a single row in matrix
  let marginBuffer = null; // How much room to leave between cells in matrix
  let cubeDimension = null; // Dimensions of each rect

  /*--------------------------------------------------------------------------------
        Function: extractTypes
        Behavior: Identifies what different types each data point can be identified as based
            off of the 'true_label' attribute in JSON file.
        Input: JSON file
        Returns: Returns array of possible values for 'Test Label'.
        --------------------------------------------------------------------------------*/
  function extractTypes(data) {
    let lookup = {};
    let items = data;
    let result = [];
    for (let item, i = 0; (item = items[i++]); ) {
      let name = item["Test Label"];
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
      }
    }
    return result.sort();
  }

  /*--------------------------------------------------------------------------------
      Function: fetchDataWindowResults
      Behavior: Fetches subset of 'd' letiable to be displayed in 'Data' window
      Input: 'd' letiable, testLabel, predLabel, epoch, conf
      Returns: Subset of 'd' letiable formatted the same as 'd'
      --------------------------------------------------------------------------------*/
  function fetchDataWindowResults(d, testLabel, predLabel, epoch, conf) {
    console.log("Visualization: Calling fetchDataWindowResults...");
    let fullDataSet = d;
    let selectedTestLabel = testLabel;
    let selectedPredictionLabel = predLabel;
    let selectedEpoch = epoch;
    let selectedConfMin = conf;
    let selectedEntries = [];
    for (const dataPoint of Object.entries(d)) {
      let currentPrediction = dataPoint[1]["Test Prediction"][epoch];
      let currentTestLabel = dataPoint[1]["Test Label"];
      let currentSentence = dataPoint[1]["Test Sentence"];
      let currentConfScore = dataPoint[1]["Test Confidence Score"][epoch];
      let bestConfScore = Math.max.apply(Math, currentConfScore);
      if (
        currentPrediction == selectedPredictionLabel &&
        currentTestLabel == selectedTestLabel &&
        bestConfScore >= selectedConfMin
      ) {
        selectedEntries.push(dataPoint);
      }
    }
    return selectedEntries;
  }

  /*--------------------------------------------------------------------------------
      Function: addAxisLabels
      Behavior: Adds x and y axis components to the DOM and text labels should be
          placed next to div for matrix
      Input: takes two string arrays, one for the x and one for the y axis
      Returns: N/A
      --------------------------------------------------------------------------------*/
  function addAxisLabels() {
    let xaxis_labels = ["1", "0"];
    let yaxis_labels = ["Iris 1", "Iris 2", "Iris 3"];
    for (let i = 0; i < xaxis_labels.length; i++) {
      d3.select(".xaxis")
        .selectAll("tr")
        .append("td")
        .text(xaxis_labels[i])
        .classed("xlabel", true);
    }
    for (let i = 0; i < yaxis_labels.length; i++) {
      d3.select(".yaxis")
        .selectAll("tr")
        .append("td")
        .text(yaxis_labels[i])
        .attr("height", 750 / yaxis_labels.length)
        .classed("ylabel", true);
    }
  }
  /*--------------------------------------------------------------------------------
        Function: fillMatrix
        Behavior: Does the work of actually placing selected datapoints into 'rect' items
            and inserting them into the matrix svg (redefines 'rect' letiable)
        Input: None
        Output: None
        --------------------------------------------------------------------------------*/
  function fillMatrix() {
    console.log("Debugging: Filling Matrix...");
    let rect = svg
      .selectAll("rect") // Defining rect as child of SVG
      .data(datasubset)
      .enter()
      .append("rect");
    /*--------------------------------------------------------------------------------
          Format: d[trueLabel, predictedLabel, entryText, index, conf_scores]
          --------------------------------------------------------------------------------*/
    rect
      .attr("x", function (d) {
        // Define x coordinate to place rect
        let matrixnum =
          parseInt(d[1][currentEpochSetting - 1]) * tableDimension +
          parseInt(d[0]);
        let inmatrixcol = counters[matrixnum] % blockStackDimension;
        counters[matrixnum]++;
        return (
          d[1][currentEpochSetting - 1] * (cellDimension + marginBuffer) +
          inmatrixcol * cubeDimension
        );
      })
      .attr("y", function (d) {
        // Define y coordinate to place rect
        let matrixnum =
          parseInt(d[1][currentEpochSetting - 1] * tableDimension) +
          parseInt(d[0]);
        let hm = Math.floor(ycounters[matrixnum] / blockStackDimension);
        ycounters[matrixnum]++;
        return d[0] * (cellDimension + marginBuffer) + hm * cubeDimension;
      })
      .attr("id", function (d) {
        // Define unique id of rect
        return "rect" + d[3];
      })
      .attr("width", function (d) {
        // Define width of rect
        return cubeDimension;
      })
      .attr("height", function (d) {
        // Define height of rect
        return cubeDimension;
      })
      .attr("opacity", function (d) {
        // Define opacity of rect
        return 1;
      })
      .attr("fill", function (d) {
        // Define color of rect
        return "black";
      })
      .attr("class", function (d) {
        // Define class of rect ( currently unused )
        let predicted_label =
          "predicted_label_" + d[1][currentEpochSetting - 1];
        let true_label = "true_label_" + d[0];
        return true_label + " " + predicted_label;
      });
  }

  /*--------------------------------------------------------------------------------
      Function: clickedRect
      Behavior: Activates when a rect is clicked, will find all rect's in same matrix
          cell and color these blue, and all other cells black. This will then make a
          call to fetchDataWindowResults to provide entries to the data window that
          correspond with the entries to this cell
      Input: Reference to clicked rect as well as the entire dataset to parse through
      Returns: N/A
      --------------------------------------------------------------------------------*/
  function clickedRect(d_on, d) {
    let actual = d_on[0];
    let prediction = d_on[1][currentEpochSetting - 1];
    let selectedDataSet = fetchDataWindowResults(
      d,
      actual,
      prediction, // Fetch data points for selected cell
      currentEpochSetting - 1,
      currentConfSetting
    );
    d3.select("#matrix").select("svg").selectAll("rect").style("fill", "black");
    // d3.selectAll('rect').style('fill', "black");                                                                        // Selecting all rects and coloring black
    d3.selectAll("rect") // Coloring rects in selected quadrent blue
      .filter(function (d) {
        if (d[0] == actual && d[1][currentEpochSetting - 1] == prediction)
          return 1;
        else return 0;
      })
      .style("fill", "blue");
    let data_section_title =
      "Data for: Label (" +
      d_on[0] +
      ") Prediction (" +
      d_on[1][currentEpochSetting - 1] +
      ")";
    d3.select("#review").text(data_section_title); // Updating title of 'Data' window
    d3.select("#review").append("ul").attr("id", "testList"); // Creating a new list to display
    d3.select("#testList").selectAll("li").remove(); // Removing all old list items
    for (let i = 0; i < selectedDataSet.length; i++) {
      // Add list entries for 'Sentence' and Confidence score of selected data
      let tableRowData = selectedDataSet[i][1];
      let dataPointString =
        " Confidence Score: " +
        tableRowData["Test Confidence Score"][currentEpochSetting - 1] +
        " Input Data: " +
        tableRowData["Test Sentence"];
      d3.select("#testList")
        .append("li")
        .text(dataPointString)
        .classed("dataPoint", true);
    }
    d3.selectAll(".dataPoint").on("click", function () {
      // View overflowed data on click
      d3.selectAll(".dataPoint").classed("clicked", false);
      d3.select(this).classed("clicked", true);
    });
  }

  /*--------------------------------------------------------------------------------
        Function: emptyMatrix
        Behavior: Empties out entire confusion matrix of any rect's, as well as resets
            counters used when placing in new rects
        Input: N/A
        Returns: N/A
        --------------------------------------------------------------------------------*/
  function emptyMatrix() {
    counters = new Array(tableDimension * tableDimension).fill(0);
    ycounters = new Array(tableDimension * tableDimension).fill(0);
    svg.selectAll("*").remove();
  }

  /*--------------------------------------------------------------------------------
        Function: refineChoice
        Behavior: Filters the dataset referenced when adding rect's to the matrix to only
            include data that has a confidence score greater than that selected on the
            slider.
        Input: N/A
        Returns: N/A
        --------------------------------------------------------------------------------*/
  function refineChoice() {
    let datasubset = [];
    for (let i = 0; i < dataset.length; i++) {
      let datapoint = dataset[i];
      let cScore = Math.max.apply(Math, dataset[i][4][currentEpochSetting - 1]);
      if (cScore >= currentConfSetting) {
        datasubset.push(datapoint);
      }
    }
  }

  useEffect(() => {
    addAxisLabels();

    totalItems = Object.keys(data).length; // Defining totalItems
    possibleOutputValues = extractTypes(data); // Defining possibleOutputValues
    tableDimension = possibleOutputValues.length; // Defining tableDimension
    /* NOTE: LIMITS AMOUNT OF DATA USED
            if( totalItems > 2000 ){
                let sliced = [];
                for( let i = 0; i < 2000; i++ ){
                    sliced[i] = rawJSONData[i];
                }
                rawJSONData = sliced;
                d = sliced;
                totalItems = 2000;
            }
            */
    table = new Array(tableDimension); // Initializing table
    for (let i = 0; i < tableDimension; i++) {
      table[i] = new Array(tableDimension);
      for (let j = 0; j < tableDimension; j++) {
        table[i][j] = 0;
      }
    }
    lastEpochIndex = data[0]["Num Epochs"]; // Defining lastEpochIndex
    d3.select("#epoch_slider").attr("max", lastEpochIndex); // Embedding lastEpochIndex
    for (let jsonEntry, i = 0; (jsonEntry = data[i++]); ) {
      // Storing JSON data in memory
      let index = i;
      let entryText = jsonEntry["Test Sentence"];
      let confidenceScore = jsonEntry["Test Confidence Score"];
      let trueLabel = jsonEntry["Test Label"];
      let predictedLabel = jsonEntry["Test Prediction"];
      let tableXCoordinate = possibleOutputValues.indexOf(
        predictedLabel[currentEpochSetting - 1]
      ); //Predicted
      let tableYCoordinate = possibleOutputValues.indexOf(trueLabel); // Actual
      table[tableXCoordinate][tableYCoordinate] += 1;
      dataset.push([
        trueLabel,
        predictedLabel,
        entryText,
        index,
        confidenceScore,
      ]);
    }
    svg = d3
      .select("body") // Defining svg
      .select("#matrix")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
    counters = new Array(tableDimension * tableDimension).fill(0); // Defining conters
    ycounters = new Array(tableDimension * tableDimension).fill(0); // Defining ycounters
    cellDimension = h / tableDimension; // Defining celldimension
    blockStackDimension = Math.round(Math.sqrt(totalItems)) + 1; // Defining blockStackDimension
    marginBuffer = 5; // Defining marginBuffer
    cubeDimension = (cellDimension - marginBuffer) / blockStackDimension; // Defining cubeDimension
    /*--------------------------------------------------------------------------------
            INITIALIZING MATRIX
     --------------------------------------------------------------------------------*/
    refineChoice(); // Filter based on default confidence score
    fillMatrix(); // Place rects on matrix
    rect.on("click", function (d_on) {
      clickedRect(d_on, data);
    }); // Define 'click' behavior
    /*--------------------------------------------------------------------------------
            Function: Slider Re-Draw
            Behavior: This d3 code will redraw each time there is a change in the slider.
            Input: None
            Returns: N/A
            --------------------------------------------------------------------------------*/
    d3.selectAll(".slider").on("change", function () {
      if (this.id === "confidence_slider") {
        currentConfSetting = this.value;
      }
      if (this.id === "epoch_slider") {
        currentEpochSetting = this.value;
      }
      d3.select("#confidence_setting").text(
        "Confidence: " + currentConfSetting
      ); // Update confidence slider header to reflect change
      d3.select("#epoch_setting").text("Epoch: " + currentEpochSetting); // Update epoch slider header to reflect change
      emptyMatrix(); // Remove all current rects from matrix
      refineChoice(); // Filter data for changes in min confidence score
      fillMatrix(); // Place new set of datapoints in matrix
      rect.on("click", function (d_on) {
        clickedRect(d_on, rawJSONData);
      }); // Re-assign click function to rects
    });
  }, []);

  return (
    <div>
      <h1> Interactive Confusion Matrix </h1>
      <h3 id='confidence_setting'> Confidence: 0.5 </h3>
      <input
        class='slider'
        id='confidence_slider'
        type='range'
        min='0'
        max='1'
        step='.1'
        value='.5'
      />
      <h3 id='epoch_setting'> Epoch: 1 </h3>
      <input
        class='slider'
        id='epoch_slider'
        type='range'
        min='1'
        max='20'
        step='1'
        value='1'
      />
      <table class='xaxis'>
        <tr> </tr>
      </table>
      <div>
        <div>
          <table class='yaxis'>
            <tr> </tr>
          </table>
          <div id='matrix'></div>
          <div id='review'>
            Data For:
            <ul id='testList'></ul>
          </div>
        </div>
      </div>
    </div>
  );
}
