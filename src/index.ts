import Sprites from '@sprite/index';
import { lipstickCrawler, searchCrawler, snsCrawler, translatorCrawler } from './job/index';

const Crawler = {
  liptstick: lipstickCrawler,
  search: searchCrawler,
  sns: snsCrawler,
  translator: translatorCrawler
};

export default {
  Crawler,
  Sprite: Sprites
};
