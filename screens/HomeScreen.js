import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen';
import StaffScreen from './StaffScreen.js';
import DateScreen from './DateScreen.js';
import FormScreen from './FormScreen.js';
import mainStyle from '../styles/main';
import ServiceScreen from './ServiceScreen';


const Stack = createNativeStackNavigator();

export default function HomeScreen(props) {

    return <Stack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: 'rgba(25,25,27, 0)'
        }
    }}>
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Service" component={ServiceScreen} options={{ 
            title: 'Выберите услугу',
            headerTintColor: mainStyle.accentColor,
            headerBackTitle: '',
            headerTransparent: true,
            navigation: props.navigation,
        }}/>
        <Stack.Screen name="Staff" component={StaffScreen} options={{ 
            title: 'Выберите мастера',
            headerTintColor: mainStyle.accentColor,
            headerBackTitle: '',
            headerTransparent: true,
            navigation: props.navigation,
        }}/>
        <Stack.Screen name="Date" component={DateScreen} options={{ 
            title: 'Выберите сеанс',
            headerTintColor: mainStyle.accentColor,
            headerBackTitle: '',
            headerTransparent: true,
            navigation: props.navigation
        }}/>
        <Stack.Screen name="Form" component={FormScreen} options={{ 
            title: 'Подтвердите данные',
            headerTintColor: mainStyle.accentColor,
            headerBackTitle: '',
            headerTransparent: true,
            navigation: props.navigation
        }} initialParams={{
            userData: props.route.params.userData  
        }}/>
    </Stack.Navigator>
}