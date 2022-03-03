import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Snackbar, TextInput } from "react-native-paper";
import axios from "axios";

function Signup() {
  // Input field states
  const [first, setFirst] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Loading sign up request
  const [loading, setLoading] = useState(false);

  // Snack bar states
  const [snackText, setSnackText] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        label="Firstname"
        mode="outlined"
        value={first}
        onChangeText={(text) => setFirst(text)}
      />
      <TextInput
        style={styles.input}
        label="Surname"
        mode="outlined"
        value={surname}
        onChangeText={(text) => setSurname(text)}
      />
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
          signUp(
            first,
            surname,
            email,
            password,
            setSnackText,
            setSnackVisible,
            setLoading
          );
        }}
      >
        Sign up
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

// Signup function
const signUp = (
  first,
  surname,
  email,
  password,
  setSnackText,
  setSnackVisible,
  setLoading
) => {
  setLoading(true);

  // create sign up request object
  const signUpRequest = {
    first_name: first,
    last_name: surname,
    email,
    password,
  };

  // hit user endpoint to create new account with specified info
  return axios
    .post("/user", signUpRequest)
    .then((response) => {
      console.log(response);
      setSnackText("Successfully signed up");
      setSnackVisible(true);
    })
    .catch((error) => {
      console.log(error);
      setSnackText("Something went wrong");
      setSnackVisible(true);
    })
    .finally(() => {
      setLoading(false);
    });
};

export default Signup;
