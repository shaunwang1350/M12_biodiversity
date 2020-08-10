function init() {
    var selector = d3.select("#selDataset");
    
    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    })}
    
init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
};

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append('h6').text(`ID: ${result.id}`)
      PANEL.append('h6').text(`ETHNICITY: ${result.ethnicity}`);
      PANEL.append('h6').text(`GENDER: ${result.gender}`);
      PANEL.append('h6').text(`AGE: ${result.age}`);
      PANEL.append("h6").text(`LOCATION: ${result.location}`);
      PANEL.append('h6').text(`BBTYPE: ${result.bbtype}`);
      PANEL.append('h6').text(`WFREQ: ${result.wfreq}`);

      var trace2 = {
        value: result.wfreq,
        title: {text: "Scrubs per Week", font:{size:16}},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: {range: [null, 9], tickmode: "linear"},
            steps: [
                {range: [0,1], color: 'rgb(165,210,80)', line: {color: 'gray', width: 1}},
                {range: [1,2], color: 'rgb(160,215,70)', line: {color: 'gray', width: 1}},
                {range: [2,3], color: 'rgb(155,220,60)', line: {color: 'gray', width: 1}},
                {range: [3,4], color: 'rgb(150,225,50)', line: {color: 'gray', width: 1}},
                {range: [4,5], color: 'rgb(145,230,40)', line: {color: 'gray', width: 1}},
                {range: [5,6], color: 'rgb(140,235,30)', line: {color: 'gray', width: 1}},
                {range: [6,7], color: 'rgb(135,240,20)', line: {color: 'gray', width: 1}},
                {range: [7,8], color: 'rgb(130,245,10)', line: {color: 'gray', width: 1}},
                {range: [8,9], color: 'rgb(125,250,0)', line: {color: 'gray', width: 1}}
            ]
        }
        };

        var data2 = [trace2]
        var layout2 =  {title: 'Belly button Washing Frequency' };
        Plotly.newPlot("gauge", data2, layout2);

    });
};

function buildCharts(sample){
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter((sampleObj => sampleObj.id == sample))
        var result = resultArray[0]


        var bar_values = result.sample_values;
        var bar_labels = result.otu_labels;
        var bar_ids = [];
        for (ids of result.otu_ids) {
            bar_ids.push(`UTO ${ids}`)
        };

        var trace = {
            x: bar_values.slice(0,10), 
            y: bar_ids.slice(0,10),
            type: "bar",
            orientation: 'h',
            transforms: [
                {type: 'sort', target: 'x', order: 'Ascending'}, 
                // {type: 'aggregate', groups: 'x', aggregations:[{target: 'x', func: 'count', enabled: true}] }
            ],
            text: bar_labels.slice(0,10)
        };

        var data = [trace];
        var layout = {
            title: `Top 10 Bacterial Species for Subject ${result.id}`,
            xaxis: {title: ""},
            yaxis: {title: "OTU IDs"},
            hovermode: "closest",
            hoverlabel: { bgcolor: "#FFF" },
            legend: {orientation: 'h', y: -0.3},
        };
        Plotly.newPlot("bar", data, layout);

        var trace2 = {
            x: result.otu_ids,
            y: result.sample_values, 
            mode: "markers",
            marker: {
                size:[5,10,20,30,40,50,60,70,80,90,100],
                // color: ['rgb(0,0,255)', 'rgb(0,255,0)']
            }
        };
        var data2 = [trace2];

        var layout2 = {
            title: `UTOs for Subject ${result.id}`,
            xaxis: {title: 'OTU ID'}
        }

        Plotly.newPlot("bubble", data2, layout2);
    });
};