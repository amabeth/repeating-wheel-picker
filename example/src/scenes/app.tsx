import { View, type ViewStyle } from "react-native";
import StringPicker from "./stringPicker";
import CustomTypePicker from "./customTypePicker";
import NumberPicker from './numberPicker';
import styles from "../constants/styles";
import BooleanPicker from "./booleanPicker";

export default function App() {

  return (
    <View style={appStyle}>
      <StringPicker/>
      <View style={separatorStyle}></View>
      <CustomTypePicker/>
      <View style={separatorStyle}></View>
      <NumberPicker/>
      <View style={separatorStyle}></View>
      <BooleanPicker/>
    </View>
  )
}

const appStyle: ViewStyle = {
  ...styles.container,
  flex: 1,
  paddingHorizontal: 15,
  paddingTop: 50,
  paddingBottom: 15
}

const separatorStyle: ViewStyle = {
  height: 15
}
