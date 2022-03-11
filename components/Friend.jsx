import axios from "axios";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, Card, IconButton } from "react-native-paper";
import { useEffect, useState } from "react";

function Friend(props) {
  // state for profile image
  const [image, setImage] = useState("");

  const {
    marginBottom,
    request,
    add,
    fullname,
    userid,
    setSnackText,
    setSnackVisible,
    sessionToken,
    navigation,
    getFriendRequests,
    pressable,
  } = props;

  // on mount get profile
  useEffect(() => {
    getProfileImage(
      userid,
      sessionToken,
      setImage,
      navigation,
      setSnackText,
      setSnackVisible
    );
  }, []);
  return (
    <Card
      mode="outlined"
      style={marginBottom && { marginBottom: 10 }}
      onPress={() => {
        if (pressable) {
          navigation.navigate("AnotherProfile", { pUserID: userid });
        }
      }}
    >
      <Card.Content>
        <View style={styles.cardContainer}>
          <Avatar.Image
            size={30}
            source={{ uri: `data:image/png;base64,${image}` }}
          />
          <Text style={styles.name}>{fullname}</Text>
          {request ? (
            <View style={styles.requestContainer}>
              <IconButton
                icon="check-circle"
                size={30}
                onPress={() => {
                  confirmFriendRequest(
                    userid,
                    sessionToken,
                    setSnackText,
                    setSnackVisible,
                    navigation,
                    getFriendRequests
                  );
                }}
              />
              <IconButton
                icon="delete"
                size={30}
                onPress={() => {
                  deleteFriendRequest(
                    userid,
                    sessionToken,
                    setSnackText,
                    setSnackVisible,
                    navigation,
                    getFriendRequests
                  );
                }}
              />
            </View>
          ) : (
            <View style={styles.singleIcon}>
              {add && (
                <IconButton
                  icon="plus-circle-outline"
                  size={30}
                  onPress={() => {
                    requestFriend(
                      userid,
                      sessionToken,
                      setSnackText,
                      setSnackVisible,
                      navigation
                    );
                  }}
                />
              )}
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    marginLeft: 5,
    fontWeight: "bold",
  },
  singleIcon: {
    marginLeft: "auto",
  },
  requestContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto",
  },
});

// FUNCTIONS

/**
 * Request a new friend
 * @param {string} userid user id to add
 * @param {string} token curent logged in session token
 */
function requestFriend(
  userid,
  token,
  setSnackText,
  setSnackVisible,
  navigation
) {
  return axios
    .post(`/user/${userid}/friends`, null, {
      headers: { "X-Authorization": token },
    })
    .then((res) => {
      // successfully sent friend request
      console.log(res);
      setSnackText("Friend request sent");
      setSnackVisible(true);
    })
    .catch((error) => {
      if (error.response.status === 401) {
        // unauthorised kick back to login
        navigation.navigate("Login");
      } else if (error.response.status === 403) {
        setSnackText("Request already sent");
        setSnackVisible(true);
      } else if (error.response.status === 404) {
        setSnackText("User not found");
        setSnackVisible(true);
      } else {
        setSnackText("Internal error. Try again later");
        setSnackVisible(true);
      }
    });
}

/**
 * Confirm an existing friend request
 * @param {string} userid User ID to accept
 * @param {string} token Session token for current logged in user
 * @param {Function} setSnackText Snackbar text value
 * @param {Function} setSnackVisible Snackbar boolean for visibility
 * @param {Function} navigation React navigation prop
 * @param {Function} getFriendRequests Function to refresh friend requests
 */
function confirmFriendRequest(
  userid,
  token,
  setSnackText,
  setSnackVisible,
  navigation,
  getFriendRequests
) {
  axios
    .post(`/friendrequests/${userid}`, null, {
      headers: { "X-Authorization": token },
    })
    .then(() => {
      // success - friend confirmed
      setSnackText("Friend added");
      setSnackVisible(true);

      // refresh friend requests
      getFriendRequests();
    })
    .catch((err) => {
      const { status } = err.response;
      console.log(err);
      if (status === 401) {
        // unauthorised
        navigation.navigate("Login");
      } else if (status === 404) {
        setSnackText("Friend request not found");
        setSnackVisible(true);
      } else {
        setSnackText("Internal error. Try again later");
        setSnackVisible(true);
      }
    });
}

/**
 *
 * @param {string} userid User ID to decline
 * @param {string} token Session token for current logged in user
 * @param {Function} setSnackText Snackbar text value
 * @param {Function} setSnackVisible Snackbar boolean for visibility
 * @param {Function} navigation React navigation prop
 * @param {Function} getFriendRequests Function to refresh friend requests
 */
function deleteFriendRequest(
  userid,
  token,
  setSnackText,
  setSnackVisible,
  navigation,
  getFriendRequests
) {
  axios
    .delete(`/friendrequests/${userid}`, {
      headers: { "X-Authorization": token },
    })
    .then(() => {
      setSnackText("Friend request declined");
      setSnackVisible(true);

      // refresh friend requests
      getFriendRequests();
    })
    .catch((err) => {
      const { status } = err.response;
      if (status === 401) {
        // unauthorised
        navigation.navigate("Login");
      } else if (status === 404) {
        setSnackText("Friend request not found");
        setSnackVisible(true);
      } else {
        setSnackText("Internal error. Try again later");
        setSnackVisible(true);
      }
    });
}

// get profile image for friend
function getProfileImage(
  userid,
  token,
  setImage,
  navigation,
  setSnackText,
  setSnackVisible
) {
  return axios
    .get(`/user/${userid}/photo`, { headers: { "X-Authorization": token } })
    .then((res) => {
      // success

      // if no photo - don't update images
      if (!res.data.includes("JFIF")) {
        setImage(res.data);
      }
    })
    .catch((err) => {
      console.log(err);
      const { status } = err.response;
      if (status === 401) {
        // un auth
        navigation.navigate("Login");
      } else {
        setSnackText("Internal error. Try again later");
        setSnackVisible(true);
      }
    });
}

export default Friend;
