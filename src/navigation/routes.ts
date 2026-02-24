export const Routes = {
  Splash: 'Splash',
  Home: 'Home',
} as const;

export type RouteName = (typeof Routes)[keyof typeof Routes];
