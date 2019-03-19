function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(response) {

    console.log(response);
     
    // Use d3 to select the panel with id of `#sample-metadata`
  var sample_metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
  sample_metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
  Object.entries(response).forEach(([key, value]) => {
    console.log(`Key: ${key} and Value ${value}`)
    d3.select("#sample-metadata").append("p").text(`${key}: ${value}`)
  });})
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}


function buildCharts(sample) {
  
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(response) {
    console.log(response);
    
    var trace1 = {
      type: 'scatter',
      x: response.otu_ids,
      y: response.sample_values,
      mode: 'markers',
      text: response.otu_labels,
      marker: {
      size: response.sample_values,
      color: response.otu_ids
      }
    }
    var data1 = [trace1]
    
    Plotly.react('bubble', data1)
  
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart

    //
    var sorted_sample_values = 
    response.sample_values.sort(function compareFunction(firstNum, secondNum) {
     return secondNum - firstNum;
   });
   Object.entries(response).forEach(([key, value]) => {
    console.log(`Key: ${key} and Value ${value}`)})
   var top_sample_values = sorted_sample_values.slice(0, 10);
   var top_otu_ids = response.otu_ids.slice(0,10);
   console.log(top_sample_values)
    var trace2 = {
      type: 'pie',
      values: top_sample_values,
      labels: top_otu_ids,
      text: response.otu_labels,
      hoverinfo:'label+text+percent+values', 
      textinfo:'percent'
    }
  
    var data2 = [trace2]
    
    Plotly.react('pie', data2)
  })
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample)
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample)
}

// Initialize the dashboard
init();


function buildGauge(sample) {
  d3.json(`/metadata/${sample}`).then(function(response) {

      console.log(response);
       
      
    var gauge = d3.select("#gauge");


  var level = response['WFREQ'];

// Trig to calc meter point
var degrees = 180 - level*20,
   radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
   pathX = String(x),
   space = ' ',
   pathY = String(y),
   pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
 x: [0], y:[0],
  marker: {size: 28, color:'850000'},
  showlegend: false,
  name: 'Washes/week',
  text: level,
  hoverinfo: 'text+name'},
{ values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9,50/9,50],
rotation: 90,
text: ['8-9', '7-8', '6-7', '5-6',
          '4-5', '3-4', '2-3', '1-2','0-1'],
textinfo: 'text',
textposition:'inside',
marker: {colors:['rgba(11, 50, 10, .5)','rgba(14, 127, 10, .5)', 'rgba(110, 154, 22, .5)',
                       'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                       'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)', 'rgba(242, 236, 212, .5)',
                       'rgba(252, 245, 235, .5)','rgba(255, 255, 255, 0)']},

hole: .5,
type: 'pie',
showlegend: false
}];

var layout = {
shapes:[{
    type: 'path',
    path: path,
    fillcolor: '850000',
    line: {
      color: '850000'
    }
  }],
title: 'Belly Button Washing Frequency',
height: 550,
width: 550,
xaxis: {zeroline:false, showticklabels:false,
           showgrid: false, range: [-1, 1]},
yaxis: {zeroline:false, showticklabels:false,
           showgrid: false, range: [-1, 1]}
};

Plotly.react('gauge', data, layout);
})}