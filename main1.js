let svg1 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height) 
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x1 = d3.scaleLinear()
    .range([0, graph_2_width - margin.left - margin.right]);

let y1 = d3.scaleBand()
    .range([0, graph_2_height-margin.top-margin.bottom])
    .padding(0.1);  

let countRef1 = svg1.append("g");

let y_axis_label1 = svg1.append("g");

svg1.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right)/2}, ${graph_2_height - margin.bottom - margin.top + 15})`)
    .style("text-anchor", "middle")
    .style("font-size", 13)
    .style("text-decoration", "underline")
    .text("Sales (in millions)");

let y_axis_text1 = svg1.append("text")
    .attr("transform", `translate(-30, -2)`)
    .style("text-anchor", "middle")
    .style("font-size", 13)
    .style("text-decoration", "underline");

let title1 = svg1.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right)/2}, -10)`)
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .style("text-decoration", "underline");

function setData1() {
    d3.csv("../data/video_games.csv").then(function(sales) {
        var region = document.getElementById("region").value;
        data1 = d3.rollup(sales, v => d3.sum(v, d => d[region]), d => d.Genre);
        data_arr = Array.from(data1).map(([key, value]) => ({key, value}));
        data_arr = data_arr.map(function(d){return {key: d.key, value: Number(d.value.toFixed(2))};});
        data_arr = data_arr.sort(function(a,b){return b.value - a.value;})
        x1.domain([0, d3.max(data_arr, function(d) {return d.value;})]);
        y1.domain(data_arr.map(function(d) {return d.key;}));
        let color1 = d3.scaleOrdinal()
        .domain(data_arr.map(function(d) { return d.key; }))
        .range(d3.quantize(d3.interpolateHcl("#ff6633", "#ff9966"), 12));
        y_axis_label1.call(d3.axisLeft(y1).tickSize(0).tickPadding(12));
        let bars1 = svg1.selectAll("rect").data(data_arr);

        bars1.enter()
            .append("rect")
            .merge(bars1)
            .transition()
            .duration(1000)
            .attr("fill", function(d) { return color1(d.key); })
            .attr("x", x1(0))
            .attr("y", function(d) {return y1(d.key);})
            .attr("width", function(d) {return x1(d.value);})
            .attr("height",  y1.bandwidth());

        let counts1 = countRef1.selectAll("text").data(data_arr);

        counts1.enter()
            .append("text")
            .merge(counts1)
            .transition()
            .duration(1000)
            .attr("x", function(d)  {return x1(d.value) + 10;}) 
            .attr("y", function(d)  {return y1(d.key) + 10;}) 
            .style("text-anchor", "start")
            .text(function(d)  {return d.value;});

        y_axis_text1.text("Genres");
        title1.text("Sales Breakdown by Genre for " + region);

        bars1.exit().remove();
        counts1.exit().remove();
    });
}
setData1();