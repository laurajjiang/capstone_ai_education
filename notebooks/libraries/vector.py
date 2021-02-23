from IPython.core.display import display, HTML
from string import Template
import json

def say_hello():
    display(HTML('<h1>Greetings</h1>'))


# Desicion needs to be made, what is to be paresd to this library?
# Should we send it a json? For now it will be a JSON
#json filepath NEEDS to be repaired

class Visualization:

	data_file_name = ""

	def __init__(self, json_name):
		# JSON file must be located in libraries directory with python file. 
		self.data_file_name = "\"" + json_name + "\""


	d3_source_html = '<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>'

	html_template = Template('''
		<style> $css_text </style>
		<h1> Vector Visualization </h1>
		<div class="tables"></div>

		<script> $js_text </script>
		''')

	css = '''
	.table {
      border-collapse: collapse;
      border: #d0d4d5 solid 1px;
      border-spacing: 0px;
      font: Arial;
      text-align: center;
      padding: 5px;
      width: 100%;
    }
    

    .headerRowStyle {
      background-color: #fff;
      border-bottom: 3px solid #ccc;
      color: #4078a9;
      font-size: 14px;
      height: 48px;
      line-height: 14px;
      padding: 10px 5px 5px 5px
    }
    
    .headerCellStyle {
      border-left: 1px solid #d0d4d5;
    }
    
    .tableRowStyle {
      border-bottom: 1px solid #d0d4d5;
      color: #565656;
    }
		'''

	js_template = Template('''
		console.log("Loading JavaScript...")
		console.log("Loaded Data:")
        var dname = $conf_data_filepath

    function colorPicker(value) {
        if (value == "Iris-setosa") {
        return "#7aa25c";
        } else if (value == "Iris-versicolor") {
        return "#f4f85e";
        } else {
        return "#d84b2a";
        }
    }


    function checkNumberIfFloat(value) {
        return Number(value) === value && value % 1 !== 0;
    }

    d3.json($conf_data_filepath, function(dataSet) {
      var div = d3.select('.tables');

      // append a table to the div
      var table = div.append("table")
        .attr({
          id: "sample",
          class: 'table'
        })
        .classed("display", true);

      // append a header to the table
      var thead = table.append("thead")

      // append a body to the table
      var tbody = table.append("tbody")

      // append a row to the header
      var theadRow = thead.append("tr")
        .attr({
          class: 'headerRowStyle'
        });

      // return a selection of cell elements in the header row
      // attribute (join) data to the selection
      // update (enter) the selection with nodes that have data
      // append the cell elements to the header row
      // return the text string for each item in the data array
      theadRow.selectAll("th")
        .data(d3.keys(dataSet[0]))
        .enter()
        .append("th")
        .text(function(d) {
          return d;
        });

      // table body rows
      var tableBodyRows = tbody.selectAll("tr")
        .data(dataSet)
        .enter()
        .append("tr")
        .attr({
          class: 'tableRowStyle'
        });

      //table body row cells
      tableBodyRows.selectAll("td")
        .data(function(d) {
          return d3.values(d);
        })
        .enter()
        .append("td")
        .text(function(d) {
          return d;
        })
        .append(function(d) {
          return createSVG(d);
        });
        
    })

    function createSVG(d) {
      var w = 75;
      var h = 75;

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

    
        if( checkNumberIfFloat(d) || Number.isInteger(d)){
            var la = (d/7);
            elemEnter.append("rect")
                .attr({
                x: 25,
                y: 10, //this basically makes the svg start from the button instead of the top
                width: 60*la,
                height: 20
                })
                .style("fill", "#4078a9");

            elemEnter.append("text")
                .style("fill", "blue")
                .attr("dy", 30)
                .attr("dx", 25)
        }else{ 
            elemEnter.append("circle")
                .attr({
                cx: 28,
                cy: 25,
                r: 20
                })
                .style("fill", colorPicker);

            elemEnter.append("text")
                .style("fill", "blue")
                .attr("dy", 30)
                .attr("dx", 25)

        }
      return kpi;
    }
		''')

	def display_internals(self):
		print(self.css, "\n", self.html, "\n", self.js, self.data_file_name)

	def html_test(self):
		say_hello()

	def display(self):
		display(HTML(self.d3_source_html))

		js_text = self.js_template.substitute({'conf_data_filepath': self.data_file_name})

		display(HTML(self.html_template.substitute({'css_text': self.css, 'js_text': js_text})))