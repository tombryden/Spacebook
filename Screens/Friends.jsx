import axios from "axios";
import { ScrollView, Text, StyleSheet } from "react-native";
import { ActivityIndicator, Button, Snackbar } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Friend from "../components/Friend";

function Friends({ route, navigation }) {
  // ref for profile user id - the user to get friends
  const profileUserID = useRef("");

  // refs for userid/token
  const userid = useRef("");
  const sessionToken = useRef("");

  // friend request list state
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  // friend list state
  const [friends, setFriends] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(true);

  // states for snackbar
  const [snackText, setSnackText] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);

  // on component load, get session token and user, get friend requests and list of friends
  useEffect(async () => {
    // variable for refresh interval - refresh friend requests every 5 seconds
    let refreshInterval;

    try {
      const auserid = await AsyncStorage.getItem("@user_id");
      const asessionToken = await AsyncStorage.getItem("@session_token");

      // set refs for userid/token to use later
      userid.current = Number(auserid);
      sessionToken.current = asessionToken;

      if (auserid !== null && asessionToken !== null) {
        // value previously stored

        // let for profile to load - default to current logged in userid
        let finalProfileUserID = auserid;

        // check if this is viewing not your own profile
        if (route.params !== undefined && route.params.pUserID !== undefined) {
          const { pUserID } = route.params;

          finalProfileUserID = pUserID;
        }

        profileUserID.current = Number(finalProfileUserID);

        // get friends instantly on mount... and below kick off a timer every 5 seconds

        // check if own users profile ... if not we don't want to get friend requests
        if (auserid === finalProfileUserID) {
          getFriendRequests(
            asessionToken,
            setRequests,
            setSnackText,
            setSnackVisible,
            navigation,
            setRequestsLoading,
            false
          );
        } else {
          // remove loading for friend requests - don't want to see friend requests for other peoples profiles
          setRequestsLoading(false);
        }

        getFriendsList(
          finalProfileUserID,
          asessionToken,
          setFriends,
          setFriendsLoading,
          false,
          navigation,
          setSnackText,
          setSnackVisible
        );
      } else {
        // reset and kick back to login
        navigation.navigate("Login");
      }
    } catch (e) {
      // error reading value - reset and kick back to login
      navigation.navigate("Login");
    }

    // clear interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <>
      <Snackbar
        visible={snackVisible}
        onDismiss={() => {
          setSnackVisible(false);
        }}
      >
        {snackText}
      </Snackbar>

      <ScrollView contentContainerStyle={styles.container}>
        <Button
          mode="contained"
          style={styles.addButton}
          onPress={() => {
            navigation.navigate("Search");
          }}
        >
          Add a new friend
        </Button>
        {userid.current === profileUserID.current && (
          <Text>Incoming friend requests</Text>
        )}
        {requestsLoading ? (
          <ActivityIndicator />
        ) : (
          requests.map((item) => (
            <Friend
              key={item.user_id}
              userid={item.user_id}
              fullname={`${item.first_name} ${item.last_name}`}
              navigation={navigation}
              setSnackText={setSnackText}
              setSnackVisible={setSnackVisible}
              sessionToken={sessionToken.current}
              getFriendRequests={() => {
                getFriendRequests(
                  sessionToken.current,
                  setRequests,
                  setSnackText,
                  setSnackVisible,
                  navigation,
                  setRequestsLoading,
                  true
                );
              }}
              request
              marginBottom
            />
          ))
        )}

        <Text>Friends</Text>
        {friendsLoading ? (
          <ActivityIndicator />
        ) : (
          friends.map((item) => (
            <Friend
              key={item.user_id}
              userid={item.user_id}
              fullname={`${item.user_givenname} ${item.user_familyname}`}
              navigation={navigation}
              setSnackText={setSnackText}
              setSnackVisible={setSnackVisible}
              sessionToken={sessionToken.current}
              getFriendsList={() => {
                getFriendsList(
                  userid.current,
                  sessionToken.current,
                  setFriends,
                  setFriendsLoading,
                  true,
                  navigation,
                  setSnackText,
                  setSnackVisible
                );
              }}
              pressable={userid.current === profileUserID.current}
              marginBottom
            />
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    padding: 20,
    backgroundColor: "#fff",
  },
  addButton: {
    marginBottom: 10,
  },
});

// FUNCTIONS

/**
 *
 * @param {string} token Session token
 * @param {Function} setRequests State for setting response
 * @param {Function} setSnackText State for setting snackbar text
 * @param {Function} setSnackVisible State for setting snackbar visible
 * @param {Function} navigation Navigation prop
 * @param {Function} setRequestsLoading State for setting loading spinner
 * @param {Boolean} displayLoading Should there be a loading spinner
 * @returns
 */
function getFriendRequests(
  token,
  setRequests,
  setSnackText,
  setSnackVisible,
  navigation,
  setRequestsLoading,
  displayLoading
) {
  // only show loading spinner when needed
  if (displayLoading) setRequestsLoading(true);

  return axios
    .get("/friendrequests", { headers: { "X-Authorization": token } })
    .then((response) => {
      // success - friend list
      setRequests(response.data);
    })
    .catch((err) => {
      // console.log(err);
      const { status } = err.response;
      if (status === 401) {
        // test
        navigation.navigate("Login");
      } else {
        setSnackText("Internal error. Try again later");
        setSnackVisible(true);
      }
    })
    .finally(() => {
      setRequestsLoading(false);
    });
}

/**
 * Get list of friends
 * @param {string} userid User to get friends list
 * @param {string} token Current logged in user token
 * @param {Function} setFriends State for friends json
 * @param {Function} setFriendsLoading State for loading spinner
 * @param {Boolean} displayLoading True = spinner will appear when loading, false = no spinner, results updated in background
 * @param {Function} navigation Navigation prop from react navigation
 * @param {Function} setSnackText State for snackbar text
 * @param {Function} setSnackVisible State for snackbar visiblity
 * @returns
 */
function getFriendsList(
  userid,
  token,
  setFriends,
  setFriendsLoading,
  displayLoading,
  navigation,
  setSnackText,
  setSnackVisible
) {
  if (displayLoading) setFriendsLoading(true);

  return axios
    .get(`/user/${userid}/friends`, { headers: { "X-Authorization": token } })
    .then((response) => {
      // successfully got friends list
      setFriends(response.data);
    })
    .catch((err) => {
      const { status } = err.response;
      if (status === 401) {
        navigation.navigate("Login");
      } else if (status === 403) {
        setSnackText("You can't view non-friends friends lists");
        setSnackVisible(true);
      } else if (status === 404) {
        setSnackText("User not found");
        setSnackVisible(true);
      } else {
        setSnackText("Internal error. Try again later");
        setSnackVisible(true);
      }
    })
    .finally(() => {
      setFriendsLoading(false);
    });
}

export default Friends;
