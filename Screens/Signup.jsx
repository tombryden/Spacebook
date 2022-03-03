import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

function Signup() {
  const [first, setFirst] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

      <Button style={styles.input} mode="outlined">
        Sign up
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

export default Signup;
