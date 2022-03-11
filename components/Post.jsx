import { Avatar, Card, IconButton } from "react-native-paper";
import { Text, StyleSheet, View } from "react-native";
import moment from "moment";
import axios from "axios";
import { useState } from "react";

function Post(props) {
  const {
    fullname,
    post,
    marginBottom,
    timestamp,
    likes,
    userid,
    postUserID,
    postid,
    token,
    setSnackText,
    setSnackVisible,
    navigation,
    getUserPosts,
    profileUserID,
    setPosts,
    setAllPostsLoading,
  } = props;

  const [likesSt, setLikesSt] = useState(Number(likes));

  const formattedDate = moment(timestamp).format("DD MMMM"); // eg 06 March
  const formattedTime = moment(timestamp).format("HH:mm"); // eg 19:51

  return (
    <Card
      mode="outlined"
      style={[styles.container, marginBottom && { marginBottom: 10 }]}
    >
      <Card.Content>
        <View style={styles.cardContainer}>
          <View style={styles.leftContainer}>
            <View style={styles.avatarNameContainer}>
              <Avatar.Image size={20} />
              <Text style={styles.fullname}>{fullname}</Text>
            </View>
            <Text>
              {formattedDate} at {formattedTime}
            </Text>
            <Text style={styles.postText}>{post}</Text>
          </View>

          {/* container for right side of post (likes) */}
          <View style={styles.rightContainer}>
            {/* if user owns the post.. allow them to edit it */}
            {userid === postUserID && (
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => {
                  navigation.navigate("EditPost", {
                    text: post,
                    userid: profileUserID,
                    postid,
                    token,
                    getUserPosts,
                    profileUserID,
                    setPosts,
                    setAllPostsLoading,
                  });
                }}
              />
            )}
            <View style={styles.rightRow}>
              <Text style={styles.likeText}>{likesSt}</Text>
              <IconButton
                icon="thumb-up-outline"
                size={20}
                onPress={() => {
                  likePost(
                    profileUserID,
                    postid,
                    token,
                    setSnackText,
                    setSnackVisible,
                    navigation,
                    likesSt,
                    setLikesSt
                  );
                }}
              />
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
  },
  leftContainer: {
    maxWidth: "80%",
    display: "flex",
  },
  avatarNameContainer: {
    display: "flex",
    flexDirection: "row",
    // gap: "5px",
  },
  fullname: {
    fontWeight: "bold",
  },
  postText: {
    fontSize: 25,
    marginTop: 10,
  },
  rightContainer: {
    marginLeft: "auto",

    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  rightRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  likeText: {
    position: "relative",
    top: 1,
  },
});

// functions

// like a post
function likePost(
  profileUserID,
  postid,
  token,
  setSnackText,
  setSnackVisible,
  navigation,
  likesSt,
  setLikesSt
) {
  return axios
    .post(`/user/${profileUserID}/post/${postid}/like`, null, {
      headers: { "X-Authorization": token },
    })
    .then(() => {
      // success - post liked
      // update like counter to +1
      setLikesSt(likesSt + 1);

      setSnackText("Post liked");
      setSnackVisible(true);
    })
    .catch((error) => {
      const { status } = error.response;
      if (status === 400) {
        // bad request - error from mysql duplicate entry
        // setSnackText("Post already liked");
        // setSnackVisible(true);

        // post already liked - removed a like
        unlikePost(
          profileUserID,
          postid,
          token,
          setSnackText,
          setSnackVisible,
          navigation,
          likesSt,
          setLikesSt
        );
      } else if (status === 401) {
        // unauthorised - kick to login
        navigation.navigate("Login");
      } else if (status === 403) {
        // cant like posts on your own wall, or your own posts
        setSnackText("You can't like your own posts");
        setSnackVisible(true);
      } else if (status === 404) {
        // post not found
        setSnackText("Post not found");
        setSnackVisible(true);
      } else if (status === 500) {
        // internal error
        setSnackText("An internal error occured. Try again later");
        setSnackVisible(true);
      }
    });
}

// unlike a post
function unlikePost(
  profileUserID,
  postid,
  token,
  setSnackText,
  setSnackVisible,
  navigation,
  likesSt,
  setLikesSt
) {
  return axios
    .delete(`/user/${profileUserID}/post/${postid}/like`, {
      headers: { "X-Authorization": token },
    })
    .then(() => {
      // success - post liked
      // update like counter to +1
      setLikesSt(likesSt - 1);

      setSnackText("Like removed");
      setSnackVisible(true);
    })
    .catch((error) => {
      console.log(error);
      const { status } = error.response;
      if (status === 401) {
        // unauthorised - kick to login
        navigation.navigate("Login");
      } else if (status === 403) {
        // cant like posts on your own wall, or your own posts
        setSnackText("You can't like your own posts");
        setSnackVisible(true);
      } else if (status === 404) {
        // post not found
        setSnackText("Post not found");
        setSnackVisible(true);
      } else {
        // internal error
        setSnackText("An internal error occured. Try again later");
        setSnackVisible(true);
      }
    });
}

export default Post;
