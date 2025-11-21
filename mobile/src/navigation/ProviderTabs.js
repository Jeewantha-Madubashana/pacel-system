import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PendingJobsScreen from '../screens/provider/PendingJobsScreen';
import MyJobsScreen from '../screens/provider/MyJobsScreen';
import JobDetailScreen from '../screens/provider/JobDetailScreen';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PendingStack = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PendingList"
        component={PendingJobsScreen}
        options={{
          title: 'Pending Jobs',
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
      <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job Details' }} />
    </Stack.Navigator>
  );
};

const MyJobsStack = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyJobsList"
        component={MyJobsScreen}
        options={{
          title: 'My Jobs',
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
      <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job Details' }} />
    </Stack.Navigator>
  );
};

const ProviderTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Pending') {
            iconName = 'pending';
          } else if (route.name === 'MyJobs') {
            iconName = 'work';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Pending" component={PendingStack} options={{ headerShown: false }} />
      <Tab.Screen name="MyJobs" component={MyJobsStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default ProviderTabs;

