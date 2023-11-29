// InputField.js
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const InputField = ({ label, value, onChangeText, placeholder, keyboardType }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555', // Medium gray text
  },
  input: {
    height: 40,
    borderColor: '#ccc', // Light gray border
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 8,
    color: '#333', // Dark gray text
  },
});

export default InputField;
