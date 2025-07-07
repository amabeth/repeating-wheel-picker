import { Text, type TextStyle, TouchableOpacity, View, type ViewStyle } from "react-native";
import { useMemo, useState } from "react";
import { RepeatingWheelPicker,
  type RepeatingWheelPickerProps,
} from "@amabeth/repeating-wheel-picker";
import styles, { Colors } from "../constants/styles";

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
    getLabel: (f: FoodItem) => `${f.name} (${f.price}€)`,
    enabled: pickerEnabled,
    itemDisplayCount: 3,

    containerVerticalPadding: 5,
    containerStyle: styles.pickerContainer,
    gradientFadeColor: Colors.tile
  }), [pickerEnabled]);

  return (
    <View style={styles.tile}>
      <View style={rowStyle}>
        <Text style={styles.title}>Custom type picker:</Text>
        <View style={{flex: 1}}/>
        <TouchableOpacity onPress={() => setPickerEnabled(!pickerEnabled)} style={buttonStyle}>
          <Text style={styles.subtitle}>{pickerEnabled ? "disable" : "enable"}</Text>
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
  borderColor: Colors.text,
  borderRadius: 15
}

type FoodItem = {
  name: string,
  price: number,
  brand: string
}
