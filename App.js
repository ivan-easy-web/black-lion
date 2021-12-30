import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { AppState, StyleSheet, View, Image, Text, ImageBackground } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "react-native-splash-screen";

import HomeScreen from "./screens/HomeScreen";
import InfoScreen from "./screens/InfoScreen";
import InitialScreen from "./screens/InitialScreen";
import mainStyle from "./styles/main";

const Tab = createBottomTabNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);

    let state = {
      userData: undefined,
      state: "loading",
    };

    this.state = state;

    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    this.readData();

    this.appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "background" || nextAppState === "inactive") {
          let userData = this.state.userData;
          if (userData == undefined) {
            userData = null;
          }
          AsyncStorage.setItem("@userData", JSON.stringify(userData));
        }
      }
    );
  }

  readData = async () => {
    
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("@userData"));
      let state = this.state;
      if (userData !== null) {
        state.userData = userData;
        state.state = "logedIn";
      } else {
        state.state = "notLogedIn";
      }
      this.setState(state);
    } catch (e) {
      alert("Failed to fetch the data from storage");
    }
    SplashScreen.hide();
    
  };

  handleLogIn(userData) {
    let state = this.state;
    state.userData = userData;
    state.state = "logedIn";
    this.setState(state);
  }

  handleLogOut() {
    let state = this.state;
    state.userData = undefined;
    state.state = "notLogedIn";
    this.setState(state);
  }

  render() {

    let currentNavigator;

    if (this.state.state == "notLogedIn") {
      currentNavigator = InitialScreen(this.handleLogIn);
    }

    if (this.state.state == "logedIn") {
      currentNavigator = <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: mainStyle.accentColor,
        tabBarStyle: {
          backgroundColor: "rgba(25,25,27,0)",
          borderTopColor: "grey",
          height: 90,
          position: 'absolute'
        }
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        initialParams={{
          userData: this.state.userData,
          logOut: this.handleLogOut,
        }}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  style={styles.tabBarIconImage}
                  source={
                    focused
                      ? require("./assets/ic_price.png")
                      : require("./assets/ic_price_off.png")
                  }
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  style={styles.tabBarIconImage}
                  source={
                    focused
                      ? require("./assets/ic_main.png")
                      : require("./assets/ic_main_off.png")
                  }
                />
              </View>
            );
          },
        }}
        initialParams={{
          userData: this.state.userData,
        }}
      />
      </Tab.Navigator>
    }

    
    return (
      <View style={[styles.container, styles.appContainer]}>
        <ImageBackground source={require('./assets/background.png')} style={mainStyle.styles.background}>
        <StatusBar style="light" />
        {(this.state.state == "loading")? 
          <LoadingScreen></LoadingScreen>:  
          <NavigationContainer>
          {currentNavigator}
        </NavigationContainer>
        }
        </ImageBackground>
      </View>
    );
  }
}

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <Text style={styles.text}>Загрузка</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    backgroundColor: 'rgb(25,25,27)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 38
  },
  container: {
    flex: 1,
  },
  appContainer: {
    backgroundColor: 'rgb(25,25,27)'
  },
  tabBarIconImage: {
    resizeMode: "contain",
    height: 50,
  },
});
