import { MessageDescriptor } from "@selfage/message/descriptor";
import { parseMessage } from "@selfage/message/parser";

export class BrowserHistoryTracker<T> {
  public state: T;

  public constructor(
    private defaultState: T,
    private stateDescriptor: MessageDescriptor<T>,
    private queryParamKey: string,
    private window: Window
  ) {}

  public init(): this {
    this.state = this.stateDescriptor.factoryFn();
    return this;
  }

  public initLoad(): this {
    this.load();
    this.window.addEventListener("popstate", () => this.load());
    return this;
  }

  private load(): void {
    let stateStr = new URLSearchParams(this.window.location.search).get(
      this.queryParamKey
    );
    parseMessage(
      this.parseJsonState(stateStr),
      this.stateDescriptor,
      this.state
    );
  }

  private parseJsonState(stateStr: string): any {
    if (stateStr) {
      try {
        return JSON.parse(stateStr);
      } catch (e) {
        return this.defaultState;
      }
    } else {
      return this.defaultState;
    }
  }
}
