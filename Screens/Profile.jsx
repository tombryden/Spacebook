import axios from "axios";
import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Snackbar,
  TextInput,
} from "react-native-paper";
import Post from "../components/Post";

function Profile({ route, navigation }) {
  // ref for profile user id
  const profileUserID = useRef();

  // refs for logged in userid/token
  const userid = useRef();
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

  // state for image
  const [image, setImage] = useState("");

  // get user info - /user on component mount
  useEffect(async () => {
    // get asyncstorage user_id and session_token
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

        // get user info and update states
        getUserInfo(
          finalProfileUserID,
          asessionToken,
          setFullName,
          setPosts,
          setAllPostsLoading,
          navigation
        );

        // get profile image
        getProfileImage(
          finalProfileUserID,
          asessionToken,
          setImage,
          navigation,
          setSnackText,
          setSnackVisible
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

      <ScrollView contentContainerStyle={styles.container}>
        {/* <View style={styles.container}> */}
        {/* profileContainer view contains profile avatar, edit profile button, friends button */}
        <View style={styles.profileContainer}>
          {/* wrap in touchableopacity so can press avatar to upload photo */}
          <TouchableOpacity
            onPress={() => {
              if (Number(userid.current) === Number(profileUserID.current))
                selectAndUploadProfileImage(
                  userid.current,
                  sessionToken.current,
                  setSnackText,
                  setSnackVisible,
                  navigation,
                  setImage
                );
            }}
          >
            <Avatar.Image
              source={{ uri: `data:image/png;base64,${image}` }}
              size={120}
            />
          </TouchableOpacity>
          <Text style={styles.nameText}>{fullName}</Text>
          {/* container for edit profile / friends */}
          <View style={styles.buttonContainer}>
            {/* only show edit profile if its users own profile */}
            {profileUserID.current === userid.current && (
              <Button
                icon="account-edit"
                onPress={() => {
                  navigation.navigate("EditProfile", {
                    token: sessionToken.current,
                    userid: userid.current,
                    setFullProfileName: setFullName,
                  });
                }}
              >
                Edit Profile
              </Button>
            )}

            <Button
              icon="account-group"
              onPress={() => {
                // if profileUserID is the current logged in user.. navigate to their tab of friends - else - on another user profile, therefore navigate to AnotherFriends stack nav

                if (profileUserID.current === userid.current) {
                  navigation.navigate("Friends");
                } else {
                  navigation.navigate("AnotherFriends", {
                    pUserID: profileUserID.current,
                  });
                }
              }}
            >
              Friends
            </Button>
          </View>
        </View>

        <View style={styles.postContainer}>
          <Text style={styles.postText}>Posts</Text>
          <TextInput
            mode="outlined"
            placeholder="Create a new post"
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
                profileUserID.current,
                sessionToken.current,
                postText,
                setSnackText,
                setSnackVisible,
                setPostText,
                setPostLoading,
                navigation,
                setPosts,
                setAllPostsLoading
              );
            }}
          >
            Post
          </Button>

          {/* list of posts - using .map instead of FlatList so ScrollView can be used */}
          {allPostsLoading ? (
            <ActivityIndicator />
          ) : (
            posts.map((item) => (
              <Post
                key={item.post_id}
                fullname={`${item.author.first_name} ${item.author.last_name}`}
                post={item.text}
                timestamp={item.timestamp}
                likes={item.numLikes}
                postUserID={item.author.user_id}
                userid={userid.current}
                token={sessionToken.current}
                postid={item.post_id}
                setSnackText={setSnackText}
                setSnackVisible={setSnackVisible}
                navigation={navigation}
                getUserPosts={getUserPosts}
                profileUserID={profileUserID.current}
                setPosts={setPosts}
                setAllPostsLoading={setAllPostsLoading}
                marginBottom
              />
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    // borderWidth: 1,
    // borderColor: "red",
    minHeight: "100%",
  },
  profileContainer: {
    // display flex so doesnt take up full container
    display: "flex",
    alignItems: "center",
    // gap: "5px",
  },
  nameText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  postContainer: {
    flex: 1,
    // gap: "5px"
  },
  postText: {
    fontSize: 25,
  },
  postButton: {
    marginBottom: 5,
    marginTop: 5,
  },
});

// functions
function getUserInfo(
  userid,
  token,
  setFullName,
  setPosts,
  setAllPostsLoading,
  navigation
) {
  return axios
    .get(`/user/${userid}`, {
      headers: { "X-Authorization": token },
    })
    .then((response) => {
      // success - store name in state and get user posts
      setFullName(`${response.data.first_name} ${response.data.last_name}`);

      // get user posts
      getUserPosts(userid, token, setPosts, setAllPostsLoading);
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status === 401) {
        navigation.navigate("Login");
      }
    });
}

function getUserPosts(userid, token, setPosts, setAllPostsLoading) {
  return axios
    .get(`/user/${userid}/post`, { headers: { "X-Authorization": token } })
    .then((response) => {
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
  navigation,
  setPosts,
  setAllPostsLoading
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
    .then(() => {
      // success - refresh posts with notification and reset create a new post input
      setSnackText("Post created");
      setSnackVisible(true);
      setPostText("");

      // refresh posts
      getUserPosts(userid, token, setPosts, setAllPostsLoading);
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

// kick user to login screen
function goToLogin(navigation) {
  return navigation.navigate("Login");
}

// select image
async function selectAndUploadProfileImage(
  userid,
  token,
  setSnackText,
  setSnackVisible,
  navigation,
  setImage
) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    base64: true,
  });

  if (!result.cancelled) {
    // got result - upload image
    console.log(`image picked: ${result.base64}`);
    // upload image 64 to backend
    axios
      .post(`/user/${userid}/photo`, result.base64, {
        headers: { "Content-Type": "image/png", "X-Authorization": token },
      })
      .then(() => {
        // refresh profile image
        getProfileImage(
          userid,
          token,
          setImage,
          navigation,
          setSnackText,
          setSnackVisible
        );
      })
      .catch((err) => {
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
}

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

export default Profile;
