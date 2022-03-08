import axios from "axios";
import { ScrollView, Text, StyleSheet } from "react-native";
import { ActivityIndicator, Button, Snackbar } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Friend from "../components/Friend";

function Friends({ navigation }) {
  // refs for userid/token
  const userid = useRef("");
  const sessionToken = useRef("");

  // friend request list state
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

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
      userid.current = auserid;
      sessionToken.current = asessionToken;

      if (auserid !== null && asessionToken !== null) {
        // value previously stored

        // get friend requests instantly on mount... and below kick off a timer every 5 seconds
        getFriendRequests(
          asessionToken,
          setRequests,
          setSnackText,
          setSnackVisible,
          navigation,
          setRequestsLoading,
          false
        );

        refreshInterval = setInterval(() => {
          // get friend requests
          getFriendRequests(
            asessionToken,
            setRequests,
            setSnackText,
            setSnackVisible,
            navigation,
            setRequestsLoading,
            false
          );
        }, 5000);
      } else {
        // reset and kick back to login
        navigation.navigate("Login");
      }
    } catch (e) {
      // error reading value - reset and kick back to login
      navigation.navigate("Login");
    }

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
        <Button mode="contained" style={styles.addButton}>
          Add a new friend
        </Button>
        <Text>Incoming friend requests</Text>
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
        <Friend marginBottom />
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

export default Friends;
