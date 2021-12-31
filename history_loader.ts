import { MessageDescriptor } from "@selfage/message/descriptor";
import { parseMessage } from "@selfage/message/parser";

export class HistoryLoader<T> {
  public state = this.stateDescriptor.factoryFn();

  public constructor(
    private stateDescriptor: MessageDescriptor<T>,
    private queryParamKey: string,
    private window: Window
  ) {}

  public static create<T>(
    stateDescriptor: MessageDescriptor<T>,
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

    parseMessage(stateObj, this.stateDescriptor, this.state);
  }
}
