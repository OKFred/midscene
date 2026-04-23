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
    info: "打开浏览器并访问ebay.com",
    breakPoint: false,
  },
  {
    action: "aiSleep",
    info: "5000",
    breakPoint: false,
  },
  {
    action: "aiAct",
    info: '在搜索框中输入"Headphones"，并回车',
    breakPoint: false,
  },
  {
    action: "aiWaitFor",
    info: "页面上至少出现一个Headphones商品",
    breakPoint: false,
  },
  {
    action: "aiQuery",
    info: "{itemTitle: string, price: Number}[]，找出列表中的商品以及对应的价格",
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
        "如果出现任何位置信息、权限、用户协议等弹窗，请点击同意。如果弹出登录页面，请关闭它。",
    });
    await device.connect();

    await runSteps(agent, steps, { initialApp: "com.android.chrome" });
  })(),
);
