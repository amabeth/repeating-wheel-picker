import { Text, View, type ViewStyle } from "react-native";
import { useMemo, useState } from "react";
import { RepeatingWheelPicker,
  type RepeatingWheelPickerProps,
} from "repeating-wheel-picker";
import styles, { Colors } from "../constants/styles";

export default function BooleanPicker() {
  const [, setSelected] = useState<boolean>();
  const data: boolean[] = [true, false];

  const exampleProps = useMemo((): RepeatingWheelPickerProps<boolean> => ({
    // mandatory
    setSelected: setSelected,
    initialIndex: 0,
    data: data,

    // optional
    getLabel: (b: boolean) => b ? "Yes" : "No",
    itemDisplayCount: 2,

    containerVerticalPadding: 5,
    containerHorizontalPadding: 20,
    containerStyle: pickerContainerStyle
  }), []);

  return (
    <View style={styles.tile}>
      <View style={rowStyle}>
        <Text style={styles.title}>Boolean picker:</Text>
        <RepeatingWheelPicker<boolean> {...exampleProps} />
      </View>
    </View>
  );
}

const rowStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
}

const pickerContainerStyle: ViewStyle = {
  ...styles.pickerContainer,

  borderRadius: 30,
  borderWidth: 1,
  borderColor: "white",
  backgroundColor: Colors.highlight
}
