import {ComponentProps, ReactNode} from 'react';
import {StyleProp, TextInputProps, ViewStyle} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface ValidateErrorProps {
  hasError?: boolean;
  isValid?: boolean;
}

export interface ErrorProps extends ValidateErrorProps {
  errorMessage?: string;
}

export interface TextInputComponentProps extends ValidateErrorProps {
  label?: ReactNode;
  disabled?: boolean;
  colorLabel?: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  isPasswordIcon?: boolean;
  isPasswordText?: boolean;
  inputWithoutCurve?: boolean;
  height?: number;
  secureTextEntry?: boolean;
}

export interface LoginAuth {
  email: string;
  password: string;
}

export interface FormDataAuth extends LoginAuth{
  name: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
}

export interface ErrorProps extends ValidateErrorProps {
  errorMessage?: string;
}

export interface WeatherData {
  day: string;
  temp: string;
  condition: string;
  icon: string;
}

export type InputCustomProps = TextInputProps & TextInputComponentProps;
