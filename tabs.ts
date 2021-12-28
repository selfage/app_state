import { BrowserHistoryPusher } from "./browser_history_pusher";

export interface Removeable {
  remove: () => void,
}

class EmptyRemoveable implements Removeable {
  public remove(): void {}
}

export class TabsNavigator {
  private keyToSetStateFns = new Map<string, (value: boolean) => void>();
  private keyToTabFactoryFns = new Map<string, () => Removeable>();
  private previousTab: Removeable = new EmptyRemoveable();
  private removePreviousTab: () => void = () => {};

  public constructor(private browserHistoryPusher: BrowserHistoryPusher) {}

  public add(
    tabKey: string,
    onStateChange: (callback: (newValue: boolean) => void) => void,
    setStateFn: (value: boolean) => void,
    onClick: (callback: () => void) => void,
    createTabFactoryFn: () => Removeable,
  ): this {
    this.keyToSetStateFns.set(tabKey, setStateFn);
    this.keyToTabFactoryFns.set(tabKey, createTabFactoryFn);
    onStateChange((newValue) => this.handleStateChange(tabKey, newValue));
    onClick(() => this.handleClick(tabKey));
    return this;
  }

  private handleStateChange(tabKey: string, newValue: boolean): void {
    if (newValue) {
      this.removePreviousTab();
      this.previousTab = this.keyToTabFactoryFns.get(tabKey)();
      this.removePreviousTab = () => this.removeTab(tabKey);
    } else {
      this.previousTab.remove();
    }
  }

  private removeTab(tabKey: string): void {
    this.keyToSetStateFns.get(tabKey)(undefined);
  }

  private handleClick(tabKey: string): void {
    this.keyToSetStateFns.get(tabKey)(true);
    this.browserHistoryPusher.push();
  }
}
