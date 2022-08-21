import { ObservableDescriptor } from "@selfage/observable/descriptor";
import { parseObservable } from "@selfage/observable/parser";

export class HistoryLoader<T> {
  public state = new this.stateDescriptor.constructor();

  public constructor(
    private stateDescriptor: ObservableDescriptor<T>,
    private queryParamKey: string,
    private window: Window
  ) {}

  public static create<T>(
    stateDescriptor: ObservableDescriptor<T>,
    queryParamKey: string
  ): HistoryLoader<T> {
    return new HistoryLoader(stateDescriptor, queryParamKey, window).init();
  }

  public init(): this {
    this.load();
    this.window.addEventListener("popstate", () => this.load());
    return this;
  }

  private load(): void {
    let stateStr = new URLSearchParams(this.window.location.search).get(
      this.queryParamKey
    );
    let stateObj: any;
    if (stateStr) {
      try {
        stateObj = JSON.parse(stateStr);
      } catch (e) {
        stateObj = {};
      }
    } else {
      stateObj = {};
    }
    parseObservable(stateObj, this.stateDescriptor, this.state);
  }
}
