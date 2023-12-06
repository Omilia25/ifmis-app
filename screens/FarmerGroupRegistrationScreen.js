// FarmerGroupRegistrationScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import GeoLocationInput from '../components/GeoLocationInput';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { createFarmerGroup } from '../api/farmerGroupApi'; // Adjust the path based on your project structure

const FarmerGroupRegistrationScreen = () => {
  const [groupName, setGroupName] = useState('');
  const [groupLocation, setGroupLocation] = useState('');
  const [groupGeoLocation, setGroupGeoLocation] = useState(null);
  const [selectedAggregator, setSelectedAggregator] = useState('');
  const [selectedGroupType, setSelectedGroupType] = useState('Vulnerable and Marginalized');

  useEffect(() => {
    // Fetch current location when the component mounts
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setGroupGeoLocation(location.coords);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to fetch location. Please enable location services.');
    }
  };

  const handleRegistration = async () => {
    try {
      // Validate input fields
      if (!groupName || !groupLocation || !selectedAggregator || !selectedGroupType) {
        Alert.alert('Error', 'Please fill in all the required fields.');
        return;
      }

      // Create data object
      const data = {
        groupName,
        groupLocation,
        groupGeoLocation,
        selectedAggregator,
        selectedGroupType,
      };

      // Call API to send data to the server
      const result = await createFarmerGroup(data);

      if (result.success) {
        // Reset form fields
        setGroupName('');
        setGroupLocation('');
        setSelectedAggregator('');
        setSelectedGroupType('Vulnerable and Marginalized');

        // Display success message
        Alert.alert('Success', 'Group registration data saved locally and on the server.');
      } else {
        // Display error message
        console.error('Error creating farmer group:', result.error);
        Alert.alert('Error', result.error || 'Failed to save data. Please try again.');
      }
    } catch (error) {
      console.error('Error handling registration:', error);
      Alert.alert('Error', 'Failed to register. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Farmer Group </Text>
      <GeoLocationInput latitude={groupGeoLocation?.latitude} longitude={groupGeoLocation?.longitude} />

      <InputField label="Choose Aggregator" value={selectedAggregator} onChangeText={setSelectedAggregator} placeholder="Select aggregator" />

      <Text style={styles.label}>Type of Group</Text>
      <Picker
        selectedValue={selectedGroupType}
        onValueChange={(itemValue) => setSelectedGroupType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Vulnerable and Marginalized" value="Vulnerable and Marginalized" />
        <Picker.Item label="Common Interest" value="Common Interest" />
      </Picker>

      <InputField label="Group Name" value={groupName} onChangeText={setGroupName} placeholder="Enter group name" />
      <InputField label="Group Location" value={groupLocation} onChangeText={setGroupLocation} placeholder="Enter group location" />

      <CustomButton title="Create" onPress={handleRegistration} style={{ marginTop: 16 }} />
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
  label: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    color: '#555', // Medium gray text
  },
  picker: {
    height: 40,
    borderColor: '#ccc', // Light gray border
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    color: '#333', // Dark gray text
  },
});

export default FarmerGroupRegistrationScreen;






// // FarmerGroupRegistrationScreen.js
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
// import InputField from '../components/InputField';
// import CustomButton from '../components/CustomButton';
// import GeoLocationInput from '../components/GeoLocationInput';
// import * as Location from 'expo-location';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Picker } from '@react-native-picker/picker';

// const FarmerGroupRegistrationScreen = () => {
//   const [groupName, setGroupName] = useState('');
//   const [groupLocation, setGroupLocation] = useState('');
//   const [groupGeoLocation, setGroupGeoLocation] = useState(null);
//   const [selectedAggregator, setSelectedAggregator] = useState('');
//   const [selectedGroupType, setSelectedGroupType] = useState('Vulnerable and Marginalized');

//   useEffect(() => {
//     // Fetch current location when the component mounts
//     fetchLocation();
//   }, []);

//   const fetchLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status === 'granted') {
//         const location = await Location.getCurrentPositionAsync({});
//         setGroupGeoLocation(location.coords);
//       }
//     } catch (error) {
//       console.error('Error getting location:', error);
//       Alert.alert('Error', 'Failed to fetch location. Please enable location services.');
//     }
//   };

//   const handleRegistration = async () => {
//     try {
//       // Validate input fields
//       if (!groupName || !groupLocation || !selectedAggregator || !selectedGroupType) {
//         Alert.alert('Error', 'Please fill in all the required fields.');
//         return;
//       }

//       // Save data to local storage
//       await saveDataLocally({ groupName, groupLocation, groupGeoLocation, selectedAggregator, selectedGroupType });

//       // Reset form fields
//       setGroupName('');
//       setGroupLocation('');
//       setSelectedAggregator('');
//       setSelectedGroupType('Vulnerable and Marginalized');

//       // Display success message
//       Alert.alert('Success', 'Group registration data saved locally.');
//     } catch (error) {
//       console.error('Error saving data:', error);
//       Alert.alert('Error', 'Failed to save data. Please try again.');
//     }
//   };

//   const saveDataLocally = async (data) => {
//     try {
//       // Fetch existing data from storage
//       const existingData = await AsyncStorage.getItem('groupRegistrationData');

//       // Parse existing data (or initialize as an empty array)
//       const existingDataArray = existingData ? JSON.parse(existingData) : [];

//       // Add new data to the array
//       existingDataArray.push(data);

//       // Save the updated array back to storage
//       await AsyncStorage.setItem('groupRegistrationData', JSON.stringify(existingDataArray));
//     } catch (error) {
//       throw new Error('Error saving data to local storage:', error);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Farmer Group </Text>
//       <GeoLocationInput latitude={groupGeoLocation?.latitude} longitude={groupGeoLocation?.longitude} />

//        <InputField label="Choose Aggregator" value={selectedAggregator} onChangeText={setSelectedAggregator} placeholder="Select aggregator" />

//       <Text style={styles.label}>Type of Group</Text>
//       <Picker
//         selectedValue={selectedGroupType}
//         onValueChange={(itemValue) => setSelectedGroupType(itemValue)}
//         style={styles.picker}
//       >
//         <Picker.Item label="Vulnerable and Marginalized" value="Vulnerable and Marginalized" />
//         <Picker.Item label="Common Interest" value="Common Interest" />
//       </Picker>

//       <InputField label="Group Name" value={groupName} onChangeText={setGroupName} placeholder="Enter group name" />
//       <InputField label="Group Location" value={groupLocation} onChangeText={setGroupLocation} placeholder="Enter group location" />

//       <CustomButton title="Create" onPress={handleRegistration} style={{ marginTop: 16 }} />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#F5F5F5', // Light gray background
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 24,
//     color: '#333', // Dark gray text
//     textAlign: 'center',
//   },
//   label: {
//     fontSize: 18,
//     marginTop: 16,
//     marginBottom: 8,
//     color: '#555', // Medium gray text
//   },
//   picker: {
//     height: 40,
//     borderColor: '#ccc', // Light gray border
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 16,
//     color: '#333', // Dark gray text
//   },
// });

// export default FarmerGroupRegistrationScreen;
