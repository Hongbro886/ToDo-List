import type { TodoItem } from "./todo";

const FILE_NAME = "todo.json";

export function exportTodoFile(items: TodoItem[]): void {
  const blob = new Blob([JSON.stringify(items, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = FILE_NAME;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function importTodoFile(file: File): Promise<TodoItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          reject(new Error("Invalid format"));
          return;
        }
        const items: TodoItem[] = parsed.map((item) => ({
          id: typeof item.id === "string" ? item.id : String(Date.now()),
          text: typeof item.text === "string" ? item.text : "",
          done: item.done === true,
        }));
        resolve(items);
      } catch {
        reject(new Error("Parse error"));
      }
    };
    reader.onerror = () => reject(new Error("Read error"));
    reader.readAsText(file);
  });
}