import React from "react";
import {
  ImageBackground,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  withSafeAreaInsets,
} from "react-native-safe-area-context";
import Api from "../components/Api";
import mainStyle from "../styles/main";

function FormScreen(props) {
  let record = (userData) => {
    let api = new Api();
    api.record(
      props.route.params.service.id,
      props.route.params.staff.id,
      props.route.params.time,
      userData.phone,
      userData.name,
      userData.email,
      (result) => {
        Alert.alert("Black Lion", "Вы записаны!");
        props.navigation.popToTop();
      },
      (error) => {
        Alert.alert("Black Lion", error);
      }
    );
  };
  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.background}
    >
      <SafeAreaView
        style={[styles.container, { paddingTop: props.insets.top + 8 }]}
      >
        <Text style={styles.text}>{props.route.params.service.title}</Text>
        <Text style={styles.text}>{props.route.params.staff.name}</Text>
        <Text style={styles.text}>
          {new Date(Date.parse(props.route.params.time)).toLocaleString("rus")}
        </Text>
        <Text style={styles.text}>
          {props.route.params.service.price_min} руб.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => record(props.route.params.userData)}
        >
          <Text style={styles.buttonText}>Подтвердить</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default withSafeAreaInsets(FormScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
  },
  background: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    backgroundColor: "rgb(25,25,27)",
  },
  text: {
    color: mainStyle.secondColor,
    width: "90%",
    marginTop: 10,
    fontSize: 20,
  },
  button: {
    borderRadius: 50,
    height: 40,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: mainStyle.accentColor,
    marginTop: 10,
  },
  buttonText: {
    color: mainStyle.secondColor,
    fontSize: 20,
  },
});
