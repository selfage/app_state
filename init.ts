import { BrowserHistoryPusher } from "./browser_history_pusher";
import { BrowserHistoryTracker } from "./browser_history_tracker";
import { MessageDescriptor } from "@selfage/message/descriptor";

export function createTrackerAndPusher<T>(
  defaultState: T,
  stateDescriptor: MessageDescriptor<T>,
  queryParamKey: string
): [BrowserHistoryTracker<T>, BrowserHistoryPusher] {
  let tracker = new BrowserHistoryTracker<T>(
    defaultState,
    stateDescriptor,
    queryParamKey,
    window
  ).init();
  return [
    tracker,
    new BrowserHistoryPusher(tracker.state, queryParamKey, window),
  ];
}
