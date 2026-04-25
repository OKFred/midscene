import { AndroidAgent } from "@midscene/android";
import { Steps } from "../type";
import { getConnectedDevices, AndroidDevice } from "@midscene/android";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const hasDom = {
  domIncluded: true,
  screenshotIncluded: true,
} as const;
const noDom = {
  domIncluded: false,
  screenshotIncluded: false,
} as const;
export async function runSteps(
  steps: Steps,
  options?: { initialApp?: string },
) {
  const devices = await getConnectedDevices();
  const device = new AndroidDevice(devices[0].udid, {
    scrcpyConfig: {
      enabled: true,
    },
  });
  const agent = new AndroidAgent(device, {
    aiActionContext:
      "如果出现任何位置信息、权限、用户协议等弹窗，请点击同意。如果弹出登录页面，请关闭它。输入任何文字前，请检查键盘的语言。",
  });
  await device.connect();

  if (options?.initialApp) {
    console.log(`[Init] Launching app: ${options.initialApp}`);
    await agent.launch(options.initialApp);
  }
  const ctx = {} as Record<string, string>;
  let stepCount = 0;
  for (const step of steps) {
    const { type, info, breakPoint } = step;
    console.log(`[Step] ${stepCount++} ${type}${info ? `: ${info}` : ""}`);

    try {
      if (type === "aiSleep") {
        const ms = parseInt(info) || 1000;
        await sleep(ms);
      } else if (type === "aiSwitchToApp") {
        await agent.launch(info);
      } else if (typeof (agent as any)[type] === "function") {
        const method = (agent as any)[type].bind(agent);
        // Handle actions that don't need arguments (like back, home)
        if (["back", "home", "recentApps"].includes(type as string)) {
          await method();
        } else {
          Object.keys(ctx).length > 0 && console.log(ctx);
          if (type === "aiQuery") {
            const result = await method(info);
            const key = /\{\{([^}]+)\}\}/.exec(info)?.[1] || "";
            /** 保存上下文 */
            ctx[key] = result;
          } else if (type === "aiAssert") {
            const assertion = info + "\n上下文：" + JSON.stringify(ctx);
            await method(
              assertion,
              "🔥 断言失败",
              step.pureLogical ? noDom : hasDom,
            );
          } else {
            await method(info);
          }
        }
      }
    } catch (error) {
      console.error(
        `[Error] Failed to execute ${type}:`,
        (error as Error).message,
      );
      if (breakPoint) {
        break;
        // throw error;
      }
    }
  }
}
