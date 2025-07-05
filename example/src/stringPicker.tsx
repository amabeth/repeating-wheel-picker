import { View } from "react-native";
import { useState } from "react";
import RepeatingWheelPicker, {
  type RepeatingWheelPickerProps,
} from 'repeating-wheel-picker';

export default function StringPicker() {
  const [, setSelected] = useState<string>();
  const data: string[] = ["art", "bus", "cache", "dart", "end", "fun", "grass", "hug"];

  const exampleProps: RepeatingWheelPickerProps<string> = {
    // mandatory
    setSelected: setSelected,
    initialIndex: 0,
    data: data,

    // optional
  }

  return (
    <View>
      <RepeatingWheelPicker {...exampleProps} />
    </View>
  );
}
