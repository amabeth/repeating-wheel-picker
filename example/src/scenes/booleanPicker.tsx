import { Text, View } from 'react-native';
import { useMemo, useState } from "react";
import RepeatingWheelPicker, {
  type RepeatingWheelPickerProps,
} from "repeating-wheel-picker";
import styles from "../constants/styles";

export default function BooleanPicker() {
  const [, setSelected] = useState<boolean>();
  const data: boolean[] = [true, false];

  const exampleProps = useMemo((): RepeatingWheelPickerProps<boolean> => ({
    // mandatory
    setSelected: setSelected,
    initialIndex: 0,
    data: data,

    // optional
    itemDisplayCount: 2,

    getLabel: (b: boolean) => b ? "Yes" : "No"
  }), []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Do you like this component?</Text>
      <RepeatingWheelPicker<boolean> {...exampleProps} />
    </View>
  );
}
