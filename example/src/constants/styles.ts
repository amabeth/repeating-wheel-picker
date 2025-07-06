import { StyleSheet } from 'react-native';

export const Colors = {
  container: "#0F1417",
  tile: "#0F1417",
  outline: "#303036",
  highlight: "#34343A",
  text: "#E4E1E9"
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.container,
    padding: 5,
  },
  tile: {
    backgroundColor: Colors.tile,
    paddingHorizontal: 15,
    paddingVertical: 10,

    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outline
  },
  pickerContainer: {
    backgroundColor: "transparent",
    paddingVertical: 15,
  },
  title: {
    color: Colors.text,
    fontSize: 20
  },
  subtitle: {
    color: Colors.text,
    fontSize: 18
  },
  text: {
    color: Colors.text,
    fontSize: 16
  }
});

export default styles;
