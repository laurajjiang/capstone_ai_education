from IPython.core.display import display, HTML
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
        print(self.source_data_path)
        # NOTE: For simplitity, the path is hard-coded into the file, and
        #       text of the first data entry is output.
        with open('../d3_visualizations/hub.json') as f:
            data = json.load(f)
        print(data["0"]["0"]["Test Sentence"])

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
      max-width:100%
    }
    .sent {
      max-width: 1000px;
      white-space: nowrap;
      overflow: scroll;
      text-overflow: ellipsis; 
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
      white-space: normal;
      stroke-width: 1px;
      stroke: black;
      overflow: visible;
    }
    '''

    """------------------------------------------------------------------------
    Variable: js_code
        Contains all javascript for entire visualization. Currently location
        of source data file is hard coded into this string.
    -------------------------------------------------------------------------"""
    js_code = '''
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

    function changedValues() {
      var x = d3.select("#myInput").property("value").toUpperCase();
      var epoch_val = d3.select("#epoch_slider").property("value");
      var sentences_val = d3.select("#num_sentences").property("value");

      d3.selectAll("#epochNum").text(epoch_val);
      d3.selectAll("#sentNum").text(sentences_val);

      d3.json('../d3_visualizations/hub.json', function(largedataset) {
        dataSet = largedataset[epoch_val];

        d3.selectAll("table").remove();
        var i;
        var test = [];
        for(i = 0; i < sentences_val; i++){
            if(dataSet[i]['Test Sentence'].toUpperCase().search(x) > -1){
              test.push([dataSet[i]["Epoch"], dataSet[i]['Index'], dataSet[i]['Test Label'],dataSet[i]['Test Prediction'],dataSet[i]['Test Confidence Score'],dataSet[i]['Test Sentence'],dataSet[i]['Intermediate Values'], dataSet[i]["Test Prediction"]]);
            }
        }
        createTable(test);
      })
    }

    function automatic(){
      var epoch_val = d3.select("#epoch_slider").property("value");
      d3.selectAll("#epochNum").text(epoch_val);

      var sentences_val = d3.select("#num_sentences").property("value");
      d3.selectAll("#sentNum").text(sentences_val);

      d3.json('../d3_visualizations/hub.json', function(largedataset) {
        dataSet = largedataset[epoch_val];

        var max_sent = document.getElementById("num_sentences");
        var ep_num = document.getElementById("epoch_slider");

        max_sent.max = (Math.min(Object.keys(largedataset[0]).length -1), 300)
        ep_num.max = Object.keys(largedataset).length -1;

        var i;
        var test = [];
        for(i = 0; i <10; i++){
          test.push([dataSet[i]["Epoch"], dataSet[i]['Index'], dataSet[i]['Test Label'],dataSet[i]['Test Prediction'],dataSet[i]['Test Confidence Score'],dataSet[i]['Test Sentence'],dataSet[i]['Intermediate Values'], dataSet[i]["Test Prediction"]]);
        }

        createTable(test);


      })
    }

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

    function createTable(test){
      var div = d3.select('.tables');
        // append a table to the div
        var table = div.append("table")
          .attr({
            id: "sample",
            class: 'table'
          })
          .classed("display", true);

        // append a body to the table
        var tbody = table.append("tbody")

        // table body rows
        var tableBodyRows = tbody.selectAll("tr")
          .data(test)
          .enter()
          .append("tr");

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
    '''


    def display(self):
        display(HTML(self.html_template.substitute({'css_text': self.css_text, 'js_code': self.js_code})))

