import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  AppState,
  StyleSheet,
  View,
  Image,
  Text,
  ImageBackground,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import {
  BottomTabBar,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "react-native-splash-screen";

import HomeScreen from "./screens/HomeScreen";
import InfoScreen from "./screens/InfoScreen";
import LoginScreen from "./screens/LoginScreen";
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

  componentWillUnmount() {}

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
    } finally {
      SplashScreen.hide();
    }
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
    if (this.state.state == "loading") {
      return LoadingScreen();
    }

    if (this.state.state == "notLogedIn") {
      return <LoginScreen logIn={this.handleLogIn} />;
    }

    if (this.state.state == "logedIn") {
      return (
        <View style={styles.container}>
          <ImageBackground
            source={require("./assets/background.png")}
            style={mainStyle.styles.background}
          >
            <StatusBar style="light" />
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarShowLabel: false,
                  tabBarActiveTintColor: mainStyle.accentColor,
                  tabBarStyle: {
                    backgroundColor: "rgba(25,25,27,0)",
                    borderTopColor: "grey",
                    height: 90,
                    position: "absolute",
                  },
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
            </NavigationContainer>
          </ImageBackground>
        </View>
      );
    }
  }
}

function LoadingScreen() {
  return (
    <View>
      <Text>Загрузка</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarIconImage: {
    resizeMode: "contain",
    height: 50,
  },
});
