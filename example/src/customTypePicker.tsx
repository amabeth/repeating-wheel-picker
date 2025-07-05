import { View } from "react-native";
import { useState } from "react";
import RepeatingWheelPicker, {
  type RepeatingWheelPickerProps,
} from 'repeating-wheel-picker';

export default function CustomTypePicker({enabled = true}: {enabled?: boolean}) {
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

  const exampleProps: RepeatingWheelPickerProps<FoodItem> = {
    // mandatory
    setSelected: setSelected,
    initialIndex: 0,
    data: data,

    // optional
    getLabel: (f: FoodItem) => f.name,
    enabled: enabled,
  }

  return (
    <View>
      <RepeatingWheelPicker {...exampleProps} />
    </View>
  );
}

type FoodItem = {
  name: string,
  price: number,
  brand: string
}
