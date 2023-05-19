import puppeteer from "puppeteer";
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";

import axios from "axios";

const app = express();
const server = http.createServer(app);
const targetURL = "https://coldplayinjakarta.com/";

async function run(): Promise<void> {
  const browser = await puppeteer.launch({
    headless: false,
    product: "firefox",
    executablePath: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
  });
  const page = await browser.newPage();
  const res = await page.goto(targetURL, { waitUntil: "domcontentloaded" });

  let btnList = await page.$$eval("button.lp-button", (el) => {
    return el.map((v) => ({ [v.textContent as string]: v.classList }));
  });

  const rrel = setInterval(async () => {
    await page.goto(targetURL, { waitUntil: "domcontentloaded" });
    let nBtnList = await page.$$eval("button.lp-button", async (el) => {
      return el.map((v) => ({ [v.textContent as string]: v.classList }));
    });
    const btnStatus = JSON.parse(JSON.stringify(nBtnList));
    if(!Object.values(btnStatus).includes("disabled")){
      setTimeout(()=>{},7000);
    }
    const btnPublic = btnStatus[1]["BUY PUBLIC ON-SALE TICKETS"];
    const isDisabled = Object.values(btnPublic).includes("disabled");
    console.log(`[${new Date().toLocaleTimeString()}] Submit is ${!isDisabled} [${JSON.stringify(btnPublic)}]`);
    if (!isDisabled) {
      let selectors = await page.$$(".lp-button");
      await selectors[1].click();
      clearInterval(rrel);
    }
  }, 1900);
}

run();