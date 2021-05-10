from IPython.core.display import display, HTML
import string
from string import Template
import json

def say_hello():
    display(HTML('<h1>Greetings</h1>'))

class BarcodePlot:
    source_data_path = ""

    def __init__(self, path):
        self.source_data_path = "\"" + path + "\""

    """------------------------------------------------------------------------
    Variable: html_template
        Variable contains the HTML code for the visualization, with variables
        placed at the locations where javascript will be inserted into the
        template.
    -------------------------------------------------------------------------"""
    html_template = Template('''
        <style> $css_text </style>
        <h1> Barcode Visualization </h1>
        <div id="container">
          <div class="left">
            <h3> Epoch #:</h3>
            <h4 id="epochNum"></h4>
            <input class="slider" id="epoch_slider" type="range" min="0" max="19" step="1" value="0" onchange="changedValues()"/>
          </div>
          <div class="left">
            <h3> Number of Sentences:</h3>
            <h4 id="sentNum"></h4>
            <input class="slider" id="num_sentences" type="range" min="0" max="496" step="1" value="10" onchange="changedValues()"/>
          </div>
        </div>
        <input type="text" id="myInput" placeholder="Filter out words" style="width : auto">
        <button onclick="changedValues()">Filter</button>
        <div class="tables"></div>
        <script> $js_code </script>
    ''')

    """------------------------------------------------------------------------
    Variable: d3_source_html
        Contains source for d3 library.
    -------------------------------------------------------------------------"""
    d3_source_html = '<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>'

    """------------------------------------------------------------------------
    Variable: css_text
        CSS code to style the visualization.
    -------------------------------------------------------------------------"""
    css_text = '''
        #myInput {
          /* background-image: url('/css/searchicon.png'); Add a search icon to input */
          background-position: 10px 12px; /* Position the search icon */
          background-repeat: no-repeat; /* Do not repeat the icon image */
          width: 100%; /* Full-width */
          font-size: 16px; /* Increase font-size */
          padding: 12px 20px 12px 40px; /* Add some padding */
          border: 1px solid #ddd; /* Add a grey border */
          margin-bottom: 12px; /* Add some space below the input */
        }
        .cosinesim{
          margin: auto;
          /* max-width:100% */
          width: 60px;
          text-align: center !important;
        }
        .sent {
          /* width: 65%; */
          max-width: 1000px;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          text-align: left !important;
        }
        #container{
          height: 150px;
          width: auto;
          border: 1px solid black;
          border-radius: 3px;
          margin-bottom: 1%;
        }
        .left{
          margin-right: 15px;
          float : left;
          text-align: center;
        }
        .center{
          text-align: center;
        }
        #highlighted {
          background-color: aqua;
          white-space: normal !important;
          stroke-width: 1px;
          stroke: black;
          overflow: visible !important;
        }
        table {
          table-layout: fixed;
        }
        td.bar {
          padding: 0 !important;
          width: 3px;
          vertical-align: middle !important;
        }
    '''

    """------------------------------------------------------------------------
    Variable: js_code
        Contains all javascript for entire visualization. Currently location
        of source data file is hard coded into this string.
    -------------------------------------------------------------------------"""
    js_path_incomplete = Template('''

    // GLOBAL VARIABLE: data_arr, store dataset to chart, so that it is referencable
    // by both the "main" or automatic function as well as the function called on
    // click
    var data_array = []
    var raw_data = []
    var current_epoch = -1
    var current_num_sent = -1

    /*------------------------------------------------------------------------
    Function: argsort
        Relatively confident that this code is responsible for sorting the
        individual barcodes when an entry in the table has been selected
    -------------------------------------------------------------------------*/
    function argsort(array) {
      const arrayObject = array.map((value, idx) => { return { value, idx }; });          // Map all values in array to have an index
      arrayObject.sort((a, b) => {                                                        // Sort array based on bar value
          if (a.value < b.value) {
            return 1;
          }
          if (a.value > b.value) {
            return -1;
          }
          return 0;
      });
      const argIndices = arrayObject.map(data => data.idx);                               // Ordering is returned as list of indices
      return argIndices;
    }

    /*------------------------------------------------------------------------
    Function: changedValues
        Function is called when any changes are made to the sliders on the
        visualization, or when a request to filter words has been made. This
        will read from the file, and update with the appropriate values in the
        table.
    -------------------------------------------------------------------------*/
    function changedValues() {
        var epoch_val = d3.select("#epoch_slider").property("value");
        var sentences_val = d3.select("#num_sentences").property("value");
        var prev_sent_val = current_num_sent;
        d3.selectAll("#epochNum").text(epoch_val);
        d3.selectAll("#sentNum").text(sentences_val);
        current_epoch = epoch_val;
        current_num_sent = sentences_val;
        var max = current_num_sent;
        // data_array = [];
        console.log("prev_sent_val, current_num_sent", prev_sent_val, current_num_sent);
        console.log("Debugging: data_array: ", data_array);

        if(current_num_sent > prev_sent_val){
            var i = current_num_sent;
        }
        if( current_num_sent < prev_sent_val){
            console.log("Debuggings: ", data_array.splice(0, current_num_sent));
            data_array = data_array.splice(0, current_num_sent);
            console.log(data_array.splice(0, current_num_sent));
        }
        // for(var i = 0; i < max; i++){                                                                            // Enter JSON data to array format
        //     data_array.push([raw_data[i]["Index"], raw_data[i]["Test Label"],
        //         raw_data[i]["Test Prediction"], raw_data[i]["Test Confidence Score"],
        //         raw_data[i]["Test Sentence"], raw_data[i]["Intermediate Values"]]);
        // }
        d3.select(".tables").selectAll("*").remove();
        createTable(data_array);
    }

    /*------------------------------------------------------------------------
    Function: automatic
        Function is called automatically. This will read from the file, and
        update with the appropriate values in the table.
    -------------------------------------------------------------------------*/
    function automatic(){
        var epoch_val = d3.select("#epoch_slider").property("value");                                               // Fetch value of epoch slider
        d3.selectAll("#epochNum").text(epoch_val);                                                                  // Insert value above slider
        current_epoch = epoch_val;
        var sentences_val = d3.select("#num_sentences").property("value");                                          // Fetch value of num sentencees slider
        d3.selectAll("#sentNum").text(sentences_val);                                                               // Insert value above slider
        current_num_sent = sentences_val;
        d3.json( $json_filepath , function(data) {                                                                  // Read in JSON file from path
            raw_data = data;
            var max_sent = document.getElementById("num_sentences");                                                // Select num_sentences slider
            var ep_num = document.getElementById("epoch_slider");                                                   // Select epoch slider
            var total_sentences = Object.keys(data).length -1;
            max_sent.max = total_sentences;
            ep_num.max = data["0"]['Num Epochs'] - 1;                                                               // Set max spoch to value of 'Num Epochs' in JSON
            for(var i = 0; i < 10; i++){                                                                            // Enter JSON data to global variable
                data_array.push([data[i]["Index"], data[i]["Test Label"],
                    data[i]["Test Prediction"], data[i]["Test Confidence Score"],
                    data[i]["Test Sentence"], data[i]["Intermediate Values"]]);
            }
            createTable(data_array);                                                                                // Filling in Table
        })
    }

    /*------------------------------------------------------------------------
    Function: cosinesim
        Calculates the cosine similarities of two entries.
    -------------------------------------------------------------------------*/
    // https://stackoverflow.com/questions/51362252/javascript-cosine-similarity-function
    function cosinesim(A,B){
        var dotproduct=0;                                        // Initialize dot product
        var mA=0;                                                // Stores partial solution for A
        var mB=0;                                                // Stores partial solution for B
        for(i = 0; i < A.length; i++){                           // Store dot product of arrays and square of arrays
            dotproduct += (A[i] * B[i]);                         // 
            mA += (A[i]*A[i]);                                   // 
            mB += (B[i]*B[i]);                                   //
        }                                                        //
        mA = Math.sqrt(mA);                                      // Take sqrt of sum of squared items in each array
        mB = Math.sqrt(mB);                                      //
        var similarity = (dotproduct)/((mA)*(mB))                // Divide dot product by product of a and b
        return Math.abs(similarity);                             // Absolute value is similarity
    }

    /*------------------------------------------------------------------------
    Function: createSVG
        Creates the SVG element to place in table, and adjusts opacity to
        reflect the intermediate value being represented.
    -------------------------------------------------------------------------*/
    function createSVG(d) {
        var w = 3;                                           // Width of bar is 3
        var h = 20;                                          // Height of bar is 20
        var kpi = document.createElement("div");             // Creating a new div to hold 'barcode'
        var svg = d3.select(kpi).append("svg")               // Appending new svg to the above div
            .attr({                                          //
                width: w,                                    //
                height: h                                    //
        });                                                  //
        var elem = svg.selectAll("div")                      // Selects the recently appended div and encodes data
            .data([d]);                                      //
        var elemEnter = elem.enter()                         //
            .append("g");                                    //
        elemEnter.append("rect")                             //
            .attr({                                          //
                x: 0,                                        //
                y: 0,                                        //
                width: 3,                                    //
                height: 20                                   //
            })                                               //
            .style("opacity", .5  + d*10)                    //
            .style("fill", "#4078a9");                       //
        return kpi;                                          //
    }

    /*------------------------------------------------------------------------
    Function: createTable
        Does the work of actually generating the table, and filling it with
        values from the dataset passed to it in either automatic or changedValues
    -------------------------------------------------------------------------*/
    function createTable(data){
        /*------------------------------------------------------------------------
        'data' Format: Index, Test Label, Test Prediction, Test Conf Score,
            Test Sentence, Intermediate Values
        -------------------------------------------------------------------------*/
        var div = d3.select('.tables');                                                            // Selecting space to place table
        var table = div.append("table")                                                            // Creates a table in div with id: sample and class: table
            .attr({ 
                id: "sample",                                                                      //   ID: Sample
                class: 'table'                                                                     //   Class: table 
            })
            .classed("display", true);                                                             //   Class: display
        var tbody = table.append("tbody")                                                          // Adds body to table
        var tableBodyRows = tbody.selectAll("tr")                                                  // Appends a table row for each data entry
            .data(data)
            .enter()
            .append("tr");
        tableBodyRows.selectAll("td")                                                              // Add prediction for current epoch and score to each row
            .data(function(d) {
                return [d];
            })
            .enter()
            .append("td")
            .attr('class', 'sent')
            .text(function(d) {
                return d[2][String(current_epoch)] + " - " +  d[4];
        });
        tableBodyRows.selectAll("td")                                                              // Add colored bars to each row
            .data(function(d) {
                return d[5][String(current_epoch)];
            })
            .enter()
            .append("td")
            .attr("class", function(d,i) {
                return 'bar ' + i;
            })
            .append(function(d) {
                return createSVG(d);                                                               // A SVG rectangle is created for each 'bar' value
        });
        tableBodyRows.on({                                                                         // Appending click function to each row
            "click": function(f){
                d3.selectAll("#highlighted")                                                       // Removes highlighting from previous selection
                    .attr("id", null)
                    .classed("sent", true)
                w = d3.select(this)                                                                // Adds highlight id to selection
                    .select(".sent")
                    .attr("id", "highlighted")
                bars = [...f[5][String(current_epoch)]]                                            // Initialize bars as array of all bars in selected row
                changed_indicies = argsort(bars)                                                   // Selected row is sorted and ordering is saved
                sorted_bars = bars.sort(function(a, b){return b-a});                               // Bars for selecd row are again sorted
                d3.selectAll('.bar').remove()                                                      // Remove bars from visualization
                d3.selectAll('.cosinesim').remove()                                                // Remove all 'cosinesim' values from visualization
                big_array = []                                                                     // Stores re-ordered 'barcodes'
                answers = []                                                                       // Stores cosine similarities
                tableBodyRows.selectAll("td")                                                      // For each row, calculate new barcode ordering and cosine similarity
                    .data(function(d) {
                        temp_array = []
                        var ugh = 0
                        for(ugh = 0; ugh < d[5][String(current_epoch)].length; ugh++){
                            temp_array.push(d[5][String(current_epoch)][changed_indicies[ugh]])
                        }
                        big_array.push(temp_array)
                        var answer = cosinesim(temp_array, sorted_bars);
                        answers.push(answer)
                        return [];
                })
                tableBodyRows.each(function(k,l){                                                  // Storing cosinesim as data for each row
                    d3.select(this)
                        .data(function(d){
                            test = [...k]
                            test[8] = answers[l]
                            return [test];
                        })
                })
                tableBodyRows.each(function(k,l){                                                  // Append the cosinesim value to each row
                    d3.select(this)
                        .append("td")
                        .attr('class', 'cosinesim')
                        .text(function(d,i){
                            return answers[l].toFixed(3);
                        })
                })
                tableBodyRows.selectAll("td")                                                      // Create SVG, recangles from newly ordered array
                    .data(function(d,i) {
                        return big_array[i]
                    })
                    .enter()
                    .append("td")
                    .attr("class", function(d,i) { return 'bar ' + i; })
                    .append(function(d) {
                        return createSVG(d);
                });
                tableBodyRows.sort(function(a,b) {                                                 // Sort rows in table based on cosinesim value
                    if (a[8] < b[8]) {
                        return 1;
                    } else if (a[8] > b[8]) {
                        return -1;
                    } else {
                        return 0;
                    }
                })
            }
        });
    }

    automatic();                                                                                   // Calling 'automatic' which serves as our 'main'
    ''')


    """------------------------------------------------------------------------
    Function: display
        Called from object in notebook, this function will display the
        complete visualization.
    -------------------------------------------------------------------------"""
    def display(self):
        js_path_completed = self.js_path_incomplete.substitute({'json_filepath': self.source_data_path})
        display(HTML(self.html_template.substitute({'css_text': self.css_text, 'js_code': js_path_completed})))

