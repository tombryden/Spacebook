import { Text, View, StatusBar, StyleSheet } from "react-native";

function Main() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to stdasdaart working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Main;
