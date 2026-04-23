import type { AndroidAgent } from "@midscene/android";

export type AndroidAgentMethods = {
  [K in keyof AndroidAgent]: AndroidAgent[K] extends Function ? K : never;
}[keyof AndroidAgent];

export type Steps = Array<{
  action: AndroidAgentMethods | "aiSleep" | "aiSwitchToApp";
  info: string;
  breakPoint: boolean;
}>;
