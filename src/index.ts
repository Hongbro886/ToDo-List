import type { ExtensionFactory, ExtensionFactoryApi } from "./types/host";
import { createHomeTodoWidget } from "./widgets/home-todo";

(function registerExampleExtension(factory: ExtensionFactory) {
  const token = document.currentScript?.dataset?.extensionToken || "";

  if (!token) {
    throw new Error("Missing extension activation token");
  }

  if (typeof window.registerExtension !== "function") {
    throw new Error("SJMCL host is unavailable");
  }

  window.registerExtension(factory, token);
})(function createExtension(api: ExtensionFactoryApi) {
  return {
    homeWidgets: createHomeTodoWidget(api).homeWidgets,
  };
});
