import axios from "axios";
import { useState } from "react";
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
        secureTextEntry="true"
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
    padding: "20px",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
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
      console.log(response);

      // store user id / token in asyncstorage - already in try/catch so no issues
      await AsyncStorage.setItem("@user_id", response.data.id);
      await AsyncStorage.setItem("@session_token", response.data.token);

      // Success - redirect to profile page without nav history
      navigation.reset({
        routes: [{ name: "Profile" }],
      });

      // setSnackText("Successfully logged in");
      // setSnackVisible(true);
    })
    .catch((error) => {
      console.log(error);

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

export default Login;
