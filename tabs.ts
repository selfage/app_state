export interface Tab {
  show: () => Promise<void> | void;
  hide: () => Promise<void> | void;
}

export class TabNavigator {
  public show: (tab: Tab) => Promise<void>;
  private lastShownTab: Tab;

  public constructor() {
    this.show = this.showOnly;
  }

  private async showOnly(tab: Tab): Promise<void> {
    await tab.show();
    this.lastShownTab = tab;
    this.show = this.hideAndshow;
  }

  private async hideAndshow(tab: Tab): Promise<void> {
    await this.lastShownTab.hide();
    await tab.show();
    this.lastShownTab = tab;
  }
}
