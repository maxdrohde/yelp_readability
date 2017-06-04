/**
 * FINAL PROJECT
 * CS314 - Data Visualization
 * Prof: Eric Alexander
 *
 * Authors: Caleb Braun, Max Rohde
 * 6/3/17
 */

// Chart display variables
var width = 800;
var height = 600;

// Data variables
// var csvFile = "combined_reviews_business100k.csv";
var data;
var csvFile = "reviews_with_prices_fixed.csv";
var businessTypes = ['Active Life','Arts & Entertainment','Automotive','Beauty & Spas','Education','Event Planning & Services','Financial Services','Food','Health & Medical','Home Services','Hotels & Travel','Local Flavor','Local Services','Mass Media','Nightlife','Pets','Professional Services','Public Services & Government','Real Estate','Religious Organizations','Restaurants','Shopping']
var states = ['NC','OH','NV','WI','AZ','PA','IL'];

// Create the plot
var svg = d3.select('#beanplot')
    .attr('height', height)
    .attr('width', width);

// Create the filter sidebar
initFilter('businesses', businessTypes);
initFilter('cities', states.map(convertStateToCity));

// Load the data and create the plot
d3.csv(csvFile, function(error, csv_data) {
    console.log("loaded!");
    if (error) throw error;

    // Make sure number values are numbers
    nums = ['funny', 'stars', 'useful', 'cool', 'flesch_kincaid_grade', 'flesch_reading_ease', 'smog_index', 'coleman_liau_index', 'automated_readability_index', 'dale_chall_readability_score', 'gunning_fog', 'price', 'length'];
    csv_data.forEach(function (d) {
        for (var i = 0; i < nums.length; i++) {
            d[nums[i]] = +d[nums[i]]
        }
    });

    data = csv_data;
    init(data, 'stars', 'coleman_liau_index');
});

var tooltip = d3.select("body")
    .append("div")
    .style('font', '14 px serif') 
    .style('background', 'lightsteelblue')     
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "black")
    .text("a simple tooltip");

/**
 * Updates the data being shown by going through all the filters and only
 * plotting data corresponding to checked boxes.
 */
function update() {
    var newData = data;
    var uncheckedCategories = [];
    var uncheckedStates = [];

    // Find which checkboxes are not checked
    for (var i = 0; i < businessTypes.length; i++) {
        var checkbox = d3.select("#" + makeValidSelector(businessTypes[i]));
        if (!checkbox.property("checked")) {
            uncheckedCategories.push(businessTypes[i]);
        }
    }
    cities = states.map(convertStateToCity);
    for (var i = 0; i < cities.length; i++) {
        var checkbox = d3.select("#" + makeValidSelector(cities[i]));
        if (!checkbox.property("checked")) {
            uncheckedStates.push(states[i]);
        }
    }

    newData = newData.filter(function(d) {
        // Check state filter
        if (uncheckedStates.indexOf(d['state']) > -1) return false;

        var categories = JSON.parse(d['categories']);
        if (categories.length == 0) return false;

        for (var i = 0; i < categories.length; i++) {
            if (uncheckedCategories.indexOf(categories[i]) > -1) {
                return false;
            }
        }
        return true;
    })

    // Check if there is any data to plot
    if (newData.length == 0) {
        d3.select('.inner-wrapper')
            .html('')
            .append('span')
            .attr('class', 'nodata')
            .append('h2')
            .html('No Data');

        d3.select('.chart').selectAll('button').property('disabled', true);
    } else {
        d3.select('.chart').selectAll('button').property('disabled', false);
        xvals = chart1.settings.xName;
        yvals = chart1.settings.yName;
        redrawChart(newData, xvals, yvals);
    }
}

/**
 * Removes the previous chart and redraws it with the filtered data
 * @param newData
 */
function redrawChart(newData, xvals, yvals) {
    d3.select(".inner-wrapper").remove();

    var showViolin = chart1.violinPlots.options.show;
    var showBean = chart1.dataPlots.options.showBeanLines;
    var showScatter = chart1.dataPlots.options.showPlot;
    var showTrends = chart1.dataPlots.options.showLines;

    init(newData, xvals, yvals);

    if (showTrends) handleTrendLinesButton();
    if (showBean) {
        handleBeanPlotButton();
    } else if (showScatter) {
        handleScatterPlotButton();
    } else if (showViolin) {
        handleViolinPlotButton();
    } else {
        handleBoxPlotButton();
    }

}

/**
 * Creates a distrochart with the given data and parameters
 * @param newData
 * @param xvals
 */
function init(newData, xvals, yvals) {
    chart1 = makeDistroChart({
        data:newData,
        xName:xvals,
        yName:yvals,
        axisLabels: {xAxis: xvals, yAxis: yvals},
        selector:"#chart-distro1",
        chartSize:{height:490, width:800},
        constrainExtremes:true});
    chart1.renderBoxPlot();
    chart1.renderDataPlots();
    chart1.renderNotchBoxes({showNotchBox:false});
    chart1.renderViolinPlot({showViolinPlot:false});
}

function updateX(xvals) {
    chart1.settings.xName = xvals;
    update();
}

function updateY(yvals) {
    chart1.settings.yName = yvals;
    update();
}

/**
 * Creates a sidebar filter in the given div for each label given
 * @param divId
 * @param labels
 */
function initFilter(divId, labels) {
    var div = d3.select("." + divId);
    div.select('p').append('input')
        .attr('type', 'button')
        .attr('id', 'selectAllButton')
        .attr('value', 'Deselect All')
        .on('click', function() {toggleCheckboxes(div);});

    for (var i = 0; i < labels.length; i++) {
        div.append('label')
            .attr('id', divId+'Label'+i)
            .append('input')
            .attr('type', 'checkbox')
            .attr('id', makeValidSelector(labels[i]))
            .property('checked', true)
            .on('change', update);
        d3.select('#'+divId+'Label'+i).append('span')
            .html(labels[i]);
    }
}

/**
 * Toggles all checkboxes in the given div based on the value of the select
 * button within that div.
 * @param div
 */
function toggleCheckboxes(div) {
    var button = div.select('#selectAllButton');
    var buttonText = button.property('value') == 'Select All' ? 'Deselect All' : 'Select All';
    var select = (buttonText == 'Deselect All');
    div.selectAll('input').property('checked', select);
    button.attr('value', buttonText);
    update();
}

/**
 * Conversion function for the city within each state
 * @param state
 */
function convertStateToCity(state) {
    var stateToCity = {
        'NC' : 'Charlotte',
        'OH' : 'Cleveland',
        'NV' : 'Las Vegas',
        'WI' : 'Madison',
        'AZ' : 'Phoenix',
        'PA' : 'Pittsburgh',
        'IL' : 'Urbana-Champaign'
    }
    return stateToCity[state];
}

/**
 * Takes any business category or place name and makes it a valid CSS selector
 * @param name
 */
function makeValidSelector(name) {
    valid = name.replace(/\s/g, '-');
    valid = valid.replace(/\&/g, 'and');
    return valid;
}
