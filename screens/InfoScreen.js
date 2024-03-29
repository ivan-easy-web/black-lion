import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { options } from 'superagent';
import Api from '../components/Api';
import mainStyle from '../styles/main';



export default class InfoScreen extends Component {
    
    constructor(props) {

        super(props);

        let state = {
            records: undefined
        }

        this.state = state;

        let api = new Api;
        api.getUserRecords(
            this.props.route.params.userData.userToken,
            (result) => {
                let records = result.data;
                let now = new Date();
                records = records.filter(elem => Date.parse(elem.datetime) > now);
                records = records.filter(elem => !elem.deleted);
                records = records.sort((r1, r2) => Date.parse(r1.datetime) > Date.parse(r2.datetime));
                let nextState = this.state;
                nextState.records = records;
                this.setState(nextState);
            },
            (error) => {
                if (this.props.route.params.userData.phone != '78005553535') {
                    Alert.alert('Black Lion', error);
                }
            }
        )

        props.navigation.addListener('focus', () => {
            this.updateInfo();
        });

        this.updateInfo = this.updateInfo.bind(this);
    }

    updateInfo() {
        let api = new Api;
        api.getUserRecords(
            this.props.route.params.userData.userToken,
            (result) => {
                let records = result.data;
                let now = new Date();
                records = records.filter(elem => Date.parse(elem.datetime) > now);
                records = records.filter(elem => !elem.deleted);
                records = records.sort((r1, r2) => Date.parse(r1.datetime) > Date.parse(r2.datetime));
                let nextState = this.state;
                nextState.records = records;
                this.setState(nextState);
            },
            (error) => {
                if (this.props.route.params.userData.phone != '78005553535') {
                    Alert.alert('Black Lion', error);
                }
            }
        )
    }
    
    render() {
        return <ImageBackground source={require('../assets/background.png')} style={styles.background}>
        {(this.state.records == undefined)? loadingScreen(): recordsScreen(this.state.records, this.props.route.params.userData.userToken, this.updateInfo)}
        <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => {
                
                Alert.alert(
                    'Black Lion', 
                    'Уверены, что хотите выйти из аккаунта?',
                    [
                        {text: 'Нет', onPress: () => {
    
                        }},
                        {text: 'Да', onPress: () => {
                            this.props.route.params.logOut();
                        }}
                    ]
                )
            }}>
                <Text style={styles.text}>Выйти из аккаунта</Text>
            </TouchableOpacity>
        </View>
        
        <View style={{height: 90}}/>
        </ImageBackground>
    }
}

function noRecordsScreen() {
    return <SafeAreaView style={styles.pageView}>
        <Text style={styles.text}>Вы не записаны</Text>
    </SafeAreaView>
    
}

function loadingScreen() {
    return <SafeAreaView style={styles.pageView}>
        <Text style={styles.text}>Загрузка</Text>
    </SafeAreaView>
}

function recordsScreen(records, userToken, updateInfo) {
    if (records.length == 0) {
        return noRecordsScreen();
    } else {
        return <FlatList style={styles.list}
        data={records}
        renderItem={({item}) => recordListItem(item, userToken, updateInfo)}
        keyExtractor={item => item.date}
        showsVerticalScrollIndicator={false}
      />
    }
}

function recordListItem(record, userToken, updateInfo) {
    let date = record.datetime;
    return <View style={styles.itemWrapper}>
        <Text style={styles.date}>{new Date(Date.parse(date)).toLocaleString('rus')}</Text>
        <Text style={styles.item}>{record.services[0].title} - {record.staff.name}</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={ () => {
            Alert.alert(
                'Удалить запись?', 
                `${record.services[0].title}, ${new Date(Date.parse(record.datetime)).toLocaleString('rus')}, мастер: ${record.staff.name}`, 
                [
                    {text: 'Нет', onPress: () => {

                    }},
                    {text: 'Да', onPress: () => {
                        let api = new Api;
                        api.deleteRecord(
                            userToken,
                            record.id,
                            (result) => {
                                updateInfo();
                                Alert.alert('Запись удалена!', `'${record.services[0].title}', ${new Date(Date.parse(record.datetime)).toLocaleString('rus')}, мастер: ${record.staff.name}`);
                            },
                            (error) => {
                                Alert.alert('Black Lion', error);
                            }
                        )
                    }}
                ]
            )
        }}>
            <Text style={styles.deleteButtonText}>Удалить</Text>
        </TouchableOpacity>
    </View>
    
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
    },
    background: {
        width: '100%',
        height: '100%',
        justifyContent: "flex-start",
        backgroundColor: 'rgb(25,25,27)'
    },
    input: {
        height: 50,
        margin: 10,
        borderWidth: 1,
        padding: 15,
        borderRadius: 25,
        borderColor: mainStyle.accentColor,
        color: mainStyle.secondColor
    },
    button: {
        height: 50,
        margin: 10,
        borderWidth: 1,
        padding: 15,
        borderRadius: 25,
        backgroundColor: mainStyle.accentColor
    },
    disabledButton: {
        height: 50,
        margin: 10,
        borderWidth: 1,
        padding: 15,
        borderRadius: 25,
        borderColor: mainStyle.accentColor
    },
    disabledText: {
        color: 'grey',
        textAlign: 'center'
    },
    text: {
        color: mainStyle.secondColor,
        textAlign: 'center'
    },
    date: {
        color: mainStyle.accentColor,
        fontSize: 18
    },
    list: {
        marginTop: 20,
        paddingTop: 20,
        marginLeft: 10,
        marginRight: 10
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
    pageView: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteButton: {
        backgroundColor: mainStyle.accentColor,
        borderRadius: 15,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5
    },
    deleteButtonText: {
        color: mainStyle.secondColor
    }
});