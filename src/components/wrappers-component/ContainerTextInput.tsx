import React, { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { Icon } from 'react-native-elements';
import { InputCustomProps } from 'src/typings/input-typings';
import ContainerWrapper from './ContainerWrapper';
import { ResponsiveUi } from '../responsive-ui/responsive-ui';
import { getColorValue } from 'src/utils/utils';


const TextInputCustomComponent: React.FC<InputCustomProps> = ({
  label,
  isPasswordIcon,
  isPasswordText,
  isValid,
  hasError,
  height,
  colorLabel,
  disabled = false,
  secureTextEntry,
  ...props
}) => {

  const tailwind = useTailwind();
  const whiteColor = getColorValue('text-white-pure', tailwind);
  const greyLightColor = getColorValue('text-lighter-gray', tailwind);
  const primaryBlueColor = getColorValue('text-light-blue', tailwind);
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [inputBackgroundColor, setInputBackgroundColor] = useState<string>(greyLightColor);

  const customOnFocus = () => {
    if (!disabled) {
      props?.onFocus;
      setInputBackgroundColor(whiteColor);
    }
  };

  const customOnBlur = () => {
    if (!disabled) {
      props?.onBlur;
      setInputBackgroundColor(whiteColor);
    }
  };

  return (
    <ContainerWrapper style={[tailwind('w-full'), {}]}>
      <ResponsiveUi.Text regular fontSize={16} color={colorLabel} style={[tailwind(`mb-2`)]}>
        {label}
      </ResponsiveUi.Text>

      <TextInput
        {...props}
        style={[
          tailwind(` font-regular text-black-pure pl-2 rounded-lg text-base ${!isValid ? 'border border-error' : 'border-0'}`),
          { height: height, backgroundColor: disabled ? undefined : inputBackgroundColor, },
          props.style,
        ]}
        editable={!disabled}
        onFocus={customOnFocus}
        onBlur={customOnBlur}
        placeholderTextColor={greyLightColor}
        secureTextEntry={isPasswordIcon ? hidePassword : isPasswordText ? hidePassword : secureTextEntry}
      />

      {isPasswordIcon && (
        <TouchableOpacity
          style={[tailwind('absolute top-11 right-3.5 pr-2.5')]}
          onPress={() => { setHidePassword(!hidePassword) }}>
          <Icon
            name={hidePassword ? 'eye' : 'eye-off'}
            type="feather"
            size={20}
            color={greyLightColor}
          />
        </TouchableOpacity>
      )}

      {isPasswordText && (
        <ResponsiveUi.Text
          regular
          h6
          color={primaryBlueColor}
          style={[tailwind('absolute top-5 right-3.5 pr-2.5')]}
          onPress={() => { setHidePassword(!hidePassword) }}>
          {hidePassword ? 'Show' : 'Hide'}
        </ResponsiveUi.Text>
      )}
    </ContainerWrapper>
  );
};
export default TextInputCustomComponent;
