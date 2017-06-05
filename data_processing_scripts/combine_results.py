import csv
import sys
import time

st = time.time()

writer = csv.writer(open("out.csv", "wb"))
for i in range(1, 9):
    infile = "combined_reviews_business%d.csv" %(i)
    reader = csv.reader(open(infile, 'r'), delimiter=",")
    first = True
    if i == 1:
        writer.writerow(next(reader))
        first = False
    
    print "reading file %d" %(i)
    for row in reader:
        if first:
            first = False
            continue
        writer.writerow(row)

print "Total time: ", time.time() - st
