import React from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Linking, ScrollView, Alert, StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function LegalScreen({ navigation }) {
  
  const PRIVACY_URL = 'https://gist.githubusercontent.com/Meritto010/106fe9eed279743481b47dd0dc548bfe/raw/privacy-policy.md';
  const TERMS_URL = 'https://gist.githubusercontent.com/Meritto010/8f44e03d9d4d8c5eb0033d2e12f50900/raw/terms-of-service.md';
  const SUPPORT_EMAIL = 'ACE CARRERS <ace.careerdesk@gmail.com>';
  const SUPPORT_WHATSAPP = '919074887447';

  const handleOpenLink = async (url, title) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", `Cannot open ${title}`);
      }
    } catch (e) {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=ACE Careers Support Request`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${SUPPORT_WHATSAPP}?text=Hello ACE Careers Support team, I need assistance.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      
      {/* HEADER HEAD BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#0F4C81" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        
        {/* SECTION 1: LEGAL AGREEMENTS */}
        <Text style={styles.sectionTitle}>Legal Framework</Text>
        
        <TouchableOpacity style={styles.legalCard} onPress={() => handleOpenLink(PRIVACY_URL, "Privacy Policy")}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#E8F0FE' }]}>
              <Ionicons name="shield-half-outline" size={20} color="#1A73E8" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Privacy Policy</Text>
              <Text style={styles.cardSub}>Data safety & usage statements</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.legalCard} onPress={() => handleOpenLink(TERMS_URL, "Terms of Service")}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#E8F0FE' }]}>
              <Ionicons name="document-text-outline" size={20} color="#1A73E8" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Terms of Service</Text>
              <Text style={styles.cardSub}>Rules regarding software utilization</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
        </TouchableOpacity>

        {/* SECTION 2: CONTACT SUPPORT */}
        <Text style={styles.sectionTitle}>Help Desk Corner</Text>

        <TouchableOpacity style={styles.legalCard} onPress={handleWhatsApp}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#E6F4EA' }]}>
              <Ionicons name="logo-whatsapp" size={20} color="#0F9D58" />
            </View>
            <View>
              <Text style={styles.cardTitle}>WhatsApp Instant Desk</Text>
              <Text style={styles.cardSub}>Fast response activation support</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.legalCard} onPress={handleEmail}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#FCE8E6' }]}>
              <Ionicons name="mail-outline" size={20} color="#EA4335" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Official Email Support</Text>
              <Text style={styles.cardSub}>Query resolution via email channels</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
        </TouchableOpacity>

        {/* APP FOOTER STAMP */}
        <View style={styles.footerStamp}>
          <Text style={styles.footerBrand}>Placement Prep v1.0.0</Text>
          <Text style={styles.footerText}>Developed for Professional Excellence</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F4C81' },
  scrollBody: { 
    padding: 20,
    paddingBottom: 80 // Increased padding for footer visibility
  },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 15, marginTop: 10 },
  legalCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  cardSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  footerStamp: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
  footerBrand: { fontSize: 12, fontWeight: '700', color: '#94A3B8' },
  footerText: { fontSize: 11, color: '#CBD5E1', marginTop: 2 }
});
