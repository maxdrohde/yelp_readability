

var width = 800;
var height = 600;
var csvFile = "combined_reviews_business100k.csv";
var data;

var businessTypes = ["Restaurants", "Bars", "Antiques", "Farmers Market", "Yoga"]

var svg = d3.select('#beanplot')
    .attr('height', height)
    .attr('width', width);

for (var i = 0; i < businessTypes.length; i++) {
    d3.select(".businesses").append('label')
        .html(businessTypes[i])
        .append('input')
        .attr('type', 'checkbox')
        .attr('id', businessTypes[i].replace(/\s/g, '-'))
        .attr('checked', 'true')
        .on('change', update);
}

d3.csv(csvFile, function(error, csv_data) {
    console.log("loaded!");
    if (error) throw error;
    data = csv_data;

    var dots = svg.selectAll('circle').data(data);
    dots.enter()
        .append('svg:circle')
        .attr('r', function(d) { return 2 }) //return d["useful"]; })
        .attr('cx', function(d) {
            var variance = parseInt(Math.abs(d["flesch_reading_ease"] - 50)) * Math.random();
            return (d["stars"]) * 110 + variance;
        })
        .attr('cy', function(d) { return (d["flesch_reading_ease"] * 5 - 150); })
        .style('fill', 'black');

});


function update() {
    var newData = data;
    for (var i = 0; i < businessTypes.length; i++) {
        var checkbox = d3.select("#" + businessTypes[i].replace(/\s/g, '-'));
        if(!checkbox.property("checked")) {
            newData = newData.filter(function(d) {
                var x = d["categories"].replace(/\', \'/g, '", "');
                x = x.replace(/\[\'/g, '["');
                x = x.replace(/\'\]/g, '"]');
                x = x.replace(/\", \'/g, '", "');
                x = x.replace(/\', \"/g, '", "');
                if (x.length == 0) { return true; }

                var categories = JSON.parse(x);
                for (var i = 0; i < categories.length; i++) {
                    if (categories[i] == businessTypes[i]) {
                        return false;
                    }
                }
                return true;
            });
        }
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


//
