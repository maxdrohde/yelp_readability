var chart1;
d3.csv('reviews_with_prices.csv', function(error, data) {
    data.forEach(function (d) { d.coleman_liau_index = +d.coleman_liau_index;});

    chart1 = makeDistroChart({
        data: data,
        xName:'state',
        yName:'coleman_liau_index',
        axisLabels: {xAxis: null, yAxis: 'Values'},
        selector:"#chart-distro1",
        chartSize:{height:400, width:800},
        constrainExtremes:true});
    chart1.renderBoxPlot();
    chart1.renderDataPlots();
    chart1.renderNotchBoxes({showNotchBox:false});
    chart1.renderViolinPlot({showViolinPlot:false});
});
