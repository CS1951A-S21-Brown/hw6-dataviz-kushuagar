let svg2 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)   
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);  
    
let tooltip1 = d3.select("#graph3")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

let legendRef = svg2.append("g");

let title2 = svg2.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right)/2}, -10)`)
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .style("text-decoration", "underline");

let title3 = svg2.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right)/2}, +5)`) 
    .style("text-anchor", "middle")
    .style("font-size", 12)
    .style("text-decoration", "underline");

function setData2() {

    d3.csv("../data/video_games.csv").then(function(sales1) {
        var genre = document.getElementById("genre").value;
        sales1 = sales1.filter(function(d) { return d.Genre == genre; });
        data2 = d3.rollup(sales1, v => v.length, d => d.Publisher);
        data_arr1 = Array.from(data2).map(([key, value]) => ({key, value}));
        data_arr1 = data_arr1.map(function(d){
            return {key: d.key, value: Number(d.value.toFixed(2))};
        });
        data_arr1 = data_arr1.sort(function(a,b){return b.value - a.value;}).slice(0, 5);
        var pie = d3.pie().value(function(d) {return d.value});
        var slices = pie(data_arr1);
        let color2 = d3.scaleOrdinal(d3.schemeCategory10);
        var arc = d3.arc().innerRadius(0).outerRadius(100);

        let mouseover1 = function(d) {
            let color_span = `<span style="color: ${color2(d.data.key)};">`;
            let html = `${d.data.key}<br/>
                    ${color_span}${d.data.value + " games"}</span><br/>`;    
            tooltip.html(html)
                .style("left", `${(d3.event.pageX)}px`)
                .style("top", `${(d3.event.pageY) - 80}px`)
                .style("box-shadow", `0px 5px 5px #000000`) 
                .style("background-color", "#dedede") 
                .style("opacity", 50)
        };

        let mouseout1 = function(d) {
            tooltip.style("opacity", 0);
        };
        let pies = svg2.selectAll("path.slice").data(slices);

        pies.enter()
            .append("path")
            .merge(pies)
            .transition()
            .duration(1000)
            .attr("class", "slice")
            .attr('d', arc)
            .attr("fill", function(d) { return color2(d.data.key); })
            .attr("transform", `translate(${(graph_3_width - margin.left - margin.right)/2}, ${(margin.top + 75)})`); 

        pies.on("mouseover", mouseover1) 
            .on("mouseout", mouseout1);
        let legend = legendRef.attr("class", "legend").selectAll("text").data(slices);

        legend.enter()
            .append("text")
            .merge(legend)
            .transition()
            .duration(1000)
            .text(function(d)  {return '•' + d.data.key + ": " + d.data.value + " games";})
            .attr('fill', function(d) { return color2(d.data.key); })
            .attr('y', function(d, i) { return 20 * (i + 1); })
            .attr("transform", `translate(${(graph_3_width - margin.left - margin.right)/2 - 70}, ${(graph_3_height - margin.bottom - margin.top)/2})`)
            .style("font-size", 13);
        title2.text("Top 5 Publishers for " + genre);
        title3.text("(Hover over pie chart to view details)");

        pies.exit().remove();
        legend.exit().remove();
    });
}
setData2();
setData2();