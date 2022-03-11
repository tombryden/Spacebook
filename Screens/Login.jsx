import axios from "axios";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Snackbar, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Login({ navigation }) {
  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Login request loading
  const [loading, setLoading] = useState(false);

  // Snackbar states
  const [snackText, setSnackText] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);

  useEffect(() => {
    autoLogin(navigation);
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        label="Password"
        mode="outlined"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <Button
        style={styles.input}
        mode="outlined"
        loading={loading}
        onPress={() => {
          login(
            email,
            password,
            setSnackText,
            setSnackVisible,
            setLoading,
            navigation
          );
        }}
      >
        Login
      </Button>

      <Text>OR</Text>

      <Button
        style={styles.input}
        mode="contained"
        onPress={() => navigation.navigate("Signup")}
      >
        Create an account
      </Button>

      <Snackbar
        visible={snackVisible}
        onDismiss={() => {
          setSnackVisible(false);
        }}
      >
        {snackText}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // gap: "5px",
  },
  input: {
    width: "100%",
  },
});

// Login function
const login = (
  email,
  password,
  setSnackText,
  setSnackVisible,
  setLoading,
  navigation
) => {
  // Set login request loading
  setLoading(true);

  // Create login reqeust object
  const loginObj = { email, password };

  // Send request to backend
  return axios
    .post("/login", loginObj)
    .then(async (response) => {
      // store user id / token in asyncstorage - already in try/catch so no issues
      await AsyncStorage.setItem("@user_id", response.data.id.toString());
      await AsyncStorage.setItem("@session_token", response.data.token);

      // Success - redirect to profile page without nav history
      // navigation.reset({
      //   routes: [{ name: "Profile" }],
      // });
      navigation.navigate("TabNavigation", "Profile");

      // setSnackText("Successfully logged in");
      // setSnackVisible(true);
    })
    .catch((error) => {
      // Invalid email/pwd
      if (error.response.status === 400) {
        setSnackText("Invalid email or password");
        setSnackVisible(true);
      } else {
        setSnackText("An internal error occured. Try again later");
        setSnackVisible(true);
      }
    })
    .finally(() => {
      setLoading(false);
    });
};

// auto login for dev purposes
async function autoLogin(navigation) {
  // get storage for userid / token
  const userid = await AsyncStorage.getItem("@user_id");
  const token = await AsyncStorage.getItem("@session_token");

  if (userid !== null && token !== null) {
    // redirect to profile page
    // Success - redirect to profile page without nav history
    // navigation.reset({
    //   routes: [{ name: "Profile" }],
    // });
    navigation.navigate("TabNavigation", "Profile");
  }
}

export default Login;
