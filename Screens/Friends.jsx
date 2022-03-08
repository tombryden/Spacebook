import { ScrollView, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Friend from "../components/Friend";

function Friends() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button mode="contained" style={styles.addButton}>
        Add a new friend
      </Button>
      <Text>Incoming friend requests</Text>
      <Friend request />
      <Text>Friends</Text>
      <Friend />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    padding: 20,
    backgroundColor: "#fff",
  },
  addButton: {
    marginBottom: 10,
  },
});

export default Friends;
