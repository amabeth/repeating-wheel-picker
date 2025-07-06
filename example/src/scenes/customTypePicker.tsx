import { Text, type TextStyle, TouchableOpacity, View, type ViewStyle } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { RepeatingWheelPicker,
  type RepeatingWheelPickerProps,
} from "repeating-wheel-picker";
import styles, { colors } from "../constants/styles";

export default function CustomTypePicker() {
  const [pickerEnabled, setPickerEnabled] = useState(false);
  const [, setSelected] = useState<FoodItem>();
  const data: FoodItem[] = [
    {
      name: "Bread",
      price: 1.23,
      brand: "Best Bakery"
    },
    {
      name: "Milk",
      price: 1.43,
      brand: "CowWow"
    },
    {
      name: "Apple",
      price: 0.40,
      brand: "Fruit Brand"
    },
    {
      name: "Ice cream",
      price: 4.99,
      brand: "ColdIce"
    }
  ];

  const exampleProps = useMemo((): RepeatingWheelPickerProps<FoodItem> => ({
    // mandatory
    setSelected: setSelected,
    initialIndex: 0,
    data: data,

    // optional
    itemDisplayCount: 4,
    getLabel: (f: FoodItem) => f.name,
    enabled: pickerEnabled
  }), [pickerEnabled]);

  useEffect(() => {
    console.log("exampleProps changed ", Date.now());
  }, [exampleProps]);

  return (
    <View style={styles.container}>
      <View style={rowStyle}>
        <Text style={styles.text}>Favorite food:</Text>
        <View style={{flex: 1}}/>
        <TouchableOpacity onPress={() => setPickerEnabled(!pickerEnabled)} style={buttonStyle}>
          <Text style={buttonTextStyle}>{pickerEnabled ? "disable" : "enable"}</Text>
        </TouchableOpacity>
      </View>
      <RepeatingWheelPicker {...exampleProps} />
    </View>
  );
}

const rowStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center"
};

const buttonStyle: TextStyle = {
  margin: 10,
  paddingVertical: 5,
  paddingHorizontal: 10,
  backgroundColor: "transparent",
  borderWidth: 0.7,
  borderColor: colors.text,
  borderRadius: 15
}

const buttonTextStyle : TextStyle = {
  ...styles.text,
  fontSize: 16
}

type FoodItem = {
  name: string,
  price: number,
  brand: string
}
