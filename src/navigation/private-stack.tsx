
import React from "react";
import { SCREENS } from "src/enums/screens/screens";
import { RootStackParamList } from "src/typings/navigation";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IndexLoginEmailContainer, IndexRegisterEmailContainer } from "src/container";
import { HomeStack } from "./home-stack";
import { useAppSelector } from "src/global/store/hooks";

const Stack = createNativeStackNavigator<RootStackParamList>();


export const PrivateStack = () => {
    
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    return (
        <Stack.Navigator
            initialRouteName={isAuthenticated ? SCREENS.Home_stack : SCREENS.Login_page}
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
            }}>

            {isAuthenticated ? (
                <Stack.Group>
                    <Stack.Screen
                        name={SCREENS.Home_stack}
                        component={HomeStack}
                        options={{ animation: 'slide_from_bottom' }}
                    />
                </Stack.Group>
            ) : (
                <Stack.Group>
                    <Stack.Screen
                        name={SCREENS.Login_page}
                        component={IndexLoginEmailContainer}
                        options={{ animation: 'slide_from_left' }}
                    />
                    <Stack.Screen
                        name={SCREENS.Register_page}
                        component={IndexRegisterEmailContainer}
                        options={{ animation: 'slide_from_left' }}
                    />
                </Stack.Group>
            )}
        </Stack.Navigator>
    );
};