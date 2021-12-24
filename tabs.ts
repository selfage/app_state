import { BrowserHistoryPusher } from "./browser_history_pusher";
import { OnceCaller } from "@selfage/once/caller";

export interface Hideable {
  show: () => void;
  hide: () => void;
}

export class TabsNavigator {
  private keyToSetStateFns = new Map<string, (value: boolean) => void>();
  private keyToTabs = new Map<string, OnceCaller<[], Hideable>>();
  private hidePreviousTab: () => void = () => {};

  public constructor(private browserHistoryPusher: BrowserHistoryPusher) {}

  public add(
    tabKey: string,
    onStateChange: (callback: (newValue: boolean) => void) => void,
    setState: (value: boolean) => void,
    onClick: (callback: () => void) => void,
    tabFactoryOnce: OnceCaller<[], Hideable>
  ): this {
    this.keyToSetStateFns.set(tabKey, setState);
    this.keyToTabs.set(tabKey, tabFactoryOnce);
    onStateChange((newValue) => this.handleStateChange(tabKey, newValue));
    onClick(() => this.handleClick(tabKey));
    return this;
  }

  private handleStateChange(tabKey: string, newValue: boolean): void {
    if (newValue) {
      this.hidePreviousTab();
      this.keyToTabs.get(tabKey).call().show();
      this.hidePreviousTab = () => this.hideTab(tabKey);
    } else {
      this.keyToTabs.get(tabKey).call().hide();
    }
  }

  private hideTab(tabKey: string): void {
    let stateSetFn = this.keyToSetStateFns.get(tabKey);
    stateSetFn(undefined);
  }

  private handleClick(tabKey: string): void {
    let stateSetFn = this.keyToSetStateFns.get(tabKey);
    stateSetFn(true);
    this.browserHistoryPusher.push();
  }
}
