// Updated LottieWrapper.tsx
import React from 'react';
import LottieView from 'lottie-react-native';
import { useTailwind } from 'tailwind-rn';
import ContainerWrapper from '../wrappers-component/ContainerWrapper';

interface LottieProps {
  lottie?: any;
  size?: number;
}

export const LottieWrapper: React.FC<LottieProps> = ({ lottie, size = 250 }) => {
  const tailwind = useTailwind();

  return (
    <ContainerWrapper style={tailwind('justify-center items-center')}>
      <LottieView
        source={lottie}
        autoPlay
        loop
        style={{ width: size, height: size }}
        cacheStrategy="strong"
      />
    </ContainerWrapper>
  );
};

export default LottieWrapper;