import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackParams } from '../typings/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PrivateStack } from './private-stack';
import { SCREENS } from 'src/enums/screens/screens';
import { useloading } from 'src/services/load/loading-services';
import ContainerWrapper from 'src/components/wrappers-component/ContainerWrapper';
import LoadingLottieComponent from 'src/components/loading-component/loading-component';
import { StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator<StackParams>();

export const RootNavigation = () => {

  const { isloading } = useloading();

  return (
    <SafeAreaProvider>
      <Stack.Navigator initialRouteName={SCREENS.Main_stack} screenOptions={{ headerShown: false, orientation: 'portrait' }}>
        <Stack.Screen name={SCREENS.Main_stack} component={PrivateStack} />
      </Stack.Navigator>
      {(isloading) && (
        <ContainerWrapper style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.8)' }]}>
          <LoadingLottieComponent />
        </ContainerWrapper>
      )}
    </SafeAreaProvider>
  );
};
