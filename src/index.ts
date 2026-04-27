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
    info: "上方的商品是广告，查看下方的{{列表中的第一个商品}}对应的名称和价格。参考格式：{title: string, price: Number}",
  },
  {
    type: "aiAssert",
    info: "页面左侧有商品分类过滤选项",
  },
  {
    type: "aiAct",
    info: "上方的商品是广告，下方的列表第一个商品点进去看详情。如果需要登录，则报错退出",
    breakPoint: true, // 可能会要求登录，导致异常
  },
  {
    type: "aiQuery",
    info: "找出{{详情的商品}}对应的名称和价格。参考格式：{title: string, price: Number}",
  },
  {
    type: "aiAssert",
    info: "看{{列表中的第一个商品}}和{{详情的商品}}的信息是否匹配",
    pureLogical: true,
  },
];

runSteps(steps, { initialApp: "com.android.chrome" });
