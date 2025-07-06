import { Text, type TextStyle, View, type ViewStyle } from "react-native";
import { useMemo, useState } from "react";
import RepeatingWheelPicker, {
  type RepeatingWheelPickerProps,
} from "repeating-wheel-picker";
import styles from "../constants/styles";
import useComponentHeight from "../hooks/useComponentHeight";

export default function NumberPicker() {
  const [, setSelected] = useState<number>();
  const data: number[] = Array.from({length: 123}, (_, i) => i);
  const [height, onLayout] = useComponentHeight();

  const exampleProps = useMemo((): RepeatingWheelPickerProps<number> => ({
    // mandatory
    setSelected: setSelected,
    initialIndex: 30,
    data: data,

    // optional
    containerOnLayout: onLayout,

    containerStyle: rightColumnStyle,
    itemTextStyle: pickerItemTextStyle
  }), [onLayout]);

  return (
    <View style={styles.container}>
      <View style={rowStyle}>
        <View style={leftColumnStyle(height)}>
          <Text style={styles.text}>Age: </Text>
        </View>
        <RepeatingWheelPicker<number> {...exampleProps} />
      </View>
    </View>
  );
}

const rowStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center"
};

const columnStyle: ViewStyle = {
  ...rowStyle,
  width: "50%",
  marginHorizontal: 10
};

const leftColumnStyle = (height: number): ViewStyle => ({
  ...columnStyle,
  height: height,
  justifyContent: "flex-end",
  alignItems: "center"
});

const rightColumnStyle: ViewStyle = {
  ...columnStyle
};

const pickerItemTextStyle: TextStyle = {
  textAlign: "left"
}
