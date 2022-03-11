import { Text, StyleSheet, View } from "react-native";
import { Button, Snackbar, TextInput } from "react-native-paper";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

function EditProfile({ route, navigation }) {
  // get token from route params
  const { token, userid, setFullProfileName } = route.params;

  // Input field states
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // states for snackbar
  const [snackText, setSnackText] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);

  // on mount get user info
  useEffect(() => {
    getUserInfo(userid, token, setFirst, setLast, setEmail, navigation);
  }, []);

  return (
    <>
      {/* snackbar outside container as causes display issue */}
      <Snackbar
        visible={snackVisible}
        onDismiss={() => {
          setSnackVisible(false);
        }}
      >
        {snackText}
      </Snackbar>

      <View style={styles.container}>
        <Text>Edit Profile</Text>

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
          value={last}
          onChangeText={(text) => setLast(text)}
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
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <Button
          mode="contained"
          style={styles.btnUpdate}
          onPress={() => {
            updateProfile(
              userid,
              token,
              first,
              last,
              email,
              password,
              setSnackText,
              setSnackVisible,
              navigation,
              setFullProfileName
            );
          }}
        >
          Update
        </Button>

        <Button
          mode="contained"
          style={styles.btnLog}
          color="darkred"
          onPress={() => {
            logout(token, navigation);
          }}
        >
          Logout
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    minHeight: "100%",
    padding: 20,
  },
  btnUpdate: {
    marginTop: 10,
  },
  btnLog: {
    marginTop: 20,
  },
});

// FUNCTIONS

function logout(token, navigation) {
  axios
    .post("/logout", null, { headers: { "X-Authorization": token } })
    .then(async () => {
      // reset asyncstorage and kick to login
      await AsyncStorage.removeItem("@user_id");
      await AsyncStorage.removeItem("@session_token");
      navigation.navigate("Login");
    })
    .catch((err) => {
      const { status } = err.response;
      if (status === 401) {
        // unauth - logged out anyway
        navigation.navigate("Login");
      } else if (status === 500) {
        // internal error - redirect to login anyway
        navigation.navigate("Login");
      }
    });
}

// get user info
function getUserInfo(userid, token, setFirst, setLast, setEmail, navigation) {
  return axios
    .get(`/user/${userid}`, {
      headers: { "X-Authorization": token },
    })
    .then((response) => {
      // success - store name and email in state to display fields
      setFirst(response.data.first_name);
      setLast(response.data.last_name);
      setEmail(response.data.email);
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status === 401) {
        navigation.navigate("Login");
      }
    });
}

// update profile
function updateProfile(
  userid,
  token,
  first,
  last,
  email,
  pass,
  setSnackText,
  setSnackVisible,
  navigation,
  setFullProfileName
) {
  return axios
    .patch(
      `/user/${userid}`,
      {
        first_name: first,
        last_name: last,
        email,
        ...(pass !== "" && { password: pass }),
      },
      { headers: { "X-Authorization": token } }
    )
    .then(() => {
      // success

      // update profile full name
      setFullProfileName(`${first} ${last}`);

      // display updated snack
      setSnackText("Updated");
      setSnackVisible(true);
    })
    .catch((err) => {
      const { status } = err.response;
      if (status === 400) {
        // bad req - password issue
        setSnackText("Password is not strong enough");
        setSnackVisible(true);
      } else if (status === 401) {
        // unauth
        navigation.navigate("Login");
      } else if (status === 403) {
        // forbidden
        navigation.navigate("Login");
      } else if (status === 404) {
        // user not found
        navigation.navigate("Login");
      } else if (status === 500) {
        setSnackText("Internal error. Try again later");
        setSnackVisible(true);
      }
    });
}

export default EditProfile;
