import { runSteps } from "./utils/testMain";
import { Steps } from "./type";

const steps: Steps = [
  {
    type: "aiAct",
    info: "打开浏览器并访问alibaba.com",
  },
  {
    type: "aiSleep",
    info: "3000",
  },
  {
    type: "aiAct",
    info: '搜索关键词"banana"',
  },
  {
    type: "aiSleep",
    info: "3000",
  },
  {
    type: "aiQuery",
    info: "找出下方{{列表中的第一个商品}}对应的价格、卖家和卖家所在地。参考格式：{itemTitle: string, price: Number, seller: string, countryRegion: string}",
  },
  {
    type: "aiAssert",
    info: "页面左侧有商品分类过滤选项",
    breakPoint: false,
  },
  {
    type: "aiAct",
    info: "下方列表第一个商品点进去看详情",
  },
  {
    type: "aiQuery",
    info: "找出{{详情的商品}}对应的价格、卖家和卖家所在地。参考格式：{itemTitle: string, price: Number, seller: string, countryRegion: string}",
  },
  {
    type: "aiAssert",
    info: "看{{列表中的第一个商品}}和{{详情的商品}}的信息是否匹配",
    pureLogical: true,
  },
];

runSteps(steps, { initialApp: "com.android.chrome" });
