import { Button, Text, View } from 'react-native';
import StringPicker from './stringPicker';
import { useState } from 'react';
import CustomTypePicker from './customTypePicker';

export default function App() {

  return (
    <View style={{ flex: 1 }}>
      <StringPickerArea/>
      <CustomTypePickerArea/>
    </View>
  )
}

function StringPickerArea() {

  return (
    <View>
      <Text>String Picker</Text>
      <StringPicker/>
    </View>
  );
}

function CustomTypePickerArea() {
  const [pickerEnabled, setPickerEnabled] = useState(true);

  return (
    <View>
      <Text>Custom Type Picker</Text>
      <Button title={"disable"} onPress={() => setPickerEnabled(!pickerEnabled)}/>
      <CustomTypePicker/>
    </View>
  )
}
