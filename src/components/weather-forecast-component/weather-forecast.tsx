// src/components/home/WeatherForecast.tsx
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, Icon } from '@rneui/themed';
import { ResponsiveUi } from '../responsive-ui/responsive-ui';
import ContainerWrapper from '../wrappers-component/ContainerWrapper';
import { useTailwind } from 'tailwind-rn';
import { WeatherData } from 'src/typings/input-typings';



const WeatherForecastComponent = ({ }) => {
    const tailwind = useTailwind();

    const [weatherData, _setWeatherData] = useState<WeatherData[]>([
        { day: 'Mon', temp: '28°C', condition: 'Sunny', icon: 'weather-sunny' },
        { day: 'Tue', temp: '26°C', condition: 'Cloudy', icon: 'weather-cloudy' },
        { day: 'Wed', temp: '24°C', condition: 'Rainy', icon: 'weather-rainy' },
        { day: 'Thu', temp: '27°C', condition: 'Partly Cloudy', icon: 'weather-partly-cloudy' },
        { day: 'Fri', temp: '29°C', condition: 'Sunny', icon: 'weather-sunny' },
    ]);

    return (
        <ContainerWrapper style={tailwind('px-5 mt-5')}>
            <ContainerWrapper style={tailwind('flex-row items-center justify-between mb-3')}>
                <ResponsiveUi.Text bold fontSize={20}>
                    Weather Forecast
                </ResponsiveUi.Text>
                <Icon name="cloud" type="material" size={24} color="#326FD1" />
            </ContainerWrapper>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {weatherData.map((weather, index) => (
                    <Card
                        key={index}
                        containerStyle={[
                            tailwind('rounded-2xl m-0 mr-3 mb-2'),
                            { width: 100, elevation: 2 }
                        ]}>
                        <ContainerWrapper style={tailwind('items-center')}>
                            <ResponsiveUi.Text bold fontSize={14}>
                                {weather.day}
                            </ResponsiveUi.Text>
                            <Icon
                                name={weather.icon}
                                type="material-community"
                                size={40}
                                color="#326FD1"
                                style={tailwind('my-2')}
                            />
                            <ResponsiveUi.Text bold fontSize={18}>
                                {weather.temp}
                            </ResponsiveUi.Text>
                            <ResponsiveUi.Text regular fontSize={10} style={tailwind('mt-1 text-center')}>
                                {weather.condition}
                            </ResponsiveUi.Text>
                        </ContainerWrapper>
                    </Card>
                ))}
            </ScrollView>
        </ContainerWrapper>
    );
};

export default WeatherForecastComponent;