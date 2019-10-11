import lipstickTask from '@task/lipstick';
import searchTask from '@task/search';
import snsTask from '@task/sns';
import translatorTask from '@task/translator';
import { colorParse, dataSync } from '@pipeline/lipstick';
import { CustomConfig, ResponseObj, LipstickResult } from '@type/sprite';

export const lipstickCrawler = async (brands: string[], config: CustomConfig = {}): Promise<ResponseObj> => {
  const results = await lipstickTask(brands, config);
  // [colorParse, dataSync]
  const res: LipstickResult[] = [];
  for (const result of results) {
    const data = await colorParse(result.data);
    res.push({brand: result.brand, data});
  }
  const success = true;
  return { data: res, status: success};
};

export const searchCrawler = async (keyword: string, platforms: string[], config: CustomConfig = {}): Promise<ResponseObj> => {
  const results = await searchTask(keyword, platforms, config);
  const success = true;
  return { data: results, status: success};
};

export const snsCrawler = async (target: string, account: any, platform: string, config: CustomConfig = {}): Promise<ResponseObj> => {
  const results = await snsTask(target, account, platform, config);
  const success = true;
  return { data: results, status: success};
};

export const translatorCrawler = async (content: string, platforms: string[], config: CustomConfig = {}): Promise<ResponseObj> => {
  const results = await translatorTask(content, platforms, config);
  const success = true;
  return { data: results, status: success};
};