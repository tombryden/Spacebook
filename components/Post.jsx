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
    postid,
    token,
    setSnackText,
    setSnackVisible,
    navigation,
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
            <Text>{likes}</Text>
            <IconButton
              icon="thumb-up-outline"
              size={20}
              onPress={() => {
                likePost(
                  userid,
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
  },
  avatarNameContainer: {
    flex: 1,
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
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

// functions

// like a post
function likePost(
  userid,
  postid,
  token,
  setSnackText,
  setSnackVisible,
  navigation
) {
  return axios
    .post(`/user/${userid}/post/${postid}/like`, null, {
      headers: { "X-Authorization": token },
    })
    .then((response) => {
      // success - post liked
      console.log(response);
      setSnackText("Post liked");
      setSnackVisible(true);
    })
    .catch((error) => {
      const { status } = error.response;
      if (status === 401) {
        // unauthorised - kick to login
        goToLogin(navigation);
      } else if (status === 403) {
        // already liked posted
        setSnackText("Post already liked");
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

// ask user to login again
function goToLogin(navigation) {
  return navigation.reset({
    routes: [{ name: "Login" }],
  });
}

export default Post;
