import Sprites from '@sprite/index';
import { lipstickCrawler, searchCrawler, snsCrawler, translatorCrawler } from './job/index';

const Crawlers = {
  liptstick: lipstickCrawler,
  search: searchCrawler,
  sns: snsCrawler,
  translator: translatorCrawler
};

export default {
  Crawlers,
  Sprites
};
