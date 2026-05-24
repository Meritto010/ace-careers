import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Alert, Linking, Platform, LayoutAnimation, UIManager, StatusBar, Dimensions, PixelRatio
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
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

const SettingRow = ({ icon, title, value, onPress, color = \"#64748B\", isLast = false }) => (
  <TouchableOpacity 
    style={[styles.row, isLast && { borderBottomWidth: 0 }]} \
    onPress={onPress}
    activeOpacity={0.6}
  >
    <View style={[styles.iconContainer, { backgroundColor: `${color}10` }]}>
      <Ionicons name={icon} size={normalize(20)} color={color} />
    </View>
    <View style={styles.rowContent}>
      <Text style={styles.rowText}>{title}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />}
    </View>
  </TouchableOpacity>
);

const AccordionSection = ({ title, icon, color, isOpen, onToggle, children }) => {
  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity style={styles.sectionHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={[styles.sectionIconContainer, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={normalize(18)} color={color} />
        </View>
        <Text style={styles.sectionLabel}>{title}</Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={16} color="#94A3B8" style={{ marginLeft: "auto" }} />
      </TouchableOpacity>
      {isOpen && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

export default function SettingsScreen({ navigation }) {
  const [openSection, setOpenSection] = useState("account"); // account, legal, help
  const [isActivated, setIsActivated] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseName, setLicenseName] = useState("");

  useEffect(() => {
    const fetchLicenseDetails = async () => {
      const storedState = await AsyncStorage.getItem('isActivated');
      const storedKey = await AsyncStorage.getItem('activeLicenseKey');
      const storedName = await AsyncStorage.getItem('licenseeName');
      
      setIsActivated(storedState === 'true');
      setLicenseKey(storedKey || "");
      setLicenseName(storedName || "");
    };

    const unsubscribe = navigation.addListener('focus', fetchLicenseDetails);
    fetchLicenseDetails();
    return unsubscribe;
  }, [navigation]);

  const toggleSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSection(openSection === section ? null : section);
  };

  const handleURL = async (url, title) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Link Error", `Cannot process verification link for ${title}`);
      }
    } catch {
      Alert.alert("Error", "Could not complete web routing redirect.");
    }
  };

  const handleDeactivate = () => {
    Alert.alert(
      "Deactivate Device",
      "Are you sure you want to log out and clear your active premium license from this terminal device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear License",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            setIsActivated(false);
            setLicenseKey("");
            setLicenseName("");
            Alert.alert("Cleared", "Terminal subscription removed successfully.");
            navigation.reset({ index: 0, routes: [{ name: 'LicenseActivation' }] });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      
      <View style={styles.topHeader}>
        <Text style={styles.topHeaderTitle}>App Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        
        {/* MEMBERSHIP BOX */}
        <View style={styles.membershipCard}>
          <View style={styles.cardInfo}>
            <Text style={styles.memberStatusLabel}>LICENSE STATUS</Text>
            <Text style={styles.memberStatusValue}>
              {isActivated ? "Premium Lifetime Member" : "Limited Evaluation Version"}
            </Text>
          </View>
          {isActivated ? (
            <View style={[styles.statusBadge, { backgroundColor: '#E6F4EA' }]}>
              <Text style={[styles.statusBadgeText, { color: GOOGLE_GREEN }]}>ACTIVE</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.statusBadge, { backgroundColor: '#E8F0FE' }]}
              onPress={() => navigation.navigate('LicenseActivation')}
            >
              <Text style={[styles.statusBadgeText, { color: GOOGLE_BLUE }]}>UPGRADE</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SECTION 1: ACCOUNT & LICENSE */}
        <AccordionSection 
          title="Account & Subscription" 
          icon="key-outline" 
          color={GOOGLE_BLUE}
          isOpen={openSection === "account"}
          onToggle={() => toggleSection("account")}
        >
          {isActivated ? (
            <View style={styles.licenseInfo}>
              <Text style={styles.licenseSubTitle}>REGISTERED HOLDER</Text>
              <Text style={styles.licenseName}>{licenseName || "Premium User"}</Text>
              
              <Text style={styles.licenseSubTitle}>LICENSE TERMINAL IDENTIFIER</Text>
              <Text style={styles.licenseKey}>{licenseKey}</Text>
              
              <TouchableOpacity style={styles.deactivateBtn} onPress={handleDeactivate}>
                <Ionicons name="log-out-outline" size={16} color={GOOGLE_RED} style={{ marginRight: 6 }} />
                <Text style={styles.deactivateBtnText}>Deactivate License Key</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.licenseInfo}>
              <Text style={styles.lockedText}>You are using the basic standard version of ACE.</Text>
              <TouchableOpacity style={styles.activateBtn} onPress={() => navigation.navigate('LicenseActivation')}>
                <Text style={styles.activateBtnText}>Unlock Premium Access Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </AccordionSection>

        {/* SECTION 2: HELP & PLATFORM SUPPORT */}
        <AccordionSection 
          title="Support Desk" 
          icon="help-circle-outline" 
          color={GOOGLE_GREEN}
          isOpen={openSection === "help"}
          onToggle={() => toggleSection("help")}
        >
          <SettingRow 
            icon="logo-whatsapp" 
            title="Chat Support Helpdesk" 
            color="#25D366"
            onPress={() => handleURL("https://wa.me/919074887447", "WhatsApp Desk")} 
          />
          <SettingRow 
            icon="mail-outline" 
            title="Email Support" 
            color={GOOGLE_BLUE}
            isLast={true}
            onPress={() => handleURL("mailto:ace.careerdesk@gmail.com", "Email Support")} 
          />
        </AccordionSection>

        {/* SECTION 3: LEGAL & LEGACY CORNER */}
        <AccordionSection 
          title="Legal & Guidelines" 
          icon="shield-checkmark-outline" 
          color="#64748B"
          isOpen={openSection === "legal"}
          onToggle={() => toggleSection("legal")}
        >
          <SettingRow 
            icon="document-text-outline" 
            title="Privacy Policy Statement" 
            onPress={() => handleURL("https://gist.githubusercontent.com/Meritto010/106fe9eed279743481b47dd0dc548bfe/raw/privacy-policy.md", "Privacy Policy")} 
          />
          <SettingRow 
            icon="reader-outline" 
            title="Terms of Service Agreement" 
            isLast={true}
            onPress={() => handleURL("https://gist.githubusercontent.com/Meritto010/8f44e03d9d4d8c5eb0033d2e12f50900/raw/terms-of-service.md", "Terms")} 
          />
        </AccordionSection>

        <View style={styles.appFooterBlock}>
          <Text style={styles.footerBrandText}>ACE Careers</Text>
          <Text style={styles.footerVersionText}>Version 1.1.0 (Production Build)</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topHeader: { paddingHorizontal: normalize(16), paddingVertical: normalize(16), backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  topHeaderTitle: { fontSize: normalize(18), fontWeight: '800', color: '#1E293B' },
  scrollBody: { padding: normalize(16), paddingBottom: normalize(40) },
  
  membershipCard: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    backgroundColor: '#FFF', padding: normalize(16), borderRadius: normalize(16), 
    marginBottom: normalize(20), borderWidth: 1, borderColor: '#E2E8F0' 
  },
  cardInfo: { flex: 1 },
  memberStatusLabel: { fontSize: normalize(10), fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 },
  memberStatusValue: { fontSize: normalize(15), fontWeight: '700', color: '#1E293B', marginTop: normalize(2) },
  statusBadge: { paddingHorizontal: normalize(10), paddingVertical: normalize(6), borderRadius: normalize(8) },
  statusBadgeText: { fontSize: normalize(11), fontWeight: '800' },

  sectionContainer: { backgroundColor: '#FFF', borderRadius: normalize(16), marginBottom: normalize(12), borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', padding: normalize(14) },
  sectionIconContainer: { width: normalize(32), height: normalize(32), borderRadius: normalize(8), justifyContent: 'center', alignItems: 'center', marginRight: normalize(12) },
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
  licenseKey: { fontSize: normalize(14), fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#475569', backgroundColor: '#F8FAFC', padding: normalize(12), borderRadius: normalize(8), borderWidth: 1, borderColor: '#E2E8F0', marginBottom: normalize(16) },
  
  deactivateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: normalize(8) },
  deactivateBtnText: { fontSize: normalize(13), fontWeight: '700', color: GOOGLE_RED },
  
  lockedText: { fontSize: normalize(13), color: '#64748B', marginBottom: normalize(14), lineHeight: normalize(18) },
  activateBtn: { backgroundColor: ACE_BLUE, paddingVertical: normalize(12), borderRadius: normalize(10), alignItems: 'center' },
  activateBtnText: { color: '#FFF', fontSize: normalize(14), fontWeight: '800' },
  
  appFooterBlock: { marginTop: normalize(30), alignItems: 'center' },
  footerBrandText: { fontSize: normalize(13), fontWeight: '700', color: '#64748B' },
  footerVersionText: { fontSize: normalize(11), color: '#94A3B8', marginTop: normalize(2) }
});
