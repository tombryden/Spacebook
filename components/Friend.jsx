import { NavigationRouteContext } from "@react-navigation/native";
import axios from "axios";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, Card, IconButton } from "react-native-paper";

function Friend(props) {
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
  } = props;
  return (
    <Card mode="outlined" style={marginBottom && { marginBottom: 10 }}>
      <Card.Content>
        <View style={styles.cardContainer}>
          <Avatar.Image size={30} />
          <Text style={styles.name}>{fullname}</Text>
          {request ? (
            <View style={styles.requestContainer}>
              <IconButton icon="check-circle" size={30} />
              <IconButton icon="delete" size={30} />
            </View>
          ) : (
            <View style={styles.singleIcon}>
              {add ? (
                <IconButton
                  icon="plus-circle-outline"
                  size={30}
                  onPress={() => {
                    addFriend(
                      userid,
                      sessionToken,
                      setSnackText,
                      setSnackVisible,
                      navigation
                    );
                  }}
                />
              ) : (
                <IconButton icon="delete" size={30} />
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
 * Add a new friend
 * @param {string} userid user id to add
 * @param {string} token curent logged in session token
 */
function addFriend(userid, token, setSnackText, setSnackVisible, navigation) {
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

export default Friend;
