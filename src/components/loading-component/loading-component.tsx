// LoadingLottie.tsx
import React from 'react';
import { useTailwind } from 'tailwind-rn';
import { StyleSheet } from 'react-native';
import ContainerWrapper from '../wrappers-component/ContainerWrapper';
import { ResponsiveUi } from '../responsive-ui/responsive-ui';
import LottieWrapper from '../wrappers-component/LottieWrapper';

const LoadingLottieComponent: React.FC = () => {
  const _size = 250;
  const tailwind = useTailwind();

  return (
    <ContainerWrapper style={[tailwind('justify-center items-center bg-loading z-999'), {}, StyleSheet.absoluteFill]}>
      <LottieWrapper lottie={require('../../assets/lottie/loading.json')} size={_size} />
      <ResponsiveUi.Text tailwind={'mt-8 text-center font-semibold text-black-pure text-5xl'}>
        {'loading...'}
      </ResponsiveUi.Text>
    </ContainerWrapper>
  );
};

export default LoadingLottieComponent;
