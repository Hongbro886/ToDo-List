import type { ExtensionFactoryApi } from "../types/host";

const TODO_FILE = "todo.json";
const TODO_STATE_KEY = "todoItems";
const TODO_READY_STATE_KEY = "todoReady";
let initPromise: Promise<TodoItem[]> | null = null;

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

function normalizeTodoItems(parsed: unknown): TodoItem[] {
  if (Array.isArray(parsed)) {
    return parsed.map((item) => ({
      id: typeof item.id === "string" ? item.id : String(Date.now()),
      text: typeof item.text === "string" ? item.text : "",
      done: item.done === true,
    }));
  }
  return [];
}

async function writeTodoFile(
  host: ReturnType<ExtensionFactoryApi["getHostContext"]>,
  items: TodoItem[]
) {
  await host.actions.writeFile(TODO_FILE, `${JSON.stringify(items, null, 2)}\n`);
}

async function readTodoFile(
  host: ReturnType<ExtensionFactoryApi["getHostContext"]>
): Promise<TodoItem[]> {
  try {
    const raw = await host.actions.readFile(TODO_FILE);
    return normalizeTodoItems(JSON.parse(raw));
  } catch (_) {
    return [];
  }
}

export function useTodoItems(api: ExtensionFactoryApi) {
  const React = api.React;
  const host = api.getHostContext();
  const [items, setItems] = host.state.useExtensionState<TodoItem[]>(
    TODO_STATE_KEY,
    []
  );
  const [hasLoaded, setHasLoaded] = host.state.useExtensionState(
    TODO_READY_STATE_KEY,
    false
  );

  React.useEffect(
    function ensureTodoLoaded() {
      if (hasLoaded) {
        return;
      }

      let cancelled = false;

      if (!initPromise) {
        initPromise = readTodoFile(api.getHostContext());
      }

      void initPromise.then(function applyLoadedItems(loadedItems) {
        if (!cancelled) {
          setItems(loadedItems);
          setHasLoaded(true);
        }
      });

      return function cleanup() {
        cancelled = true;
      };
    },
    [api, hasLoaded, setHasLoaded, setItems]
  );

  const writeItems = React.useCallback(
    async function writeItems(nextItems: TodoItem[]) {
      setItems(nextItems);
      setHasLoaded(true);
      await writeTodoFile(api.getHostContext(), nextItems);
      return nextItems;
    },
    [api, setHasLoaded, setItems]
  );

  return {
    items,
    hasLoaded,
    writeItems,
  };
}