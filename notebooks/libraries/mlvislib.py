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
        console.log("Visualization: Running JavaScript...");
        var dname = $conf_data_filepath;
        var currentConfSetting = .5;
        var currentEpochSetting = 1;
        var lastEpochIndex = 0;
        // Delete this line below just in case it slows down the program
        console.log("Visualization: Reading JSON file(", dname, ")...");

        d3.json( $conf_data_filepath, function(d) {
            console.log("Visualization: Logging complete JSON...");
            console.log(d);
            lastEpochIndex = d[0]['Num Epochs']
            d3.select("#epoch_slider").attr("max", lastEpochIndex);
        });


        /*--------------------------------------------------------------------------------
        I've temporarily left out the 'getType' function, since the names of these
        types are not included in the JSON file that is given to the JavaScript. More
        functionality can be incldued later to bring the names in as well as the raw data.
        Type will be represented by the given numeric identifier for now.
        --------------------------------------------------------------------------------*/

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
                    // console.log("Prediction:", currentPrediction,
                    //     "Test Sentence:", currentSentence,
                    //     "Confidence Score:", currentConfScore);
                }
            }
            return selectedEntries;
        }

        /*--------------------------------------------------------------------------------
        Function: addAxisLabels
        Behavior: 
        Input: 
        Output: 
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
        addAxisLabels()

        /*--------------------------------------------------------------------------------
        Function: Slider Re-Draw
        Behavior: This d3 code will redraw each time there is a change in the slider.
        Input: None
        Output: Visualization should be redrawn
        --------------------------------------------------------------------------------*/
        /*--------------------------------------------------------------------------------
        BUG: This should be adjusted to be called both on load and on change. 
        --------------------------------------------------------------------------------*/

        d3.selectAll(".slider").on("change", function() {
            d3.select("svg").remove();

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

            /*--------------------------------------------------------------------------------
            Function: Re-Draw
            Behavior: Adjusting the slider will call this function to redraw the
                      visualization. First a table is build keep track of the number of
                      elements to be in each cell. Next, data is read into an array based on
                      the parameters set by the sliders.
            Input: filepath to JSON
            Output: visualization should be redrawn
            --------------------------------------------------------------------------------*/

            d3.json($conf_data_filepath, function(d) {
                var totalItems = Object.keys(d).length
                console.log("Visualization: ", totalItems, "pieces of test data included")

                var possibleOutputValues = extractTypes(d);
                console.log("Visualization: Possible outcomes inlcudes; ", possibleOutputValues)

                var tableDimension = extractTypes(d).length;
                console.log("Visualization: Constructing", tableDimension, "x",
                            tableDimension, "chart...");
                var dataset = [];

                var table = new Array(tableDimension);
                for(var i=0; i<tableDimension; i++){
                    table[i] = new Array(tableDimension);
                    for(var j=0; j<tableDimension; j++){
                        table[i][j] = 0;
                    }
                }

                console.log("Visualization: Table initialized as: ", table)
                console.log("Visualization: Preparing to display epoch (", currentEpochSetting, ")...");

                /*--------------------------------------------------------------------------------
                NOTE: Will we need to display just integer representations of classifications,
                      or will we need to display titles of classicications along the axis
                --------------------------------------------------------------------------------*/

                for(var jsonEntry, i=0; jsonEntry = d[i++];){
                    var index = i;
                    var entryText = jsonEntry["Test Sentence"];
                    var confidenceScore = jsonEntry["Test Confidence Score"][currentEpochSetting-1];
                    var trueLabel = jsonEntry["Test Label"];
                    var predictedLabel = jsonEntry["Test Prediction"][currentEpochSetting-1];
                    var tableXCoordinate = possibleOutputValues.indexOf(predictedLabel); //Predicted
                    var tableYCoordinate = possibleOutputValues.indexOf(trueLabel); // Actual

                    if(confidenceScore > currentConfSetting){
                        table[tableXCoordinate][tableYCoordinate]+=1;
                        dataset.push([trueLabel, predictedLabel, entryText, index]);
                    }
                }

                console.log("Visualization: Table for confidence ", currentConfSetting, " at epoch ", currentEpochSetting, table);
                console.log("Visualization: Creating SVG...");

                /*--------------------------------------------------------------------------------
                NOTE: Will leave this as the default viz size for now
                --------------------------------------------------------------------------------*/

                var w = 750;
                var h = 750;

                var svg = d3.select("body")
                            .select("#matrix")
                            .append("svg")
                            .attr("width", w)
                            .attr("height", h);

                var rect = svg.selectAll("rect")
                              .data(dataset)
                              .enter()
                              .append("rect");

                var counters = new Array(tableDimension * tableDimension).fill(0);
                var ycounters = new Array(tableDimension * tableDimension).fill(0);
                var cellDimension = h / tableDimension;
                var blockStackDimension = Math.round(Math.sqrt(totalItems)) + 1;
                var marginBuffer = 5;
                var cubeDimension = ((cellDimension - marginBuffer) / blockStackDimension);

                /*--------------------------------------------------------------------------------
                Format: d[trueLabel, predictedLabel, entryText, index, epoch]
                --------------------------------------------------------------------------------*/

                /*--------------------------------------------------------------------------------
                Filling each cell of the matrix with the proper number of squares
                NOTE: boxes have the attributes: x, y, id, width, height, opacity, fill, and class
                --------------------------------------------------------------------------------*/
                rect.attr("x", function (d, i){
                    var matrixnum = (parseInt(d[1]) * tableDimension) + parseInt(d[0]);
                    var inmatrixcol = counters[matrixnum] % blockStackDimension;
                    counters[matrixnum]++;
                    return (d[1] * (cellDimension + marginBuffer)) + (inmatrixcol * (cubeDimension));
                    })
                    .attr("y", function(d, i){
                        var matrixnum = (parseInt(d[1] * tableDimension) + parseInt(d[0]));
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
                        predicted_label = "predicted_label_" + d[1];
                        true_label = "true_label_" + d[0];
                        return true_label + " " + predicted_label;
                });

                rect.on("click",function(d_on){ clickedRect(d_on, d) });
            });
        })

        
        /*--------------------------------------------------------------------------------
        Function: fillMatrix
        Behavior:
        Input:
        Output:
        --------------------------------------------------------------------------------*/

        /*--------------------------------------------------------------------------------
        Function: clickedRect
        Behavior:
        Input:
        Output:
        --------------------------------------------------------------------------------*/
        function clickedRect(d_on, d){
            console.log("Debugging: d_on: ", d_on);
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
