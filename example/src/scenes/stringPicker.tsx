import { Text, View } from 'react-native';
import { useMemo, useState } from "react";
import { RepeatingWheelPicker,
  type RepeatingWheelPickerProps,
} from "repeating-wheel-picker";
import styles from "../constants/styles";

export default function StringPicker() {
  const [, setSelected] = useState<string>();
  const data: string[] = ["art", "bus", "cache", "dart", "end", "fun", "grass", "hug"];

  const exampleProps = useMemo((): RepeatingWheelPickerProps<string> => ({
    // mandatory
    setSelected: setSelected,
    initialIndex: 7,
    data: data,

    // optional
    itemDisplayCount: 5
  }), []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favorite word:</Text>
      <RepeatingWheelPicker<string> {...exampleProps} />
    </View>
  );
}
