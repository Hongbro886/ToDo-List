import type { ExtensionFactoryApi } from "../types/host";
import { useTodoItems } from "../shared/todo";
import { exportTodoFile, importTodoFile } from "../shared/io";

export function createSettingsPage(api: ExtensionFactoryApi) {
  const React = api.React;
  const { Box, Button, VStack, Text } = api.ChakraUI;

  function SettingsPage() {
    const { items, writeItems } = useTodoItems(api);

    function handleExport() {
      void exportTodoFile(items);
    }

    async function handleImport() {
      try {
        const imported = await importTodoFile();
        void writeItems(imported);
      } catch {
        // ignore error
      }
    }

    return React.createElement(
      VStack,
      { align: "stretch", spacing: 4 },
      React.createElement(
        Box,
        null,
        React.createElement(Text, { fontSize: "sm", fontWeight: "bold", mb: 2 }, "数据管理"),
        React.createElement(
          VStack,
          { align: "stretch", spacing: 2 },
          React.createElement(
            Button,
            { size: "sm", onClick: handleExport },
            "导出数据"
          ),
          React.createElement(
            Button,
            { size: "sm", onClick: handleImport },
            "导入数据"
          )
        )
      )
    );
  }

  return {
    settingsPage: {
      Component: SettingsPage,
    },
  };
}