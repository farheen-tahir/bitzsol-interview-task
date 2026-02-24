import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Routes } from './routes';
import type { RootStackParamList } from './types';

import SplashScreen from '../screens/SplashScreen';
import TodoScreen from '../screens/ToDoScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Routes.Splash}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name={Routes.Splash} component={SplashScreen} />
        <Stack.Screen name={Routes.Home} component={TodoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
