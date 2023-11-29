// FarmerRegistrationScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import GeoLocationInput from '../components/GeoLocationInput';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FarmerRegistrationScreen = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [crops, setCrops] = useState(['']); // Initialize with an empty item
  const [livestock, setLivestock] = useState(['']); // Initialize with an empty item
  const [farmGeoLocation, setFarmGeoLocation] = useState(null);
  const [searchAggregator, setSearchAggregator] = useState('');
  const [searchGroup, setSearchGroup] = useState('');

  useEffect(() => {
    // Fetch current location when the component mounts
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setFarmGeoLocation(location.coords);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to fetch location. Please enable location services.');
    }
  };

  const handleRegistration = async () => {
    try {
      // Validate input fields
      if (!name || !age || !gender || !farmSize || crops.some((crop) => !crop) || livestock.some((animal) => !animal)) {
        Alert.alert('Error', 'Please fill in all the required fields.');
        return;
      }

      // Save data to local storage
      await saveDataLocally({ name, age, gender, farmSize, crops, livestock, farmGeoLocation, searchAggregator, searchGroup });

      // Reset form fields
      setName('');
      setAge('');
      setGender('');
      setFarmSize('');
      setCrops(['']);
      setLivestock(['']);
      setSearchAggregator('');
      setSearchGroup('');

      // Display success message
      Alert.alert('Success', 'Registration data saved locally.');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save data. Please try again.');
    }
  };

  const saveDataLocally = async (data) => {
    try {
      // Fetch existing data from storage
      const existingData = await AsyncStorage.getItem('registrationData');

      // Parse existing data (or initialize as an empty array)
      const existingDataArray = existingData ? JSON.parse(existingData) : [];

      // Add new data to the array
      existingDataArray.push(data);

      // Save the updated array back to storage
      await AsyncStorage.setItem('registrationData', JSON.stringify(existingDataArray));
    } catch (error) {
      throw new Error('Error saving data to local storage:', error);
    }
  };

  const handleAddItem = (field, state, setState) => {
    // Clone the existing array and add an empty item
    const updatedArray = [...state, ''];
    setState(updatedArray);
  };

  const handleRemoveItem = (field, index, state, setState) => {
    // Clone the existing array and remove the item at the specified index
    const updatedArray = [...state.slice(0, index), ...state.slice(index + 1)];
    setState(updatedArray);
  };

  const renderItems = (field, items, setItems) => {
    return items.map((item, index) => (
      <View key={index} style={styles.itemContainer}>
        <TextInput
          style={styles.itemInput}
          value={item}
          placeholder={`Enter ${field} ${index + 1}`}
          onChangeText={(text) => {
            const updatedArray = [...items];
            updatedArray[index] = text;
            setItems(updatedArray);
          }}
        />
        {items.length > 1 && (
          <TouchableOpacity onPress={() => handleRemoveItem(field, index, items, setItems)}>
            <Text style={styles.removeButton}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Farmer Registration</Text>
      <GeoLocationInput latitude={farmGeoLocation?.latitude} longitude={farmGeoLocation?.longitude} />

      <InputField label="Search Aggregator" value={searchAggregator} onChangeText={setSearchAggregator} placeholder="Search by aggregator name" />

      <InputField label="Search Farmer Group" value={searchGroup} onChangeText={setSearchGroup} placeholder="Search by group name" />

      <InputField label="Name" value={name} onChangeText={setName} placeholder="Enter your name" />
      <InputField label="Age" value={age} onChangeText={setAge} placeholder="Enter your age" keyboardType="numeric" />
      <InputField label="Gender" value={gender} onChangeText={setGender} placeholder="Enter your gender" />
      <InputField label="Farm Size (Hectare)" value={farmSize} onChangeText={setFarmSize} placeholder="Enter your farm size" keyboardType="numeric" />

      <Text style={styles.subtitle}>Crops</Text>
      {renderItems('Crop', crops, setCrops)}
      <TouchableOpacity onPress={() => handleAddItem('Crop', crops, setCrops)} style={styles.addButton}>
        <Text style={styles.buttonText}>+ Add Crop</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Livestock</Text>
      {renderItems('Livestock', livestock, setLivestock)}
      <TouchableOpacity onPress={() => handleAddItem('Livestock', livestock, setLivestock)} style={styles.addButton}>
        <Text style={styles.buttonText}>+ Add Livestock</Text>
      </TouchableOpacity>

      <CustomButton title="Register" onPress={handleRegistration} style={{ marginTop: 16 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5', // Light gray background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333', // Dark gray text
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#555', // Medium gray text
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc', // Light gray border
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 8,
    color: '#333', // Dark gray text
  },
  addButton: {
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'green', // Custom color from your logo
    borderRadius: 8,
    width: 150,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'green', // Custom color from your logo
    textAlign: 'center',
  },
  removeButton: {
    color: 'red',
    marginLeft: 8,
  },
});

export default FarmerRegistrationScreen;

