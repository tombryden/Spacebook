import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput, Snackbar } from "react-native-paper";
import { useState } from "react";
import axios from "axios";

function EditPost({ route, navigation }) {
  // route params
  const {
    text,
    postid,
    userid,
    token,
    getUserPosts,
    profileUserID,
    setPosts,
    setAllPostsLoading,
  } = route.params;

  // state for post text
  const [postText, setPostText] = useState(text);

  // states for snackbar
  const [snackText, setSnackText] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);

  // on mount update post text to contain passed text
  // useEffect(() => {
  //   const { text, postid, userid, token } = route.params;
  //   setPostText(text);
  // }, []);

  return (
    <View style={styles.container}>
      <Snackbar
        visible={snackVisible}
        onDismiss={() => {
          setSnackVisible(false);
        }}
      >
        {snackText}
      </Snackbar>

      <Text>Edit post</Text>
      <TextInput
        mode="outlined"
        multiline
        numberOfLines={4}
        onChangeText={(post) => {
          setPostText(post);
        }}
        value={postText}
      />
      <Button mode="contained" style={styles.btnConfirm}>
        Confirm
      </Button>
      <Button
        mode="contained"
        style={styles.btnDelete}
        color="darkred"
        onPress={() => {
          deletePost(
            userid,
            postid,
            token,
            navigation,
            setSnackText,
            setSnackVisible,
            getUserPosts,
            profileUserID,
            setPosts,
            setAllPostsLoading
          );
        }}
      >
        Delete post
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    minHeight: "100%",
    padding: 20,
  },
  btnConfirm: {
    marginTop: 5,
  },
  btnDelete: {
    marginTop: 15,
  },
});

// FUNCTIONS

function deletePost(
  userid,
  postid,
  token,
  navigation,
  setSnackText,
  setSnackVisible,
  getUserPosts,
  profileUserID,
  setPosts,
  setAllPostsLoading
) {
  return axios
    .delete(`/user/${userid}/post/${postid}`, {
      headers: { "X-Authorization": token },
    })
    .then(() => {
      // success - refresh posts and navigate to profile
      getUserPosts(profileUserID, token, setPosts, setAllPostsLoading);

      navigation.goBack();
    })
    .catch((err) => {
      const { status } = err.response;
      if (status === 401) {
        navigation.navigate("Login");
      } else if (status === 403) {
        // not your own post
        setSnackText("You can only delete your own posts");
        setSnackVisible(true);
      } else if (status === 404) {
        // post not found
        setSnackText("Post not found");
        setSnackVisible(true);
      } else if (status === 500) {
        // internal
        setSnackText("Internal error. Try again later");
        setSnackVisible(true);
      }
    });
}

export default EditPost;
