import { Avatar, Card, IconButton } from "react-native-paper";
import { Text, StyleSheet, View } from "react-native";
import moment from "moment";
import axios from "axios";

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
                    userid: postUserID,
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
              <Text style={styles.likeText}>{likes}</Text>
              <IconButton
                icon="thumb-up-outline"
                size={20}
                onPress={() => {
                  likePost(
                    postUserID,
                    postid,
                    token,
                    setSnackText,
                    setSnackVisible,
                    navigation
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
  postUserID,
  postid,
  token,
  setSnackText,
  setSnackVisible,
  navigation
) {
  return axios
    .post(`/user/${postUserID}/post/${postid}/like`, null, {
      headers: { "X-Authorization": token },
    })
    .then(() => {
      // success - post liked
      setSnackText("Post liked");
      setSnackVisible(true);
    })
    .catch((error) => {
      const { status } = error.response;
      if (status === 400) {
        // bad request - error from mysql duplicate entry
        setSnackText("Post already liked");
        setSnackVisible(true);
      } else if (status === 401) {
        // unauthorised - kick to login
        navigation.navigate("Login");
      } else if (status === 403) {
        // already liked posted
        setSnackText("You can't like your own post");
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

export default Post;
