import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import TodoItem from '../components/ToDoItem';
import FilterTabs from '../components/FilterTabs';
import EmptyState from '../components/EmptyState';
import { useTodos } from '../hooks/useTodos';

export default function TodoScreen() {
  const {
    todos,
    loading,
    refreshing,
    loadingMore,
    error,
    filter,
    setFilter,
    onRefresh,
    loadMore,
    toggle,
    remove,
    add,
    hydrate,
  } = useTodos();

  const [title, setTitle] = useState('');

  const headerTitle = useMemo(() => {
    if (filter === 'pending') return 'Pending Tasks';
    if (filter === 'completed') return 'Completed Tasks';
    return 'All Tasks';
  }, [filter]);

  const onAdd = async () => {
    try {
      await add(title);
      setTitle('');
      Keyboard.dismiss();
    } catch (e: any) {
      Alert.alert('Validation', e?.message ?? 'Invalid todo');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.h1}>Todo List</Text>
        <Text style={styles.h2}>{headerTitle}</Text>
      </View>

      <View style={styles.addWrap}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Add a new task..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={onAdd}
        />
        <Pressable style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      <FilterTabs value={filter} onChange={setFilter} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.centerText}>Loading todos...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={hydrate}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={todos.length ? undefined : { paddingTop: 20 }}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onToggle={toggle}
              onDelete={id => remove(id)}
            />
          )}
          ListEmptyComponent={<EmptyState title="No todos found" />}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.6}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 16 }}>
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F7FB' },
  header: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  h1: { fontSize: 26, fontWeight: '900', color: '#111827' },
  h2: { marginTop: 4, fontSize: 13, fontWeight: '700', color: '#6B7280' },

  addWrap: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  input: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EEF2F7',
    fontWeight: '700',
    color: '#111827',
  },
  addBtn: {
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: { color: '#FFFFFF', fontWeight: '900' },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  centerText: { marginTop: 10, color: '#6B7280', fontWeight: '700' },

  errorTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },
  errorText: {
    marginTop: 6,
    color: '#6B7280',
    fontWeight: '700',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 14,
    backgroundColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  retryText: { color: '#FFFFFF', fontWeight: '900' },
});
