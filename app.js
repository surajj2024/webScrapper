const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
const fs = require("fs");

const url = "https://www.naukri.com/it-jobs?src=gnbjobs_homepage_srch";

async function fetchData() {
  try {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

async function scrapeJobs() {
  const $ = await fetchData();
  const jobs = [];

  $(".jobTuple").each((index, element) => {
    const jobTitle = $(element).find(".title").text().trim();
    const companyName = $(element).find(".subTitle").text().trim();
    const location = $(element).find(".location").text().trim();
    const jobType = $(element).find(".jobType").text().trim();
    const postedDate = $(element)
      .find(".jobTupleFooter .postedDate")
      .text()
      .trim();
    const jobDescription = $(element).find(".job-description").text().trim();

    jobs.push({
      JobTitle: jobTitle,
      CompanyName: companyName,
      Location: location,
      JobType: jobType,
      PostedDate: postedDate,
      JobDescription: jobDescription,
    });
  });

  return jobs;
}

async function exportToExcel(data) {
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, worksheet, "Jobs");
  xlsx.writeFile(workbook, "TechJobPostings.xlsx");
}

async function main() {
  const jobs = await scrapeJobs();
  await exportToExcel(jobs);
  console.log("Job data scraped and saved to TechJobPostings.xlsx");
}

main();
