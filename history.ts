import { MessageDescriptor } from "@selfage/message/descriptor";
import { parseMessage } from "@selfage/message/parser";

export class HistoryTracker<State> {
  private static STATEFUL_QUERY_PARAM = "q";

  public constructor(
    public state: State,
    private stateDescriptor: MessageDescriptor<State>,
    private window: Window
  ) {}

  public static create<State>(
    defaultState: State,
    stateDescriptor: MessageDescriptor<State>
  ): HistoryTracker<State> {
    return new HistoryTracker(defaultState, stateDescriptor, window).init();
  }

  public init(): this {
    this.window.addEventListener("popstate", () => {
      this.loadState();
    });
    this.loadState();
    return this;
  }

  private loadState(): void {
    let queryParams = new URLSearchParams(this.window.location.search);
    let stateStr = queryParams.get(HistoryTracker.STATEFUL_QUERY_PARAM);
    if (stateStr) {
      try {
        this.state = parseMessage(JSON.parse(stateStr), this.stateDescriptor);
      } catch (e) {
        // Do nothing.
      }
    }
  }

  public pushState(): void {
    let url = new URL(this.window.location.href);
    url.searchParams.set(
      HistoryTracker.STATEFUL_QUERY_PARAM,
      JSON.stringify(this.state)
    );
    this.window.history.pushState(undefined, "", url.href);
  }
}
