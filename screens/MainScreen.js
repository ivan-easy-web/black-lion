import React, { Component } from 'react';
import { Dimensions, Image, View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import mainStyle from '../styles/main';

const logoRatio = 772/700;
const m2Ratio = 216/200;

import { BlurView } from 'expo-blur';

const { width }  = Dimensions.get('window');

export default function MainScreen({navigation}) {
    return <ImageBackground source={require('../assets/background.png')} style={mainStyle.styles.background}>
    <SafeAreaView style={styles.container}>
        
        <ScrollView contentContainerStyle={styles.mainView} showsVerticalScrollIndicator={false}>
            <Image
                style={styles.logoImg}
                source={require('../assets/logo.png')}
            />
            <Image
                style={styles.m2}
                source={require('../assets/m2.png')}
            />
            <Text style={[styles.h1, styles.mainText]}>
                Наша мода -
            </Text>
            <Text style={[styles.h1, styles.mainText]}>
                правильный стиль!
            </Text>
            <Image
                style={styles.m2}
                source={require('../assets/arrow.png')}
            />
            <Text style={styles.h2}>
                Наш адрес
            </Text>
            <Text style={[styles.h3,{marginTop: 10}]}>
                г. Тверь
            </Text>
            <Text style={styles.h3}>
                ул. Вольного Новгорода, д. 13
            </Text>
            <Image
                style={styles.m2}
                source={require('../assets/m2.png')}
            />
            <Text style={styles.h4}>
                "Black Time" 30%
            </Text>
            <Text style={[styles.h4, {marginBottom: 140}]}>
                Пн-Чт с 13:00-17:00
            </Text>

        </ScrollView>

        <View style={styles.callButtonWrapper}>
            <TouchableOpacity onPress={() => {Linking.openURL(`tel:+74822777024`)}}>
                <Image
                    style={styles.callImg}
                    source={require('../assets/call.png')}
                />
            </TouchableOpacity>
        </View>
        <View style={styles.instButtonWrapper}>
            <TouchableOpacity onPress={() => {Linking.openURL(`https://instagram.com/blacklion.barbershop?utm_medium=copy_link`)}}>
                <Image
                    style={styles.callImg}
                    source={require('../assets/inst.png')}
                />
            </TouchableOpacity>
        </View>

        <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('Service')}}>
                <Text style={styles.text}>Записаться</Text>
            </TouchableOpacity>
        </View>

        
        <View style={{height: 90}}/>
    </SafeAreaView>
    </ImageBackground>
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    callButtonWrapper: {
        position: 'absolute',
        top: 60,
        left: 10
    },

    instButtonWrapper: {
        position: 'absolute',
        top: 60,
        right: 10
    },

    callImg: {
        height: 50,
        width: 50
    },

    mainView: {
        alignItems: "center"
    },  

    logoImg: {
        width: width * 0.7,
        height: width * logoRatio * 0.7,
        aspectRatio: 1,
        resizeMode: 'contain',
        marginTop: 100
    },

    m2: {
        width: width * 0.15,
        height: width * m2Ratio * 0.15,
        aspectRatio: 1,
        resizeMode: 'contain',
        marginTop: 10,
        marginBottom: 10
    },

    h1: {
        color: mainStyle.accentColor,
        fontSize: 26,
        textTransform: 'uppercase'
    },

    h2: {
        color: mainStyle.secondColor,
        fontSize: 20
    },

    h3: {
        color: mainStyle.accentColor
    },

    h4: {
        color: mainStyle.secondColor
    },

    buttonWrapper: {
        position: 'absolute',
        bottom: 100,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    button: {
        borderRadius: 50,
        height: 40,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: mainStyle.accentColor,
    },
    text: {
        color: mainStyle.secondColor,
        fontSize: 20,
    },
    mainText: {
        fontFamily: 'American Typewriter'
    }
});