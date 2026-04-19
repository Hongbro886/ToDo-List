import type { ExtensionFactoryApi } from "../types/host";
import { useTodoItems, TodoItem } from "../shared/todo";

export function createHomeTodoWidget(api: ExtensionFactoryApi) {
  const React = api.React;
  const { Box, Button, HStack, Input, Text, VStack } = api.ChakraUI;

  return function HomeTodoWidget() {
    const { items, hasLoaded, writeItems } = useTodoItems(api);
    const [inputValue, setInputValue] = React.useState("");

    const todoItems = items.filter((item) => !item.done);
    const doneItems = items.filter((item) => item.done);

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
      React.createElement(Input, {
        size: "sm",
        placeholder: "添加TODO，按Enter",
        value: inputValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setInputValue(e.target.value),
        onKeyDown: handleKeyDown,
      }),
      hasLoaded
        ? React.createElement(
            React.Fragment,
            null,
            todoItems.length > 0 &&
              React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  Text,
                  { fontSize: "xs", color: "gray.500", mt: 2 },
                  "TODO"
                ),
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
                          borderRadius: "sm",
                          border: "1px solid",
                          borderColor: "gray.400",
                          flexShrink: 0,
                        }
                      ),
                      React.createElement(Text, { fontSize: "sm" }, item.text)
                    )
                  )
                )
              ),
            doneItems.length > 0 &&
              React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  Text,
                  { fontSize: "xs", color: "gray.500", mt: 2 },
                  "DONE"
                ),
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
                        Box,
                        {
                          w: 4,
                          h: 4,
                          borderRadius: "sm",
                          bg: "green.400",
                          flexShrink: 0,
                        }
                      ),
                      React.createElement(
                        Text,
                        { fontSize: "sm", textDecoration: "line-through", color: "gray.500" },
                        item.text
                      )
                    )
                  )
                )
              )
          )
        : null
    );
  };
}