import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Todo } from '../types/todo';

type Props = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  const confirmDelete = () => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(todo.id),
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.card}>
      <Pressable style={styles.left} onPress={() => onToggle(todo.id)}>
        <View style={[styles.dot, todo.completed && styles.dotDone]} />
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.title, todo.completed && styles.titleDone]}
            numberOfLines={2}
          >
            {todo.title}
          </Text>
          <Text
            style={[
              styles.status,
              todo.completed ? styles.done : styles.pending,
            ]}
          >
            {todo.completed ? 'Completed' : 'Not Completed'}
          </Text>
        </View>
      </Pressable>

      <Pressable onPress={confirmDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  left: { flex: 1, flexDirection: 'row', gap: 12, alignItems: 'center' },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#9CA3AF',
  },
  dotDone: { borderColor: '#16A34A', backgroundColor: '#16A34A' },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  titleDone: { textDecorationLine: 'line-through', color: '#6B7280' },
  status: { marginTop: 6, fontSize: 12, fontWeight: '600' },
  done: { color: '#16A34A' },
  pending: { color: '#DC2626' },
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
  },
  deleteText: { fontWeight: '700', color: '#B91C1C' },
});
