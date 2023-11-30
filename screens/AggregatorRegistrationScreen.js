// AggregatorRegistrationScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import GeoLocationInput from '../components/GeoLocationInput';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AggregatorRegistrationScreen = () => {
  const [aggregatorName, setAggregatorName] = useState('');
  const [aggregatorGeoLocation, setAggregatorGeoLocation] = useState(null);
  const [businessType, setBusinessType] = useState('');
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [maleEmployees, setMaleEmployees] = useState('');
  const [femaleEmployees, setFemaleEmployees] = useState('');
  const [commodities, setCommodities] = useState([{ name: '', quantity: '' }]);
  const [equipment, setEquipment] = useState([{ type: '', quantity: '' }]);

  useEffect(() => {
    // Fetch current location when the component mounts
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setAggregatorGeoLocation(location.coords);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to fetch location. Please enable location services.');
    }
  };

  const handleRegistration = async () => {
    try {
      // Validate input fields
      if (!aggregatorName || !aggregatorGeoLocation || !businessType || !companyPhoneNumber || !companyEmail || !maleEmployees || !femaleEmployees || !commodities || !equipment) {
        Alert.alert('Error', 'Please fill in all the required fields.');
        return;
      }

      // Check for unique aggregator name (you may need to implement a check against existing data)
      const isAggregatorNameUnique = await checkAggregatorNameUniqueness(aggregatorName);
      if (!isAggregatorNameUnique) {
        Alert.alert('Error', 'Aggregator name must be unique.');
        return;
      }

      // Save data to local storage
      await saveDataLocally({
        aggregatorName,
        aggregatorGeoLocation,
        businessType,
        companyPhoneNumber,
        companyEmail,
        maleEmployees,
        femaleEmployees,
        commodities,
        equipment,
      });

      // Reset form fields
      setAggregatorName('');
      setBusinessType('');
      setCompanyPhoneNumber('');
      setCompanyEmail('');
      setMaleEmployees('');
      setFemaleEmployees('');
      setCommodities([{ name: '', quantity: '' }]);
      setEquipment([{ type: '', quantity: '' }]);

      // Display success message
      Alert.alert('Success', 'Aggregator registration data saved locally.');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save data. Please try again.');
    }
  };

  const saveDataLocally = async (data) => {
    try {
      // Fetch existing data from storage
      const existingData = await AsyncStorage.getItem('aggregatorRegistrationData');

      // Parse existing data (or initialize as an empty array)
      const existingDataArray = existingData ? JSON.parse(existingData) : [];

      // Add new data to the array
      existingDataArray.push(data);

      // Save the updated array back to storage
      await AsyncStorage.setItem('aggregatorRegistrationData', JSON.stringify(existingDataArray));
    } catch (error) {
      throw new Error('Error saving data to local storage:', error);
    }
  };

  const checkAggregatorNameUniqueness = async (name) => {
    // Implement logic to check if the aggregator name is unique
    // You may need to fetch existing data and compare the names
    // Return true if the name is unique, false otherwise
    return true;
  };

  const handleAddItem = (field, state, setState) => {
    // Clone the existing array and add an empty item
    const updatedArray = [...state, { name: '', quantity: '' }];
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
          value={item.name}
          placeholder={`Enter ${field} ${index + 1}`}
          onChangeText={(text) => {
            const updatedArray = [...items];
            updatedArray[index].name = text;
            setItems(updatedArray);
          }}
        />
        <TextInput
          style={styles.itemInput}
          value={item.quantity}
          placeholder={`Enter Quantity ${index + 1}`}
          onChangeText={(text) => {
            const updatedArray = [...items];
            updatedArray[index].quantity = text;
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
      <Text style={styles.title}>Aggregator Registration</Text>
      <GeoLocationInput latitude={aggregatorGeoLocation?.latitude} longitude={aggregatorGeoLocation?.longitude} />

      <InputField label="Aggregator Name" value={aggregatorName} onChangeText={setAggregatorName} placeholder="Enter aggregator name" />
      <InputField label="Business Type" value={businessType} onChangeText={setBusinessType} placeholder="Enter business type" />
      <InputField label="Company Phone Number" value={companyPhoneNumber} onChangeText={setCompanyPhoneNumber} placeholder="Enter company phone number" keyboardType="phone-pad" />
      <InputField label="Company Email" value={companyEmail} onChangeText={setCompanyEmail} placeholder="Enter company email" keyboardType="email-address" />
      <InputField label="Male Employees" value={maleEmployees} onChangeText={setMaleEmployees} placeholder="Enter male employees" keyboardType="numeric" />
      <InputField label="Female Employees" value={femaleEmployees} onChangeText={setFemaleEmployees} placeholder="Enter female employees" keyboardType="numeric" />

      <Text style={styles.subtitle}>Commodities</Text>
      {renderItems('Commodity', commodities, setCommodities)}
      <TouchableOpacity onPress={() => handleAddItem('Commodity', commodities, setCommodities)} style={styles.addButton}>
        <Text style={styles.buttonText}>+ Add Commodity</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Equipment</Text>
      {renderItems('Equipment', equipment, setEquipment)}
      <TouchableOpacity onPress={() => handleAddItem('Equipment', equipment, setEquipment)} style={styles.addButton}>
        <Text style={styles.buttonText}>+ Add Equipment</Text>
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
    borderWidth: 0.9,
    borderColor: 'green', // Red outline colour
    borderRadius: 8,
    width: 150,
    alignSelf: 'center'
  },
  buttonText: {
    color: 'green', // Red text color
    textAlign: 'center',
  },
  removeButton: {
    color: 'red',
    marginLeft: 8,
  },
});

