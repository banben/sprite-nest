import lipstickTask from '@task/lipstick';
import searchTask from '@task/search';
import snsTask from '@task/sns';
import translatorTask from '@task/translator';
import { colorParse, dataSync } from '@pipeline/lipstick';
import { CustomConfig, ResponseObj, LipstickResult } from '@type/sprite';

const l = console.log;

export const lipstickCrawler = async (brands: string[], config: CustomConfig = {}): Promise<ResponseObj> => {
  const results = await lipstickTask(brands, config);
  // [colorParse, dataSync]
  const res: LipstickResult[] = [];
  for (const result of results) {
    const data = await colorParse(result.data);
    res.push({brand: result.brand, data});
  }
  // let res = await colorParse(results)
  const success = true;
  // l(res)
  // let success = await dataSync(res)
  return { data: res, status: success};
};

export const searchCrawler = async (keyword: string, platforms: string[], config: CustomConfig = {}): Promise<ResponseObj> => {
  const results = await searchTask(keyword, platforms, config);
  // let res = await colorParse(results)
  const success = true;
  // l(res)
  // let success = await dataSync(res)
  return { data: results, status: success};
};

export const snsCrawler = async (target: string, account: any, platform: string, config: CustomConfig = {}): Promise<ResponseObj> => {
  const results = await snsTask(target, account, platform, config);
  // let res = await colorParse(results)
  const success = true;
  // l(res)
  // let success = await dataSync(res)
  return { data: results, status: success};
};

export const translatorCrawler = async (content: string, platforms: string[], config: CustomConfig = {}): Promise<ResponseObj> => {
  const results = await translatorTask(content, platforms, config);
  // let res = await colorParse(results)
  const success = true;
  // l(res)
  // let success = await dataSync(res)
  return { data: results, status: success};
};