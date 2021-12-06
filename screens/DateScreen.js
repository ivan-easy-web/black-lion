import React, { Component, useState } from 'react';
import { render } from 'react-dom';
import { View, Text, ImageBackground, TouchableOpacity, FlatList, StyleSheet, Image, TouchableWithoutFeedbackBase, SafeAreaView } from 'react-native';
import Api from '../components/Api';
import mainStyle from '../styles/main';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class DatesScreen extends React.Component {
    constructor(props) {
        super(props);

        let state = {
            dates: undefined
        }

        this.state = state;

        let api = new Api;
        api.getDates(props.route.params.service.id, props.route.params.staff.id,
            (result) => {
                let nextState = this.state;
                nextState.dates = result;
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
            {(this.state.dates == undefined)? loadingScreen(): <MainScreen dates={this.state.dates} apiProps={this.props.route.params} navigation={this.props.navigation}/>}
        </SafeAreaView>
        </ImageBackground>
    }
    
}

function loadingScreen() {
    return <View style={styles.loadingScreen}>
        <Text style={styles.loadingText}>Загрузка</Text>
    </View>
}

class MainScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.dates[0]
        };
        this.setDate = this.setDate.bind(this);
    }

    setDate(date) {
        let state = this.state;
        state.date = date;
        this.setState(state);
    }

    render() {
        return <View>
            {datesList(this.props.dates, this.state.date, this.setDate)}
            <TimesScreen date={this.state.date} apiProps={this.props.apiProps} navigation={this.props.navigation}/>
        </View>
    }
}

function datesList(dates, date, setDate) {
    return <View><FlatList
    horizontal
    style={styles.hlist}
    data={dates}
    renderItem={({item}) => datesListItem(item, date, setDate)}
    keyExtractor={item => item}
    showsHorizontalScrollIndicator={false}
    />
    </View>
}

function datesListItem(item, date, setDate) {
    return <TouchableOpacity style={(item == date)? styles.hItemWrapperSelected: styles.hItemWrapper} onPress={() => {setDate(item)}}>
        <Text style={(item == date)? styles.hItemSelected: styles.hItem}>{new Date(Date.parse(item)).toLocaleDateString('rus')}</Text>
    </TouchableOpacity>
}

class TimesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            times: undefined,
            date: this.props.date
        };

        let {service, staff} = props.apiProps;

        let api = new Api;

        api.getTimes(service.id, staff.id, this.state.date, 
            (result) => {
                let state = this.state;
                state.times = result;
                this.setState(state);
            },
            (error) => {
                alert(error);
            }
        )
    }

    componentDidUpdate(prevProps) {
        if (this.props.date !== prevProps.date) {
            let state = this.state;
            state.date = this.props.date;
            state.times = undefined;
            this.setState(state);

            let api = new Api;
            let {service, staff} = this.props.apiProps;

            api.getTimes(service.id, staff.id, this.state.date, 
                (result) => {
                    let state = this.state;
                    state.times = result;
                    this.setState(state);
                },
                (error) => {
                    alert(error);
                }
            )
        }
    }

    render() {
        let apiProps = this.props.apiProps;
        apiProps.date = this.state.date;
        return <View>
            {(this.state.times == undefined)? loadingScreen(): timesList(this.state.times, this.props.navigation, apiProps)}

        </View>
    }
}

function timesList(times, navigation, apiProps) {
    return <FlatList
    style={styles.list}
    data={times}
    renderItem={({item}) => timesListItem(item, navigation, apiProps)}
    keyExtractor={item => item.time}
    showsVerticalScrollIndicator={false}
    />
}

function timesListItem(time, navigation, apiProps) {
    return <TouchableOpacity style={styles.itemWrapper} onPress={() => {
        apiProps.time = time.datetime;
        navigation.navigate('Form', apiProps);
        }}>
        <Text style={styles.item}>{time.time}</Text>
    </TouchableOpacity>
}


const styles = StyleSheet.create({
    container: {
        flex: 1
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
    hlist: {
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        maxHeight: 50
    },
    hItemWrapper: {
        height: 40,
        marginTop: 10,
        justifyContent: 'center',
        borderColor: mainStyle.accentColor,
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 30
    },
    hItemWrapperSelected: {
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
        color: mainStyle.accentColor
    },
    hItemSelected: {
        color: mainStyle.secondColor
    },
    list: {
        marginLeft: 10,
        marginRight: 10,
        height: windowHeight - 200
    },
    itemWrapper: {
        marginTop: 10,
        paddingBottom: 10,
        borderColor: 'transparent',
        borderBottomColor: 'grey',
        borderWidth: 1
    },
    item: {
        color: mainStyle.secondColor,
        fontSize: 18
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