import React, { useState, useEffect } from 'react'; // ✅ FIXED: Added useEffect here
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

export default function FeaturedJobs({ isActivated, onOpenPaywall, navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const URL = 'https://raw.githubusercontent.com/Meritto010/job-feed/main/jobs.json';
    
    fetch(URL)
      .then((res) => res.json())
      .then((json) => {
        const extractedJobs = json.elite_placements || json.feed || json.jobs || [];
        setJobs(extractedJobs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Featured Jobs Fetch Error: ", err);
        setLoading(false);
      });
  }, []);

  const handleApplyPress = (item) => {
    if (!isActivated) {
      if (onOpenPaywall) {
        onOpenPaywall();
      } else if (navigation) {
        navigation.navigate('Activation');
      } else {
        Alert.alert("Premium Feature", "Please activate your account to apply for elite placements.");
      }
      return;
    }

    const email = "ace.careerdesk@gmail.com";
    const subject = encodeURIComponent(`Application for ${item.role || 'Job Opportunity'} at ${item.company || 'ACE Careers'}`);
    const body = encodeURIComponent(`Hi Team,\n\nI am interested in applying for the ${item.role} position at ${item.company}.\n\nPlease find my resume attached.\n\nRegards,`);
    
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.openURL(mailtoUrl).catch((err) => {
      console.error("Failed to open email app:", err);
      Alert.alert("Error", "Could not launch email application. Please contact support.");
    });
  };

  if (loading) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="small" color={GOOGLE_BLUE} />
      </View>
    );
  }

  if (jobs.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Elite Placements</Text>
        <View style={styles.proBadge}>
          <Text style={styles.proBadgeText}>PRO ONLY</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContent}
      >
        {jobs.map((item, index) => (
          <View key={item.id || index} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.company} numberOfLines={1}>{item.company}</Text>
              <Ionicons name="briefcase-outline" size={14} color={GOOGLE_BLUE} />
            </View>
            
            <Text style={styles.role} numberOfLines={1}>{item.role}</Text>
            
            <View style={styles.miniDivider} />

            <View style={styles.details}>
              <Text style={styles.detailText}>📍 {item.location || 'Pan India'}</Text>
              <Text style={styles.detailText}>💰 {item.ctc || 'Best in Industry'}</Text>
              <Text style={styles.detailText}>🎓 {item.eligibility || 'Graduates'}</Text>
            </View>

            <TouchableOpacity 
              style={styles.btn}
              onPress={() => handleApplyPress(item)}
            >
              <Text style={styles.btnText}>Apply Now</Text>
              <Ionicons name="paper-plane-outline" size={12} color="#FFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centerLoading: { paddingVertical: 40, justifyContent: 'center', alignItems: 'center' },
  container: { marginVertical: 10 },
  miniDivider: { height: 1, backgroundColor: '#F1F3F4', marginVertical: 6 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: BRAND_DARK, letterSpacing: 1, marginRight: 6 },
  proBadge: { backgroundColor: '#E8F0FE', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4 },
  proBadgeText: { color: GOOGLE_BLUE, fontSize: 9, fontWeight: '900' },
  horizontalScrollContent: { paddingHorizontal: 15 },
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 12, 
    marginHorizontal: 5, 
    width: 220, 
    borderWidth: 1, 
    borderColor: '#F1F3F4',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 }
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  company: { fontSize: 14, fontWeight: '800', color: BRAND_DARK },
  role: { fontSize: 12, color: GOOGLE_BLUE, fontWeight: '600', marginTop: 1 },
  details: { marginBottom: 10 },
  detailText: { fontSize: 11, color: '#5F6368', marginBottom: 1 },
  btn: { backgroundColor: GOOGLE_BLUE, flexDirection: 'row', height: 34, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 12, fontWeight: '700' }
});
