import {ParamListBase, RouteProp} from '@react-navigation/native';
import {SCREENS} from 'src/enums/screens/screens';

interface ISubNavigator<T extends ParamListBase, K extends keyof T> {
  screen: K;
  params?: T[K];
  initial?: boolean;
}

export type HomeStackParamList = {
  [SCREENS.Home_page]: undefined;
};

export type RootStackParamList = {
  [SCREENS.Main_stack]: undefined;
  [SCREENS.Login_page]: undefined;
  [SCREENS.Register_page]: undefined;
  [SCREENS.Home_stack]: ISubNavigator<HomeStackParamList, keyof HomeStackParamList>;
};

export type StackParams = RootStackParamList & HomeStackParamList;

export type RootStackScreenProps<T extends keyof StackParams> = {
  navigation?: any;
  route: RouteProp<StackParams, keyof StackParams>;
};
