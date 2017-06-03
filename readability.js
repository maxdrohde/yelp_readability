

var width = 800;
var height = 600;
var csvFile = "combined_reviews_business100k.csv";
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

for (var i = 0; i < businessTypes.length; i++) {
    d3.select(".businesses").append('label')
        .attr('id', 'label'+i)
        .append('input')
        .attr('type', 'checkbox')
        .attr('id', makeValidSelector(businessTypes[i]))
        // .attr('checked', 'true')
        .on('change', update);
    d3.select('#label'+i).append('span')
        .html(businessTypes[i]);
}

d3.csv(csvFile, function(error, csv_data) {
    console.log("loaded!");
    if (error) throw error;
    data = csv_data;
    update();
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

            // format the data into JSON
            var x = d["categories"].replace(/\', \'/g, '", "');
            x = x.replace(/\[\'/g, '["');
            x = x.replace(/\'\]/g, '"]');
            x = x.replace(/\", \'/g, '", "');
            x = x.replace(/\', \"/g, '", "');
            if (x.length == 0) { return true; }
            // End format

            var categories = JSON.parse(x);
            for (var i = 0; i < categories.length; i++) {
                if (uncheckedCategories.indexOf(categories[i]) > -1) {
                    return false;
                }
            }
            return true;
        });
    }

    newItems = svg.selectAll("circle").data(newData);

    newItems.enter()
        .append('svg:circle')
        .attr('r', function(d) { return 2 }) //return d["useful"]; })
        .attr('cx', function(d) {
            var variance = parseInt(Math.abs(d["flesch_reading_ease"] - 50)) * Math.random();
            return (d["stars"]) * 110 + variance;
        })
        .attr('cy', function(d) { return (d["flesch_reading_ease"] * 5 - 150); })
        .style('fill', 'black');

    newItems.exit()
        .remove();
}

function makeValidSelector(name) {
    valid = name.replace(/\s/g, '-');
    valid = valid.replace(/\&/g, 'and');
    return valid;
}


//
