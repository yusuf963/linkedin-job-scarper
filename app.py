import logging
from linkedin_jobs_scraper import LinkedinScraper
from linkedin_jobs_scraper.events import Events, EventData
from linkedin_jobs_scraper.query import Query, QueryFilters, QueryOptions
from linkedin_jobs_scraper.filters import RelevanceFilters, TimeFilters, TypeFilters, ExperienceLevelFilters, RemoteFilters

def on_data(data: EventData):
    print('[On_DATA]', data.title,data.company, data.date, data.link, len(data.description))

def on_error(error):
    print('[ON_ERROR]', error)

def on_end():
    print('[On_END]')

scraper = LinkedinScraper(
    chrome_executable_path=None, # Custom Chrome executable path (e.g. /foo/bar/bin/chromedriver) 
    chrome_options=None,  # Custom Chrome options here
    headless=True, # Overrides headless mode only if chrome_options is None
    max_workers=1,  # How many threads will be spawned to run queries concurrently (one Chrome driver for each thread)
    slow_mo=1.3,  # Slow down the scraper to avoid 'Too many requests (429)' errors  
)
# Add event listeners

