import { HistoryLoader } from "./history_loader";
import { HistoryUpdater } from "./history_updater";
import { ObservableDescriptor } from "@selfage/observable/descriptor";

export function createLoaderAndUpdater<T>(
  stateDescriptor: ObservableDescriptor<T>,
  queryParamKey: string
): [HistoryLoader<T>, HistoryUpdater] {
  let loader = HistoryLoader.create(stateDescriptor, queryParamKey);
  let updater = HistoryUpdater.create(loader.state, queryParamKey);
  return [loader, updater];
}
