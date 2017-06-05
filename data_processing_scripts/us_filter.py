import csv
import time

st = time.time()

# The files we will be working with
reviews = "yelp_academic_dataset_review.csv"
outfile = "shortened_reviews.csv"

infile1 = open(reviews, 'r')
output = open(outfile, 'wb')

reviews_reader = csv.reader(infile1, delimiter=',')
writer = csv.writer(output)

# The states we are accepting reviews from
states = ['PA', 'NC', 'AZ', 'IL', 'WI', 'OH', 'NV']

# Create a header of the combined reviews and business file headers
header = next(reviews_reader)
writer.writerow(header)

count = 0

for row in reader:
    # writer.writerow([row[3]])
    read = textstat.flesch_kincaid_grade(row[3])
    # read = textstat.flesch_reading_ease(row[3])
    if read < 1:
        mnrevs.append(row[3])
    if read > 12:
        mxrevs.append(row[3])
    # textstat.smog_index(row[3])
    # textstat.coleman_liau_index(row[3])
    # textstat.automated_readability_index(row[3])
    # textstat.dale_chall_readability_score(row[3])
    # textstat.difficult_words(row[3])
    # textstat.linsear_write_formula(row[3])
    # textstat.gunning_fog(row[3])
    # textstat.text_standard(row[3])
    count += 1
    if count % 1000 == 0:
        print count
        break
        print time.time() - st

print count
print "time: ", time.time() - st

for i in mnrevs:
    print '-' * 80
    print i

print '=' * 100

for i in mxrevs:
    print '-' * 80
    print i
