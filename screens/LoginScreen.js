import React, {Component} from 'react';
import { Dimensions, ImageBackground, Image, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Api from '../components/Api';
import mainStyle from '../styles/main';

const logoRatio = 700/1500;

const { width }  = Dimensions.get('window');


export default class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userData: {
                phone: '7',
                name: '',
                email: '',
                userToken: ''
            },
            code: '',
            codeSent: false
        }

        this.handleSendCode = this.handleSendCode.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
    }

    handleSendCode() {

        if (this.state.userData.phone == '78005553535') {
            this.props.route.params.handleLogIn({
                email: '',
                phone: '78005553535',
                name: 'Тестовый Аккаунт',
                userToken: ''
            });
            return;
        }

        let api = new Api;

        api.sendCode(this.state.userData.phone, this.state.userData.name,
            (result) => {
                let state = this.state;
                state.codeSent = true;
                this.setState(state);
            },
            (error) => {
                Alert.alert('Black Lion', error);
                let state = this.state;
                state.codeSent = false;
                this.setState(state);
            }
        );
    }

    handleLogIn() {

        let api = new Api;

        if (this.state.userData.name == '') {
            Alert.alert('Black Lion', 'Введите имя!');
            return;
        }
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regexp.test(String(this.state.userData.email).toLowerCase())) {
            Alert.alert('Black Lion', 'Введите E-mail!');
            return;
        }

        api.authorize(this.state.userData.phone, this.state.code,
            (result) => {
                let userData = this.state.userData;
                let userToken = result;
                userData.userToken = userToken;
                this.props.route.params.handleLogIn(this.state.userData);
            },
            (error) => {
                Alert.alert('Black Lion', error);
            }
        )
    }   

    printPhone() {
        let phone = this.state.userData.phone;
        let result = "+7 (";
        for(let i = 1; i < phone.length; i++) {
            let c = phone[i];
            if ([1,2,3,5,6,8,10].includes(i)) {
                result += c;
            }
            if (i == 4) {
                result += ') ' + c;
            }
            if (i == 7 || i == 9) {
                result += '-' + c;
            }
        }
        return result;
    }

    parsePhone(text) {
        if(text == '') {
            return '7';
        }
        var matches = text.match(/\d+/g);
        let result = '';
        matches.forEach(digit => {
            result += digit;
        });
        return (result);
    }

    render() {  

        return <ImageBackground source={require('../assets/background.png')} style={styles.background}>
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.imageWrapper}>
                <Image
                    style={styles.logoImg}
                    source={require('../assets/login.png')}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate('Service', {fromLogin: true})}}>
                <Text style={styles.buttonText}>Price</Text>
            </TouchableOpacity>

            <Text style={styles.h1}>
                Вход в систему
            </Text>

            <Text style={styles.label}>Имя</Text>
            <TextInput
                value={this.state.userData.name}
                style={styles.input}
                keyboardAppearance={'dark'}
                keyboardType="default"
                onChangeText={(text) => {
                    let state = this.state;
                    state.userData.name = text;
                    this.setState(state);
                }}
            />
            <Text style={styles.label}>Номер телефона</Text>
            <TextInput
                value={this.printPhone(this.state.userData.phone)}
                style={styles.input}
                keyboardAppearance={'dark'}
                keyboardType="phone-pad"
                onChangeText={(text) => {
                    let state = this.state;
                    state.userData.phone = this.parsePhone(text);
                    this.setState(state);
                }}
            />
            <Text style={styles.label}>E-mail</Text>
            <TextInput
                value={this.state.userData.email}
                style={styles.input}
                autoCorrect={false}
                keyboardAppearance={'dark'}
                keyboardType='email-address'
                onChangeText={(text) => {
                    let state = this.state;
                    state.userData.email = text;
                    this.setState(state);
                }}
            />
            <Text style={styles.label}>Код</Text>
            <TextInput
                value={this.state.code}
                style={styles.input}
                keyboardAppearance={'dark'}
                onChangeText={(text) => {
                    let state = this.state;
                    state.code = text;
                    this.setState(state);
                }}
            />
            <TouchableOpacity style={styles.button} onPress={(this.state.codeSent)? this.handleLogIn: this.handleSendCode}>
                <Text style={styles.buttonText}>{(this.state.codeSent)? 'Войти': 'Отправить код'}</Text>
            </TouchableOpacity>
            <View style={styles.spacer}></View>
        </ScrollView>
        </SafeAreaView>
        </ImageBackground>
    }

    
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    scrollView: {
        width: '80%',
    }, 
    imageWrapper: {
        alignItems: 'center',
        marginTop: 20
    },  
    logoImg: {
        height: width * 0.8 * logoRatio,
        resizeMode: 'contain'
    },
    h1: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
    },  
    background: {
        width: '100%',
        height: '100%',
        justifyContent: "flex-start",
        backgroundColor: 'rgb(25,25,27)'
    },
    label: {
        color: 'white',
        marginTop: 20
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        minHeight: 30,
        fontSize: 25,
        color: 'white'
    },
    button: {
        backgroundColor: 'white',
        marginTop: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40
    },
    buttonText: {
        fontSize: 25,
    },
    spacer: {
        height: 300
    }
});