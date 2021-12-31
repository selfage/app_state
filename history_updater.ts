export class HistoryUpdater {
  public constructor(
    private state: any,
    private queryParamKey: string,
    private window: Window
  ) {}

  public static create(state: any, queryParamKey: string): HistoryUpdater {
    return new HistoryUpdater(state, queryParamKey, window);
  }

  public push(): void {
    this.window.history.pushState(undefined, "", this.stringifyToUrl());
  }

  public replace(): void {
    this.window.history.replaceState(undefined, "", this.stringifyToUrl());
  }

  private stringifyToUrl(): string {
    let url = new URL(this.window.location.href);
    url.searchParams.set(this.queryParamKey, JSON.stringify(this.state));
    return url.href;
  }
}
