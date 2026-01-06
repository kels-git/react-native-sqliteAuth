// src/components/home/AccountDetails.tsx
import React from 'react';
import { Card, Icon } from '@rneui/themed';
import { ResponsiveUi } from '../responsive-ui/responsive-ui';
import ContainerWrapper from '../wrappers-component/ContainerWrapper';
import { useTailwind } from 'tailwind-rn';



interface AccountDetailsProps {
  id?: number;
  name?: string;
  email?: string;
}

const AccountDetailsComponent = ({ id, name, email }: AccountDetailsProps) => {
  const tailwind = useTailwind();

  const details = [
    { icon: 'badge', label: 'User ID', value: `#${id || 'N/A'}` },
    { icon: 'person', label: 'Full Name', value: name || 'N/A' },
    { icon: 'email', label: 'Email Address', value: email || 'N/A' },
  ];

  return (
    <Card containerStyle={[tailwind('rounded-2xl m-0'), { elevation: 3 }]}>
      <ResponsiveUi.Text bold fontSize={18} style={tailwind('mb-3')}>
        Account Details
      </ResponsiveUi.Text>

      {details.map((detail, index) => (
        <ContainerWrapper 
          key={index} 
          style={[
            tailwind('flex-row items-center py-3'),
            index < details.length - 1 && tailwind('border-b border-gray')
          ]}
        >
          <Icon name={detail.icon} type="material" size={24} color="#326FD1" />
          <ContainerWrapper style={tailwind('ml-3 flex-1')}>
            <ResponsiveUi.Text regular fontSize={12}>
              {detail.label}
            </ResponsiveUi.Text>
            <ResponsiveUi.Text bold fontSize={14}>
              {detail.value}
            </ResponsiveUi.Text>
          </ContainerWrapper>
        </ContainerWrapper>
      ))}
    </Card>
  );
};

export default AccountDetailsComponent;