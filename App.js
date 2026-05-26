import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  ActivityIndicator,
  View,
  Text,
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
   STACK
========================================================= */

const Stack = createStackNavigator();

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [isLoading, setIsLoading] =
    useState(true);

  const [isActivated, setIsActivated] =
    useState(false);

  const navigationRef = useRef();

  /* =========================================================
     CHECK ACTIVATION
  ========================================================= */

  useEffect(() => {
    checkActivationStatus();
  }, []);

  const checkActivationStatus =
    async () => {
      try {
        const status =
          await AsyncStorage.getItem(
            '@is_activated'
          );

        const activated =
          status === 'true';

        setIsActivated(activated);

        setTimeout(() => {
          setIsLoading(false);

          /* =========================================
             AUTO NAVIGATE AFTER SPLASH
          ========================================= */

          setTimeout(() => {
            navigationRef.current?.reset({
              index: 0,
              routes: [
                {
                  name: activated
                    ? 'MainApp'
                    : 'Activation',

                  params: {
                    isActivated:
                      activated,
                  },
                },
              ],
            });
          }, 100);
        }, 1000);
      } catch (error) {
        console.log(
          'Activation load failed:',
          error
        );

        setIsLoading(false);
      }
    };

  /* =========================================================
     SPLASH SCREEN
  ========================================================= */

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0F4C81"
        />

        <Text style={styles.splashTitle}>
          ACE CAREERS
        </Text>

        <Text style={styles.splashTag}>
          Career Growth Platform
        </Text>

        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={{
            marginTop: 25,
          }}
        />
      </View>
    );
  }

  /* =========================================================
     MAIN NAVIGATION
  ========================================================= */

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        {/* =====================================================
            ACTIVATION
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

                      params: {
                        isActivated: true,
                      },
                    },
                  ],
                });
              }}
            />
          )}
        </Stack.Screen>

        {/* =====================================================
            MAIN DASHBOARD
        ===================================================== */}

        <Stack.Screen
          name="MainApp"
        >
          {(props) => {
            const dynamicActivationState =
              props.route.params
                ?.isActivated ??
              isActivated;

            return (
              <DashboardScreen
                {...props}
                isActivated={
                  dynamicActivationState
                }
              />
            );
          }}
        </Stack.Screen>

        {/* =====================================================
            MODULES
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
          component={
            InterviewModule
          }
        />

        {/* =====================================================
            SUPPORT
        ===================================================== */}

        <Stack.Screen
          name="Settings"
          component={
            SettingsScreen
          }
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
   STYLES
========================================================= */

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: '#0F4C81',
  },

  splashTitle: {
    color: '#FFFFFF',

    fontSize: 34,

    fontWeight: '900',

    letterSpacing: 1,
  },

  splashTag: {
    color: '#DCEAFE',

    fontSize: 14,

    fontWeight: '600',

    marginTop: 10,
  },
});