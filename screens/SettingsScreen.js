import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Alert, SafeAreaView, Linking, Platform, LayoutAnimation, UIManager, StatusBar, Dimensions, PixelRatio
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

// Normalize function for responsive scaling
export function normalize(size) {
  const newSize = size * scale;
  const roundedSize = Math.round(PixelRatio.roundToNearestPixel(newSize));
  return Platform.OS === 'ios' ? roundedSize : roundedSize - 2;
}

const ACE_BLUE = '#0F4C81';
const GOOGLE_BLUE = '#1A73E8';
const GOOGLE_GREEN = '#0F9D58';
const GOOGLE_RED = '#EA4335';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SettingRow = ({ icon, title, value, onPress, color = "#64748B", isLast = false }) => (
  <TouchableOpacity 
    style={[styles.row, isLast && { borderBottomWidth: 0 }]} 
    onPress={onPress}
    activeOpacity={0.6}
    // FIX: Android touch area minimum
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={normalize(18)} color={color} />
    </View>
    <View style={styles.rowContent}>
      <Text style={styles.rowText}>{title}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
    </View>
    <Ionicons name="chevron-forward" size={normalize(16)} color="#B0B5BB" />
  </TouchableOpacity>
);

export default function SettingsScreen({ navigation }) {
  const [licenseKey, setLicenseKey] = useState("Not Activated");
  const [userName, setUserName] = useState("Learner");
  const [expandedSection, setExpandedSection] = useState('license');

  useEffect(() => { loadUserData(); }, []);

  const loadUserData = async () => {
    const key = await AsyncStorage.getItem('@activated_license');
    const name = await AsyncStorage.getItem('@user_name');
    if (key) setLicenseKey(key);
    if (name) setUserName(name);
  };

  const toggleSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleWhatsApp = () => {
    const phone = "919074887447";
    const message = "Hi ACE Support, I need help with my Pro account.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => Alert.alert("Error", "WhatsApp is not installed"));
  };

  const performLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['@is_activated', '@activated_license', '@user_name']);
      navigation.reset({ index: 0, routes: [{ name: 'Activation' }] });
    } catch (e) { Alert.alert("Error", "Logout failed."); }
  };

  const AccordionSection = ({ title, icon, sectionKey, iconColor, children }) => {
    const isOpen = expandedSection === sectionKey;
    return (
      <View style={styles.sectionCard}>
        <TouchableOpacity 
          style={styles.sectionHeader} 
          onPress={() => toggleSection(sectionKey)}
          activeOpacity={0.7}
        >
          <View style={styles.headerLeft}>
            <View style={[styles.headerIconCircle, { backgroundColor: iconColor + '10' }]}>
                <Ionicons name={icon} size={normalize(18)} color={iconColor} />
            </View>
            <Text style={styles.sectionLabel}>{title}</Text>
          </View>
          <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={normalize(16)} color="#B0B5BB" />
        </TouchableOpacity>
        {isOpen && <View style={styles.accordionContent}>{children}</View>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backCircle}
          // FIX: Android back button touch area
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
            <Ionicons name="arrow-back" size={normalize(24)} color={ACE_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: normalize(40) }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        // FIX: Android scroll bounce
        bounces={Platform.OS === 'ios'}
      >
        <View style={styles.brandCard}>
          <View style={styles.logoBox}>
            <View style={styles.avatar}>
                <Ionicons name="shield-checkmark" size={normalize(28)} color="#FFF" />
            </View>
          </View>
          <View>
            <Text style={styles.brandName}>ACE CAREERS</Text>
            <Text style={styles.version}> v1.1.0</Text>
          </View>
        </View>

        <AccordionSection title="LICENSE DETAILS" icon="ribbon-outline" iconColor={GOOGLE_BLUE} sectionKey="license">
             <View style={styles.licenseInfo}>
                <Text style={styles.licenseSubTitle}>REGISTERED USER</Text>
                <Text style={styles.licenseName}>{userName}</Text>
                <View style={styles.divider} />
                <Text style={styles.licenseSubTitle}>LICENSE KEY</Text>
                <Text style={styles.licenseKey}>{licenseKey}</Text>
             </View>
        </AccordionSection>

        <AccordionSection title="SUPPORT CHANNELS" icon="help-buoy-outline" iconColor={GOOGLE_GREEN} sectionKey="support">
          <SettingRow icon="logo-whatsapp" title="WhatsApp Support" color={GOOGLE_GREEN} onPress={handleWhatsApp} isLast={true} />
        </AccordionSection>

        <AccordionSection title="LEGAL & POLICIES" icon="shield-checkmark-outline" iconColor={GOOGLE_BLUE} sectionKey="legal">
          <SettingRow icon="document-text-outline" title="Privacy Policy" color={GOOGLE_BLUE} onPress={() => navigation.navigate('Legal')} />
          <SettingRow icon="document-lock-outline" title="Terms of Service" color={GOOGLE_BLUE} onPress={() => navigation.navigate('Legal')} isLast={true} />
        </AccordionSection>

        <AccordionSection title="ACCOUNT MANAGEMENT" icon="settings-outline" iconColor={GOOGLE_RED} sectionKey="account">
          <SettingRow icon="log-out-outline" title="Deactivate Device" color={GOOGLE_RED} onPress={performLogout} isLast={true} />
        </AccordionSection>

        <View style={styles.footerContainer}>
            <Text style={styles.footerNote}>ACE v1.1.0</Text>
            <Text style={styles.footerNote}>© 2026 ACE CAREERS• All Rights Reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC',
    // FIX: Android container padding
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: normalize(16), 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  backCircle: { 
    width: normalize(40), 
    height: normalize(40), 
    borderRadius: normalize(20),
    backgroundColor: '#F1F5F9', 
    alignItems: 'center', 
    justifyContent: 'center',
    // FIX: Android minimum touch area
    minWidth: 48,
    minHeight: 48,
  },
  headerTitle: { fontSize: normalize(18), fontWeight: '700', color: ACE_BLUE },
  // FIX: Increased bottom padding for Android
  scrollContent: { 
    padding: normalize(20), 
    paddingBottom: normalize(80) 
  },
  brandCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: normalize(20), borderRadius: normalize(24), marginBottom: normalize(20), borderWidth: 1, borderColor: '#E2E8F0' },
  logoBox: { backgroundColor: ACE_BLUE, borderRadius: normalize(16), marginRight: normalize(15) },
  avatar: { 
    width: normalize(50), 
    height: normalize(50), 
    borderRadius: normalize(25),
    backgroundColor: ACE_BLUE, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  brandName: { fontSize: normalize(20), fontWeight: '900', color: ACE_BLUE },
  version: { fontSize: normalize(13), color: GOOGLE_BLUE, fontWeight: '700' },
  sectionCard: { backgroundColor: '#FFF', borderRadius: normalize(20), marginBottom: normalize(15), overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: normalize(16) },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerIconCircle: { width: normalize(36), height: normalize(36), borderRadius: normalize(12), justifyContent: 'center', alignItems: 'center', marginRight: normalize(12) },
  sectionLabel: { fontSize: normalize(12), fontWeight: '800', color: '#475569', letterSpacing: 0.5 },
  accordionContent: { paddingHorizontal: normalize(16), paddingBottom: normalize(10), borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: normalize(14), borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  iconContainer: { width: normalize(38), height: normalize(38), borderRadius: normalize(12), justifyContent: 'center', alignItems: 'center', marginRight: normalize(15) },
  rowContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowText: { fontSize: normalize(15), fontWeight: '600', color: '#334155' },
  rowValue: { fontSize: normalize(14), color: '#94A3B8' },
  licenseInfo: { paddingVertical: normalize(12) },
  licenseSubTitle: { fontSize: normalize(10), fontWeight: '800', color: '#94A3B8', marginBottom: normalize(6) },
  licenseName: { fontSize: normalize(18), fontWeight: '700', color: '#1E293B', marginBottom: normalize(16) },
  licenseKey: { fontSize: normalize(15), fontWeight: '700', color: GOOGLE_BLUE },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: normalize(14) },
  footerContainer: { marginTop: normalize(10), alignItems: 'center' },
  footerNote: { textAlign: 'center', color: '#64748B', fontSize: normalize(12), fontWeight: '600' }
});
