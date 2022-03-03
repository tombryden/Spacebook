import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import axios from "axios";
import Main from "./Main";

export default function App() {
  // set default axios url to the api
  axios.defaults.baseURL = "http://localhost:3333/api/1.0.0";

  return (
    <PaperProvider>
      <NavigationContainer>
        <Main />
      </NavigationContainer>
    </PaperProvider>
  );
}
