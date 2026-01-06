import React, { useEffect } from 'react';
import utilities from './tailwind.json';
import { TailwindProvider } from 'tailwind-rn';
import { RootNavigation } from 'src/navigation/root-stack';
import { NavigationContainer } from '@react-navigation/native';
import { LoadingProvider } from 'src/services/load/loading-services';
import { initDB } from 'src/services/database/database-service';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from 'src/global/store/store';
import { Provider } from 'react-redux';

const App = () => {

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await initDB();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initializeDatabase();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TailwindProvider utilities={utilities}>
          <LoadingProvider>
            <NavigationContainer>
              <RootNavigation />
            </NavigationContainer>
          </LoadingProvider>
        </TailwindProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
