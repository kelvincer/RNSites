
//import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import { ThemeContextProvider } from "./presentation/context/ThemeContext";
import { AppNavigator } from './presentation/navigator/AppNavigator';
import Geolocation from '@react-native-community/geolocation';

//const queryClient = new QueryClient();

export const SitesApp = () => {

  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
    locationProvider: 'playServices', // o 'android'
  });

  return (
    //<QueryClientProvider client={queryClient}>
    <ThemeContextProvider>
      <AppNavigator />
    </ThemeContextProvider>
    //</QueryClientProvider>
  );
};