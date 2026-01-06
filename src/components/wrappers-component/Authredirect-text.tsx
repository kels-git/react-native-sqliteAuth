import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import ContainerWrapper from './ContainerWrapper';
import { ResponsiveUi } from '../responsive-ui/responsive-ui';
import { getColorValue } from 'src/utils/utils';

interface AuthRedirectTextProps {
  primaryText?: string;
  secondaryText?: string;
  onPress?: () => void;
}

export const AuthRedirectText: React.FC<AuthRedirectTextProps> = ({ primaryText, secondaryText, onPress }) => {
  const tailwind = useTailwind();
  const mediumBlack = getColorValue('text-medium-black', tailwind);
  const primaryColor = getColorValue('text-primary', tailwind)

  return (
    <ContainerWrapper style={[tailwind('flex-row mb-10 mt-3 items-center justify-center')]}>
      <ResponsiveUi.Text regular fontSize={14} color={mediumBlack} tailwind="font-regular">
        {primaryText}
      </ResponsiveUi.Text>
      <TouchableOpacity onPress={onPress}>
        <ResponsiveUi.Text fontSize={14} color={primaryColor} style={tailwind('ml-2')} tailwind="font-regular">
          {secondaryText}
        </ResponsiveUi.Text>
      </TouchableOpacity>
    </ContainerWrapper>
  );
};
