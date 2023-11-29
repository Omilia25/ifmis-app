import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import GeoLocationInput from '../components/GeoLocationInput';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import CustomButton from '../components/CustomButton';
import { Picker } from '@react-native-picker/picker';

const TrainingSessionScreen = () => {
  const [sessionGeoLocation, setSessionGeoLocation] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [isCameraPermissionGranted, setCameraPermissionGranted] = useState(null);
  const [selectedAggregator, setSelectedAggregator] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedFarmers, setSelectedFarmers] = useState([]);
  const [trainingDetails, setTrainingDetails] = useState({
    unit: '',
    module: '',
    date: '',
    time: '',
  });

  // Mock data
  const aggregators = ['Aggregator1', 'Aggregator2'];
  const groups = {
    Aggregator1: ['Group1', 'Group2'],
    Aggregator2: ['Group3', 'Group4'],
  };
  const farmers = {
    Group1: ['Farmer1', 'Farmer2'],
    Group2: ['Farmer3', 'Farmer4'],
    Group3: ['Farmer5', 'Farmer6'],
    Group4: ['Farmer7', 'Farmer8'],
  };

  useEffect(() => {
    // Fetch current location and time when the component mounts
    fetchLocation();
    fetchCurrentTime();
    checkCameraPermission();
  }, []);

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setSessionGeoLocation(location.coords);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Error',
        'Failed to fetch location. Please enable location services.'
      );
    }
  };

  const fetchCurrentTime = () => {
    const now = new Date();
    const formattedTime = `${now.getHours()}:${now.getMinutes()}`;
    setCurrentTime(formattedTime);
  };

  const checkCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync(); // Updated method
    setCameraPermissionGranted(status === 'granted');
  };

  const handleCapturePhoto = async () => {
    if (!isCameraPermissionGranted) {
      Alert.alert(
        'Error',
        'Camera permission not granted. Please enable camera access.'
      );
      return;
    }

    const photo = await capturePhoto();
    if (photo) {
      // Save the captured photo to the device's media library or perform any required action
      savePhotoToLibrary(photo);
    }
  };

  const capturePhoto = async () => {
    try {
      const { uri } = await Camera.takePictureAsync();
      return uri;
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  const savePhotoToLibrary = async (photoUri) => {
    try {
      await MediaLibrary.saveToLibraryAsync(photoUri);
      Alert.alert('Success', 'Photo captured and saved to the library.');
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    }
  };

  const handleMarkAttendance = () => {
    // Implement your logic to mark attendance here
    // Save the selected farmers and training details to your database or perform any necessary action
    const dataToSave = {
      selectedFarmers,
      trainingDetails,
    };
    console.log('Data to save:', dataToSave);

    Alert.alert('Success', 'Attendance marked successfully.');
  };

  const handleTrainingDetailsChange = (key, value) => {
    setTrainingDetails((prevDetails) => ({ ...prevDetails, [key]: value }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Training Session</Text>
      <GeoLocationInput
        latitude={sessionGeoLocation?.latitude}
        longitude={sessionGeoLocation?.longitude}
      />

      <Text style={styles.label}>Current Time: {currentTime}</Text>

      {isCameraPermissionGranted !== null && isCameraPermissionGranted ? (
        <TouchableOpacity onPress={handleCapturePhoto} style={styles.captureButton}>
          <Text style={styles.buttonText}>Capture Photo</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.errorText}>Camera permission not granted</Text>
      )}

      <Text style={styles.label}>Select Aggregator:</Text>
      <Picker
        selectedValue={selectedAggregator}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedAggregator(itemValue)}
      >
        <Picker.Item label="Select Aggregator" value={null} />
        {aggregators.map((aggregator, index) => (
          <Picker.Item key={index} label={aggregator} value={aggregator} />
        ))}
      </Picker>

      {selectedAggregator && (
        <>
          <Text style={styles.label}>Select Group:</Text>
          <Picker
            selectedValue={selectedGroup}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedGroup(itemValue)}
          >
            <Picker.Item label="Select Group" value={null} />
            {groups[selectedAggregator].map((group, index) => (
              <Picker.Item key={index} label={group} value={group} />
            ))}
          </Picker>
        </>
      )}

      {selectedGroup && (
        <>
          <Text style={styles.label}>Select Farmers Attending:</Text>
          <Picker
            selectedValue={selectedFarmers}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedFarmers(itemValue)}
            mode="multiple"
          >
            {farmers[selectedGroup].map((farmer, index) => (
              <Picker.Item key={index} label={farmer} value={farmer} />
            ))}
          </Picker>
        </>
      )}

      <Text style={styles.label}>Training Details:</Text>
      <TextInput
        style={styles.input}
        placeholder="Training Unit"
        value={trainingDetails.unit}
        onChangeText={(text) => handleTrainingDetailsChange('unit', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Training Module"
        value={trainingDetails.module}
        onChangeText={(text) => handleTrainingDetailsChange('module', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Training Date"
        value={trainingDetails.date}
        onChangeText={(text) => handleTrainingDetailsChange('date', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Training Time"
        value={trainingDetails.time}
        onChangeText={(text) => handleTrainingDetailsChange('time', text)}
      />

      <TouchableOpacity
        onPress={handleMarkAttendance}
        style={styles.markAttendanceButton}
      >
        <Text style={styles.buttonText}>Mark Attendance</Text>
      </TouchableOpacity>
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
  captureButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#4CAF50', // Green color
    borderRadius: 8,
    width: 150,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFF', // White text color
    textAlign: 'center',
  },
  errorText: {
    marginTop: 8,
    color: 'red',
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  markAttendanceButton: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#4CAF50', // Green color
    borderRadius: 8,
    width: 200,
    alignSelf: 'center',
  },
});

export default TrainingSessionScreen;