export default AggregatorRegistrationScreen;




// // AggregatorRegistrationScreen.js
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, ScrollView } from 'react-native';
// import InputField from '../components/InputField';
// import CustomButton from '../components/CustomButton';
// import GeoLocationInput from '../components/GeoLocationInput';
// import * as Location from 'expo-location';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AggregatorRegistrationScreen = () => {
//   const [aggregatorName, setAggregatorName] = useState('');
//   const [aggregatorGeoLocation, setAggregatorGeoLocation] = useState(null);
//   const [businessType, setBusinessType] = useState('');
//   const [companyPhoneNumber, setCompanyPhoneNumber] = useState('');
//   const [companyEmail, setCompanyEmail] = useState('');
//   const [maleEmployees, setMaleEmployees] = useState('');
//   const [femaleEmployees, setFemaleEmployees] = useState('');
//   const [commodityTradeVolumes, setCommodityTradeVolumes] = useState(['']); // Initialize with an empty item
//   const [equipment, setEquipment] = useState(['']); // Initialize with an empty item

//   useEffect(() => {
//     // Fetch current location when the component mounts
//     fetchLocation();
//   }, []);

//   const fetchLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status === 'granted') {
//         const location = await Location.getCurrentPositionAsync({});
//         setAggregatorGeoLocation(location.coords);
//       }
//     } catch (error) {
//       console.error('Error getting location:', error);
//       Alert.alert('Error', 'Failed to fetch location. Please enable location services.');
//     }
//   };

//   const handleRegistration = async () => {
//     try {
//       // Validate input fields
//       if (!aggregatorName || !aggregatorGeoLocation || !businessType || !companyPhoneNumber || !companyEmail || !maleEmployees || !femaleEmployees || !commodityTradeVolumes || !equipment) {
//         Alert.alert('Error', 'Please fill in all the required fields.');
//         return;
//       }

//       // Check for unique aggregator name (you may need to implement a check against existing data)
//       const isAggregatorNameUnique = await checkAggregatorNameUniqueness(aggregatorName);
//       if (!isAggregatorNameUnique) {
//         Alert.alert('Error', 'Aggregator name must be unique.');
//         return;
//       }

//       // Save data to local storage
//       await saveDataLocally({ aggregatorName, aggregatorGeoLocation, businessType, companyPhoneNumber, companyEmail, maleEmployees, femaleEmployees, commodityTradeVolumes, equipment });

//       // Reset form fields
//       setAggregatorName('');
//       setBusinessType('');
//       setCompanyPhoneNumber('');
//       setCompanyEmail('');
//       setMaleEmployees('');
//       setFemaleEmployees('');
//       setCommodityTradeVolumes(['']);
//       setEquipment(['']);

//       // Display success message
//       Alert.alert('Success', 'Aggregator registration data saved locally.');
//     } catch (error) {
//       console.error('Error saving data:', error);
//       Alert.alert('Error', 'Failed to save data. Please try again.');
//     }
//   };

//   const saveDataLocally = async (data) => {
//     try {
//       // Fetch existing data from storage
//       const existingData = await AsyncStorage.getItem('aggregatorRegistrationData');

