import puppeteer from 'puppeteer-core';
import { Cluster } from 'puppeteer-cluster';
export const DB_CONFIG = {
    MongoURI: 'mongodb://localhost:27017/nest'
};

export const CLUSTER_CONFIG = {
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 2,
    monitor: false,
    puppeteer
};

export const BROWSER_CONFIG = {
    Viewport: {
        width: 1600,
        height: 1600,
    },
    UserAgent: '"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36"',
    LaunchOption: {
        headless: true,
        args: [
            '–disable-gpu',
            '–disable-dev-shm-usage',
            '–disable-setuid-sandbox',
            '–no-first-run',
            '–no-sandbox',
            '–no-zygote',
            '–single-process'
        ],
        defaultViewport: {
            width: 1200,
            height: 720
        },
        executablePath: process.platform === 'win32' ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        ignoreHTTPSErrors: true,
        timeout: 60000
        // slowMo: 200
    }
};
