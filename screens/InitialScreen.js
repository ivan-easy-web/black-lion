import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import mainStyle from '../styles/main';
import ServiceScreen from './ServiceScreen';
import LoginScreen from './LoginScreen';


const Stack = createNativeStackNavigator();

export default function InitialScreen(handleLogIn) {
    return <Stack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: 'rgba(25,25,27, 0)'
        }
    }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}}
        initialParams={{
            handleLogIn: handleLogIn,
        }} />
        <Stack.Screen name="Service" component={ServiceScreen} options={{ 
            title: 'Price',
            headerTintColor: mainStyle.accentColor,
            headerBackTitle: '',
            headerTransparent: true
        }}/>
    </Stack.Navigator>
}