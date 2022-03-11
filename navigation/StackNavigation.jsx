import { createStackNavigator } from "@react-navigation/stack";
import EditPost from "../screens/EditPost";
import EditProfile from "../screens/EditProfile";
import Friends from "../screens/Friends";
import Login from "../screens/Login";
import Profile from "../screens/Profile";
import Signup from "../screens/Signup";
import TabNavigation from "./TabNavigation";

const Stack = createStackNavigator();

function Main() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen
        name="TabNavigation"
        component={TabNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerTitle: "Edit Profile" }}
      />

      <Stack.Screen
        name="AnotherProfile"
        component={Profile}
        options={{ headerTitle: "Profile" }}
      />
      <Stack.Screen
        name="EditPost"
        component={EditPost}
        options={{ headerTitle: "Edit Post" }}
      />
      <Stack.Screen
        name="AnotherFriends"
        component={Friends}
        options={{ headerTitle: "Friends" }}
      />
    </Stack.Navigator>
  );
}

export default Main;