//       // Parse existing data (or initialize as an empty array)
//       const existingDataArray = existingData ? JSON.parse(existingData) : [];

//       // Add new data to the array
//       existingDataArray.push(data);

//       // Save the updated array back to storage
//       await AsyncStorage.setItem('aggregatorRegistrationData', JSON.stringify(existingDataArray));
//     } catch (error) {
//       throw new Error('Error saving data to local storage:', error);
//     }
//   };

//   const checkAggregatorNameUniqueness = async (name) => {
//     // Implement logic to check if the aggregator name is unique
//     // You may need to fetch existing data and compare the names
//     // Return true if the name is unique, false otherwise
//     return true;
//   };

//   const handleAddItem = (field, state, setState) => {
//     // Clone the existing array and add an empty item
//     const updatedArray = [...state, ''];
//     setState(updatedArray);
//   };

//   const handleRemoveItem = (field, index, state, setState) => {
//     // Clone the existing array and remove the item at the specified index
//     const updatedArray = [...state.slice(0, index), ...state.slice(index + 1)];
//     setState(updatedArray);
//   };

//   const renderItems = (field, items, setItems) => {
//     return items.map((item, index) => (
//       <View key={index} style={styles.itemContainer}>
//         <TextInput
//           style={styles.itemInput}
//           value={item}
//           placeholder={`Enter ${field} ${index + 1}`}
//           onChangeText={(text) => {
//             const updatedArray = [...items];
//             updatedArray[index] = text;
//             setItems(updatedArray);
//           }}
//         />
//         {items.length > 1 && (
//           <TouchableOpacity onPress={() => handleRemoveItem(field, index, items, setItems)}>
//             <Text style={styles.removeButton}>Remove</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     ));
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Aggregator Registration</Text>
//       <GeoLocationInput latitude={aggregatorGeoLocation?.latitude} longitude={aggregatorGeoLocation?.longitude} />

//       <InputField label="Aggregator Name" value={aggregatorName} onChangeText={setAggregatorName} placeholder="Enter aggregator name" />
//       <InputField label="Business Type" value={businessType} onChangeText={setBusinessType} placeholder="Enter business type" />
//       <InputField label="Company Phone Number" value={companyPhoneNumber} onChangeText={setCompanyPhoneNumber} placeholder="Enter company phone number" keyboardType="phone-pad" />
//       <InputField label="Company Email" value={companyEmail} onChangeText={setCompanyEmail} placeholder="Enter company email" keyboardType="email-address" />
//       <InputField label="Male Employees" value={maleEmployees} onChangeText={setMaleEmployees} placeholder="Enter male employees" keyboardType="numeric" />
//       <InputField label="Female Employees" value={femaleEmployees} onChangeText={setFemaleEmployees} placeholder="Enter female employees" keyboardType="numeric" />

//       <Text style={styles.subtitle}>Commodity</Text>
//       {renderItems('Commodity', commodityTradeVolumes, setCommodityTradeVolumes)}
//       <TouchableOpacity onPress={() => handleAddItem('Commodity', commodityTradeVolumes, setCommodityTradeVolumes)} style={styles.addButton}>
//         <Text style={styles.buttonText}>+ Add Commodity</Text>
//       </TouchableOpacity>

//       <Text style={styles.subtitle}>Equipment</Text>
//       {renderItems('Equipment', equipment, setEquipment)}
//       <TouchableOpacity onPress={() => handleAddItem('Equipment', equipment, setEquipment)} style={styles.addButton}>
//         <Text style={styles.buttonText}>+ Add Equipment</Text>
//       </TouchableOpacity>

//       <CustomButton title="Register" onPress={handleRegistration} style={{ marginTop: 16 }} />
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
//   subtitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 16,
//     marginBottom: 8,
//     color: '#555', // Medium gray text
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   itemInput: {
//     flex: 1,
//     height: 40,
//     borderColor: '#ccc', // Light gray border
//     borderWidth: 1,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     color: '#333', // Dark gray text
//   },
//   addButton: {
//     marginTop: 8,
//     padding: 8,
//     borderWidth: 0.9,
//     borderColor: 'green', // Red outline colour
//     borderRadius: 8,
//     width: 150,
//     alignSelf: 'center'
//   },
//   buttonText: {
//     color: 'green', // Red text color
//     textAlign: 'center',
//   },
//   removeButton: {
//     color: 'red',
//     marginLeft: 8,
//   },
// });

// export default AggregatorRegistrationScreen;
