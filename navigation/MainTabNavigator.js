import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SettingsScreen1 from '../screens/SettingsScreen1';
import SettingsScreen2 from '../screens/SettingsScreen2';
import CameraScreen from '../screens/CameraScreen';
import TherapyScreen from '../screens/TherapyScreen';
import AddPatientScreen from '../screens/AddPatientScreen';
import ChartScreen from '../screens/ChartScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  AddPatient: AddPatientScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Patients',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-medkit'
          : 'md-medkit'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
  Camera: CameraScreen,
  Therapy: TherapyScreen,
  Chart: ChartScreen
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Actions',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
  Settings1: SettingsScreen1,
  Settings2: SettingsScreen2,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
});
