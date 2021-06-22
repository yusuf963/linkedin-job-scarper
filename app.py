import logging
from linkedin_jobs_scraper import LinkedinScraper
from linkedin_jobs_scraper import filters
from linkedin_jobs_scraper.events import Events, EventData
from linkedin_jobs_scraper.query import Query, QueryFilters, QueryOptions
from linkedin_jobs_scraper.filters import RelevanceFilters, TimeFilters, TypeFilters, ExperienceLevelFilters, RemoteFilters


def on_data(data: EventData):
    print('[On_DATA]', data.title, data.company,
          data.date, data.link, len(data.description))


# def on_error(error):
#     print('[ON_ERROR]', error)


def on_end():
    print('[On_END]')


print('I am here')

scraper = LinkedinScraper(
    # Custom Chrome executable path (e.g. /foo/bar/bin/chromedriver)"\c:\Windows\chromedriver.exe"
    chrome_executable_path=None,
    chrome_options=None,  # Custom Chrome options here
    headless=True,  # Overrides headless mode only if chrome_options is None
    # How many threads will be spawned to run queries concurrently (one Chrome driver for each thread)
    max_workers=1,
    # Slow down the scraper to avoid 'Too many requests (429)' errors
    slow_mo=2.3,
)
# Add event listeners
scraper.on(Events.DATA, on_data)
# scraper.on(Events.ERROR, on_error)
scraper.on(Events.END, on_end)

queries = [
    Query(
        options=QueryOptions(
            optimize=True,  # Blocks requests for resources like images and stylesheet
            limit=27  # Limit the number of jobs to scrape
        )
    ),
    Query(
        query='Engineer',
        options=QueryOptions(
            locations=['United States'],
            optimize=False,
            limit=5,
            filters=QueryFilters(
                company_jobs_url='https://www.linkedin.com/jobs/search/?f_C=162479&geoId=92000000',
                relevance=RelevanceFilters.RECENT,
                time=TimeFilters.MONTH,
                type=[TypeFilters.FULL_TIME, TypeFilters.INTERNSHIP],
                experience=None,
            )
        )
    ),
]
scraper.run(queries)
