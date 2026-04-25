// import type { AndroidAgent } from "@midscene/android";

export type Steps = Array<{
  type: "aiAct" | "aiQuery" | "aiAssert" | "aiSleep" | "aiSwitchToApp";
  info: string;
  breakPoint?: boolean;
  pureLogical?: boolean;
}>;
