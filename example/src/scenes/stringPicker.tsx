import { Text, type TextStyle, View, type ViewStyle } from "react-native";
import { useMemo, useState } from "react";
import { RepeatingWheelPicker,
  type RepeatingWheelPickerProps,
} from "@amabeth/repeating-wheel-picker";
import styles, { Colors } from "../constants/styles";

export default function StringPicker() {
  const [favoriteWord, setFavoriteWord] = useState<string>();
  const data: string[] = ["art", "bus", "cache", "dart", "end", "fun", "grass", "hug"];

  const exampleProps = useMemo((): RepeatingWheelPickerProps<string> => ({
    // mandatory
    setSelected: setFavoriteWord,
    initialIndex: 7,
    data: data,

    // optional
    itemDisplayCount: 6,
    itemHeight: 25,

    containerStyle: pickerContainerStyle,

    gradientFadeColor: Colors.tile
  }), []);

  return (
    <View style={tileStyle}>
      <View style={rowStyle}>
        <Text style={titleStyle}>String picker:</Text>
        <RepeatingWheelPicker<string> {...exampleProps} />
      </View>
      <Text style={selectedStyle}>Selected: {favoriteWord}</Text>
    </View>
  );
}

const tileStyle: ViewStyle = {
  ...styles.tile,
  paddingVertical: 0,
  paddingBottom: 10
}

const rowStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center"
};

const titleStyle: TextStyle ={
  ...styles.title,
  flex: 1,
  textAlign: "left"
}

const pickerContainerStyle: ViewStyle = {
  ...styles.pickerContainer,
  flex: 1
}

const selectedStyle: TextStyle ={
  ...styles.text,
  fontStyle: "italic",
  textAlign: "right"
}
