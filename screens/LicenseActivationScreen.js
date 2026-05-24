import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Dimensions,
  PixelRatio,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons';

import { checkLicense } from '../services/supabase';

/* =========================================================
   RESPONSIVE
========================================================= */

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scale = SCREEN_WIDTH / 375;

const ACE_BLUE = '#0F4C81';
const SUCCESS_GREEN = '#10B981';
const WARNING_ORANGE = '#F59E0B';

export function normalize(size) {

  const newSize = size * scale;

  const roundedSize = Math.round(
    PixelRatio.roundToNearestPixel(
      newSize
    )
  );

  return Platform.OS === 'ios'
    ? roundedSize
    : roundedSize - 2;
}

/* =========================================================
   FEATURE CARD
========================================================= */

const FeatureCard = ({
  icon,
  title,
  desc,
}) => (
  <View style={styles.featureCard}>
    <View
      style={styles.featureIconContainer}
    >
      <Ionicons
        name={icon}
        size={normalize(22)}
        color={ACE_BLUE}
      />
    </View>
    <View style={{ flex: 1 }}>
      <Text
        style={styles.featureTitle}
      >
        {title}
      </Text>
      <Text style={styles.featureDesc}>
        {desc}
      </Text>
    </View>
  </View>
);

/* =========================================================
   LICENSE ACTIVATION SCREEN
========================================================= */

