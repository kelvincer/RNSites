
//import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import { ThemeContextProvider } from "./presentation/context/ThemeContext";
import { AppNavigator } from './presentation/navigator/AppNavigator';

//const queryClient = new QueryClient();

export const SitesApp = () => {
  return (
    //<QueryClientProvider client={queryClient}>
    <ThemeContextProvider>
      <AppNavigator />
    </ThemeContextProvider>
    //</QueryClientProvider>
  );
};