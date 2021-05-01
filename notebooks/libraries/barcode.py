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
    Function: load_json(self)
        Function prints out the path of the source file to the Jupyter Notebook,
        reads the JSON file into this python script, and then finally displays
        the concents of the JSON file into the cells output in the Jupyter
        notebook as confirmation of a successful read.
    -------------------------------------------------------------------------"""
    def load_json(self):
        stripped = self.source_data_path[1:-1]
        with open(stripped) as f:
            data = json.load(f)
        print("First Input:\n", data["0"]["Test Sentence"])

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
    /*------------------------------------------------------------------------
    Function: argsort
        Relatively confident that this code is responsible for sorting the
        individual barcodes when an entry in the table has been selected
    -------------------------------------------------------------------------*/
    function argsort(array) {
      const arrayObject = array.map((value, idx) => { return { value, idx }; });
      arrayObject.sort((a, b) => {
          if (a.value < b.value) {
            return 1;
          }
          if (a.value > b.value) {
            return -1;
          }
          return 0;
      });

      const argIndices = arrayObject.map(data => data.idx);

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
      var x = d3.select("#myInput").property("value").toUpperCase();
      console.log("Debugging: x: ", x);
      var epoch_val = d3.select("#epoch_slider").property("value");
      var sentences_val = d3.select("#num_sentences").property("value");

      d3.selectAll("#epochNum").text(epoch_val);
      d3.selectAll("#sentNum").text(sentences_val);

      d3.json( $json_filepath , function(largedataset) {
        // NOTE: This variable is not needed after adjustments made to JSON format
        // dataSet = largedataset[epoch_val];

        d3.selectAll("table").remove();
        var i;
        var test = [];
        for(i = 0; i < sentences_val; i++){
        // NOTE: This conditional statement will break the visualization if the dataset has
        // a non-text value in the ['Test Sentence'] field.
            if(largedataset[String(i)]['Test Sentence'].toUpperCase().search(x) > -1){
              test.push([epoch_val, largedataset[i]["Index"], largedataset[i]["Test Label"], largedataset[i]["Test Prediction"][String(epoch_val)],
              largedataset[i]["Test Confidence Score"][epoch_val], largedataset[i]["Test Sentence"],
              largedataset[i]["Intermediate Values"][epoch_val], largedataset[i]["Test Prediction"][epoch_val]]);
            }
        }
        createTable(test);
      })
    }

    /*------------------------------------------------------------------------
    Function: automatic
        Function is called automatically. This will read from the file, and
        update with the appropriate values in the table.
    -------------------------------------------------------------------------*/
    function automatic(){
      var epoch_val = d3.select("#epoch_slider").property("value");
      d3.selectAll("#epochNum").text(epoch_val);

      var sentences_val = d3.select("#num_sentences").property("value");
      d3.selectAll("#sentNum").text(sentences_val);

      d3.json( $json_filepath , function(largedataset) {
        console.log("Debugging: largedataset: ", largedataset);
        // NOTE: following line is not needed for new JSON format
        // dataSet = largedataset[epoch_val];

        var max_sent = document.getElementById("num_sentences");
        var ep_num = document.getElementById("epoch_slider");

        max_sent.max = Object.keys(largedataset).length -1;
        ep_num.max = largedataset["0"]['Num Epochs'] - 1;

        var i;
        var test = []
        for( i = 0; i < 10; i++ ){
          test.push([epoch_val, largedataset[i]["Index"], largedataset[i]["Test Label"],
          largedataset[i]["Test Prediction"][String(epoch_val)],
          largedataset[i]["Test Confidence Score"][epoch_val], largedataset[i]["Test Sentence"],
          largedataset[i]["Intermediate Values"][epoch_val], largedataset[i]["Test Prediction"][epoch_val]]);
        }

        createTable(test);
      })
    }

    /*------------------------------------------------------------------------
    Function: cosinesim
        Calculates the cosine similarities of two entries.
    -------------------------------------------------------------------------*/
    // https://stackoverflow.com/questions/51362252/javascript-cosine-similarity-function
    function cosinesim(A,B){
        var dotproduct=0;
        var mA=0;
        var mB=0;
        for(i = 0; i < A.length; i++){
            dotproduct += (A[i] * B[i]);
            mA += (A[i]*A[i]);
            mB += (B[i]*B[i]);
        }
        mA = Math.sqrt(mA);
        mB = Math.sqrt(mB);
        var similarity = (dotproduct)/((mA)*(mB))
        return Math.abs(similarity);
    }

    /*------------------------------------------------------------------------
    Function: createSVG
        Creates the SVG element to place in table, and adjusts opacity to
        reflect the intermediate value being represented.
    -------------------------------------------------------------------------*/
    function createSVG(d) {
      var w = 3;
      var h = 20;

      var kpi = document.createElement("div");

      var svg = d3.select(kpi).append("svg")
        .attr({
          width: w,
          height: h
        });

      var elem = svg.selectAll("div")
        .data([d]);

      var elemEnter = elem.enter()
        .append("g");

      elemEnter.append("rect")
        .attr({
        x: 0,
        y: 0,
        width: 3,
        height: 20
        })
        .style("opacity", .5  + d*10)
        .style("fill", "#4078a9");

      return kpi;
    }

    /*------------------------------------------------------------------------
    Function: createTable
        Does the work of actually generating the table, and filling it with
        values from the dataset passed to it in either automatic or changedValues
    -------------------------------------------------------------------------*/
    function createTable(test){
      var div = d3.select('.tables');

      // Appends a table to designated div
      var table = div.append("table")
        .attr({
          id: "sample",
          class: 'table'
        })
        .classed("display", true);

      // Appends a body to the table
      var tbody = table.append("tbody")

      // Creates a row (tr) for each highes level entry in the JSON
      var tableBodyRows = tbody.selectAll("tr")
        .data(test)
        .enter()
        .append("tr");

      // Adds 'Sentence' component to each row, along with it's classification
      tableBodyRows.selectAll("td")
        .data(function(d) {
          return [d];
        })
        .enter()
        .append("td")
        .attr('class', 'sent')
        .text(function(d) {
          return d[7] + " - " +  d[5];
        })

      // Adds colored bars each representing an 'intermediate value'
      tableBodyRows.selectAll("td")
        .data(function(d) {
          return d[6];
        })
        .enter()
        .append("td")
        .attr("class", function(d,i) { return 'bar ' + i; })
        .append(function(d) {
          return createSVG(d);
        });

        // Defining behavior for clicking on a row
        tableBodyRows.on({
          "click": function(f){
          d3.selectAll("#highlighted")
            .attr("id", null)
            .classed("sent", true)
          w = d3.select(this)
            .select(".sent")
            .attr("id", "highlighted")

          bars = [...f[6]]
          changed_indicies = argsort(bars)
          sorted_bars = bars.sort(function(a, b){return b-a});

          // here we basically delete the current table & remake it except with different ordering for the barcode (done on line 207)
          d3.selectAll('.bar').remove()
          d3.selectAll('.cosinesim').remove()

          big_array = []
          answers = []

          tableBodyRows.selectAll("td")
            .data(function(d) {
              temp_array = []
              var ugh = 0
              for(ugh = 0; ugh < d[6].length; ugh++){
                temp_array.push(d[6][changed_indicies[ugh]])
              }
              big_array.push(temp_array)

              var answer = cosinesim(temp_array, sorted_bars);
              answers.push(answer)
              return [];
            })


          tableBodyRows.each(function(k,l){
            d3.select(this)
              .data(function(d){
                test = [...k]
                test[8] = answers[l]
                return [test];
            })
          })

          tableBodyRows.each(function(k,l){
            d3.select(this)
            .append("td")
            .attr('class', 'cosinesim')
            .text(function(d,i){
              return answers[l].toFixed(3);
            })
          })

          tableBodyRows.selectAll("td")
            .data(function(d,i) {
              return big_array[i]
            })
            .enter()
            .append("td")
            .attr("class", function(d,i) { return 'bar ' + i; })
            .append(function(d) {
              return createSVG(d);
            });

          tableBodyRows.sort(function(a,b) {
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

    automatic();
    ''')


    """------------------------------------------------------------------------
    Function: display
        Called from object in notebook, this function will display the
        complete visualization.
    -------------------------------------------------------------------------"""
    def display(self):
        js_path_completed = self.js_path_incomplete.substitute({'json_filepath': self.source_data_path})
        display(HTML(self.html_template.substitute({'css_text': self.css_text, 'js_code': js_path_completed})))

