// App.js

import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import AggregatorRegistrationScreen from './screens/AggregatorRegistrationScreen';
import FarmerGroupRegistrationScreen from './screens/FarmerGroupRegistrationScreen';
import FarmerRegistrationScreen from './screens/FarmerRegistrationScreen';
import TrainingSessionScreen from './screens/TrainingSessionScreen';
import AndroidSafeView from './utilities/AndroidSafeView';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={AndroidSafeView.AndroidSafeArea}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }} // Set headerShown to false to hide the title for all screens
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="RegisterAggregator" component={AggregatorRegistrationScreen} />
          <Stack.Screen name="RegisterFarmerGroup" component={FarmerGroupRegistrationScreen} />
          <Stack.Screen name="RegisterFarmer" component={FarmerRegistrationScreen} />
          <Stack.Screen name="TrainingSession" component={TrainingSessionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}




// // App.js

// import React from 'react';
// import { SafeAreaView } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// import HomeScreen from './screens/HomeScreen';
// import AggregatorRegistrationScreen from './screens/AggregatorRegistrationScreen';
// import FarmerGroupRegistrationScreen from './screens/FarmerGroupRegistrationScreen';
// import FarmerRegistrationScreen from './screens/FarmerRegistrationScreen';
// import TrainingSessionScreen from './screens/TrainingSessionScreen';
// import AndroidSafeView from './utilities/AndroidSafeView';

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <SafeAreaView style={AndroidSafeView.AndroidSafeArea}>
//       <NavigationContainer>
//         <Stack.Navigator>
//           <Stack.Screen name="Home" component={HomeScreen} />
//           <Stack.Screen name="RegisterAggregator" component={AggregatorRegistrationScreen} />
//           <Stack.Screen name="RegisterFarmerGroup" component={FarmerGroupRegistrationScreen} />
//           <Stack.Screen name="RegisterFarmer" component={FarmerRegistrationScreen} />
//           <Stack.Screen name="TrainingSession" component={TrainingSessionScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaView>
//   );
// }



