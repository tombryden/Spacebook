import { StyleSheet, Text, View } from "react-native";
import { Avatar, Card, IconButton } from "react-native-paper";

function Friend(props) {
  const { marginBottom, request } = props;
  return (
    <Card mode="outlined" style={marginBottom && { marginBottom: 10 }}>
      <Card.Content>
        <View style={styles.cardContainer}>
          <Avatar.Image size={30} />
          <Text style={styles.name}>Tom Bryden</Text>
          {request ? (
            <View style={styles.requestContainer}>
              <IconButton icon="check-circle" size={30} />
              <IconButton icon="delete" size={30} />
            </View>
          ) : (
            <IconButton style={styles.deleteIcon} icon="delete" size={30} />
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
  deleteIcon: {
    marginLeft: "auto",
  },
  requestContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto",
  },
});

export default Friend;
