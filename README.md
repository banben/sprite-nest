#  Sprite Nest

Crawl contents of specific types from web easily and flexibly.

## Feature

* Built-in specified type content crawlers
* Cluster execution(powered by [pupputeer-cluster](https://github.com/thomasdondorf/puppeteer-cluster))
* Logger information (powered by [winstom](https://github.com/winstonjs/winston))

## Install

```bash
yarn add sprite-nest
# or
npm install sprite-nest --save
```

## Usage

### Basic Usage

For example I would like to get the searching results of a keyword in multiple search engines.

```js
import SpriteNest from 'sprite-nest'
// or
// const SpriteNest = require('sprite-nest').default

const { Crawlers } = SpriteNest

const keyword = 'ishihara satomi'

Crawlers.search(keyword, ['google', 'baidu', 'duckduckgo']).then(res => {
  console.log(`result of searching ${keyword}: `, res)
});
```

### Use with Config

Later I hope to get translation results of text content in multiple translators and compare them. Furthermore enable **monitor** of cluster status and set a **maximum concurrent crawler number**,  with a **visible browser window**.

```js
import SpriteNest from 'sprite-nest'
const { Crawlers } = SpriteNest

const sentence = 'good morning'

Crawlers.translator(sentence, ['google', 'baidu', 'bing'], {
  cluster: {
    maxConcurrency: 3,
    monitor: true,
  },
  pptr: {
    headless: false
  }
}).then(res => {
  console.log(`result of translating ${keyword}: `, res)
})
```

### Use Sprite and drive Puppeteer Page

`Crawler` contains wrapped task and `Sprite` is the class which has inner functions with some puppeteer operations, it means you can input a custom Page instance and then will get crawled data.

And now I get information of **Armani lipsticks** to pick one!

```js
import SpriteNest from 'sprite-nest'
import puppeteer from 'puppeteer'

const { Sprites } = SpriteNest;

const UseInnerSprite = async () => {
    const armaniSprite = new Sprites.LipStick.armani()
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const data = {
      url: armaniSprite.home
    }
    return await armaniSprite.getList({ page, data })
}
UseInnerSprite().then(lipsticks => console.log('armani lipsticks: ', lipsticks));
```

## API

### Main 

`Crawlers` \<Object\>
  * `lipstick` \<Function\>
  * `search` \<Function\>
  * `sns` \<Function\>
  * `translator` \<Function\>

#### `Crawlers.lipstick(brands, config)`

* `brands` <string[]>
* `config` <?CustomConfig>

#### `Crawlers.search(keyword, platforms, config)`

* `keyword` \<string\>
* `platforms` <string[]>
* `config` <?CustomConfig>

#### `Crawlers.sns(target, account, platform, config)`

* `target` \<string\>
* `account` \<Object\>
  * `username` \<string\>
  * `password` \<string\>
* `brands` <string[]>
* `config` <?CustomConfig>

#### `Crawlers.translator(content, platforms, config)`

* `content` \<string\>
* `platforms` <string[]>
* `config` <?CustomConfig>

### Sprites

Every sprite may has `getList()` or `getDetail()` method, depends on its type.

#### Lipstick

- [x] armani
- [x] covergirl
- [ ] cpb
- [x] dior
- [x] esteelauder
- [x] givenchy
- [ ] guerlian
- [x] lancome
- [ ] louboutin
- [x] mac
- [x] maquillage
- [x] maybelline
- [ ] nars
- [ ] sephora
- [x] tomford
- [x] urbandecay
- [x] ysl

#### Search

- [x] baidu
- [x] bing
- [x] duckduckgo
- [x] google

#### Translator

- [x] baidu
- [x] bing
- [x] google

#### SNS

- [x] weibo 

## Todo

- [ ] testing
- [ ] custom sprite constructor

## License

MIT
