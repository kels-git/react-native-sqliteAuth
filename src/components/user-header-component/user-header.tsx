// src/components/home/UserHeader.tsx
import React from 'react';
import { View } from 'react-native';
import { Avatar, Icon } from '@rneui/themed';
import { ResponsiveUi } from '../responsive-ui/responsive-ui';
import ContainerWrapper from '../wrappers-component/ContainerWrapper';
import { useTailwind } from 'tailwind-rn';
import { getColorValue } from 'src/utils/utils';

interface UserHeaderProps {
    name?: string;
    email?: string;
    onLogout?: () => void;
    isLoggingOut?: boolean;
}

const UserHeaderComponent = ({ name, email, onLogout, isLoggingOut }: UserHeaderProps) => {
    const tailwind = useTailwind();
    const whiteColor = getColorValue('text-white-pure', tailwind);

    return (
        <ContainerWrapper style={[tailwind('bg-primary pt-10 pb-5 px-5 rounded-b-3xl'), { elevation: 5 }]}>
            <ContainerWrapper style={tailwind('flex-row items-center justify-between')}>
                <ContainerWrapper style={tailwind('flex-row items-center')}>
                    <Avatar
                        size={60}
                        rounded
                        title={name?.charAt(0).toUpperCase() || 'U'}
                        containerStyle={{ backgroundColor: '#E7FCFF' }}
                        titleStyle={{ color: '#326FD1' }}
                    />
                    <ContainerWrapper style={tailwind('ml-3')}>
                        <ResponsiveUi.Text bold fontSize={20} color={whiteColor}>
                            {name || 'User'}
                        </ResponsiveUi.Text>
                        <ContainerWrapper style={tailwind('flex-row items-center mt-1')}>
                            <Icon name="email" type="material" size={14} color={whiteColor} />
                            <ResponsiveUi.Text regular fontSize={12} color={whiteColor} style={tailwind('ml-1')}>
                                {email || 'No email'}
                            </ResponsiveUi.Text>
                        </ContainerWrapper>
                    </ContainerWrapper>
                </ContainerWrapper>

                <Icon
                    name="logout"
                    type="material"
                    size={28}
                    color={whiteColor}
                    onPress={onLogout}
                    disabled={isLoggingOut}
                />
            </ContainerWrapper>
        </ContainerWrapper>
    );
};

export default UserHeaderComponent;