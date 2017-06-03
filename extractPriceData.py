import csv
import time

st = time.time()

# The files we will be working with
reviews = "combined_reviews_business100k.csv"
out = "reviews_with_prices.csv"
infile1 = open(reviews, 'r')
outfile = open(out, 'wb')
reviews_reader = csv.reader(infile1, delimiter=',')
reviews_writer = csv.writer(outfile)

# Make a Python dictionary of the businesses
x = 0

reviews_writer.writerow(next(reviews_reader) + ["price", "length", "alcohol"])
for row in reviews_reader:
    x+=1
    try:
        attrs = eval(row[10])
    except Exception as e:
        attrs = []

    price = ""
    for att in attrs:
        if att.split()[0] == "RestaurantsPriceRange2:":
            price += att.split()[1]

    row += [price, len(row[3])]

    reviews_writer.writerow(row)

print "Total time: ", time.time() - st
