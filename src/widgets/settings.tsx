import type { ExtensionFactoryApi } from "../types/host";
import { useTodoItems } from "../shared/todo";
import { exportTodoFile } from "../shared/io";

export function createSettingsPage(api: ExtensionFactoryApi) {
  const React = api.React;
  const { Box, Button, VStack, Text, useToast } = api.ChakraUI;

  function SettingsPage() {
    const { items, writeItems } = useTodoItems(api);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const toast = useToast();

    function handleExport() {
      try {
        exportTodoFile(items);
        toast({
          title: "导出成功",
          description: `已导出 ${items.length} 条数据`,
          status: "success",
          duration: 3000,
          position: "bottom-left",
        });
      } catch {
        toast({
          title: "导出失败",
          description: "文件导出失败，请重试",
          status: "error",
          duration: 3000,
          position: "bottom-left",
        });
      }
    }

    function handleImportClick() {
      fileInputRef.current?.click();
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;

      // 检查文件类型
      if (!file.name.endsWith(".json")) {
        toast({
          title: "导入失败",
          description: "请选择 JSON 格式文件",
          status: "error",
          duration: 3000,
          position: "bottom-left",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const parsed = JSON.parse(text);
          if (!Array.isArray(parsed)) throw new Error("Invalid format");
          void writeItems(parsed);
          toast({
            title: "导入成功",
            description: `已导入 ${parsed.length} 条数据`,
            status: "success",
            duration: 3000,
            position: "bottom-left",
          });
        } catch {
          toast({
            title: "导入失败",
            description: "文件格式错误，无法解析",
            status: "error",
            duration: 3000,
            position: "bottom-left",
          });
        } finally {
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.onerror = () => {
        toast({
          title: "导入失败",
          description: "文件读取失败",
          status: "error",
          duration: 3000,
          position: "bottom-left",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsText(file);
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