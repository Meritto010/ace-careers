import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, View, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

/* =========================================================
   SCREENS
========================================================= */
import LicenseActivationScreen from './screens/LicenseActivationScreen';
import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import LegalScreen from './screens/LegalScreen';

/* =========================================================
   MODULES
========================================================= */
import ResumeModule from './modules/ResumeModule';
import GDModule from './modules/GDModule';
import InterviewModule from './modules/InterviewModule';

/* =========================================================
   STACK
========================================================= */
const Stack = createStackNavigator();

/* =========================================================
   APP
========================================================= */
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isActivated, setIsActivated] = useState(false);
  const navigationRef = useRef(null);

  useEffect(() => {
    const initializeAppState = async () => {
      try {
        const activationToken = await AsyncStorage.getItem('@is_activated');
        if (activationToken === 'true') {
          setIsActivated(true);
        }
      } catch (error) {
        console.error("Error reading persistence keys:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    initializeAppState();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" translucent={false} />
        <ActivityIndicator size="large" color="#103D6A" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={isActivated ? "Dashboard" : "Activation"}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F8F9FA' }
        }}
      >
        {/* =====================================================
            ONBOARDING & MANAGEMENT
        ===================================================== */}
        <Stack.Screen name="Activation">
          {(props) => (
            <LicenseActivationScreen 
              {...props} 
              isActivated={isActivated}
              onActivationSuccess={() => {
                // Safely update app-wide storage state smoothly
                setIsActivated(true);
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Dashboard">
          {(props) => {
            // Checks route parameters first, then global app state fallback
            const resolvedActivationState = props.route?.params?.isActivated ?? isActivated;
            return (
              <DashboardScreen
                {...props}
                isActivated={resolvedActivationState}
                onOpenPaywall={() => {
                  // Standard path to handle restricted premium feature taps cleanly
                  props.navigation.navigate('Activation');
                }}
                onSyncStateChange={(updatedToken) => {
                  if (updatedToken !== undefined) setIsActivated(updatedToken);
                }}
              />
            );
          }}
        </Stack.Screen>

        {/* =====================================================
            MODULES
        ===================================================== */}
        <Stack.Screen name="Resume" component={ResumeModule} />
        <Stack.Screen name="GD" component={GDModule} />
        <Stack.Screen name="Interview" component={InterviewModule} />

        {/* =====================================================
            SUPPORT
        ===================================================== */}
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Legal" component={LegalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* =========================================================
   STYLES
========================================================= */
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  }
});
