import { ScrollView, Text, StyleSheet } from "react-native";
import { Searchbar, Snackbar } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Friend from "../components/Friend";

function Search({ navigation }) {
  // refs for userid/token
  const userid = useRef("");
  const sessionToken = useRef("");

  // state for search text
  const [searchQuery, setSearchQuery] = useState("");

  // state for search results
  const [results, setResults] = useState([]);

  // states for snackbar
  const [snackText, setSnackText] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);

  // get stored userid / token
  useEffect(async () => {
    // get asyncstorage user_id and session_token
    try {
      const auserid = await AsyncStorage.getItem("@user_id");
      const asessionToken = await AsyncStorage.getItem("@session_token");

      // set refs for userid/token to use later
      userid.current = auserid;
      sessionToken.current = asessionToken;

      if (auserid !== null && asessionToken !== null) {
        // value previously stored
      } else {
        // reset and kick back to login
        goToLogin(navigation);
      }
    } catch (e) {
      // error reading value - reset and kick back to login
      goToLogin(navigation);
    }
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
        <Searchbar
          placeholder="Search for a friend"
          onChangeText={(text) => {
            setSearchQuery(text);
            searchNewFriends(text, sessionToken.current, setResults);
          }}
          value={searchQuery}
        />
        <Text style={styles.resultsText}>
          {results.length} {results.length === 1 ? "result" : "results"}
        </Text>
        {results.map((res) => (
          <Friend
            key={res.user_id}
            fullname={`${res.user_givenname} ${res.user_familyname}`}
            userid={res.user_id}
            setSnackText={setSnackText}
            setSnackVisible={setSnackVisible}
            sessionToken={sessionToken.current}
            navigation={navigation}
            add
            marginBottom
          />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: "#fff",
    padding: 20,
  },
  resultsText: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
});

// FUNCTIONS

// search for a new friend
function searchNewFriends(query, token, setResults) {
  // if search is 1 character or less.. dont search and clear results
  if (query.length <= 1) {
    setResults([]);
    return;
  }

  axios
    .get("/search", {
      params: { q: query },
      headers: { "X-Authorization": token },
    })
    .then((response) => {
      // set state to contain results
      setResults(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

// kick user to login screen (only need to use .navigate because currently in 'TabNavigation' stack)
function goToLogin(navigation) {
  return navigation.navigate("Login");
}

export default Search;
