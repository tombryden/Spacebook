import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Screens/Login";
import Signup from "./Screens/Signup";

const Stack = createStackNavigator();

function Main() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

export default Main;
