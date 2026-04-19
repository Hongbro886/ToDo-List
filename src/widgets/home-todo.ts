import type { ExtensionFactoryApi } from "../types/host";
import { useTodoItems, TodoItem } from "../shared/todo";

export function createHomeTodoWidget(api: ExtensionFactoryApi) {
  const React = api.React;
  const { Box, Button, HStack, Input, Text, VStack, IconButton } = api.ChakraUI;

  function HomeTodoWidget() {
    const { items, hasLoaded, writeItems } = useTodoItems(api);
    const [inputValue, setInputValue] = React.useState("");

    const todoItems = items.filter((item) => !item.done);

    function handleAddTodo() {
      const text = inputValue.trim();
      if (!text) return;

      const newItem: TodoItem = {
        id: String(Date.now()),
        text,
        done: false,
      };
      void writeItems([...items, newItem]);
      setInputValue("");
    }

    function handleToggleItem(item: TodoItem) {
      void writeItems(
        items.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i))
      );
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Enter") {
        handleAddTodo();
      }
    }

    return React.createElement(
      VStack,
      { align: "stretch", spacing: 3 },
      React.createElement(Text, { fontSize: "sm", fontWeight: "bold" }, "TODO"),
      React.createElement(
        HStack,
        null,
        React.createElement(Input, {
          size: "sm",
          borderRadius: "md",
          placeholder: "添加TODO，按Enter",
          value: inputValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value),
          onKeyDown: handleKeyDown,
          flex: 1,
        }),
        React.createElement(IconButton, {
          "aria-label": "下一步",
          icon: React.createElement(Text, null, "→"),
          size: "sm",
          onClick: handleAddTodo,
        })
      ),
      hasLoaded
        ? todoItems.length > 0 &&
            React.createElement(
              VStack,
              { align: "stretch", spacing: 1 },
              todoItems.map((item) =>
                React.createElement(
                  HStack,
                  {
                    key: item.id,
                    as: Button,
                    variant: "ghost",
                    size: "sm",
                    justifyContent: "flex-start",
                    onClick: () => handleToggleItem(item),
                  },
                  React.createElement(
                    Box,
                    {
                      w: 4,
                      h: 4,
                      borderRadius: "md",
                      border: "1px solid",
                      borderColor: "gray.400",
                      flexShrink: 0,
                    }
                  ),
                  React.createElement(Text, { fontSize: "sm" }, item.text)
                )
              )
            )
        : null
    );
  }

  function HomeDoneWidget() {
    const { items, hasLoaded, writeItems } = useTodoItems(api);
    const doneItems = items.filter((item) => item.done);

    function handleToggleItem(item: TodoItem) {
      void writeItems(
        items.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i))
      );
    }

    function handleRestoreAll() {
      void writeItems(
        items.map((i) => (i.done ? { ...i, done: false } : i))
      );
    }

    function handleClearAll() {
      void writeItems(items.filter((i) => !i.done));
    }

    return React.createElement(
      VStack,
      { align: "stretch", spacing: 3 },
      React.createElement(
        HStack,
        { justifyContent: "space-between" },
        React.createElement(Text, { fontSize: "sm", fontWeight: "bold" }, "DONE"),
        hasLoaded && doneItems.length > 0
          ? React.createElement(
              HStack,
              { spacing: 1 },
              React.createElement(
                Button,
                { size: "xs", variant: "ghost", onClick: handleRestoreAll },
                "还原"
              ),
              React.createElement(
                Button,
                { size: "xs", variant: "ghost", colorScheme: "red", onClick: handleClearAll },
                "清空"
              )
            )
          : null
      ),
      hasLoaded
        ? doneItems.length > 0 &&
            React.createElement(
              VStack,
              { align: "stretch", spacing: 1 },
              doneItems.map((item) =>
                React.createElement(
                  HStack,
                  {
                    key: item.id,
                    as: Button,
                    variant: "ghost",
                    size: "sm",
                    justifyContent: "flex-start",
                    onClick: () => handleToggleItem(item),
                  },
                  React.createElement(
                    Text,
                    { fontSize: "sm", textDecoration: "line-through", color: "gray.500" },
                    item.text
                  )
                )
              )
            )
        : null
    );
  }

  return {
    homeWidgets: [
      {
        key: "todo",
        title: "TODO",
        description: "待办事项",
        icon: "checkbox",
        Component: HomeTodoWidget,
      },
      {
        key: "done",
        title: "DONE",
        description: "已完成事项",
        icon: "check-circle",
        Component: HomeDoneWidget,
      },
    ],
  };
}
