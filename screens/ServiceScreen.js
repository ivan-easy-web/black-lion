import React, { Component } from 'react';
import { render } from 'react-dom';
import { View, Text, ImageBackground, TouchableOpacity, FlatList, StyleSheet, Image, TouchableWithoutFeedbackBase, SafeAreaView } from 'react-native';
import Api from '../components/Api';
import mainStyle from '../styles/main';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class ServiceScreen extends React.Component {
    constructor(props) {
        super(props);

        let state = {
            services: undefined,
            pro: true,
            renderedServices: []
        }

        this.state = state;
        this.setPro = this.setPro.bind(this);

        let api = new Api;
        api.getServices(
            (result) => {
                let nextState = this.state;
                nextState.services = result;
                nextState.renderedServices = result.filter(e => e.category_id == 8279741);
                this.setState(nextState);
            },
            (error) => {
                alert(error);
            }
        )
    }

    setPro(pro) {
        let state = this.state;
        state.pro = pro;
        if (pro) {
            state.renderedServices = state.services.filter(e => e.category_id == 8279741);
        } else {
            state.renderedServices = state.services.filter(e => e.category_id != 8279741);
        }
        this.setState(state);
    } 

    render() {
        return <ImageBackground source={require('../assets/background.png')} style={mainStyle.styles.background}>
        <SafeAreaView style={styles.container}>
            {(this.state.services == undefined)? loadingScreen(): servicesScreen(this.state.renderedServices, this.props.navigation, this.state.pro, this.setPro)}
        </SafeAreaView>
        </ImageBackground>
    }
    
}

function loadingScreen() {
    return <View style={styles.loadingScreen}>
        <Text style={styles.loadingText}>Загрузка</Text>
    </View>
}

function servicesScreen(services, navigation, pro, setPro) {
    return <View>
        <View
        style={styles.hlist}
        >
            <TouchableOpacity style={(pro)? styles.hItemWrapperSelected: styles.hItemWrapper} onPress={() => {setPro(true)}}>
                <Text style={(pro)? styles.hItemSelected: styles.hItem}>Услуги PRO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={(pro)? styles.hItemWrapper: styles.hItemWrapperSelected} onPress={() => {setPro(false)}}>
                <Text style={(pro)? styles.hItem: styles.hItemSelected}>Услуги Барбершопа</Text>
            </TouchableOpacity>
        </View>
        <FlatList
        showsVerticalScrollIndicator={false}
        style={styles.list}
        data={services}
        renderItem={({item}) => serviceListItem(item, navigation)}
        keyExtractor={item => item.id.toString()}
        />
    </View>
}

function serviceListItem(item, navigation) {
    return <TouchableOpacity style={styles.item} onPress={() => {navigation.navigate('Staff', {service: item})}}>
        <View style={styles.row}>
            <View>
                <Image style={styles.image} source={{uri: item.image}}/>
            </View>
            <View style={styles.col}>
                <Text style={styles.text}>{item.title}</Text>
                <Text style={styles.price}>От {item.price_min}р.</Text>
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
        paddingRight: 10,
        height: windowHeight - 110
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
        justifyContent: 'space-between'
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
    },
    hlist: {
        height: 50,
        marginBottom: 10,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    hItemWrapper: {
        flex: 1,
        height: 40,
        marginTop: 10,
        justifyContent: 'center',
        textAlign: 'center',
        borderColor: mainStyle.accentColor,
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 30,
    },
    hItemWrapperSelected: {
        flex: 1,
        height: 40,
        marginTop: 10,
        justifyContent: 'center',
        backgroundColor: mainStyle.accentColor,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20
    },
    hItem: {
        textAlign: 'center',
        color: mainStyle.accentColor
    },
    hItemSelected: {
        textAlign: 'center',
        color: mainStyle.secondColor
    },
  });