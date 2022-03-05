import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar, Button } from "react-native-paper";

function Profile() {
  // states for profile
  const [fullName, setFullName] = useState("");

  // get user info - /user on component mount
  useEffect(async () => {
    // get asyncstorage user_id and session_token
    try {
      const userid = await AsyncStorage.getItem("@user_id");
      const sessionToken = await AsyncStorage.getItem("@session_token");

      if (userid !== null && sessionToken !== null) {
        // value previously stored
        console.log(`${userid} | ${sessionToken}`);

        // get user info and update states
        getUserInfo(userid, sessionToken, setFullName);
      } else {
        // reset and kick back to login
      }
    } catch (e) {
      // error reading value - reset and kick back to login
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* profileContainer view contains profile avatar, edit profile button, friends button */}
      <View style={styles.profileContainer}>
        <Avatar.Image size={120} />
        <Text style={styles.nameText}>{fullName}</Text>
        {/* container for edit profile / friends */}
        <View style={styles.buttonContainer}>
          <Button icon="account-edit">Edit Profile</Button>
          <Button icon="account-group">Friends</Button>
        </View>
      </View>

      <View style={styles.postContainer}>
        <Text style={styles.postText}>Posts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: "20px",
    backgroundColor: "#fff",
    // borderWidth: 1,
    // borderColor: "red",
    minHeight: "100%",
  },
  profileContainer: {
    // display flex so doesnt take up full container
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  nameText: {
    fontSize: "25px",
    fontWeight: "bold",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  postContainer: {},
  postText: {
    fontSize: "25px",
  },
});

// functions
function getUserInfo(userid, token, setFullName) {
  return axios
    .get(`/user/${userid}`, {
      headers: { "X-Authorization": token },
    })
    .then((response) => {
      // success - store name in state
      console.log(response);
      setFullName(`${response.data.first_name} ${response.data.last_name}`);
    })
    .catch((error) => {
      console.log(error);
    });
}

export default Profile;
