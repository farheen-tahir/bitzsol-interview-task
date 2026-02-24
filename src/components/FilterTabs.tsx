import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Filter } from '../hooks/useTodos';

type Props = {
  value: Filter;
  onChange: (v: Filter) => void;
};

const tabs: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

export default function FilterTabs({ value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {tabs.map(t => {
        const active = value === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabActive: {
    borderColor: '#111827',
    backgroundColor: '#111827',
  },
  text: { color: '#111827', fontWeight: '600' },
  textActive: { color: '#FFFFFF' },
});
