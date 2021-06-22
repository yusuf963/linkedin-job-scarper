

const fs = require("fs");
const stringify = require("csv-stringify")
const moment = require('moment');
timestamp = moment().format('DD-MM-YYYY-HH-m-s')
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
    title:'Job Title', 
    desc :'Description', 
    query:'Query', 
    loc:'Job Location', 
    jobId: 'Job Id', 
    company:'Company Name', 
    level:'Senority Level', 
    func:'function', 
    link:'Job Link',
    type: 'Emplyment Type',
    applyLink: 'Apply Link'
    };


(async () => {
    // Each scraper instance is associated with one browser.
    // Concurrent queries will run on different pages within the same browser instance.
    const scraper = new LinkedinScraper({
        headless: true,
        slowMo: 500,
        args: [
            "--lang=en-GB",
        ],
    });

    // Add listeners for scraper events
    scraper.on(events.scraper.data, (data) => {
        console.log(
            // data.description.length,
            // data.descriptionHTML.length,
            // data.description,
            // `Description='${data.description.replace('\n', '')}'`,
            // `Query='${data.query}'`,
            // `Location='${data.location}'`,
            // `Id='${data.jobId}'`,
            `Title='${data.title}'`,
            // `Company='${data.company ? data.company : "N/A"}'`,
            // `CompanyURL='${data.company.link ? data.company : "N/A"}'`,
            // `Place='${data.place}'`,
            // `Date='${data.date}'`,
            // `Link='${data.link}'`,
            // `applyLink='${data.applyLink ? data.applyLink : "N/A"}'`,
            // `senorityLevel='${data.senorityLevel}'`,
            // `function='${data.jobFunction}'`,
            // `employmentType='${data.employmentType}'`,
            // `industries='${data.industries}'`,
        );
        scraped_data.push([
            data.title,
            data.description.replace(/[\s\n\r]+/g, " ").trim(),
            data.query,
            data.location,
            data.jobId,
            data.company,
            data.senorityLevel,
            data.jobFunction,
            data.link,
            data.employmentType,
            data.applyLink?data.applyLink:'N/A'
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
              console.log('data is saved.');
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
                query: "Platform Engineer"
            },
        ], { // Global options for this run, will be merged individually with each query options (if any)
            locations: ["United Kingdom"],
            optimize: true,
            limit: 50,
        }),
    ]);
    // Close browser
    await scraper.close();
})();