from IPython.core.display import display, HTML
from string import Template
import json

def say_hello():
    display(HTML('<h1>Greetings</h1>'))


# Desicion needs to be made, what is to be paresd to this library?
# Should we send it a json? For now it will be a JSON


class ConfusionMatrix:

	data_file_name = ""

	def __init__(self, json_name):
		# JSON file must be located in libraries directory with python file. 
		self.data_file_name = "\"" + json_name + "\""


	d3_source_html = '<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>'

	html_template = Template('''
		<style> $css_text </style>
		<h1> Interactive Confusion Matrix </h1>
		<h3 id="confidence_setting"> Confidence: 0.5 </h3>
		<input class="slider" id="confidence_slider" type="range" min="0" max="1" step=".1" value=".5"/>
		<h3 id="epoch_setting"> Epoch: 1 </h3>
		<input class="slider" id="epoch_slider" type="range" min="1" max="20" step="1" value="1"/>
		<div>
			<div>
				<div id="matrix"></div>
				<div id="review">
					Data 
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
		li{
		    font-size: smaller;
		}
		td{
		    min-width: 100px;
		}
		#review{
		    border:1px solid pink; 
		    padding: 5px; 
		    float: left; 
		    width: 750px; 
		    height: 500px; 
		    background-color: white;
		    margin: 20px;
		    overflow: scroll;
		    }
		#matrix{
		    border:1px solid pink; 
		    padding: 5px; 
		    float: left;
		    margin: 20px;
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
        console.log("Visualization: Reading JSON file(", dname, ")...");

		d3.json( $conf_data_filepath, function(d) {
			console.log("Visualization: Logging complete JSON...");
		    console.log(d);
		});

		/*--------------------------------------------------------------------------------
		I've temporarily left out the 'getType' function, since the names of these
		types are not included in the JSON file that is given to the JavaScript. More
		functionality can be incldued later to bring the names in as well as the raw data.
		Type will be represented by the given numeric identifier for now.
		--------------------------------------------------------------------------------*/

		/*--------------------------------------------------------------------------------
		Function: extractTypes
		Behavior: Identifies different types each data point can be identified as, based 
				  off of the 'true_label' attribute in JSON file.
		Input: JSON file
		Output: Returns array of possible values for 'Test Label'.
		--------------------------------------------------------------------------------*/

		function extractTypes(data){
		    var lookup = {};
		    var items = data["0"];
		    var result = [];

		    for (var item, i=0; item = items[i++];){
		        var name = item['Test Label'];
		        if(!(name in lookup)){
		            lookup[name] = 1;
		            result.push(name);
		        }
		    }

		    return result;
		}

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
		    	var possibleOutputValues = extractTypes(d);
		        var tableDimension = extractTypes(d).length;
		        console.log("Visualization: Constructing", tableDimension, "x",
		        			tableDimension, "chart...");
		        var table = new Array(tableDimension);
		        var dataset = [];

		        for(var i=0; i<tableDimension; i++){
		            table[i] = new Array(tableDimension);
		            for(var j=0; j<tableDimension; j++){
		                table[i][j] = 0;
		            }
		        }

		        var selectedEpoch = {};

		        for(var singleEpoch, i=0; singleEpoch = d[i++];){
		        	if((singleEpoch[0]["Epoch"] + 1) == parseInt(currentEpochSetting)){
		        		selectedEpoch = singleEpoch;
		        	}
		        }

		        console.log("Visualization: Parsing epoch (", currentEpochSetting, ")...");

		        /*--------------------------------------------------------------------------------
				NOTE: Will we need to display just integer representations of classifications,
					  or will we need to display titles of classicications along the axis
				--------------------------------------------------------------------------------*/

		        for(var jsonEntry, i=0; jsonEntry = selectedEpoch[i++];){
		        	var index = i;
		        	var epoch = jsonEntry["Epoch"];
		        	var entryText = jsonEntry["Test Sentence"];
		        	var confidenceScore = jsonEntry["Test Confidence Score"][0];
		        	var trueLabel = jsonEntry["Test Label"];
		        	var predictedLabel = jsonEntry["Test Prediction"][0];
		        	var tableXCoordinate = possibleOutputValues.indexOf(predictedLabel); //Predicted
		        	var tableYCoordinate = possibleOutputValues.indexOf(trueLabel); // Actual

		        	if(confidenceScore < currentConfSetting){
		        		table[tableXCoordinate][tableYCoordinate]+=1;
		        		dataset.push([trueLabel, predictedLabel, entryText, index, epoch]);
		        	}
		        }

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
		        var confusing = h / tableDimension;
		        var blockStackDimension = Math.round(Math.sqrt(dataset.length));
		        var marginBuffer = w * .005;
		        var cubeDimension = Math.round(Math.sqrt(confusing / blockStackDimension));

		        /*--------------------------------------------------------------------------------
				Format: d[trueLabel, predictedLabel, entryText, index, epoch]
				--------------------------------------------------------------------------------*/

				rect.attr("x", function (d, i){
		            var matrixnum = (parseInt(d[1]) * tableDimension) + parseInt(d[0]);
		            var inmatrixcol = counters[matrixnum] % 16;
		            counters[matrixnum]++;
		            return 10 + (d[0] * confusing) + (inmatrixcol * 16);
		            })
		            .attr("y", function(d, i){
		                var matricvol = d[1];
		                var matrixnum = (parseInt(d[1] * tableDimension) + parseInt(d[0]));
		                var hm = Math.floor(ycounters[matrixnum]/16);
		                ycounters[matrixnum]++;
		                return 10 + (d[1] * confusing) + (hm * 16);
		            })
		            .attr("id", function(d){
		                return "rect" + d[3];
		            })
		            .attr("width", function(d){
		                return 15;
		            })
		            .attr("height", function(d){
		                return 15;
		            })
		            .attr("opacity", function(d){
		                return .85;
		            })
		            .attr("fill", function(d){
		                return ("pink");
		            })
		            .attr("class", function(d){
		                predicted_label = "predicted_label_" + d[1];
		                true_label = "true_label_" + d[0];
		                return true_label + " " + predicted_label;
		        });
				
				/*
		        rect.attr("x", function (d, i){
		            var matrixnum = (parseInt(d[1]) * tableDimension) + parseInt(d[0]);
		            var inmatrixcol = counters[matrixnum] % blockStackDimension;
		            counters[matrixnum]++;
		            //return 10 + (d[0] * confusing) + (inmatrixcol * blockStackDimension);
		            //return  (d[0] * confusing) + (inmatrixcol * blockStackDimension);

		            return ((d[0]*(marginBuffer+confusing)) + (inmatrixcol*blockStackDimension));

		            })
		            .attr("y", function(d, i){
		                var matricvol = d[1];
		                var matrixnum = (parseInt(d[1] * tableDimension) + parseInt(d[0]));
		                var hm = Math.floor(ycounters[matrixnum]/blockStackDimension);
		                ycounters[matrixnum]++;
		                return 10 + (d[1] * confusing) + (hm * blockStackDimension);
		            })
		            .attr("id", function(d){
		                return "rect" + d[3];
		            })
		            .attr("width", function(d){
		                return 15;
		            })
		            .attr("height", function(d){
		                return 15;
		            })
		            .attr("opacity", function(d){
		                return .85;
		            })
		            .attr("fill", function(d){
		                return ("pink");
		            })
		            .attr("class", function(d){
		                predicted_label = "predicted_label_" + d[1];
		                true_label = "true_label_" + d[0];
		                return true_label + " " + predicted_label;
		        });
		        */

		        d3.select("#review")
		            .select("testList")
		            .selectAll("rect")
		            .data(
		                dataset.filter(d => d[0] != d[1]),
		                function(d){
		                    return d[3];
		                }
		            )
		            .enter()
		            .append("li")
		            .attr("id", function(d){
		                return "text" + d[3];
		            })
		            .html(function(d){
		                table = "<table><tr>"
		                table += "<td> True: ";
		                table += parseInt(d[0]); //getType(d[0]);
		                table += "</td>"
		                table += "<td> Predict: ";
		                table += parseInt(d[1]); //getType(d[1]);
		                table += "</td>"
		                table += "<td>" + d[2].substr(0,200); + "</td>"
		                table += "</tr> </table>"
		                return  table;
		        });


		        rect.on("click", function(d_on){
		            d3.select("#review")
		                .select("#testList")
		                .html("");
		            if(!this.classList.contains("past")){
		                d3.selectAll(".past")
		                    .attr("fill", "pink")
		                    .classed("past", false);
		                d3.selectAll(".reclick")
		                    .attr("fill", "pink")
		                    .classed("reclick", false)
		            }
		            if(!this.classList.contains("reclick")){
		                d3.selectAll(".reclick")
		                    .attr("fill", "pink")
		                    .classed("reclick", false);
		            }
		            d3.select(this);
		            textId = "";
		            x = "." + this.classList[0];
		            y = "." + this.classList[1];
		            test = x + y;
		            x1 = x.charAt(x.length - 1);
		            y1 = y.charAt(y.length - 1);
		            if(this.classList.contains("past")){
		                d3.select(this)
		                    .classed("reclick", true)
		                Id = this.id;
		                textId = "#text" + Id.substring(4);
		            }
		            d3.selectAll(test)
		                .attr("fill", "purple")
		                .classed("past", "true");
		            d3.select("#review")
		                .select("#testList")
		                .selectAll("rect")
		                .data(
		                    dataset
		                        .filter(d => d[0] == x1)
		                        .filter(d => d[1] == y1),
		                        function(d){
		                            return d[3];
		                        }
		                )
		                .enter()
		                .append("li")
		                .attr("id", function(d){
		                    return "text" + d[3];
		                })
		                .html(function(d){
		                    table = "<table><tr>"
		                    table += "<td> True: ";
		                    table += parseInt(d[0]); //getType(d[0]);
		                    table += "</td>"
		                    table += "<td> Predict: ";
		                    table += parseInt(d[1]); //getType(d[1]);
		                    table += "</td>"
		                    table += "<td>" + d[2].substr(0,200); + "</td>"
		                    table += "</tr> </table>"
		                    return table;
		            });
		            d3.select("#review")
		                .select("testList")
		                .selectAll("li")
		                .on("mouseover", function(d_on){
		                    d3.select(this)
		                        .classed("lighthigh", true)
		                        id = this.id;
		                        rectId = "#rect" + id.substring(4);
		                        d3.selectAll(rectId)
		                            .attr("fill", "green");
		                })
		                .on("mouseout", function(d_on){
		                    d3.select(this)
		                        .classed("lighthigh", false)
		                        id = this.id;
		                        rectId = "#rect" + id.substring(4);
		                        d3.selectAll(rectId)
		                            .attr("fill", "purple");
		            });
		        });


		        d3.select("#review")
		            .select("#testList")
		            .selectAll("li")
		            .on("mouseover", function(d_on){
		                d3.select(this)
		                    .classed("lighthigh", true)
		                    id = this.id;
		                    rectId = "#rect" + id.substring(4);
		                    d3.selectAll(rectId)
		                        .attr("fill", "green");
		            })
		          .on("mouseout", function(d_on){
		                d3.select(this)
		                    .classed("lighthigh", false)
		                    id = this.id;
		                    rectId = "#rect" + id.substring(4);
		                    d3.selectAll(rectId)
		                        .attr("fill", "pink");
		        });

		        
		    });
		})
		''')

	def display_internals(self):
		print(self.css, "\n", self.html_template, "\n", self.js_template, self.data_file_name)

	def html_test(self):
		say_hello()

	def display(self):
		display(HTML(self.d3_source_html))

		js_text = self.js_template.substitute({'conf_data_filepath': self.data_file_name})

		display(HTML(self.html_template.substitute({'css_text': self.css, 'js_text': js_text})))