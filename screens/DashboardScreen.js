import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 

import LatestOpportunities from '../components/LatestOpportunities';
import SupportHubModal from '../components/SupportHubModal';

const BRAND_DARK = '#103D6A';
const BG_LIGHT = '#F8F9FA';
const GOOGLE_BLUE = '#1A73E8';

export default function Dashboard({ isActivated, navigation, route }) {
  const [resolvedActivationState, setResolvedActivationState] = useState(
    route?.params?.isActivated ?? isActivated ?? false
  );
  
  // Single, reliable source of truth for the entire dashboard
  const [jobsFeed, setJobsFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supportModalVisible, setSupportModalVisible] = useState(false);

  // Synchronize Activation Pro State caches
  useEffect(() => {
    if (route?.params?.isActivated !== undefined) {
      setResolvedActivationState(route.params.isActivated);
    } else {
      const runStorageCheck = async () => {
        const storedStatus = await AsyncStorage.getItem('@is_activated');
        setResolvedActivationState(storedStatus === 'true');
      };
      runStorageCheck();
    }
  }, [route?.params?.isActivated]);

  // Unified single-fetch for complete metrics validity
  useEffect(() => {
    const fetchLiveOpportunities = async () => {
      try {
        const URL = 'https://raw.githubusercontent.com/Meritto010/campus_connect/main/campus_connect.json';
        const response = await fetch(URL);
        const json = await response.json();
        
        // Target structural object array safely
        const dataList = json.vacancies || [];
        setJobsFeed(dataList);
      } catch (error) {
        console.error("Error fetching repository dataset:", error);
        // Fallback production targets for localized testing
        setJobsFeed([
          { company: 'Schneider', role: 'Production Associate', location: 'Chennai', ctc: '2L - 2.5 L', qualification: 'ITI / Diploma', status: 'Active', isPremiumDrive: false },
          { company: 'Schneider', role: 'Production Associate', location: 'Bangalore', ctc: '2L - 2.5 L', qualification: 'ITI / Diploma', status: 'Active', isPremiumDrive: true },
          { company: 'Ace Mastery Corp', role: 'Mobile Developer', location: 'Remote', ctc: '6L - 8L', qualification: 'B.E / B.Tech', status: 'Active', isPremiumDrive: true },
          { company: 'Global Tech', role: 'Graduate Engineer', location: 'Mumbai', ctc: '4L', qualification: 'Diploma', status: 'Closed', isPremiumDrive: false }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveOpportunities();
  }, []);

  // Compute metrics dynamically from the live array
  const totalVacancies = jobsFeed.length;
  const activeVerifiedDrives = jobsFeed.filter(job => job.status === 'Active').length;

  const triggerPaywallNotice = () => {
    Alert.alert(
      "Premium Feature Locked",
      "Unlock Career Masterclass tools, placement packs, and pro job dashboards immediately.",
      [
        { text: "Keep Exploring Free", style: "cancel" },
        {
          text: "Activate License Key",
          onPress: () => navigation.navigate('Activation')
        }
      ]
    );
  };

  const handleToolNavigation = (destinationModule) => {
    if (!resolvedActivationState) {
      triggerPaywallNotice();
      return;
    }
    navigation.navigate(destinationModule);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" translucent={false} />

      {/* FIXED BRANDING HEADER BAR */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.brandText}>ACE CAREERS</Text>
        </View>

        <View style={styles.headerRightActions}>
          <View style={styles.statusBadge}>
            <View 
              style={[
                styles.statusDot,
                { backgroundColor: resolvedActivationState ? '#1E8E3E' : '#70757A' }
              ]}
            />
            <Text style={styles.statusText}>
              {resolvedActivationState ? 'PRO' : 'FREE'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.settingsIconButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={22} color={BRAND_DARK} />
          </TouchableOpacity>
        </View>
      </View>

      {/* CORE TIMELINE CONTENT LAYOUT */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={BRAND_DARK} />
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* GRID MODULE 1: CAREER TOOLS */}
            <View style={styles.toolsContainer}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionLeft}>
                  <Text style={styles.sectionLabel}>CAREER MASTERY TOOLS</Text>
                  <View style={styles.proTag}>
                    <Text style={styles.proTagText}>PRO</Text>
                  </View>
                </View>

                {!resolvedActivationState && (
                  <TouchableOpacity
                    style={styles.headerUnlockBtn}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Activation')}
                  >
                    <Ionicons name="lock-open-outline" size={11} color="#FFF" />
                    <Text style={styles.headerUnlockBtnText}> UNLOCK</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.toolsGrid}>
                <TouchableOpacity style={styles.toolCard} onPress={() => handleToolNavigation('Resume')}>
                  <Ionicons name="document-text" size={22} color="#1A73E8" style={{ marginBottom: 4 }} />
                  <Text style={styles.toolTitle}>Resume</Text>
                  <Text style={styles.toolSubTitle}>Engineering</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.toolCard} onPress={() => handleToolNavigation('GD')}>
                  <Ionicons name="people" size={22} color="#0F9D58" style={{ marginBottom: 4 }} />
                  <Text style={styles.toolTitle}>GD</Text>
                  <Text style={styles.toolSubTitle}>Frameworks</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.toolCard} onPress={() => handleToolNavigation('Interview')}>
                  <Ionicons name="mic" size={22} color="#EA4335" style={{ marginBottom: 4 }} />
                  <Text style={styles.toolTitle}>Interview</Text>
                  <Text style={styles.toolSubTitle}>Mastery</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.miniDivider} />
            
            {/* HEADER SUBSECTION 2: CAMPUS CONNECT SLIDER CONTAINER */}
            <Text style={[styles.sectionLabel, { paddingHorizontal: 20, marginTop: 15, marginBottom: 2 }]}>
              CORPORATE PLACEMENTS
            </Text>

            <LatestOpportunities 
              vacancies={jobsFeed}
              isActivated={resolvedActivationState} 
              onOpenPaywall={triggerPaywallNotice}
              navigation={navigation}
            />

            {/* METRICS SECTION 3: RE-CONFIGURED LIVE DATA PANEL */}
            <View style={styles.statsPanelCard}>
              <View style={styles.statsHeaderRow}>
                <Ionicons name="analytics" size={16} color={BRAND_DARK} />
                <Text style={styles.statsPanelTitle}>LATEST HUB ACTIVITY</Text>
              </View>
              
              <View style={styles.statsRowItem}>
                <View style={styles.statsBulletIcon}>
                  <Ionicons name="briefcase" size={14} color={GOOGLE_BLUE} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statsDataText}>{totalVacancies} Active Vacancies</Text>
                  <Text style={styles.statsDetailLabel}>Total openings aggregated inside live dataset</Text>
                </View>
              </View>

              <View style={styles.statsRowItem}>
                <View style={styles.statsBulletIcon}>
                  <Ionicons name="checkmark-circle" size={14} color="#0F9D58" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statsDataText}>{activeVerifiedDrives} Verified Campus Drives</Text>
                  <Text style={styles.statsDetailLabel}>Active corporate drives verified by core team</Text>
                </View>
              </View>

              <View style={styles.statsRowItem}>
                <View style={styles.statsBulletIcon}>
                  <Ionicons name="shield-checkmark" size={14} color="#EA4335" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statsDataText}>100% Secure Access</Text>
                  <Text style={styles.statsDetailLabel}>Live automated connection with production repo</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* FLOATING ACTION ICON */}
          <TouchableOpacity
            style={styles.floatingSupportIcon}
            activeOpacity={0.85}
            onPress={() => setSupportModalVisible(true)}
          >
            <Ionicons name="chatbubble-ellipses" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* THE INFRASTRUCTURE OVERLAY SHEET MODULE */}
      <SupportHubModal 
        visible={supportModalVisible}
        onClose={() => setSupportModalVisible(false)}
        isPro={resolvedActivationState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 12
  },
  mainContainer: {
    flex: 1,
    position: 'relative'
  },
  scrollContent: {
    backgroundColor: BG_LIGHT,
    paddingBottom: 60 // Reduced from 120 to eliminate the large white scroll space gap below the cards
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG_LIGHT
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4'
  },
  welcomeText: {
    fontSize: 11,
    color: '#5F6368',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
    color: BRAND_DARK,
    letterSpacing: -0.5
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#5F6368'
  },
  settingsIconButton: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8EAED'
  },
  toolsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5F6368',
    letterSpacing: 1,
    marginRight: 6
  },
  proTag: {
    backgroundColor: '#E8F0FE',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4
  },
  proTagText: {
    color: GOOGLE_BLUE,
    fontSize: 9,
    fontWeight: '900'
  },
  headerUnlockBtn: {
    backgroundColor: '#D93025',
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  headerUnlockBtnText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  toolsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  toolCard: {
    width: '31%',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F3F4',
    elevation: 1
  },
  toolTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: BRAND_DARK
  },
  toolSubTitle: {
    fontSize: 9,
    fontWeight: '600',
    color: GOOGLE_BLUE,
    marginTop: 1
  },
  miniDivider: {
    height: 6,
    backgroundColor: '#F1F3F4',
    marginVertical: 4
  },
  statsPanelCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EAED',
    elevation: 1
  },
  statsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
    paddingBottom: 10,
    marginBottom: 14
  },
  statsPanelTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: BRAND_DARK,
    marginLeft: 6,
    letterSpacing: 0.5
  },
  statsRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  statsBulletIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E8EAED'
  },
  statsDataText: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND_DARK
  },
  statsDetailLabel: {
    fontSize: 10,
    color: '#70757A',
    marginTop: 1
  },
  floatingSupportIcon: {
    position: 'absolute',
    bottom: 28, // Kept exactly at your requested 28 position
    right: 24,
    backgroundColor: GOOGLE_BLUE,
    width: 38, // Optimized footprint size for clear layout distribution
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 }
  }
});
