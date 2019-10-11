
import SpriteNest from './src/index'
// import SpriteNest from './dist'
import { BROWSER_CONFIG } from './src/config/index' 
import puppeteer from 'puppeteer-core'
const l = console.log;
const { Crawlers, Sprites } = SpriteNest

const UseInnerSprite = async () => {
    const lipstickSprite = new Sprites.LipStick.armani()

    const browser = await puppeteer.launch(BROWSER_CONFIG.LaunchOption);
    const page = await browser.newPage();
    const data = {
      url: lipstickSprite.home
    }
    const res = await lipstickSprite.getList({ page, data })
    l('result data is: ', res)
}

const UseWrappedTask = async () => {
  // const target = ''
  // const account = {
  //   username: '',
  //   password: ''
  // }
  // snsCrawler(target, account, 'weibo').then(res => {
  //   let filePath = __dirname + "/results/test.json";
  //   fs.writeFileSync(filePath, JSON.stringify(res));
  // })

  // const transRes = await Crawlers.translator('good morning', ['hi', 'google', 'baidu', 'bing'], {
  //   cluster: {
  //     maxConcurrency: 2,
  //     monitor: true,
  //   },
  //   pptr: {
  //     headless: true
  //   }
  // })
  // l('translators data: ', transRes);
  
  const lipRes = await Crawlers.liptstick(['dior']);
  l('lipsticks data: ', lipRes);

  // const searchRes = await Crawlers.search('ishihara satomi', ['google', 'baidu', 'duckduckgo']);
  // l('search engines data: ', searchRes);

  l('all tasks ending')
  // exec('go run scripts/image.go', (err, stdout, stderr) => console.log(stdout));
};

// UseInnerSprite();
UseWrappedTask();
