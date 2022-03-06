import { Avatar, Card } from "react-native-paper";
import { Text, StyleSheet, View } from "react-native";

function Post(props) {
  const { fullname, post, marginBottom } = props;

  return (
    <Card
      mode="outlined"
      style={[styles.container, marginBottom && { marginBottom: "5px" }]}
    >
      <Card.Content>
        <View style={styles.avatarNameContainer}>
          <Avatar.Image size={20} />
          <Text style={styles.fullname}>{fullname}</Text>
        </View>
        <Text>06 March at 22:00</Text>
        <Text style={styles.postText}>{post}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  avatarNameContainer: {
    flex: 1,
    flexDirection: "row",
    gap: "5px",
  },
  fullname: {
    fontWeight: "bold",
  },
  postText: {
    fontSize: "25px",
    marginTop: "10px",
  },
});

export default Post;
