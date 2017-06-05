'''
This script takes in a csv with attributes that are in JSON format except
for the use of single quotes instead of double quotes. It replaces them
correctly and outputs the fixed file.
'''

import csv
import time
import json

st = time.time()

# The files we will be working with
reviews = "reviews_with_prices.csv"
out = "reviews_with_prices_fixed.csv"
infile1 = open(reviews, 'r')
outfile = open(out, 'wb')
reviews_reader = csv.reader(infile1, delimiter=',')
reviews_writer = csv.writer(outfile)

# The columns in the CSV that need fixing, and which column they are in
attributes_to_convert = {'attributes' : 0, 'categories' : 0}

# Get the header and advance the reader to the data
header = next(reviews_reader)

# Get the column number of each attribute
for att in attributes_to_convert:
    attributes_to_convert[att] = header.index(att)

# Write the header
reviews_writer.writerow(header)

businessTypes = ['Active Life','Arts & Entertainment','Automotive','Beauty & Spas','Education','Event Planning & Services','Financial Services','Food','Health & Medical','Home Services','Hotels & Travel','Local Flavor','Local Services','Mass Media','Nightlife','Pets','Professional Services','Public Services & Government','Real Estate','Religious Organizations','Restaurants','Shopping']
x = 0
for row in reviews_reader:
    c = 0
    for col in attributes_to_convert.values():
        try:
            data = eval(row[col])
        except Exception as e:
            data = []
            c += 1

        row[col] = json.dumps(data)

    if c == 2: x += 1
    reviews_writer.writerow(row)

print x
print "Total time: ", time.time() - st














##
