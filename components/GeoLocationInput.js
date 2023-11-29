// GeoLocationInput.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GeoLocationInput = ({ latitude, longitude }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Geo Location</Text>
      {latitude && longitude ? (
        <Text style={styles.locationText}>
          Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}
        </Text>
      ) : (
        <Text style={styles.locationText}>Fetching location...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555', // Medium gray text
  },
  locationText: {
    fontSize: 14,
    color: '#333', // Dark gray text
  },
});

export default GeoLocationInput;

