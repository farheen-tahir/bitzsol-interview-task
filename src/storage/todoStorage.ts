import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '../types/todo';

const KEY = 'todos_cache_v1';

export async function saveTodos(todos: Todo[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(todos));
}

export async function loadTodos(): Promise<Todo[] | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Todo[];
    if (!Array.isArray(parsed)) return null;
    return parsed.map(t => ({
      id: Number(t.id),
      title: String(t.title ?? ''),
      completed: Boolean(t.completed),
      local: Boolean((t as any).local),
    }));
  } catch {
    return null;
  }
}

export async function clearTodos() {
  await AsyncStorage.removeItem(KEY);
}
