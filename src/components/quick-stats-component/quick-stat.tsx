// src/components/home/QuickStats.tsx
import React from 'react';
import { Card, Icon } from '@rneui/themed';
import { ResponsiveUi } from '../responsive-ui/responsive-ui';
import ContainerWrapper from '../wrappers-component/ContainerWrapper';
import { useTailwind } from 'tailwind-rn';

interface StatItem {
  icon: string;
  title: string;
  subtitle: string;
  iconColor: string;
}

interface QuickStatsProps {
  stats?: StatItem[];
}

const QuickStatsComponent = ({ 
  stats = [
    { icon: 'person', title: 'Profile', subtitle: 'Active', iconColor: '#059669' },
    { icon: 'verified-user', title: 'Verified', subtitle: 'User', iconColor: '#2563EB' },
  ] 
}: QuickStatsProps) => {
  const tailwind = useTailwind();

  return (
    <>
      <ResponsiveUi.Text bold fontSize={20} style={tailwind('mb-3')}>
        Quick Stats
      </ResponsiveUi.Text>

      <ContainerWrapper style={tailwind('flex-row justify-between')}>
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            containerStyle={[
              tailwind('rounded-2xl m-0 flex-1'), 
              index === 0 ? tailwind('mr-2') : tailwind('ml-2'),
              { elevation: 2 }
            ]}
          >
            <ContainerWrapper style={tailwind('items-center')}>
              <Icon name={stat.icon} type="material" size={30} color={stat.iconColor} />
              <ResponsiveUi.Text bold fontSize={16} style={tailwind('mt-2')}>
                {stat.title}
              </ResponsiveUi.Text>
              <ResponsiveUi.Text regular fontSize={12}>
                {stat.subtitle}
              </ResponsiveUi.Text>
            </ContainerWrapper>
          </Card>
        ))}
      </ContainerWrapper>
    </>
  );
};

export default QuickStatsComponent;