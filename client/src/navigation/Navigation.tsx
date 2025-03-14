import {View, Text} from 'react-native';
import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '@utils/NavigationUtils';
import SplashScreen from '@features/auth/SplashScreen';
import CustomerLogin from '@features/auth/CustomerLogin';
import DeliveryLogin from '@features/auth/DeliveryLogin';
import ProductDashboard from '@features/dashboard/ProductDashboard';

const Stack = createNativeStackNavigator();

const Navigation: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="ProductDashboard" component={ProductDashboard} />
        <Stack.Screen
          name="CustomerLogin"
          component={CustomerLogin}
          options={{animation: 'fade'}}
        />
        <Stack.Screen
          name="DeliveryLogin"
          component={DeliveryLogin}
          options={{animation: 'fade'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
