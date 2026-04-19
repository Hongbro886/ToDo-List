import type { ExtensionFactory, ExtensionFactoryApi } from "./types/host";
import { createExamplePage } from "./pages/example-page";
import { createSettingsPage } from "./pages/settings-page";
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
    homeWidgets: [
      {
        key: "home-todo",
        title: "TODO",
        defaultWidth: 320,
        minWidth: 280,
        Component: createHomeTodoWidget(api),
      },
    ],
    settingsPage: {
      Component: createSettingsPage(api),
    },
    pages: [
      {
        routePath: "example",
        Component: createExamplePage(api, false),
      },
      {
        routePath: "example-standalone",
        isStandAlone: true,
        Component: createExamplePage(api, true),
      },
    ],
  };
});
