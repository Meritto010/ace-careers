import 'react-native-gesture-handler';

import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  ActivityIndicator,
  View,
  StatusBar,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createStackNavigator,
} from '@react-navigation/stack';

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
   STACK INTERACTION PROFILE
========================================================= */

const Stack = createStackNavigator();

/* =========================================================
   APPLICATION ROOT ENTRY POINT
========================================================= */

export default function App() {
  const [isLoading, setIsLoading] =
    useState(true);

  const [isActivated, setIsActivated] =
    useState(false);

  const navigationRef = useRef(null);

  /* =========================================================
     SECURE RUNTIME ASYNC STATE PARSING
  ========================================================= */

  useEffect(() => {
    checkActivationStatus();
  }, []);

  const checkActivationStatus = async () => {
    try {
      const status =
        await AsyncStorage.getItem(
          '@is_activated'
        );

      const activated =
        status === 'true';

      setIsActivated(activated);

    } catch (error) {
      console.log(
        'Activation load failed:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
     NATIVE TRANSITIONAL SPLASH HANDLER
  ========================================================= */

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0F4C81"
        />

        <ActivityIndicator
          size="large"
          color="#FFFFFF"
        />
      </View>
    );
  }

  /* =========================================================
     GLOBAL ROUTING AND ENGINE NAVIGATION
  ========================================================= */

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <Stack.Navigator
        initialRouteName={
          isActivated
            ? 'MainApp'
            : 'Activation'
        }
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >

        {/* =====================================================
            ACTIVATION GATEWAY ROUTE
        ===================================================== */}

        <Stack.Screen name="Activation">
          {(props) => (
            <LicenseActivationScreen
              {...props}
              onActivationSuccess={() => {
                setIsActivated(true);

                navigationRef.current?.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'MainApp',
                    },
                  ],
                });
              }}
            />
          )}
        </Stack.Screen>

        {/* =====================================================
            CORE PLATFORM WORKSPACE
        ===================================================== */}

        <Stack.Screen
          name="MainApp"
        >
          {(props) => (
            <DashboardScreen
              {...props}
              isActivated={isActivated}
            />
          )}
        </Stack.Screen>

        {/* =====================================================
            PREMIUM PLACEMENT GUIDANCE VEHICLES
        ===================================================== */}

        <Stack.Screen
          name="Resume"
          component={ResumeModule}
        />

        <Stack.Screen
          name="GD"
          component={GDModule}
        />

        <Stack.Screen
          name="Interview"
          component={InterviewModule}
        />

        {/* =====================================================
            UTILITY SYSTEMS AND SUPPORT CHANNELS
        ===================================================== */}

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />

        <Stack.Screen
          name="Legal"
          component={LegalScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* =========================================================
   PERFORMANCE MEMORY RENDERING STYLES
========================================================= */

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F4C81',
  },
});
