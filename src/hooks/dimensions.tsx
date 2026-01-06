import { Dimensions } from 'react-native';

import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

export const useAppDimensions = () => {
  const dimension = Dimensions.get('screen');

  return dimension.width < dimension.height || dimension.width < 768
    ? {
      //portrait dimension
      width: dimension.width,
      height: dimension.height,
      wp: widthPercentageToDP,
      hp: heightPercentageToDP,
      isLargeScreen: dimension.width >= 768,
    }
    : {
      //landscape dimension
      width: dimension.width,
      height: dimension.height,
      wp: heightPercentageToDP,
      hp: widthPercentageToDP,
      isLargeScreen: dimension.width >= 768,
    };
};
