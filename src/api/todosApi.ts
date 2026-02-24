import { Todo } from '../types/todo';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function fetchTodos(limit = 10, start = 0): Promise<Todo[]> {
  const url = `${BASE_URL}/todos?_start=${start}&_limit=${limit}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch todos (HTTP ${res.status})`);

  const data = (await res.json()) as Todo[];
  return data.map(t => ({
    id: Number(t.id),
    title: String(t.title ?? ''),
    completed: Boolean(t.completed),
  }));
}
