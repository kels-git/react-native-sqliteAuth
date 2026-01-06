import {combineReducers} from 'redux';
import authReducer from '../auth/auth-slice';

const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
