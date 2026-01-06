import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, Alert, } from 'react-native';
import { ResponsiveUi } from 'src/components/responsive-ui/responsive-ui';
import ContainerWrapper from 'src/components/wrappers-component/ContainerWrapper';
import { SCREENS } from 'src/enums/screens/screens';
import { useAppDispatch, useAppSelector } from 'src/global/store/hooks';
import { logout } from 'src/global/auth/auth-slice';
import { RootStackScreenProps } from 'src/typings/navigation';
import { getColorValue } from 'src/utils/utils';
import { useTailwind } from 'tailwind-rn';
import { WeatherData } from 'src/typings/input-typings';
import UserHeaderComponent from 'src/components/user-header-component/user-header';
import WelcomeCardComponent from 'src/components/welcome-card-component/welcome-card-header';
import WeatherForecastComponent from 'src/components/weather-forecast-component/weather-forecast';
import QuickStatsComponent from 'src/components/quick-stats-component/quick-stat';
import AccountDetailsComponent from 'src/components/user-card-component/user-card';


const IndexHomeContainer = ({ navigation }: RootStackScreenProps<SCREENS.Home_page>) => {
    const user = useAppSelector(state => state.auth?.user);
    const dispatch = useAppDispatch();
    const tailwind = useTailwind();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = useCallback(async () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        setIsLoggingOut(true);
                        try {
                            await dispatch(logout()).unwrap();

                            navigation.reset({
                                index: 0,
                                routes: [{ name: SCREENS.Login_page }],
                            });

                            console.log('✅ Logout successful');
                        } catch (error: any) {
                            console.error('❌ Logout error:', error);
                            Alert.alert('Logout Failed', 'An error occurred during logout. Please try again.');
                        } finally {
                            setIsLoggingOut(false);
                        }
                    },
                },
            ]
        );
    }, [dispatch, navigation]);

    return (
        <SafeAreaView style={[tailwind('flex-1 bg-screen'), {}]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[tailwind('pb-5'), {}]}>

                <UserHeaderComponent
                    name={user?.name || ''}
                    email={user?.email || ''}
                    onLogout={handleLogout}
                    isLoggingOut={isLoggingOut} />

                <ContainerWrapper style={tailwind('px-5 mt-5')}>
                    <WelcomeCardComponent userName={user?.name || ''} />
                </ContainerWrapper>

                <WeatherForecastComponent />

                <ContainerWrapper style={tailwind('px-5 mt-5')}>
                    <QuickStatsComponent />
                </ContainerWrapper>

                <ContainerWrapper style={tailwind('px-5 mt-5')}>
                    <AccountDetailsComponent id={user?.id} name={user?.name} email={user?.email} />
                </ContainerWrapper>

                <ContainerWrapper style={tailwind('px-5 mt-5')}>
                    <ResponsiveUi.Button
                        regular
                        gradient={true}
                        fontSize={16}
                        title={isLoggingOut ? 'Logging out...' : 'Logout'}
                        colors={['#DC2626', '#CC3300']}
                        style={[tailwind('w-full')]}
                        action={() => { handleLogout() }}
                        disabled={isLoggingOut}
                    />
                </ContainerWrapper>

            </ScrollView>
        </SafeAreaView>
    );
};

export default IndexHomeContainer;