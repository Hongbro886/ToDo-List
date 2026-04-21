import type { TodoItem } from "./todo";

export async function exportTodoFile(items: TodoItem[]): Promise<void> {
  const handle = await window.showSaveFilePicker({
    suggestedName: "todo.json",
    types: [
      {
        description: "JSON File",
        accept: { "application/json": [".json"] },
      },
    ],
  });
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(items, null, 2));
  await writable.close();
}

export async function importTodoFile(): Promise<TodoItem[]> {
  const [handle] = await window.showOpenFilePicker({
    types: [
      {
        description: "JSON File",
        accept: { "application/json": [".json"] },
      },
    ],
  });
  const file = await handle.getFile();
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid format");
  }
  const items: TodoItem[] = parsed.map((item) => ({
    id: typeof item.id === "string" ? item.id : String(Date.now()),
    text: typeof item.text === "string" ? item.text : "",
    done: item.done === true,
  }));
  return items;
}