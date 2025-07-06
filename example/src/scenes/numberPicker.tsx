import { Text, type TextStyle, View, type ViewStyle } from "react-native";
import { useMemo, useState } from "react";
import { RepeatingWheelPicker,
  type RepeatingWheelPickerProps,
} from "repeating-wheel-picker";
import styles, { Colors } from "../constants/styles";
import useComponentHeight from "../hooks/useComponentHeight";

export default function NumberPicker() {
  const [selected, setSelected] = useState<number>();
  const data: number[] = Array.from({length: 123}, (_, i) => i);
  const [height, onLayout] = useComponentHeight();

  const exampleProps = useMemo((): RepeatingWheelPickerProps<number> => ({
    // mandatory
    setSelected: setSelected,
    initialIndex: 30,
    data: data,

    // optional
    itemDisplayCount: 5,

    containerOnLayout: onLayout,

    containerStyle: rightColumnStyle,
    itemTextStyle: pickerItemTextStyle,
    gradientFadeColor: Colors.tile
  }), [onLayout]);

  return (
    <View style={styles.tile}>
      <View style={rowStyle}>
        <View style={leftColumnStyle(height)}>
          <Text style={styles.subtitle}>Number picker: </Text>
        </View>
        <RepeatingWheelPicker<number> {...exampleProps} />
      </View>
      <Text style={selectedStyle}>Selected: {selected}</Text>
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
  marginHorizontal: 3
};

const leftColumnStyle = (height: number): ViewStyle => ({
  ...columnStyle,
  height: height,
  justifyContent: "flex-end",
  alignItems: "center"
});

const rightColumnStyle: ViewStyle = {
  ...styles.pickerContainer,
  ...columnStyle
};

const pickerItemTextStyle: TextStyle = {
  ...styles.text,
  textAlign: "left"
}

const selectedStyle: TextStyle ={
  ...styles.text,
  fontStyle: "italic",
  textAlign: "right"
}
