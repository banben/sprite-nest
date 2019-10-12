
import SpriteNest from './src/index'
// import SpriteNest from './dist'
import { BROWSER_CONFIG } from './src/config/index' 
import puppeteer from 'puppeteer-core'
const l = console.log;
const { Crawler, Sprite } = SpriteNest

const UseInnerSprite = async () => {
    const lipstickSprite = new Sprite.LipStick.armani()

    const browser = await puppeteer.launch(BROWSER_CONFIG.LaunchOption);
    const page = await browser.newPage();
    const res = await lipstickSprite.getList({ page })
    l('result data is: ', res)
    
}
UseInnerSprite();
const UseWrappedTask = async () => {
  // const target = ''
  // const account = {
  //   username: '',
  //   password: ''
  // }
  // Crawler.sns(target, account, 'weibo').then(res => {
  //   let filePath = __dirname + "/results/test.json";
  //   fs.writeFileSync(filePath, JSON.stringify(res));
  // })

  const transRes = await Crawler.translator('good morning', ['google', 'baidu'], {
    cluster: {
      maxConcurrency: 2,
      monitor: true,
    },
    pptr: {
      headless: true
    }
  })
  l('translators data: ', transRes);
  
  const lipRes = await Crawler.liptstick(['armani', 'dior']);
  l('lipsticks data: ', lipRes);

  const searchRes = await Crawler.search('ishihara satomi', ['google', 'baidu', 'duckduckgo']);
  l('search engines data: ', searchRes);

  l('all tasks ending')
};
// UseWrappedTask();
