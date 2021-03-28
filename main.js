const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 250;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height) 
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let tooltip = d3.select("#graph1")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 100)

let x = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

let y = d3.scaleBand()
    .range([0, graph_1_height-margin.top-margin.bottom])
    .padding(0.1);  

let countRef = svg.append("g");

let y_axis_label = svg.append("g");

svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right)/2}, ${graph_1_height - margin.bottom - margin.top + 15})`)
    .style("text-anchor", "middle")
    .style("font-size", 13)
    .style("text-decoration", "underline")
    .text("Global Sales (in millions)");

let y_axis_text = svg.append("text")
    .attr("transform", `translate(-30, -2)`) 
    .style("text-anchor", "middle")
    .style("font-size", 13)
    .style("text-decoration", "underline");

let title = svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right)/2}, -10)`) 
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .style("text-decoration", "underline");

function setData(index) {

    d3.csv("../data/video_games.csv").then(function(data) {

        data = cleanData(data, function(a,b){return b.Global_Sales - a.Global_Sales;}, index);

        x.domain([0, d3.max(data, function(d) {return d.Global_Sales;})]);

        y.domain(data.map(function(d) {return d.Name;}));

        let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d.Name; }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10));

        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));
  
        let mouseover = function(d) {
            let color_span = `<span style="color: ${color(d.Global_Sales)};">`;
            let html = `${d.Name}<br/>
                    ${color_span}${d.Global_Sales}</span><br/>`;      

            tooltip.html(html)
                .style("left", `${(d3.event.pageX)}px`)
                .style("top", `${(d3.event.pageY) - 80}px`)
                .style("box-shadow", `0px 5px 5px ${color(d.Global_Sales)}`) 
                .style("background-color", "#dedede") 
                .style("opacity", 50)
        };

        let mouseout = function(d) {
            tooltip.style("opacity", 0);
        };
        let bars = svg.selectAll("rect").data(data);

        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("fill", function(d) { return color(d.Name); })
            .attr("x", x(0))
            .attr("y", function(d) {return y(d.Name);})
            .attr("width", function(d) {return x(d.Global_Sales);})
            .attr("height",  y.bandwidth());

        let counts = countRef.selectAll("text").data(data);

        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d)  {return x(d.Global_Sales) + 10;})
            .attr("y", function(d)  {return y(d.Name) + 10;})
            .style("text-anchor", "start")
            .text(function(d)  {return d.Global_Sales;});

        y_axis_text.text("Games");
        var yearVal = document.getElementById("year").value;
        let strs = ["All Time", yearVal];
        title.text("Top 10 Video Games of " + strs[index]);

        bars.exit().remove();
        counts.exit().remove();
    });
}

function cleanData(data, comparator, index) {
    if (index == 1){
        var inputVal = document.getElementById("year").value;
        data = data.filter(function(d) { return d.Year == inputVal; });
    }
    return data.sort(comparator).slice(0, 10);
}
setData(0);
