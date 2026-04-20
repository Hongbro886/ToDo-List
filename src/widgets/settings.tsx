import type { ExtensionFactoryApi } from "../types/host";
import { useTodoItems } from "../shared/todo";
import { exportTodoFile, importTodoFile } from "../shared/io";

export function createSettingsPage(api: ExtensionFactoryApi) {
  const React = api.React;
  const { Box, Button, VStack, Text } = api.ChakraUI;

  function SettingsPage() {
    const { items, writeItems } = useTodoItems(api);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    function handleExport() {
      exportTodoFile(items);
    }

    function handleImportClick() {
      fileInputRef.current?.click();
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;
      void importTodoFile(file)
        .then((imported) => {
          void writeItems(imported);
        })
        .catch(() => {
          // ignore error
        })
        .finally(() => {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        });
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
            { size: "sm", onClick: handleImportClick },
            "导入数据"
          )
        ),
        React.createElement("input", {
          ref: fileInputRef,
          type: "file",
          accept: ".json",
          style: { display: "none" },
          onChange: handleFileChange,
        })
      )
    );
  }

  return {
    settingsPage: {
      Component: SettingsPage,
    },
  };
}