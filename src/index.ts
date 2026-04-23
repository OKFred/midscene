import {
  AndroidAgent,
  AndroidDevice,
  getConnectedDevices,
} from "@midscene/android";
import { runSteps } from "./utils/testMain";
import { Steps } from "./type";

const steps: Steps = [
  {
    action: "aiAct",
    info: "打开浏览器并访问alibaba.com",
    breakPoint: false,
  },
  {
    action: "aiSleep",
    info: "5000",
    breakPoint: false,
  },
  {
    action: "aiAct",
    info: '在搜索框中输入"banana"，并回车',
    breakPoint: false,
  },
  {
    action: "aiWaitFor",
    info: "页面上至少出现一个商品",
    breakPoint: false,
  },
  {
    action: "aiQuery",
    info: "{itemTitle: string, price: Number, seller: string, countryRegion: string}[]，找出列表中的商品以及对应的价格、卖家和卖家所在地，找不到字段就null",
    breakPoint: false,
  },
  {
    action: "aiAssert",
    info: "页面左侧有商品分类过滤选项",
    breakPoint: false,
  },
];

Promise.resolve(
  (async () => {
    const devices = await getConnectedDevices();
    const device = new AndroidDevice(devices[0].udid);
    const agent = new AndroidAgent(device, {
      aiActionContext:
        "如果出现任何位置信息、权限、用户协议等弹窗，请点击同意。如果弹出登录页面，请关闭它。输入任何文字前，请检查键盘的语言。",
    });
    await device.connect();

    await runSteps(agent, steps, { initialApp: "com.android.chrome" });
  })(),
);
