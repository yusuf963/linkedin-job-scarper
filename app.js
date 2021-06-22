const searchKeyWord = document.getElementById("demo");
console.log(searchKeyWord)
alert('hello')

const {
    LinkedinScraper,
    relevanceFilter,
    timeFilter,
    typeFilter,
    experienceLevelFilter,
    events,
} = require("linkedin-jobs-scraper");

const fs = require('fs')
const writeStream = fs.createWriteStream('result.csv');
// writeStream.write(`Description, Query, Location, Id, Title,Company, CompanyUrl, senorityLevel, function, Link \n`)

(async () => {
    // Each scraper instance is associated with one browser.
    // Concurrent queries will run on different pages within the same browser instance.
    const scraper = new LinkedinScraper({
        headless: true,
        slowMo: 900,
        args: [
            "--lang=en-GB",
        ],
    });

    // Add listeners for scraper events
    scraper.on(events.scraper.data, (data) => {
        console.log(
            data.description.length,
            // data.descriptionHTML.length,
            // data.description,
            `Description='${data.description.replace('\n', '')}'`,
            `Query='${data.query}'`,
            `Location='${data.location}'`,
            `Id='${data.jobId}'`,
            `Title='${data.title}'`,
            `Company='${data.company ? data.company : "N/A"}'`,
            `CompanyURL='${data.company.link ? data.company : "N/A"}'`,
            `Place='${data.place}'`,
            `Date='${data.date}'`,
            `Link='${data.link}'`,
            `applyLink='${data.applyLink ? data.applyLink : "N/A"}'`,
            `senorityLevel='${data.senorityLevel}'`,
            `function='${data.jobFunction}'`,
            `employmentType='${data.employmentType}'`,
            `industries='${data.industries}'`,
        );
        writeStream.write(`${data.description.replace('\n', '')}, ${data.query}, ${data.location}, ${data.jobId},${data.title}, ${data.company ? data.company : "N/A"}, ${data.senorityLevel}, ${data.jobFunction}, ${data.link} `)
    });

    scraper.on(events.scraper.error, (err) => {
        console.error(err);
    });

    scraper.on(events.scraper.end, () => {
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
                query: "DevOps",
                options: {
                    locations: ["United Kingdom"], // This will be merged with the global options => ["United States", "Europe"]
                    filters: {
                        type: [typeFilter.FULL_TIME, typeFilter.CONTRACT]
                    },
                }
            },
            {
                query: "devops",
                options: {
                    limit: 101, // This will override global option limit (33)
                }
            },
        ], { // Global options for this run, will be merged individually with each query options (if any)
            locations: ["United Kingdom"],
            optimize: true,
            limit: 100,
        }),
    ]);

    // Close browser
    // await scraper.close();
})();