import { AndroidAgent, AndroidDevice, getConnectedDevices } from "@midscene/android";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
Promise.resolve(
    (async () => {
        const devices = await getConnectedDevices();
        const device = new AndroidDevice(devices[0].udid);
        console.table(device);
        const agent = new AndroidAgent(device, {
            aiActionContext:
                "如果出现任何位置信息、权限、用户协议等弹窗，请点击同意。如果弹出登录页面，请关闭它。",
        });
        await device.connect();

        await agent.aiAct("打开浏览器并访问ebay.com");
        await sleep(5000);
        await agent.aiAct('在搜索框中输入"Headphones"，并回车');
        await agent.aiWaitFor("页面上至少出现一个Headphones商品");

        const items = await agent.aiQuery(
            "{itemTitle: string, price: Number}[]，找出列表中的商品以及对应的价格",
        );
        console.log("headphones in stock", items);

        await agent.aiAssert("页面左侧有商品分类过滤选项");
    })(),
);
