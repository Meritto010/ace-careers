import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Dimensions,
  PixelRatio,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
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
  const roundedSize = Math.round(PixelRatio.roundToNearestPixel(newSize));
  return Platform.OS === 'ios' ? roundedSize : roundedSize - 2;
}

/* =========================================================
   FEATURE CARD
========================================================= */
const FeatureCard = ({ icon, title, description, iconColor, bgColor }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    style={[styles.fCard, { backgroundColor: bgColor }]}
    onPress={() => Alert.alert(title, description)}
  >
    <View style={[styles.iconCircle, { backgroundColor: `${iconColor}20` }]}>
      <Ionicons name={icon} size={normalize(18)} color={iconColor} />
    </View>
    <Text style={styles.fText}>{title}</Text>
  </TouchableOpacity>
);

/* =========================================================
   MAIN SCREEN
========================================================= */
export default function LicenseActivationScreen({ navigation, onActivationSuccess }) {
  const [name, setName] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================================================
     LINKS
  ========================================================= */
  const PRIVACY_URL = 'https://gist.githubusercontent.com/Meritto010/106fe9eed279743481b47dd0dc548bfe/raw/024f52e035c0860b37473e5bc7e32606023a1ea6/privacy-policy.md';
  const TERMS_URL = 'https://gist.githubusercontent.com/Meritto010/8f44e03d9d4d8c5eb0033d2e12f50900/raw/c71e80fab781e7336b62284beb13d8870bb99b2c/terms-of-service.md';

  /* =========================================================
     SUPPORT & UTILS
  ========================================================= */
  const handleSupport = () => {
    const phone = '919074887447';
    const url = `https://wa.me/${phone}?text=Hi ACE Careers Support, I have a license enquiry / need support with activation.`;

    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'WhatsApp not installed.')
    );
  };

  const openLink = (url) => {
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open link.')
    );
  };

  const handleFreeAccess = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'MainApp',
          params: { isActivated: false },
        },
      ],
    });
  };

  /* =========================================================
     ACTIVATION LOGIC
  ========================================================= */
  const handleActivation = async () => {
    if (!name.trim() || !licenseKey.trim()) {
      Alert.alert('Required', 'Please enter your details.');
      return;
    }

    if (!agreed) {
      Alert.alert('Terms Required', 'Please accept Privacy Policy and Terms.');
      return;
    }

    setLoading(true);

    try {
      const formattedKey = licenseKey.trim().toUpperCase().replace(/\s/g, '');
      const isValid = await checkLicense(formattedKey);

      if (isValid) {
        await AsyncStorage.setItem('@is_activated', 'true');
        await AsyncStorage.setItem('@activated_license', formattedKey);
        await AsyncStorage.setItem('@user_name', name.trim());

        Alert.alert('Activation Successful', 'Premium features unlocked.', [
          {
            text: 'Continue',
            onPress: () => {
              if (onActivationSuccess) {
                onActivationSuccess();
              } else {
                navigation.navigate('MainApp', { isActivated: true });
              }
            },
          },
        ]);
      } else {
        Alert.alert('Activation Failed', 'Invalid or disabled license key.');
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Connection Error', 'Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Ionicons name="shield-checkmark" size={normalize(30)} color="#FFF" />
            </View>
            <Text style={styles.brandTitle}>ACE CAREERS</Text>
            <Text style={styles.tagline}>Unlock Premium Career Features</Text>
          </View>

          {/* FEATURES */}
          <View style={styles.featContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: normalize(20) }}
            >
              <FeatureCard
                icon="briefcase"
                title="Featured Jobs"
                description="Access premium job opportunities."
                iconColor={WARNING_ORANGE}
                bgColor="#FFF7ED"
              />
              <FeatureCard
                icon="construct"
                title="Career Tools"
                description="Resume Builder, Mock Interviews and Career Support."
                iconColor={SUCCESS_GREEN}
                bgColor="#ECFDF5"
              />
            </ScrollView>
          </View>

          {/* FORM AREA */}
          <View style={styles.form}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#94A3B8"
              value={name}
              editable={!loading}
              onChangeText={setName}
            />

            <Text style={styles.label}>LICENSE KEY</Text>
            <TextInput
              style={styles.input}
              placeholder="ACE-XXXX-XXXX"
              placeholderTextColor="#94A3B8"
              value={licenseKey}
              editable={!loading}
              autoCapitalize="characters"
              onChangeText={setLicenseKey}
            />

            {/* TERMS AND CONDITIONS */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity disabled={loading} onPress={() => setAgreed(!agreed)}>
                <Ionicons
                  name={agreed ? 'checkbox' : 'square-outline'}
                  size={normalize(22)}
                  color={agreed ? ACE_BLUE : '#CBD5E1'}
                />
              </TouchableOpacity>

              <View style={styles.termsRow}>
                <Text style={styles.checkboxText}>I agree to the</Text>
                <TouchableOpacity onPress={() => openLink(PRIVACY_URL)}>
                  <Text style={styles.linkText}> Privacy Policy</Text>
                </TouchableOpacity>
                <Text style={styles.checkboxText}> &</Text>
                <TouchableOpacity onPress={() => openLink(TERMS_URL)}>
                  <Text style={styles.linkText}> Terms</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ACTIVATE PREMIUM BUTTON */}
            <TouchableOpacity
              disabled={loading}
              style={[styles.btnActivate, loading && { opacity: 0.7 }]}
              onPress={handleActivation}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="flash" size={normalize(18)} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.btnText}>Activate Premium</Text>
                </>
              )}
            </TouchableOpacity>

            {/* EXPLORE FREE ACCESS */}
            <TouchableOpacity disabled={loading} style={styles.btnSkip} onPress={handleFreeAccess}>
              <Text style={styles.skipText}>Explore Free Access</Text>
            </TouchableOpacity>

            {/* INTEGRATED SUPPORT SECTION */}
            <View style={styles.supportSection}>
              <Text style={styles.supportHeading}>Get Support / License Enquiry</Text>
              <TouchableOpacity
                style={styles.supportRowPill}
                onPress={handleSupport}
                activeOpacity={0.85}
              >
                <Ionicons name="logo-whatsapp" size={normalize(16)} color="#065F46" />
                <Text style={styles.supportRowText}>Connect on WhatsApp (+91 9074887447)</Text>
              </TouchableOpacity>
            </View>

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
    paddingBottom: normalize(40),
  },
  header: {
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight + normalize(15) : normalize(20),
  },
  logoBadge: {
    width: normalize(64),
    height: normalize(64),
    borderRadius: normalize(32),
    backgroundColor: ACE_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginBottom: normalize(12),
  },
  brandTitle: {
    fontSize: normalize(28),
    fontWeight: '900',
    color: ACE_BLUE,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: normalize(14),
    color: '#334155',
    fontWeight: '700',
    marginTop: normalize(4),
  },
  featContainer: {
    marginTop: normalize(20),
  },
  fCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
    height: normalize(52),
    borderRadius: normalize(14),
    marginRight: normalize(12),
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconCircle: {
    width: normalize(30),
    height: normalize(30),
    borderRadius: normalize(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(8),
  },
  fText: {
    fontSize: normalize(13),
    fontWeight: '800',
    color: '#1E293B',
  },
  form: {
    paddingHorizontal: normalize(24),
    marginTop: normalize(24),
  },
  label: {
    fontSize: normalize(11),
    fontWeight: '800',
    color: '#334155',
    marginBottom: normalize(6),
  },
  input: {
    height: normalize(52),
    backgroundColor: '#F8FAFC',
    borderRadius: normalize(12),
    borderWidth: 1.5,
    borderColor: '#DCE3EA',
    paddingHorizontal: normalize(14),
    fontSize: normalize(14),
    color: '#0F172A',
    marginBottom: normalize(14),
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  termsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: normalize(8),
    flex: 1,
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: normalize(12),
    color: '#475569',
    fontWeight: '600',
  },
  linkText: {
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
    color: '#0F4C81',
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
  supportRowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(10),
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: '#86EFAC',
    width: '100%',
    justifyContent: 'center',
  },
  supportRowText: {
    marginLeft: normalize(8),
    fontSize: normalize(12),
    fontWeight: '800',
    color: '#065F46',
  },
});