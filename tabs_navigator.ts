import { BrowserHistoryPusher } from "./browser_history_pusher";

export interface Hideable {
  show: () => void;
  hide: () => void;
}

export class TabsNavigator {
  private keyToTabFactoryFns = new Map<string, () => Hideable>();
  private keyToStateSettFns = new Map<string, (value: boolean) => void>();
  private keyToTabs = new Map<string, Hideable>();
  private previousTabKey: string;

  public constructor(
    private browserHistoryPusher: BrowserHistoryPusher
  ) {}

  public add(
    tabKey: string,
    onStateChange: (callback: (newValue: boolean) => void) => void,
    stateSetFn: (value: boolean) => void,
    onClick: (callback: () => void) => void,
    tabFactoryFn: () => Hideable
  ): this {
    this.keyToStateSettFns.set(tabKey, stateSetFn);
    this.keyToTabFactoryFns.set(tabKey, tabFactoryFn);
    onStateChange((newValue) => this.handleStateChange(tabKey, newValue));
    onClick(() => this.handleClick(tabKey));
    return this;
  }

  private handleStateChange(tabKey: string, newValue: boolean): void {
    if (newValue) {
      if (this.previousTabKey) {
        let stateSetFn = this.keyToStateSettFns.get(tabKey);
        stateSetFn(undefined);
      }
      this.previousTabKey = tabKey;
      let tab = this.keyToTabs.get(tabKey);
      if (!tab) {
        let tabFactoryFn = this.keyToTabFactoryFns.get(tabKey);
        tab = tabFactoryFn();
        this.keyToTabs.set(tabKey, tab);
      }
      tab.show();
    } else {
      this.keyToTabs.get(tabKey).hide();
    }
  }

  private handleClick(tabKey: string): void {
    let stateSetFn = this.keyToStateSettFns.get(tabKey);
    stateSetFn(true);
    this.browserHistoryPusher.push();
  }
}
