# yelp_readability
Data visualization final project Carleton College 2017

# How to run
For D3 to read in the data, the files must be hosted on a server. To implement a simple one, simply run `python -m http.server` in the yelp_readability directory. Then navigate to http://localhost:8000/ in any web browser.

## A note about data processing
The folder data_processing_scripts contains several python files used to explore and manipulate the data. The important files are:
### combining.py
This file reads in the large dataset straight from the Yelp Dataset Challenge. It should be given two command line arguments representing the fraction of the data you want to process. For example, we significantly sped up the process of getting readability metrics by running this eight times simultaneously, each on a different eighth of the data. Note that this file also removes reviews from foreign countries.
### combine_results.py
This script should be run in the folder with the output from combining.py. It simply puts all of the results from that script into a single csv.
### extract_price_data.py
This file extracts price and length data from the reviews and appends them as attributes.
### attriutes_to_json
This script should be run last, and the output is the file that can be worked with in D3. It makes the attributes and categories columns JSON.
