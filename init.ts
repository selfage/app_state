import { HistoryLoader } from "./history_loader";
import { HistoryUpdater } from "./history_updater";
import { MessageDescriptor } from "@selfage/message/descriptor";

export function createLoaderAndUpdater<T>(
  stateDescriptor: MessageDescriptor<T>,
  queryParamKey: string
): [HistoryLoader<T>, HistoryUpdater] {
  let loader = HistoryLoader.create(stateDescriptor, queryParamKey);
  let updater = HistoryUpdater.create(loader.state, queryParamKey);
  return [loader, updater];
}
