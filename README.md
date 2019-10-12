#  Sprite Nest

中文 | [English](README-EN.md)

轻松灵活地从网络上爬取指定类型内容的数据

## 特性

* 内置的指定类型内容爬虫
* 集群化操作(使用[pupputeer-cluster](https://github.com/thomasdondorf/puppeteer-cluster))
* 日志记录(使用[winstom](https://github.com/winstonjs/winston))

## 安装

```bash
yarn add sprite-nest
# 或
npm install sprite-nest --save
```

## 开始

### 基本使用

比如我想在得到某一关键词在**不同搜索引擎**上的结果，

```js
import SpriteNest from 'sprite-nest'
// or
// const SpriteNest = require('sprite-nest').default

const { Crawler } = SpriteNest

const keyword = 'ishihara satomi'

Crawler.search(keyword, ['google', 'baidu', 'duckduckgo']).then(res => {
  console.log(`result of searching ${keyword}: `, res)
});
```

### 自定义配置

接下来我想翻译一段话，并且想看在**不同翻译器**中的结果。这一次进行一些自定义配置：集群的**并发数量**，开启CLI中的**数据监控**，禁用headless模式，即使用可见的浏览器窗口。

```js
import SpriteNest from 'sprite-nest'
const { Crawler } = SpriteNest

const sentence = 'good morning'

Crawler.translator(sentence, ['google', 'baidu', 'bing'], {
  // puppeteer-cluster配置
  cluster: { 
    maxConcurrency: 3, // default is 2
    monitor: true, // default is false
  },
  // puppeteer配置
  pptr: { 
    headless: false
  }
}).then(res => {
  console.log(`result of translating ${keyword}: `, res)
})
```

> SpriteNest内部默认使用[**puppeteer-core**](https://www.npmjs.com/package/puppeteer-core)，不会单独下载chromium，与puppeteer的具体对比可以看[这里](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteer-vs-puppeteer-core)。

### 使用Sprite对象

之前的`Crawler`中包含封装好的任务，包括处理列表与详情，集群执行等，其中所使用的一个关键类：`Sprite`类，则包含了具体执行puppetter操作的函数，这意味着你传入一个自己的Page实例即可得到执行后爬取的数据。

举个栗子，我现在想得到**阿玛尼口红**的数据：

```js
import SpriteNest from 'sprite-nest'
import puppeteer from 'puppeteer'

const { Sprite } = SpriteNest;

const UseInnerSprite = async () => {
    const armaniSprite = new Sprite.LipStick.armani()
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    return await armaniSprite.getList({ page })
}

UseInnerSprite().then(lipsticks => console.log('armani lipsticks: ', lipsticks));
```

在这个例子仅获取了口红列表的基本数据，而**Crawler.lipstick**方法中同时包含了列表与详情的任务，比如口红的所有颜色与名称等。

## API

### Crawler

#### `Crawler.lipstick(brands, config)`

* `brands` <string[]> 可用值参见Sprite->Lipstick
* `config` <?CustomConfig>

#### `Crawler.search(keyword, platforms, config)`

* `keyword` \<string\>
* `platforms` <string[]> 可用值参见Sprite->Search
* `config` <?CustomConfig>

#### `Crawler.sns(target, account, platform, config)`

* `target` \<string\>
* `account` \<Object\>
  * `username` \<string\>
  * `password` \<string\>
* `brands` <string[]> 可用值参见Sprite->SNS
* `config` <?CustomConfig>

#### `Crawler.translator(content, platforms, config)`

* `content` \<string\>
* `platforms` <string[]> 可用值参见Sprite->Translator
* `config` <?CustomConfig>

### Sprite

每个Sprite类都具有一个`getList()`或`getDetail()`方法，取决于它的内容类型。

目前已有的sprite状态如下，打勾表示可用的：

#### Lipstick

* getList && getDetail

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

* getList

- [x] baidu
- [x] bing
- [x] duckduckgo
- [x] google

#### Translator

* getList & getDetail

- [x] baidu
- [x] bing
- [x] google

#### SNS

* getList

- [x] weibo 

## Todo

- [ ] testing
- [ ] custom sprite constructor

## License

MIT
