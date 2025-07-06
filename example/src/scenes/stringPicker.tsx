import { Text, View, type ViewStyle } from "react-native";
import { useMemo, useState } from "react";
import { RepeatingWheelPicker,
  type RepeatingWheelPickerProps,
} from "repeating-wheel-picker";
import styles from "../constants/styles";

export default function StringPicker() {
  const [favoriteWord, setFavoriteWord] = useState<string>();
  const data: string[] = ["art", "bus", "cache", "dart", "end", "fun", "grass", "hug"];

  const exampleProps = useMemo((): RepeatingWheelPickerProps<string> => ({
    // mandatory
    setSelected: setFavoriteWord,
    initialIndex: 7,
    data: data,

    // optional
    itemDisplayCount: 5
  }), []);

  return (
    <View style={styles.container}>
      <View style={rowStyle}>
        <Text style={styles.text}>Favorite word:</Text>
        <Text style={styles.text}>{favoriteWord}</Text>
      </View>
      <RepeatingWheelPicker<string> {...exampleProps} />
    </View>
  );
}

const rowStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
};
