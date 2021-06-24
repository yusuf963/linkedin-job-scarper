const fs = require("fs");
const objectToCsv = require('objects-to-csv')
const stringify = require("csv-stringify")
const moment = require('moment');
timestamp = moment().format('DD-MM-YYYY-HH-m')

const {
    LinkedinScraper,
    relevanceFilter,
    timeFilter,
    typeFilter,
    experienceLevelFilter,
    events,
} = require("linkedin-jobs-scraper");

scraped_data = []
let columns = {
    scrapedTime: 'Time Stamp',
    company: 'Company Name',
    industry: 'Company Industry',
    place: 'Company Location',
    companyUrl: 'Company URL',
    title: 'Job Title',
    date: 'Job Posted Date',
    loc: 'Job Location',
    query: 'Query',
    jobId: 'Job Id',
    level: 'Senority Level',
    type: 'Emplyment Type',
    func: 'function',
    desc: 'Description',
    link: 'Job Link',
    applyLink: 'Apply Link'
};

(async () => {
    // Each scraper instance is associated with one browser.
    // Concurrent queries will run on different pages within the same browser instance.
    const scraper = new LinkedinScraper({
        headless: true,
        slowMo: 800,
        args: [
            "--lang=en-GB",
        ],
    });

    // Add listeners for scraper events
    scraper.on(events.scraper.data, (data) => {
        let scrappedTime = timestamp
        console.log('heeeeeeeeeeeeeeee', scrappedTime)
        let companyUrl = `www.linkedin.com/company/${data.company.toLowerCase().replace(/[\s\n\r\' '\.]+/g, "")}`
        console.log(
            // data.description.length,
            // data.descriptionHTML,
            // data.description,
            // `Description='${data.description.replace('\n', '')}'`,
            // `Query='${data.query}'`,
            // `Location='${data.location}'`,
            // `Id='${data.jobId}'`,
            `Title='${data.title}'`,
            `CompanyUrl=${companyUrl}`,
            // `Company='${data.company ? data.company : "N/A"}'`,
            // `CompanyURL='${data.company.link}'`,
            // `Place='${data.place}'`,
            // `Date='${data.date}'`,
            // `Link='${data.link}'`,
            // `applyLink='${data.applyLink ? data.applyLink : "N/A"}'`,
            // `senorityLevel='${data.senorityLevel}'`,
            // `function='${data.jobFunction}'`,
            // `employmentType='${data.employmentType}'`,
            // `industries='${data.industries}'`

        );
        scraped_data.push([
            scrappedTime,
            data.company,
            data.industries,
            data.place,
            companyUrl,
            data.title,
            data.date,
            data.location,
            data.query,
            data.jobId,
            data.senorityLevel,
            data.employmentType,
            data.jobFunction,
            data.description.replace(/[\s\n\r]+/g, " ").trim(),
            data.link,
            data.applyLink ? data.applyLink : 'N/A'
        ])

    });

    scraper.on(events.scraper.error, (err) => {
        console.error(err);
    });

    scraper.on(events.scraper.end, () => {
        stringify(scraped_data, { header: true, columns: columns }, (err, output) => {
            if (err) throw err;
            fs.writeFile(`result${timestamp}.csv`, output, (err) => {
                if (err) throw err;
                console.log('csv has been created and scrraped data has been saved into it.');

                // delete file after download to local driver
                // setTimeout(() => {
                //     console.log('sleep')
                //     fs.unlink(`result${timestamp}.csv`, (err) => {
                //         if (err) throw err;
                //         console.log('File deleted!');
                //     });
                //     console.log('awake')
                // }, 5000)
            });
        });
        console.log('All done!');
    });

    // Add listeners for puppeteer browser events
    scraper.on(events.puppeteer.browser.targetcreated, () => {
    });
    scraper.on(events.puppeteer.browser.targetchanged, () => {
    });
    scraper.on(events.puppeteer.browser.targetdestroyed, () => {
    });
    scraper.on(events.puppeteer.browser.disconnected, () => {
    });

    // Custom function executed on browser side to extract job description
    const descriptionFn = () => document.querySelector(".description__text")
        .innerText
        .replace(/[\s\n\r]+/g, " ")
        .trim();
    // Run queries concurrently    
    await Promise.all([
        // Run queries serially
        scraper.run([
            {
                query: "Data Analyst"
            },
        ], { // Global options for this run, will be merged individually with each query options (if any)
            locations: ["United Kingdom"],
            optimize: true,
            limit: 2,
        }),
    ]);
    // Close browser
    await scraper.close();
})();

