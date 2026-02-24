import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function EmptyState({ title }: { title: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>Add a new task or change the filter.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: '#111827' },
  sub: { marginTop: 6, color: '#6B7280', fontWeight: '600' },
});
