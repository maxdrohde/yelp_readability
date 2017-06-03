
function handleBoxPlotButton() {
    chart1.violinPlots.hide();
    chart1.boxPlots.show({reset:true});
    chart1.notchBoxes.hide();
    chart1.dataPlots.change({showPlot:false,showBeanLines:false});
}

function handleViolinPlotButton() {
    chart1.violinPlots.show({reset:true,clamp:1});
    chart1.boxPlots.show({reset:true, showWhiskers:false,showOutliers:false,boxWidth:10,lineWidth:15,colors:['#555']});
    chart1.notchBoxes.hide();
    chart1.dataPlots.change({showPlot:false,showBeanLines:false});
}

function handleBeanPlotButton() {
    chart1.violinPlots.show({reset:true, width:75, clamp:0, resolution:30, bandwidth:1});
    chart1.dataPlots.show({showBeanLines:true,beanWidth:15,showPlot:false,colors:['#555']});
    chart1.boxPlots.hide();
    chart1.notchBoxes.hide();
}

function handleScatterPlotButton() {
    chart1.violinPlots.hide();
    chart1.dataPlots.show({showPlot:true, plotType:40, showBeanLines:false,colors:null});
    chart1.notchBoxes.hide();
    chart1.boxPlots.hide();
}

function handleTrendLinesButton() {
    if(chart1.dataPlots.options.showLines) {
        chart1.dataPlots.change({showLines:false});
    } else {
        chart1.dataPlots.change({showLines:['median','quartile1','quartile3']});
    }
}
