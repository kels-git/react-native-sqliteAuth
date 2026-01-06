// src/components/home/WelcomeCard.tsx
import React from 'react';
import { Card } from '@rneui/themed';
import { ResponsiveUi } from '../responsive-ui/responsive-ui';
import ContainerWrapper from '../wrappers-component/ContainerWrapper';
import { useTailwind } from 'tailwind-rn';
import { Icon } from '@rneui/themed';

interface WelcomeCardProps {
  userName: string;
}

const WelcomeCardComponent = ({ userName }: WelcomeCardProps) => {
  const tailwind = useTailwind();

  return (
    <Card containerStyle={[tailwind('rounded-2xl m-0 p-4'), { elevation: 3 }]}>
      <ContainerWrapper style={tailwind('flex-row items-center')}>
        <Icon name="wb-sunny" type="material" size={40} color="#FFD700" />
        <ContainerWrapper style={tailwind('ml-3 flex-1')}>
          <ResponsiveUi.Text bold fontSize={18}>
            Good Day!
          </ResponsiveUi.Text>
          <ResponsiveUi.Text regular fontSize={14} style={tailwind('mt-1')}>
            Welcome back, {userName?.split(' ')[0] || 'User'}
          </ResponsiveUi.Text>
        </ContainerWrapper>
      </ContainerWrapper>
    </Card>
  );
};

export default WelcomeCardComponent;