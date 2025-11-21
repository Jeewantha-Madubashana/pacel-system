import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ServicesScreen from '../screens/customer/ServicesScreen';
import BookingsScreen from '../screens/customer/BookingsScreen';
import BookingDetailScreen from '../screens/customer/BookingDetailScreen';
import CreateBookingScreen from '../screens/customer/CreateBookingScreen';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ServicesStack = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ServicesList"
        component={ServicesScreen}
        options={{
          title: 'Services',
          headerRight: () => (
            <Button
              onPress={async () => {
                await logout();
                navigation.replace('Login');
              }}
              mode="text"
            >
              Logout
            </Button>
          ),
        }}
      />
      <Stack.Screen name="CreateBooking" component={CreateBookingScreen} options={{ title: 'Create Booking' }} />
    </Stack.Navigator>
  );
};

const BookingsStack = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BookingsList"
        component={BookingsScreen}
        options={{
          title: 'My Bookings',
          headerRight: () => (
            <Button
              onPress={async () => {
                await logout();
                navigation.replace('Login');
              }}
              mode="text"
            >
              Logout
            </Button>
          ),
        }}
      />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} options={{ title: 'Booking Details' }} />
    </Stack.Navigator>
  );
};

const CustomerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Services') {
            iconName = 'shopping-cart';
          } else if (route.name === 'Bookings') {
            iconName = 'list';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Services" component={ServicesStack} options={{ headerShown: false }} />
      <Tab.Screen name="Bookings" component={BookingsStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default CustomerTabs;

