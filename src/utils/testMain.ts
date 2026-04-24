import { AndroidAgent } from "@midscene/android";
import { Steps } from "../type";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function runSteps(
  agent: AndroidAgent,
  steps: Steps,
  options?: { initialApp?: string },
) {
  if (options?.initialApp) {
    console.log(`[Init] Launching app: ${options.initialApp}`);
    await agent.launch(options.initialApp);
  }
  const ctx = {} as Record<string, string>;
  for (const step of steps) {
    const { type, info, breakPoint } = step;
    if (!type) continue;

    // 获取并打印详细的 DOM 摘要信息
    try {
      const elements = await (agent as any).device.getElementsInfo();
      const summary = elements
        .slice(0, 5)
        .map((el: any) => {
          return `${el.type}: ${el.contentDescription || el.text || "no-text"}`;
        })
        .join(", ");
      console.log(
        `[DOM] Found ${elements.length} elements. Top elements: [${summary}...]`,
      );
    } catch (e) {
      console.warn("[DOM] Failed to fetch element info");
    }

    console.log(`[Step] ${type}${info ? `: ${info}` : ""}`);

    try {
      if (type === "aiSleep") {
        const ms = parseInt(info) || 1000;
        await sleep(ms);
      } else if (type === "aiSwitchToApp") {
        await agent.launch(info);
      } else if (typeof (agent as any)[type] === "function") {
        const method = (agent as any)[type].bind(agent);
        // Handle actions that don't need arguments (like back, home)
        if (!info && ["back", "home", "recentApps"].includes(type as string)) {
          await method();
        } else {
          const result = await method(info);
          const key = /\{\{([^}]+)\}\}/.exec(info)?.[1] || "";
          ctx[key] = result;
        }
      } else {
        console.warn(`[Warning] Unknown type: ${type}`);
      }
    } catch (error) {
      console.error(`[Error] Failed to execute ${type}:`, error);
      throw error;
    }

    if (breakPoint) {
      console.log("[Breakpoint] Step completed, continuing...");
    }
  }
}
