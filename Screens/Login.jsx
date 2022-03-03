import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

      <Button style={styles.input} mode="outlined">
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

export default Login;
