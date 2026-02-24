import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from '../types/todo';
import { fetchTodos } from '../api/todosApi';
import { loadTodos, saveTodos } from '../storage/todoStorage';
import { makeLocalId } from '../utils/id';

export type Filter = 'all' | 'pending' | 'completed';

const PAGE_SIZE = 10;

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [hasMore, setHasMore] = useState(true);

  const startRef = useRef(0);

  const hydrate = useCallback(async () => {
    setError(null);
    setLoading(true);
    setHasMore(true);
    startRef.current = 0;

    try {
      // optional: show cache first
      const cached = await loadTodos();
      if (cached && cached.length) {
        setTodos(cached);
        setLoading(false);
        return;
      }

      const firstPage = await fetchTodos(PAGE_SIZE, 0);
      setTodos(firstPage);
      await saveTodos(firstPage);

      startRef.current = firstPage.length;
      setHasMore(firstPage.length === PAGE_SIZE);
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    setHasMore(true);
    startRef.current = 0;

    try {
      const firstPage = await fetchTodos(PAGE_SIZE, 0);
      setTodos(firstPage);
      await saveTodos(firstPage);

      startRef.current = firstPage.length;
      setHasMore(firstPage.length === PAGE_SIZE);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    // Only infinite-scroll on "all" to avoid weird UX under filters
    if (filter !== 'all') return;

    if (loading || refreshing || loadingMore || !hasMore) return;

    setLoadingMore(true);
    setError(null);

    try {
      const next = await fetchTodos(PAGE_SIZE, startRef.current);

      // If API returns empty, no more pages
      if (!next.length) {
        setHasMore(false);
        return;
      }

      setTodos(prev => {
        // de-dupe by id
        const existingIds = new Set(prev.map(x => x.id));
        const merged = [...prev, ...next.filter(x => !existingIds.has(x.id))];
        saveTodos(merged).catch(() => {});
        return merged;
      });

      startRef.current += next.length;
      setHasMore(next.length === PAGE_SIZE);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load more');
    } finally {
      setLoadingMore(false);
    }
  }, [filter, hasMore, loading, refreshing, loadingMore]);

  const toggle = useCallback((id: number) => {
    setTodos(prev => {
      const next = prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      );
      saveTodos(next).catch(() => {});
      return next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setTodos(prev => {
      const next = prev.filter(t => t.id !== id);
      saveTodos(next).catch(() => {});
      return next;
    });
  }, []);

  const add = useCallback(async (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) throw new Error('Todo title cannot be empty');

    const newTodo: Todo = {
      id: makeLocalId(),
      title: trimmed,
      completed: false,
      local: true,
    };

    setTodos(prev => {
      const next = [newTodo, ...prev];
      saveTodos(next).catch(() => {});
      return next;
    });
  }, []);

  const filteredTodos = useMemo(() => {
    if (filter === 'pending') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  }, [todos, filter]);

  return {
    todos: filteredTodos,
    rawTodos: todos,
    loading,
    refreshing,
    loadingMore,
    error,
    filter,
    setFilter,
    hasMore,
    hydrate,
    onRefresh,
    loadMore,
    toggle,
    remove,
    add,
  };
}
