import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, FlatList, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Snackbar,
  TextInput,
} from "react-native-paper";
import Post from "../components/Post";

function Profile({ navigation }) {
  // refs for userid/token
  const userid = useRef("");
  const sessionToken = useRef("");

  // states for profile
  const [fullName, setFullName] = useState("");

  // state for posts
  const [postText, setPostText] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [allPostsLoading, setAllPostsLoading] = useState(true);

  // states for snackbar
  const [snackText, setSnackText] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);

  // get user info - /user on component mount
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
        console.log(`${auserid} | ${asessionToken}`);

        // get user info and update states
        getUserInfo(
          auserid,
          asessionToken,
          setFullName,
          setPosts,
          setAllPostsLoading
        );
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
    <ScrollView>
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
          <TextInput
            mode="outlined"
            placeholder="Create a new post"
            right={<TextInput.Affix text="/50" />}
            multiline
            numberOfLines={4}
            onChangeText={(post) => {
              setPostText(post);
            }}
            value={postText}
          />
          <Button
            style={styles.postButton}
            mode="contained"
            loading={postLoading}
            onPress={() => {
              createNewPost(
                userid.current,
                sessionToken.current,
                postText,
                setSnackText,
                setSnackVisible,
                setPostText,
                setPostLoading,
                navigation
              );
            }}
          >
            Post
          </Button>

          {/* list of posts */}
          {allPostsLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(item) => item.post_id}
              renderItem={({ item }) => (
                <Post
                  fullname={`${item.author.first_name} ${item.author.last_name}`}
                  post={item.text}
                  timestamp={item.timestamp}
                  likes={item.numLikes}
                  userid={userid.current}
                  token={sessionToken.current}
                  postid={item.post_id}
                  marginBottom
                />
              )}
            />
          )}
        </View>
      </View>

      {/* snackbar outside container as causes display issue */}
      <Snackbar
        visible={snackVisible}
        onDismiss={() => {
          setSnackVisible(false);
        }}
      >
        {snackText}
      </Snackbar>
    </ScrollView>
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
  postContainer: { flex: 1, gap: "5px" },
  postText: {
    fontSize: "25px",
  },
  postButton: {
    marginBottom: "5px",
  },
});

// functions
function getUserInfo(userid, token, setFullName, setPosts, setAllPostsLoading) {
  return axios
    .get(`/user/${userid}`, {
      headers: { "X-Authorization": token },
    })
    .then((response) => {
      // success - store name in state and get user posts
      console.log(response);
      setFullName(`${response.data.first_name} ${response.data.last_name}`);

      // get user posts
      getUserPosts(userid, token, setPosts, setAllPostsLoading);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getUserPosts(userid, token, setPosts, setAllPostsLoading) {
  return axios
    .get(`/user/${userid}/post`, { headers: { "X-Authorization": token } })
    .then((response) => {
      console.log(response.data);
      setPosts(response.data);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      setAllPostsLoading(false);
    });
}

function createNewPost(
  userid,
  token,
  text,
  setSnackText,
  setSnackVisible,
  setPostText,
  setPostLoading,
  navigation
) {
  setPostLoading(true);

  return axios
    .post(
      `/user/${userid}/post`,
      { text },
      {
        headers: { "X-Authorization": token },
      }
    )
    .then((response) => {
      // success - refresh posts with notification and reset create a new post input
      console.log(response);
      setSnackText("Post created");
      setSnackVisible(true);
      setPostText("");
    })
    .catch((error) => {
      console.log(error);
      // bad request
      if (error.response.status === 400) {
        setSnackText("Something is wrong with your message");
        setSnackVisible(true);
      } else if (error.response.status === 401) {
        // reset and kick back to login - unauthorised
        goToLogin(navigation);
      } else {
        setSnackText("An internal error occured. Try again later");
        setSnackVisible(true);
      }
    })
    .finally(() => {
      setPostLoading(false);
    });
}

// ask user to login again
function goToLogin(navigation) {
  return navigation.reset({
    routes: [{ name: "Login" }],
  });
}

export default Profile;
