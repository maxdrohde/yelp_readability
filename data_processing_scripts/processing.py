import csv
import time
from textstat.textstat import textstat

st = time.time()

# reviews = "review_text_only.csv"
reviews = "yelp_academic_dataset_review.csv"
outfile = "review_text_only.csv"

f = open(reviews, 'r')
f2 = open(outfile, 'wb')

reader = csv.reader(f, delimiter=',')
writer = csv.writer(f2)

count = 0
print next(reader)
# writer.writerow(['Review Text'])

mxrevs=[]
mnrevs=[]
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
