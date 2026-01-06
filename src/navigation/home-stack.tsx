import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS } from '../enums/screens/screens';
import { HomeStackParamList, RootStackScreenProps } from 'src/typings/navigation';
import { IndexHomeContainer } from 'src/container';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = ({ }: RootStackScreenProps<SCREENS.Home_stack>) => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.Home_page}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}>
      <Stack.Screen
        name={SCREENS.Home_page}
        component={IndexHomeContainer}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};
