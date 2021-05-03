from IPython.core.display import display, HTML
from string import Template
import json

def say_hello():
    display(HTML('<h1>Greetings</h1>'))


# Desicion needs to be made, what is to be paresd to this library?
# Should we send it a json? For now it will be a JSON


class ConfusionMatrix:

    data_file_name = ""

    def __init__(self, json_name, x_labels, y_labels):
        # JSON file must be located in libraries directory with python file. 
        self.data_file_name = "\"" + json_name + "\""
        self.x_labels = x_labels
        self.y_labels = y_labels
        display(HTML(self.d3_source_html))


    d3_source_html = '<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>'

    html_template = Template('''
        <style> $css_text </style>
        <h1> Interactive Confusion Matrix </h1>
        <h3 id="confidence_setting"> Confidence: 0.5 </h3>
        <input class="slider" id="confidence_slider" type="range" min="0" max="1" step=".1" value=".5"/>
        <h3 id="epoch_setting"> Epoch: 1 </h3>
        <input class="slider" id="epoch_slider" type="range" min="1" max="20" step="1" value="1"/>
        <table class="xaxis">
            <tr> </tr>
        </table>
        <div>
        <div>
            <div>
                <table class="yaxis">
                    <tr> </tr>
                </table>
                <div id="matrix"></div>
                <div id="review">
                    Data For:
                    <ul id = "testList"></ul>
                </div>
            </div>
        </div>
        <script> $js_text </script>
        ''')

    css = '''
        body {
            font-family: Arial, sans-serif;
            font-size: larger;
        }
        .box_highlighted { 
            background-color: #ffb; 
            border: 1px solid #b53;
        }
        .highlight{
            background-color: yellow;
        }
        .lighthigh{
            background-color: green;
        }
        #testList {
            list-style-type: none;
            padding-left: 0;
            margin: 0;
        }
        li.dataPoint{
            font-size: smaller;
        }
        li.dataPoint:nth-child(odd){
            background: #999;
        }
        table.xaxis {
            table-layout: auto;
            width: 750px;
            margin-left: 26px !important;
            text-align: center;
        }
        td.xlabel {
            text-align: center;
        }
        table.yaxis {
            float: left;
            display: inline;
            table-layout: auto;
            height: 750px;
            writing-mode: sideways-lr;
        }
        td.ylabel {
            text-align: center;
        }
        #review{
            border:1px solid blue; 
            padding: 5px; 
            float: left; 
            width: 750px; 
            height: 500px; 
            background-color: white;
            margin: 20px;
            overflow: scroll;
            }
        #matrix{
            border:1px solid blue; 
            padding: 5px; 
            float: left;
            width: 750px;
            display: inline;
        }
        #slider {
          -webkit-appearance: none;
          width: 100%;
          height: 15px;
          border-radius: 5px;  
          background: #d3d3d3;
          outline: none;
          opacity: 0.7;
          -webkit-transition: .2s;
          transition: opacity .2s;
        }
        #slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 25px;
          height: 25px;
          border-radius: 50%; 
          background: #4ca2af;
          cursor: pointer;
        }
        #slider::-moz-range-thumb {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background: #4ca2af;
          cursor: pointer;
        }
    '''

    js_template = Template('''
        /*--------------------------------------------------------------------------------
        Function: extractTypes
        Behavior: Identifies what different types each data point can be identified as based 
                  off of the 'true_label' attribute in JSON file.
        Input: JSON file
        Output: Returns array of possible values for 'Test Label'.
        --------------------------------------------------------------------------------*/
        function extractTypes(data){
            var lookup = {};
            var items = data;
            var result = [];
            for (var item, i=0; item = items[i++];){
                var name = item['Test Label'];
                if(!(name in lookup)){
                    lookup[name] = 1;
                    result.push(name);
                }
            }
            return result.sort();
        }

        /*--------------------------------------------------------------------------------
        Function: fetchDataWindowResults
        Behavior: Fetches subset of 'd' variable to be displayed in 'Data' window
        Input: 'd' variable, testLabel, predLabel, epoch, conf
        Output: Subset of 'd' variable formatted the same as 'd'
        --------------------------------------------------------------------------------*/
        function fetchDataWindowResults(d, testLabel, predLabel, epoch, conf){
            console.log("Visualization: Calling fetchDataWindowResults...");
            var fullDataSet = d;
            var selectedTestLabel = testLabel;
            var selectedPredictionLabel = predLabel;
            var selectedEpoch = epoch;
            var selectedConfMin = conf;
            var selectedEntries = []
            console.log(d);
            console.log("Visualization: fetchDataWindowResults: for testLabel, predLabel, epoch, conf of: ", 
                testLabel, predLabel, epoch, conf);
            for (const dataPoint of Object.entries(d)){
                var currentPrediction = dataPoint[1]['Test Prediction'][epoch];
                var currentTestLabel = dataPoint[1]['Test Label'];
                var currentSentence = dataPoint[1]['Test Sentence'];
                var currentConfScore = dataPoint[1]['Test Confidence Score'][epoch];
                if (currentPrediction == selectedPredictionLabel &&
                currentTestLabel == selectedTestLabel &&
                currentConfScore > selectedConfMin){
                    selectedEntries.push(dataPoint);
                }
            }
            return selectedEntries;
        }

        /*--------------------------------------------------------------------------------
        Function: addAxisLabels
        Behavior: Adds x and y axis components to the DOM
        Input: takes two string arrays, one for the x and one for the y axis
        Output: Text labels should be placed next to div for matrix
        --------------------------------------------------------------------------------*/
        function addAxisLabels(){
            var xaxis_labels = $x
            var yaxis_labels = $y
            console.log(xaxis_labels, yaxis_labels);
            for(var i = 0; i < xaxis_labels.length; i++){
                d3.select(".xaxis").selectAll("tr").append("td").text(xaxis_labels[i])
                    .classed("xlabel", true);
            }
            for(var i = 0; i < yaxis_labels.length; i++){
                d3.select(".yaxis").selectAll("tr").append("td").text(yaxis_labels[i])
                    .attr("height", (750 / yaxis_labels.length)).classed("ylabel", true);
            }
        }
        addAxisLabels()                               // Calling function to add axis' to the DOM

        /*--------------------------------------------------------------------------------
        Function: fillMatrix
        Behavior:
        Input:
        Output:
        --------------------------------------------------------------------------------*/
        function fillMatrix(){
            /*--------------------------------------------------------------------------------
            Format: d[trueLabel, predictedLabel, entryText, index, conf_scores]
            --------------------------------------------------------------------------------*/
            rect.attr("x", function (d){
                    var matrixnum = (parseInt(d[1][currentEpochSetting]) * tableDimension) + parseInt(d[0]);
                    var inmatrixcol = counters[matrixnum] % blockStackDimension;
                    counters[matrixnum]++;
                    return (d[1][currentEpochSetting] * (cellDimension + marginBuffer)) + (inmatrixcol * (cubeDimension));
                })
                .attr("y", function(d){
                    var matrixnum = (parseInt(d[1][currentEpochSetting] * tableDimension) + parseInt(d[0]));
                    var hm = Math.floor(ycounters[matrixnum]/blockStackDimension);
                    ycounters[matrixnum]++;
                    return (d[0] * (cellDimension + marginBuffer)) + (hm * (cubeDimension));
                })
                .attr("id", function(d){
                    return "rect" + d[3];
                })
                .attr("width", function(d){
                    return cubeDimension;
                })
                .attr("height", function(d){
                    return cubeDimension;
                })
                .attr("opacity", function(d){
                    return 1;
                })
                .attr("fill", function(d){
                    return ("black");
                })
                .attr("class", function(d){
                    predicted_label = "predicted_label_" + d[1][currentEpochSetting];
                    true_label = "true_label_" + d[0];
                    return true_label + " " + predicted_label;
            });
        }

        /*--------------------------------------------------------------------------------
        Function: clickedRect
        Behavior:
        Input:
        Output:
        --------------------------------------------------------------------------------*/
        function clickedRect(d_on, d){
            console.log("Actual: ", d_on[0], "Predicted: ", d_on[1]);
            var actual = d_on[0];
            var prediction = d_on[1];
            var selectedDataSet = fetchDataWindowResults(d, actual, prediction,
                (currentEpochSetting - 1), currentConfSetting);

            d3.selectAll('rect').style('fill', "black");
            d3.selectAll('rect')
                .filter(function(d) { 
                    if( d[0] == actual && d[1] == prediction)
                        return 1;
                    else
                        return 0;
                })
                .style('fill', "blue");

            // Updating the Label on the Chart
            var data_section_title = "Data for: Label (" + d_on[0] + ") Prediction (" + d_on[1] + ")";
            d3.select('#review').text(data_section_title);

            // For some reason the above code deletes the ul
            d3.select('#review').append("ul").attr("id", "testList")

            d3.select("#testList").selectAll("li").remove();
            for (var i = 0; i < selectedDataSet.length; i++){
                var tableRowData = selectedDataSet[i][1];
                // Label and Actual is no longer included since its shown on the box title
                var dataPointString = " Input Data: " + tableRowData['Test Sentence'] +
                " Confidence Score: " +  tableRowData['Test Confidence Score'][currentEpochSetting - 1];
                d3.select("#testList").append("li").text(dataPointString).classed("dataPoint", true);
                
            }
        }

        /*--------------------------------------------------------------------------------
        Function: emptyMatrix
        Behavior:
        Input:
        Output:
        --------------------------------------------------------------------------------*/
        function emptyMatrix(){
            console.log("CALLEWD EMPTY");
            counters = new Array(tableDimension * tableDimension).fill(0);
            ycounters = new Array(tableDimension * tableDimension).fill(0);
            /*
            cellDimension = h / tableDimension;
            blockStackDimension = Math.round(Math.sqrt(totalItems)) + 1;
            marginBuffer = 5;
            cubeDimension = ((cellDimension - marginBuffer) / blockStackDimension);
            */
            svg.selectAll("*").remove();
        }

        /*--------------------------------------------------------------------------------
        Function: refineChoice
        Behavior:
        Input:
        Output:
        --------------------------------------------------------------------------------*/
        function refineChoice(){
            console.log("Debugging: dataset filter:", dataset);
            var filterEpoch = currentEpochSetting;
            var filterConf = currentConfSetting;
            
            for( var i = 0; i < dataset.length; i++ ){
                datapoint = dataset[i];
                // datapoint[1]
                if( i < 10 ) {
                    console.log(dataset[i]);
                }
                
            }
        }

        /*--------------------------------------------------------------------------------
        GLOBAL VARIABLES: DECLARATIONS
        --------------------------------------------------------------------------------*/
        console.log("Visualization: Running JavaScript...");
        var dname = $conf_data_filepath;              // Path to local JSON file storing data
        var currentConfSetting = .5;                  // Set confidence score minimum to default
        var currentEpochSetting = 1;                  // Set epoch setting to default
        var lastEpochIndex = 0;                       // Max value that epoch slider can reach
        var totalItems = null;                        // Total number of boxes that should appear
        var possibleOutputValues = null;              // Possible values that predictions may produce
        var tableDimension = null;                    // Dimensions of table (square so x and y are same)
        var dataset = []                              // JSON is read into this array
        var datasubset = []                           // Selected values from dataset
        var table = null;                             // Reference for how many boxes should be in each matrix cell
        var svg = null;                               // SVG graphic
        var rect = null;                              // Rectangles which are put into above graphic
        var w = 750;                                  // Width of matrix
        var h = 750;                                  // Height of matrix
        
        var counters = null;
        var ycounters = null;
        var cellDimension = null;
        var blockStackDimension = null;
        var marginBuffer = null;
        var cubeDimension = null;

        /*--------------------------------------------------------------------------------
        Creating Visualization / Main
        --------------------------------------------------------------------------------*/
        d3.json( $conf_data_filepath, function(d) {
            /*--------------------------------------------------------------------------------
            GLOBAL VARIABLES: DEFINITIONS
            --------------------------------------------------------------------------------*/
            console.log("Visualization: Reading JSON file(", dname, ")...");
            totalItems = Object.keys(d).length                                                             // Defining totalItems
            console.log("Visualization: totalItems: ", totalItems);
            possibleOutputValues = extractTypes(d);                                                        // Defining possibleOutputValues
            console.log("Visualization: possibleOutputValues: ", possibleOutputValues);
            tableDimension = possibleOutputValues.length;                                                  // Defining tableDimension
            console.log("Visualization: tableDimension: ", tableDimension);
            table = new Array(tableDimension);                                                             // Initializing table
            for(var i=0; i<tableDimension; i++){
                table[i] = new Array(tableDimension);
                for(var j=0; j<tableDimension; j++){
                    table[i][j] = 0;
                }
            }
            lastEpochIndex = d[0]['Num Epochs']                                                            // Defining lastEpochIndex
            d3.select("#epoch_slider").attr("max", lastEpochIndex);                                        // Embedding lastEpochIndex
            console.log("Visualization: lastEpochIndex: ", lastEpochIndex);
            for(var jsonEntry, i=0; jsonEntry = d[i++];){                                                  // Storing JSON data in memory
                var index = i;
                var entryText = jsonEntry["Test Sentence"];
                var confidenceScore = jsonEntry["Test Confidence Score"];
                var trueLabel = jsonEntry["Test Label"];
                var predictedLabel = jsonEntry["Test Prediction"];
                var tableXCoordinate = possibleOutputValues.indexOf(predictedLabel[currentEpochSetting-1]); //Predicted
                var tableYCoordinate = possibleOutputValues.indexOf(trueLabel); // Actual
                table[tableXCoordinate][tableYCoordinate]+=1;
                dataset.push([trueLabel, predictedLabel, entryText, index, confidenceScore]);
            }
            console.log("Visualization: table: ", table);
            console.log("Visualization: dataset: ", dataset);
            svg = d3.select("body")                                                                        // Defining svg
                        .select("#matrix")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);
            console.log("Visualization: svg: ", svg);
            rect = svg.selectAll("rect")                                                                   // Defining rect
                          .data(dataset)
                          .enter()
                          .append("rect");
            console.log("Visualization: rect: ", rect);

            
            /*--------------------------------------------------------------------------------
            Defining variables for drawing matrix
            --------------------------------------------------------------------------------*/
            counters = new Array(tableDimension * tableDimension).fill(0);
            ycounters = new Array(tableDimension * tableDimension).fill(0);
            cellDimension = h / tableDimension;
            blockStackDimension = Math.round(Math.sqrt(totalItems)) + 1;
            marginBuffer = 5;
            cubeDimension = ((cellDimension - marginBuffer) / blockStackDimension);

            // refineChoice();
            fillMatrix();

            
            rect.on("click",function(d_on){ clickedRect(d_on, d) });
        });
 
        /*--------------------------------------------------------------------------------
        Function: Slider Re-Draw
        Behavior: This d3 code will redraw each time there is a change in the slider.
        Input: None
        Output: Visualization should be redrawn
        --------------------------------------------------------------------------------*/
        d3.selectAll(".slider").on("change", function() {
            // d3.select("svg").remove();

            if(this.id == "confidence_slider"){
                currentConfSetting = this.value;
            }
            if(this.id == "epoch_slider"){
                currentEpochSetting = this.value;
            }

            d3.select("#confidence_setting").text("Confidence: " + currentConfSetting);
            d3.select("#epoch_setting").text("Epoch: " + currentEpochSetting);
            console.log("Visualization: Confidence set to (", currentConfSetting,
                        ") Epoch set to (", currentEpochSetting, ")");

            emptyMatrix();
            fillMatrix();

            /*
            d3.json($conf_data_filepath, function(d) {


                emptyMatrix();
                console.log("from inside");
                // fillMatrix();

                rect.on("click",function(d_on){ clickedRect(d_on, d) });
            });
            */
        })
        
    ''')
    
    def display_column_labels(self):
        print(self.x_labels)

    def display_internals(self):
        print(self.css, "\n", self.html_template, "\n", self.js_template, self.data_file_name)

    def html_test(self):
        say_hello()

    def display(self):
        js_text = self.js_template.substitute({'conf_data_filepath': self.data_file_name, 'x': self.x_labels, 'y': self.y_labels})

        display(HTML(self.html_template.substitute({'css_text': self.css, 'js_text': js_text})))
