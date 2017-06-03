

var width = 800;
var height = 600;
// var csvFile = "combined_reviews_business100k.csv";
var csvFile = "reviews_with_prices_fixed.csv";
var data;

var businessTypes = ['Active Life',
                    'Arts & Entertainment',
                    'Automotive',
                    'Beauty & Spas',
                    'Education',
                    'Event Planning & Services',
                    'Financial Services',
                    'Food',
                    'Health & Medical',
                    'Home Services',
                    'Hotels & Travel',
                    'Local Flavor',
                    'Local Services',
                    'Mass Media',
                    'Nightlife',
                    'Pets',
                    'Professional Services',
                    'Public Services & Government',
                    'Real Estate',
                    'Religious Organizations',
                    'Restaurants',
                    'Shopping']

var svg = d3.select('#beanplot')
    .attr('height', height)
    .attr('width', width);

initBusinessFilters();
initCityFilters();

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
    init(data);
});


function update() {
    var newData = data;
    var uncheckedCategories = [];

    // loop through each checkbox
    for (var i = 0; i < businessTypes.length; i++) {
        var checkbox = d3.select("#" + makeValidSelector(businessTypes[i]));
        if (!checkbox.property("checked")) {
            uncheckedCategories.push(businessTypes[i]);
        }
    }

    // Filter out unchecked categories
    for (var i = 0; i < uncheckedCategories.length; i++) {
        newData = newData.filter(function(d) {
            var x = d["categories"];
            if (x.length == 0) { return true; }

            var categories = JSON.parse(x);
            for (var i = 0; i < categories.length; i++) {
                if (uncheckedCategories.indexOf(categories[i]) > -1) {
                    return false;
                }
            }
            return true;
        });
    }

    d3.select(".inner-wrapper").remove();
    var showViolin = chart1.violinPlots.options.show;
    var showBean = chart1.dataPlots.options.showBeanLines;
    var showScatter = chart1.dataPlots.options.showPlot;
    var showTrends = chart1.dataPlots.options.showLines;
    init(newData);

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

function init(newData) {
    chart1 = makeDistroChart({
        data:newData,
        xName:'state',
        yName:'coleman_liau_index',
        axisLabels: {xAxis: 'State', yAxis: 'Values'},
        selector:"#chart-distro1",
        chartSize:{height:490, width:800},
        constrainExtremes:true});
    chart1.renderBoxPlot();
    chart1.renderDataPlots();
    chart1.renderNotchBoxes({showNotchBox:false});
    chart1.renderViolinPlot({showViolinPlot:false});
}

function initBusinessFilters() {
    var businessDiv = d3.select(".businesses");
    businessDiv.append('label')
        .attr('id', 'selectAllBusinesses')
        .append('input')
        .attr('type', 'checkbox')
        .on('change', checkAll(businessDiv));

    d3.select('#selectAllBusinesses').append('span')
        .html('Select All');

    for (var i = 0; i < businessTypes.length; i++) {
        businessDiv.append('label')
            .attr('id', 'label'+i)
            .append('input')
            .attr('type', 'checkbox')
            .attr('id', makeValidSelector(businessTypes[i]))
            // .attr('checked', 'true')
            .on('change', update);
        d3.select('#label'+i).append('span')
            .html(businessTypes[i]);
    }
}

function initCityFilters() {
    var states = ['NC','OH','NV','WI','AZ','PA','IL'];
    var cityDiv = d3.select(".cities");
    for (var i = 0; i < states.length; i++) {
        cityName = convertStateToCity(states[i])
        cityDiv.append('label')
            .attr('id', 'cityLabel'+i)
            .append('input')
            .attr('type', 'checkbox')
            .attr('id', makeValidSelector(cityName))
            .on('change', update)
        d3.select('#cityLabel'+i).append('span')
            .html(cityName);
    }
}

function checkAll(div) {
    div.selectAll('input').attr('checked', 'true');
}


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

function makeValidSelector(name) {
    valid = name.replace(/\s/g, '-');
    valid = valid.replace(/\&/g, 'and');
    return valid;
}
//
