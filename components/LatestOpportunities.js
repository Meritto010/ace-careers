import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Linking, 
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GOOGLE_BLUE = '#1A73E8';
const BRAND_DARK = '#103D6A';

// 💡 Pass standard props from DashboardScreen to handle paywall activation prompts
export default function LatestOpportunities({ isActivated, onOpenPaywall, navigation }) {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const URL = 'https://raw.githubusercontent.com/Meritto010/campus_connect/main/campus_connect.json';
    fetch(URL)
      .then((res) => res.json())
      .then((json) => {
        setVacancies(json.vacancies || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleJoinPress = (item) => {
    if (item.status === 'Closed') return;

    // 💡 Optional Premium Interception Strategy:
    // If you want to make specific premium drives require key activation while keeping others free:
    if (!isActivated && item.isPremiumDrive) {
      if (onOpenPaywall) {
        onOpenPaywall();
      } else {
        Alert.alert("Premium Drive", "Unlock premium corporate drives with an activation key.");
      }
      return;
    }

    // Default open access routing 
    Linking.openURL(item.link);
  };

  if (loading) return <ActivityIndicator color={GOOGLE_BLUE} style={{ marginVertical: 20 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>CAMPUS CONNECT</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContent}
      >
        {vacancies.map((item, index) => (
          <View key={index} style={[styles.card, item.status === 'Closed' && { opacity: 0.6 }]}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.company} numberOfLines={1}>{item.company}</Text>
                <Text style={styles.role} numberOfLines={1}>{item.role}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'Active' ? '#E6F4EA' : '#FCE8E6' }]}>
                <Text style={[styles.statusText, { color: item.status === 'Active' ? '#1E8E3E' : '#D93025' }]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.details}>
              <Text style={styles.detailText}>📍 {item.location}</Text>
              <Text style={styles.detailText}>💰 {item.ctc}</Text>
              <Text style={styles.qualificationText}>🎓 {item.qualification}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.btn, item.status === 'Closed' && styles.disabledBtn]}
              onPress={() => handleJoinPress(item)}
            >
              <Ionicons name="logo-whatsapp" size={14} color="#FFF" />
              <Text style={styles.btnText}> Join Group</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 15 },
  sectionHeader: { fontSize: 11, fontWeight: '700', color: '#5F6368', marginBottom: 15, paddingHorizontal: 20, letterSpacing: 1 },
  horizontalScrollContent: { paddingHorizontal: 15 },
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 15, 
    marginHorizontal: 5, 
    width: 260, 
    borderWidth: 1, 
    borderColor: '#F1F3F4',
    elevation: 2
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  company: { fontSize: 15, fontWeight: '800', color: BRAND_DARK },
  role: { fontSize: 12, color: GOOGLE_BLUE, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  statusText: { fontSize: 9, fontWeight: '800' },
  details: { marginBottom: 12 },
  detailText: { fontSize: 11, color: '#5F6368', marginBottom: 2 },
  qualificationText: { fontSize: 11, color: BRAND_DARK, fontWeight: '700', marginTop: 2 },
  btn: { backgroundColor: '#25D366', flexDirection: 'row', height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  disabledBtn: { backgroundColor: '#BDC1C6' },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 12 }
});
