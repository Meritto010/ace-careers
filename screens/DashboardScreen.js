import React, {
  useState,
  useEffect,
} from 'react';

import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons';

import LatestOpportunities from '../components/LatestOpportunities';
import FeaturedJobs from '../components/FeaturedJobs';

/* =========================================================
   COLORS
========================================================= */

const BRAND_DARK = '#103D6A';
const BG_LIGHT = '#F8F9FA';
const GOOGLE_BLUE = '#1A73E8';

/* =========================================================
   DASHBOARD
========================================================= */

export default function DashboardScreen({
  isActivated,
  navigation,
  route,
}) {

  const [
    resolvedActivationState,
    setResolvedActivationState,
  ] = useState(false);

  /* =========================================================
     CHECK ACTIVATION
  ========================================================= */

  useEffect(() => {

    const initializeActivation =
      async () => {

        try {

          /* =========================================
             ROUTE PARAM PRIORITY
          ========================================= */

          if (
            route.params &&
            route.params.isActivated !==
              undefined
          ) {
            setResolvedActivationState(
              route.params.isActivated
            );
            return;
          }

          /* =========================================
             FALLBACK TO STORAGE
          ========================================= */

          const storedState =
            await AsyncStorage.getItem(
              'isActivated'
            );
          setResolvedActivationState(
            storedState === 'true'
          );

        } catch (error) {
          console.error(
            'Error reading activation status:',
            error
          );
          setResolvedActivationState(
            false
          );
        }
      };

    initializeActivation();

  }, [route.params?.isActivated]);

  /* =========================================================
     HANDLERS
  ========================================================= */

  const handleSupportWhatsApp =
    async () => {
      const url =
        'https://wa.me/919074887447?text=Hello%20ACE%20Support,%20I%20need%20help%20with%20the%20app.';
      try {
        const supported =
          await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert(
            'Error',
            'WhatsApp is not installed on this device.'
          );
        }
      } catch (e) {
        Alert.alert(
          'Error',
          'Could not open WhatsApp.'
        );
      }
    };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        backgroundColor="#FFF"
        barStyle="dark-content"
      />

      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>
            ACE
          </Text>
          <Text
            style={styles.appSubName}
          >
            Careers
          </Text>
        </View>

        {resolvedActivationState ? (
          <View
            style={
              styles.headerActiveBadge
            }
          >
            <Ionicons
              name="checkmark-circle"
              size={14}
              color="#FFF"
              style={{ marginRight: 4 }}
            />
            <Text
              style={
                styles.headerActiveText
              }
            >
              PREMIUM
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={
              styles.headerUnlockBtn
            }
            onPress={() =>
              navigation.navigate(
                'LicenseActivation'
              )
            }
          >
            <Ionicons
              name="lock-open-outline"
              size={12}
              color="#FFF"
              style={{ marginRight: 4 }}
            />
            <Text
              style={
                styles.headerUnlockBtnText
              }
            >
              UNLOCK
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={
          styles.scrollBody
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* QUICK TOOLS SECTION */}
        <Text
          style={styles.sectionTitle}
        >
          Quick Career Tools
        </Text>
        <View style={styles.toolsGrid}>
          {/* TOOL 1: GRAMMAR */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() =>
              navigation.navigate(
                'Grammar'
              )
            }
          >
            <Ionicons
              name="text-outline"
              size={24}
              color={GOOGLE_BLUE}
            />
            <Text
              style={styles.toolTitle}
            >
              Grammar
            </Text>
            <Text
              style={
                styles.toolSubTitle
              }
            >
              Learn Rules
            </Text>
          </TouchableOpacity>

          {/* TOOL 2: SPEAKING */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() =>
              navigation.navigate(
                'Speaking'
              )
            }
          >
            <Ionicons
              name="mic-outline"
              size={24}
              color={GOOGLE_BLUE}
            />
            <Text
              style={styles.toolTitle}
            >
              Speaking
            </Text>
            <Text
              style={
                styles.toolSubTitle
              }
            >
              Practice AI
            </Text>
          </TouchableOpacity>

          {/* TOOL 3: RESUME */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() =>
              navigation.navigate(
                'Resume'
              )
            }
          >
            <Ionicons
              name="document-text-outline"
              size={24}
              color={GOOGLE_BLUE}
            />
            <Text
              style={styles.toolTitle}
            >
              Resume
            </Text>
            <Text
              style={
                styles.toolSubTitle
              }
            >
              Builder
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={styles.miniDivider}
        />

        {/* COMPONENT feeds */}
        <LatestOpportunities
          navigation={navigation}
        />
        <FeaturedJobs
          navigation={navigation}
        />
      </ScrollView>

      {/* FLOATING CHAT SUPPORT */}
      <TouchableOpacity
        style={
          styles.absoluteSupportContainer
        }
        onPress={handleSupportWhatsApp}
      >
        <Ionicons
          name="chatbubble-ellipses"
          size={18}
          color="#FFF"
        />
        <Text style={styles.supportLink}>
          Help Desk
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
  },

  appName: {
    fontSize: 22,
    fontWeight: '900',
    color: BRAND_DARK,
    letterSpacing: -0.5,
  },

  appSubName: {
    fontSize: 11,
    fontWeight: '700',
    color: GOOGLE_BLUE,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: -2,
  },

  scrollBody: {
    padding: 16,
    paddingBottom: 160,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 4,
  },

  headerActiveBadge: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },

  headerActiveText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  headerUnlockBtn: {
    flexDirection: 'row',
    backgroundColor: BRAND_DARK,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },

  headerUnlockBtnText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  toolsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  toolCard: {
    width: '31%',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F3F4',
    elevation: 1,
  },

  toolTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: BRAND_DARK,
  },

  toolSubTitle: {
    fontSize: 9,
    fontWeight: '600',
    color: GOOGLE_BLUE,
    marginTop: 1,
  },

  miniDivider: {
    height: 6,
    backgroundColor: '#F1F3F4',
    marginVertical: 4,
  },

  absoluteSupportContainer: {
    position: 'absolute',
    bottom: 95,
    left: 20,
    backgroundColor: GOOGLE_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  supportLink: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },
});
