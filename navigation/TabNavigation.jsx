import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Friends from "../screens/Friends";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();
function TabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Friends" component={Friends} />
    </Tab.Navigator>
  );
}

export default TabNavigation;
