// CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#EC342C',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin:32
  },
  buttonText: {
    color: 'white',
    fontWeight:'bold',
    fontSize: 20,
  },
});

export default CustomButton;
