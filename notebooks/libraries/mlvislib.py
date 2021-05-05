from IPython.core.display import display, HTML
from string import Template
import json

def say_hello():
    display(HTML('<h1>Greetings</h1>'))

'''--------------------------------------------------------------------------------
Class: ConfusionMatrix
Behavior: Displays confusion matrix powered by JS in Jupyter output cell
Input: require JSON path, and arrays of strings for x and y axis labels
Returns: Should return instance of ConfusionMatrix object
--------------------------------------------------------------------------------'''
class ConfusionMatrix:

    data_file_name = ""                                                # Filepath with " character appended

    def __init__(self, json_name, x_labels, y_labels):
        # NOTE: JSON should reside in same folder as .py file
        self.data_file_name = "\"" + json_name + "\""                  # Store user provided filepath string as class variable
        self.x_labels = x_labels                                       # String of labels for X-Axis
        self.y_labels = y_labels                                       # String of labels for Y-Axis
        display(HTML(self.d3_source_html))                             # Calling d3 source library


    '''--------------------------------------------------------------------------------
    Variable: d3_source_html
        Directs to d3 source code, however this is also called in the notebook itself
    --------------------------------------------------------------------------------'''
    d3_source_html = '<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>'

    '''--------------------------------------------------------------------------------
    Variable: html_template
        Contains HTML for website, includes variables to insert css, and javascript
        which are replaced when the display function is called.
    --------------------------------------------------------------------------------'''
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

    '''--------------------------------------------------------------------------------
    Variable: css
        Contains all styling for entire visualization. changes to this css code may
        also change the styling of the entire jupyter notebook.
    --------------------------------------------------------------------------------'''
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
        #testList {                                           /* List in data Section */
            list-style-type: none;
            padding-left: 0;
            margin: 0;
        }
        li.dataPoint{
            font-size: smaller;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        li.dataPoint.clicked{
            overflow: visible;
            white-space: normal;
        }
        li.dataPoint:nth-child(odd){                          /* Alternating list item color */
            background: #999;
        }
        table.xaxis {                                         /* X-axis of table */
            table-layout: auto;
            width: 750px;
            margin-left: 26px !important;
            text-align: center;
        }
        td.xlabel {
            text-align: center;
        }
        table.yaxis {                                         /* Y-axis of table */
            float: left;
            display: inline;
            table-layout: auto;
            height: 750px;
            writing-mode: sideways-lr;
        }
        td.ylabel {
            text-align: center;
        }
        #review{                                              /* Data Section */
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
        Returns: Returns array of possible values for 'Test Label'.
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
        Returns: Subset of 'd' variable formatted the same as 'd'
        --------------------------------------------------------------------------------*/
        function fetchDataWindowResults(d, testLabel, predLabel, epoch, conf){
            console.log("Visualization: Calling fetchDataWindowResults...");
            var fullDataSet = d;
            var selectedTestLabel = testLabel;
            var selectedPredictionLabel = predLabel;
            var selectedEpoch = epoch;
            var selectedConfMin = conf;
            var selectedEntries = []
            for (const dataPoint of Object.entries(d)){
                var currentPrediction = dataPoint[1]['Test Prediction'][epoch];
                var currentTestLabel = dataPoint[1]['Test Label'];
                var currentSentence = dataPoint[1]['Test Sentence'];
                var currentConfScore = dataPoint[1]['Test Confidence Score'][epoch];
                var bestConfScore = Math.max.apply(Math, currentConfScore);
                if(
                currentPrediction == selectedPredictionLabel &&
                currentTestLabel == selectedTestLabel &&
                bestConfScore >= selectedConfMin){
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
        function addAxisLabels(){
            var xaxis_labels = $x
            var yaxis_labels = $y
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
        Behavior: Does the work of actually placing selected datapoints into 'rect' items
            and inserting them into the matrix svg (redefines 'rect' variable)
        Input: None
        Output: None
        --------------------------------------------------------------------------------*/
        function fillMatrix(){
            console.log("Debugging: Filling Matrix...");
            rect = svg.selectAll("rect")                                                                                       // Defining rect as child of SVG
                          .data(datasubset)
                          .enter()
                          .append("rect");
            /*--------------------------------------------------------------------------------
            Format: d[trueLabel, predictedLabel, entryText, index, conf_scores]
            --------------------------------------------------------------------------------*/
            rect.attr("x", function (d){                                                                                       // Define x coordinate to place rect
                    var matrixnum = (parseInt(d[1][currentEpochSetting -1]) * tableDimension) + parseInt(d[0]);
                    var inmatrixcol = counters[matrixnum] % blockStackDimension;
                    counters[matrixnum]++;
                    return (d[1][currentEpochSetting -1] * (cellDimension + marginBuffer)) + (inmatrixcol * (cubeDimension));
                })
                .attr("y", function(d){                                                                                        // Define y coordinate to place rect
                    var matrixnum = (parseInt(d[1][currentEpochSetting -1] * tableDimension) + parseInt(d[0]));
                    var hm = Math.floor(ycounters[matrixnum]/blockStackDimension);
                    ycounters[matrixnum]++;
                    return (d[0] * (cellDimension + marginBuffer)) + (hm * (cubeDimension));
                })
                .attr("id", function(d){                                                                                       // Define unique id of rect
                    return "rect" + d[3];
                })
                .attr("width", function(d){                                                                                    // Define width of rect
                    return cubeDimension;
                })
                .attr("height", function(d){                                                                                   // Define height of rect
                    return cubeDimension;
                })
                .attr("opacity", function(d){                                                                                  // Define opacity of rect
                    return 1;
                })
                .attr("fill", function(d){                                                                                     // Define color of rect
                    return ("black");
                })
                .attr("class", function(d){                                                                                    // Define class of rect ( currently unused )
                    predicted_label = "predicted_label_" + d[1][currentEpochSetting -1];
                    true_label = "true_label_" + d[0];
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
        function clickedRect(d_on, d){
            var actual = d_on[0];
            var prediction = d_on[1][currentEpochSetting-1];
            var selectedDataSet = fetchDataWindowResults(d, actual, prediction,                                                 // Fetch data points for selected cell
                (currentEpochSetting - 1), currentConfSetting);
            d3.selectAll('rect').style('fill', "black");                                                                        // Selecting all rects and coloring black
            d3.selectAll('rect')                                                                                                // Coloring rects in selected quadrent blue
                .filter(function(d) {
                    if( d[0] == actual && d[1][currentEpochSetting-1] == prediction)
                        return 1;
                    else
                        return 0;
                })
                .style('fill', "blue");
            var data_section_title = "Data for: Label (" + d_on[0] + ") Prediction (" + d_on[1][currentEpochSetting-1] + ")";
            d3.select('#review').text(data_section_title);                                                                      // Updating title of 'Data' window
            d3.select('#review').append("ul").attr("id", "testList")                                                            // Creating a new list to display
            d3.select("#testList").selectAll("li").remove();                                                                    // Removing all old list items
            for (var i = 0; i < selectedDataSet.length; i++){                                                                   // Add list entries for 'Sentence' and Confidence score of selected data
                var tableRowData = selectedDataSet[i][1];
                var dataPointString = " Confidence Score: " +  tableRowData['Test Confidence Score'][currentEpochSetting - 1] +
                    " Input Data: " + tableRowData['Test Sentence']
                d3.select("#testList").append("li").text(dataPointString).classed("dataPoint", true);
            }
            d3.selectAll(".dataPoint").on('click', function(){                                                                  // View overflowed data on click
                console.log(this);
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
        function emptyMatrix(){
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
        function refineChoice(){
            datasubset = [];
            for( var i = 0; i < dataset.length; i++ ){
                datapoint = dataset[i];
                cScore = Math.max.apply(Math, dataset[i][4][currentEpochSetting-1]);
                if( cScore >= currentConfSetting ){
                    datasubset.push(datapoint);
                }
            }
        }

        /*--------------------------------------------------------------------------------
        GLOBAL VARIABLES: DECLARATIONS
        --------------------------------------------------------------------------------*/
        console.log("Visualization: Running JavaScript...");
        var dname = $conf_data_filepath;              // Path to local JSON file storing data
        var rawJSONData = null;                       // Data from JSON read operation
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
        var counters = null;                          // Current 'x' position when placing rects
        var ycounters = null;                         // Curent 'y' position when placing rects
        var cellDimension = null;                     // Height and width to make each cell on matrix
        var blockStackDimension = null;               // How many cubes to place on a single row in matrix
        var marginBuffer = null;                      // How much room to leave between cells in matrix
        var cubeDimension = null;                     // Dimensions of each rect

        /*--------------------------------------------------------------------------------
        Creating Visualization / Main
        --------------------------------------------------------------------------------*/
        d3.json( $conf_data_filepath, function(d) {
            rawJSONData = d;                                                                               // Storing JSON after read operation
            limitData(rawJSONData);
            /*--------------------------------------------------------------------------------
            GLOBAL VARIABLES: DEFINITIONS
            --------------------------------------------------------------------------------*/
            totalItems = Object.keys(d).length                                                             // Defining totalItems
            possibleOutputValues = extractTypes(d);                                                        // Defining possibleOutputValues
            tableDimension = possibleOutputValues.length;                                                  // Defining tableDimension
            /* NOTE: LIMITS AMOUNT OF DATA USED
            if( totalItems > 2000 ){
                var sliced = [];
                for( var i = 0; i < 2000; i++ ){
                    sliced[i] = rawJSONData[i];
                }
                rawJSONData = sliced;
                d = sliced;
                totalItems = 2000;
            }
            */
            table = new Array(tableDimension);                                                             // Initializing table
            for(var i=0; i<tableDimension; i++){
                table[i] = new Array(tableDimension);
                for(var j=0; j<tableDimension; j++){
                    table[i][j] = 0;
                }
            }
            lastEpochIndex = d[0]['Num Epochs']                                                            // Defining lastEpochIndex
            d3.select("#epoch_slider").attr("max", lastEpochIndex);                                        // Embedding lastEpochIndex
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
            svg = d3.select("body")                                                                        // Defining svg
                        .select("#matrix")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);
            counters = new Array(tableDimension * tableDimension).fill(0);                                 // Defining conters
            ycounters = new Array(tableDimension * tableDimension).fill(0);                                // Defining ycounters
            cellDimension = h / tableDimension;                                                            // Defining celldimension
            blockStackDimension = Math.round(Math.sqrt(totalItems)) + 1;                                   // Defining blockStackDimension
            marginBuffer = 5;                                                                              // Defining marginBuffer
            cubeDimension = ((cellDimension - marginBuffer) / blockStackDimension);                        // Defining cubeDimension
            /*--------------------------------------------------------------------------------
            INITIALIZING MATRIX
            --------------------------------------------------------------------------------*/
            refineChoice();                                                                                // Filter based on default confidence score
            fillMatrix();                                                                                  // Place rects on matrix
            rect.on("click",function(d_on){ clickedRect(d_on, d) });                                       // Define 'click' behavior
            /*--------------------------------------------------------------------------------
            Function: Slider Re-Draw
            Behavior: This d3 code will redraw each time there is a change in the slider.
            Input: None
            Returns: N/A
            --------------------------------------------------------------------------------*/
            d3.selectAll(".slider").on("change", function() {
                if(this.id == "confidence_slider"){
                    currentConfSetting = this.value;
                }
                if(this.id == "epoch_slider"){
                    currentEpochSetting = this.value;
                }
                d3.select("#confidence_setting").text("Confidence: " + currentConfSetting);                    // Update confidence slider header to reflect change
                d3.select("#epoch_setting").text("Epoch: " + currentEpochSetting);                             // Update epoch slider header to reflect change
                emptyMatrix();                                                                                 // Remove all current rects from matrix
                refineChoice();                                                                                // Filter data for changes in min confidence score
                fillMatrix();                                                                                  // Place new set of datapoints in matrix
                rect.on("click",function(d_on){ clickedRect(d_on, rawJSONData) });                             // Re-assign click function to rects
            })
        });

    ''')

    '''--------------------------------------------------------------------------------
    Testing function, please ignore
    --------------------------------------------------------------------------------'''
    def display_column_labels(self):
        print(self.x_labels)

    '''--------------------------------------------------------------------------------
    Testing function, please ignore
    --------------------------------------------------------------------------------'''
    def display_internals(self):
        print(self.css, "\n", self.html_template, "\n", self.js_template, self.data_file_name)


    '''--------------------------------------------------------------------------------
    Testing function, please ignore
    --------------------------------------------------------------------------------'''
    def html_test(self):
        say_hello()

    '''--------------------------------------------------------------------------------
    Function: display
    Behavior: Fills HTML template with js code and css, as well as replaces variable
        for location of JSON file with class cariable data_file_name. This template
        is then rendered using the IPython HTML function in the Jypyter notebook
        output cell.
    Input: Variables data_file_name, x_labels, y_labels, css, js_text, and html_template
        must all be defined before calling this function
    Returns: N/A
    --------------------------------------------------------------------------------'''
    def display(self):
        js_text = self.js_template.substitute({'conf_data_filepath': self.data_file_name, 'x': self.x_labels, 'y': self.y_labels})
        display(HTML(self.html_template.substitute({'css_text': self.css, 'js_text': js_text})))
