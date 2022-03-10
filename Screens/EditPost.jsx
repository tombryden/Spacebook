import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState, useEffect } from "react";

function EditPost({ route }) {
  // state for post text
  const [postText, setPostText] = useState("");

  // on mount update post text to contain passed text
  useEffect(() => {
    const { text } = route.params;
    setPostText(text);
  }, []);

  return (
    <View style={styles.container}>
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
      <Button mode="contained" style={styles.btnDelete} color="darkred">
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

function deletePost() {}

export default EditPost;
