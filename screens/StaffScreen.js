import React, { Component } from 'react';
import { render } from 'react-dom';
import { SafeAreaView, View, Text, ImageBackground, TouchableOpacity, FlatList, StyleSheet, Image, TouchableWithoutFeedbackBase } from 'react-native';
import Api from '../components/Api';
import mainStyle from '../styles/main';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class StaffScreen extends React.Component {
    constructor(props) {
        super(props);

        let state = {
            staff: undefined
        }

        this.state = state;

        let api = new Api;
        api.getStaff(props.route.params.service.id,
            (result) => {
                let nextState = this.state;
                nextState.staff = result;
                this.setState(nextState);
            },
            (error) => {
                alert(error);
            }
        );
    }

    render() {
        return <ImageBackground source={require('../assets/background.png')} style={mainStyle.styles.background}>
        <SafeAreaView style={styles.container}>
            {(this.state.staff == undefined)? loadingScreen(): staffScreen(this.props.route.params.service, this.state.staff, this.props.navigation)}
        </SafeAreaView>
        </ImageBackground>
    }
    
}

function loadingScreen() {
    return <View style={styles.loadingScreen}>
        <Text style={styles.loadingText}>Загрузка</Text>
    </View>
}

function staffScreen(service, staff, navigation) {
    return <FlatList
    showsVerticalScrollIndicator={false}
    style={styles.list}
    data={staff}
    renderItem={({item}) => staffListItem(service, item, navigation)}
    keyExtractor={item => item.id.toString()}
    />
}

function staffListItem(service, item, navigation) {
    return <TouchableOpacity style={styles.item} onPress={() => {navigation.navigate('Date', {service: service, staff: item})}}>
        <View style={styles.row}>
            <View>
                <Image style={styles.image} source={{uri: item.avatar}}/>
            </View>
            <View style={styles.col}>
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.price}>{item.specialization}</Text>
            </View>
        </View>
    </TouchableOpacity>
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    loadingScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        color: mainStyle.accentColor,
        fontSize: 24
    },
    list: {
        paddingLeft: 10,
        paddingRight: 10
    },
    item: {
        marginTop: 10,
        paddingBottom: 10,
        borderColor: 'transparent',
        borderBottomColor: 'grey',
        borderWidth: 1
    },
    row: {
        flex: 1,
        flexDirection: 'row'
    },
    text: {
        color: mainStyle.secondColor,
        fontSize: 18,
        width: windowWidth - 130
    }, 
    col: {
        marginLeft: 10,
        justifyContent: 'center'
    },
    price: {
        color: mainStyle.accentColor,
        fontSize: 18
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 50
    }
  });