import { StyleSheet } from 'react-native';

export const colors = {
  container: "#000000",
  text: "#FFFFFF"
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.container,
    padding: 5,
  },
  text: {
    color: colors.text,
    fontSize: 20
  }
});

export default styles;