export default function LicenseActivationScreen({
  navigation,
}) {

  const [licenseKey, setLicenseKey] =
    useState('');
  const [loading, setLoading] =
    useState(false);

  const handleActivation =
    async () => {

      if (!licenseKey.trim()) {
        Alert.alert(
          'Required',
          'Please enter your activation license key.'
        );
        return;
      }

      setLoading(true);

      try {

        const cleanKey = licenseKey
          .trim()
          .toUpperCase();
        const verification =
          await checkLicense(cleanKey);

        if (verification.success) {

          await AsyncStorage.setItem(
            'isActivated',
            'true'
          );
          await AsyncStorage.setItem(
            'activeLicenseKey',
            cleanKey
          );

          if (verification.name) {
            await AsyncStorage.setItem(
              'licenseeName',
              verification.name
            );
          }

          Alert.alert(
            'Success',
            'Your ACE premium access is now fully active!',
            [
              {
                text: 'Get Started',
                onPress: () =>
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'MainTabs',
                        params: {
                          isActivated: true,
                        },
                      },
                    ],
                  }),
              },
            ]
          );

        } else {
          Alert.alert(
            'Activation Failed',
            verification.message ||
              'Invalid license key. Please check and try again.'
          );
        }

      } catch (error) {
        console.error(
          'Activation Error: ',
          error
        );
        Alert.alert(
          'System Error',
          'Unable to connect to activation system. Please check your network connection.'
        );
      } finally {
        setLoading(false);
      }
    };

  const handleBuyLicense = async () => {
    const message = encodeURIComponent(
      'Hello ACE Careers, I want to purchase the License Key for Premium access.'
    );
    const url = `https://wa.me/919074887447?text=${message}`;

    try {
      const supported =
        await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Error',
          'WhatsApp is not installed.'
        );
      }
    } catch (err) {
      Alert.alert(
        'Error',
        'Could not initiate purchase.'
      );
    }
  };

  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'MainTabs',
          params: { isActivated: false },
        },
      ],
    });
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.brandTitle}>
              ACE
            </Text>
            <Text
              style={styles.brandSubtitle}
            >
              CAREERS
            </Text>
            <View
              style={
                styles.badgeContainer
              }
            >
              <Text style={styles.badgeText}>
                Premium Activation
              </Text>
            </View>
          </View>

          {/* HERO VALUE CARD */}
          <View style={styles.valueCard}>
            <Text
              style={styles.valueTitle}
            >
              Unlock complete career tools
            </Text>
            <Text style={styles.valuePrice}>
              ₹249
              <Text
                style={styles.valueDuration}
              >
                / lifetime access
              </Text>
            </Text>
            <Text style={styles.valueOffer}>
              One-time payment. No hidden charges.
            </Text>
          </View>

          {/* EXCLUSIVE FEATURES LIST */}
          <Text
            style={styles.sectionHeading}
          >
            What you will unlock:
          </Text>

          <FeatureCard
            icon="document-text"
            title="Premium Resume Builder"
            desc="Generate unlimited beautifully structured professional resumes for sharing."
          />

          <FeatureCard
            icon="mic"
            title="Interactive Interview Prep"
            desc="Practice speaking structures with curated modules and instant checks."
          />

          <FeatureCard
            icon="briefcase"
            title="Verified Career Opportunities"
            desc="Gain direct access to active corporate off-campus job feeds and listings."
          />

          {/* INPUT & ACTION BLOCK */}
          <View
            style={styles.activationBlock}
          >
            <Text
              style={styles.inputLabel}
            >
              Enter License Key
            </Text>
            <TextInput
              style={styles.input}
              placeholder="ACE-XXXX-XXXX-XXXX"
              placeholderTextColor="#94A3B8"
              value={licenseKey}
              onChangeText={setLicenseKey}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.btnActivate}
              onPress={handleActivation}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                />
              ) : (
                <>
                  <Text
                    style={
                      styles.btnText
                    }
                  >
                    Activate License
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={normalize(16)}
                    color="#FFFFFF"
                    style={{
                      marginLeft: 8,
                    }}
                  />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSkip}
              onPress={handleSkip}
              disabled={loading}
            >
              <Text
                style={styles.skipText}
              >
                Continue with Limited Free Version
              </Text>
            </TouchableOpacity>
          </View>

          {/* SUPPORT / BUY LINK */}
          <View
            style={
              styles.supportSection
            }
          >
            <Text
              style={
                styles.supportHeading
              }
            >
              Don't have a license key?
            </Text>
            <TouchableOpacity
              onPress={handleBuyLicense}
              style={
                styles.buyLinkContainer
              }
            >
              <Ionicons
                name="logo-whatsapp"
                size={normalize(14)}
                color={ACE_BLUE}
                style={{ marginRight: 6 }}
              />
              <Text
                style={styles.buyLinkText}
              >
                Buy Key Instantly via WhatsApp
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingHorizontal: normalize(24),
    paddingTop: normalize(20),
    paddingBottom: normalize(40),
  },

  header: {
    alignItems: 'center',
    marginBottom: normalize(24),
  },

  brandTitle: {
    fontSize: normalize(32),
    fontWeight: '900',
    color: ACE_BLUE,
    letterSpacing: -1,
  },

  brandSubtitle: {
    fontSize: normalize(12),
    fontWeight: '800',
    color: WARNING_ORANGE,
    letterSpacing: 4,
    marginTop: normalize(-4),
    textTransform: 'uppercase',
  },

  badgeContainer: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(4),
    borderRadius: normalize(20),
    marginTop: normalize(12),
  },

  badgeText: {
    fontSize: normalize(11),
    fontWeight: '700',
    color: '#475569',
  },

  valueCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: normalize(16),
    padding: normalize(20),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: normalize(24),
  },

  valueTitle: {
    fontSize: normalize(13),
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  valuePrice: {
    fontSize: normalize(34),
    fontWeight: '900',
    color: '#1E293B',
    marginVertical: normalize(4),
  },

  valueDuration: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#64748B',
  },

  valueOffer: {
    fontSize: normalize(11),
    color: SUCCESS_GREEN,
    fontWeight: '700',
  },

  sectionHeading: {
    fontSize: normalize(12),
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: normalize(14),
  },

  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: normalize(12),
    padding: normalize(14),
    marginBottom: normalize(12),
  },

  featureIconContainer: {
    backgroundColor: '#EFF6FF',
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(14),
  },

  featureTitle: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#1E293B',
  },

  featureDesc: {
    fontSize: normalize(12),
    color: '#64748B',
    marginTop: normalize(2),
    lineHeight: normalize(16),
  },

  activationBlock: {
    marginTop: normalize(16),
  },

  inputLabel: {
    fontSize: normalize(12),
    fontWeight: '800',
    color: '#475569',
    marginBottom: normalize(6),
  },

  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: normalize(12),
    height: normalize(50),
    paddingHorizontal: normalize(16),
    fontSize: normalize(16),
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 1,
    marginBottom: normalize(16),
    textAlign: 'center',
  },

  buyLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(4),
  },

  buyLinkText: {
    fontSize: normalize(12),
    color: ACE_BLUE,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },

  btnActivate: {
    backgroundColor: ACE_BLUE,
    height: normalize(54),
    borderRadius: normalize(14),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 4,
  },

  btnText: {
    color: '#FFFFFF',
    fontSize: normalize(15),
    fontWeight: '900',
  },

  btnSkip: {
    marginTop: normalize(12),
    alignItems: 'center',
    paddingVertical: normalize(4),
  },

  skipText: {
    color: ACE_BLUE,
    fontSize: normalize(14),
    fontWeight: '800',
    textDecorationLine: 'underline',
  },

  supportSection: {
    marginTop: normalize(20),
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: normalize(16),
  },

  supportHeading: {
    fontSize: normalize(11),
    fontWeight: '800',
    color: '#64748B',
    marginBottom: normalize(8),
    letterSpacing: 0.5,
  },
});
