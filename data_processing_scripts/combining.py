import csv
import sys
import time
from textstat.textstat import textstat

st = time.time()

# Determine which portion of the data we are working with
REVIEW_COUNT = 4153150
SEGMENT = int(sys.argv[1])
TOTAL_SEGMENTS = int(sys.argv[2])
start_line = (REVIEW_COUNT / TOTAL_SEGMENTS) * (SEGMENT - 1)
end_line = (REVIEW_COUNT / TOTAL_SEGMENTS) * SEGMENT

print "Processing segment %d of %d of the data." %(SEGMENT, TOTAL_SEGMENTS)

# The files we will be working with
reviews = "yelp_academic_dataset_review.csv"
business = "yelp_academic_dataset_business.csv"
outfile = "combined_reviews_business%d.csv" %(SEGMENT)

infile1 = open(reviews, 'r')
infile2 = open(business, 'r')
output = open(outfile, 'wb')

reviews_reader = csv.reader(infile1, delimiter=',')
business_reader = csv.reader(infile2, delimiter=',')
writer = csv.writer(output)

# The states we are accepting reviews from
states = ['PA', 'NC', 'AZ', 'IL', 'WI', 'OH', 'NV']

# Error reviews - the reviews that cause errors in the betrics
error_reviews = [';))', '.']

# Choose which metrics we are going to use
metrics = [ 'flesch_kincaid_grade',
            'flesch_reading_ease',
            'smog_index',
            'coleman_liau_index',
            'automated_readability_index',
            'dale_chall_readability_score',
            # 'difficult_words',
            'gunning_fog',
            # 'linsear_write_formula',
            # 'text_standard'
          ]

# Create a header of the combined reviews and business file headers
header = next(reviews_reader) + next(business_reader)[5:15] + metrics
writer.writerow(header)

# Make a Python dictionary of the businesses
businesses = {}
for row in business_reader:
    businesses[row[1]] = row[5:15]

print 'Loaded businesses in %f seconds.' %(time.time() - st)
st = time.time()

line_count = 0
reviews_processed = 0

for row in reviews_reader:
    # Only work in the range of lines specific to the segment
    if line_count < start_line:
        line_count += 1
        continue
    elif line_count > end_line:
        break

    line_count += 1
    reviews_processed += 1

    # Make sure business is in US
    business = businesses[row[4]]
    if business[6] not in states:
        continue

    text = row[3]
    scores = []

    if text in error_reviews:
        continue

    # Bad or whatever to use exec() but I like it more than that commented code
    for m in metrics:
        exec('scores.append(textstat.%s(text))' %m)
    # if 'flesch_kincaid_grade' in metrics:
    #     scores.append(textstat.flesch_kincaid_grade(text))
    # if 'flesch_reading_ease' in metrics:
    #     scores.append(textstat.flesch_reading_ease(text))
    # if 'smog_index' in metrics:
    #     scores.append(textstat.smog_index(text))
    # if 'coleman_liau_index' in metrics:
    #     scores.append(textstat.coleman_liau_index(text))
    # if 'automated_readability_index' in metrics:
    #     scores.append(textstat.automated_readability_index(text))
    # if 'dale_chall_readability_score' in metrics:
    #     scores.append(textstat.dale_chall_readability_score(text))
    # if 'difficult_words' in metrics:
    #     scores.append(textstat.difficult_words(text))
    # if 'gunning_fog' in metrics:
    #     textstat.gunning_fog(text)
    # if 'linsear_write_formula' in metrics:
    #     textstat.linsear_write_formula(text)
    # if 'text_standard' in metrics:
    #     textstat.text_standard(text)

    writer.writerow(row + business + scores)
    if reviews_processed % 1000 == 0:
        print "%d reviews processed in %f seconds." %(reviews_processed, time.time()-st)

print reviews_processed, "total reviews processed."
print "Total time: ", time.time() - st
