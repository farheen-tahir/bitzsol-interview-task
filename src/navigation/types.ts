import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Routes } from './routes';

export type RootStackParamList = {
  [Routes.Splash]: undefined;
  [Routes.Home]: undefined;
};

export type SplashScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof Routes.Splash
>;

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof Routes.Home
>;
