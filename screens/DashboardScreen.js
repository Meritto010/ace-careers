import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 

import LatestOpportunities from '../components/LatestOpportunities';
import FeaturedJobs from '../components/FeaturedJobs';

const BRAND_DARK = '#103D6A';
const BG_LIGHT = '#F8F9FA';
const GOOGLE_BLUE = '#1A73E8';

export default function Dashboard({ isActivated, navigation, route }) {

  const [resolvedActivationState, setResolvedActivationState] = useState(
    route?.params?.isActivated ?? isActivated ?? false
  );

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
      
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFF" 
      />

      {/* HEADER */}
      <View style={styles.header}>

        <View>
          <Text style={styles.welcomeText}>
            Welcome to
          </Text>

          <Text style={styles.brandText}>
            ACE CAREERS
          </Text>
        </View>

        <View style={styles.headerRightActions}>

          <View style={styles.statusBadge}>
            <View 
              style={[
                styles.statusDot,
                {
                  backgroundColor: resolvedActivationState
                    ? '#1E8E3E'
                    : '#70757A'
                }
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
            <Ionicons
              name="settings-outline"
              size={22}
              color={BRAND_DARK}
            />
          </TouchableOpacity>

        </View>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView
        style={styles.scrollViewFrame}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <LatestOpportunities />

        {/* TOOLS SECTION */}
        <View style={styles.toolsContainer}>

          <View style={styles.sectionHeaderRow}>

            <View style={styles.sectionLeft}>

              <Text style={styles.sectionLabel}>
                CAREER MASTERY TOOLS
              </Text>

              <View style={styles.proTag}>
                <Text style={styles.proTagText}>
                  PRO
                </Text>
              </View>

            </View>

            {!resolvedActivationState && (
              <TouchableOpacity
                style={styles.headerUnlockBtn}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Activation')}
              >
                <Ionicons
                  name="lock-open-outline"
                  size={11}
                  color="#FFF"
                />

                <Text style={styles.headerUnlockBtnText}>
                  {' '}UNLOCK
                </Text>
              </TouchableOpacity>
            )}

          </View>

          {/* TOOLS GRID */}
          <View style={styles.toolsGrid}>

            <TouchableOpacity
              style={styles.toolCard}
              onPress={() => handleToolNavigation('Resume')}
            >
              <Ionicons
                name="document-text"
                size={22}
                color="#1A73E8"
                style={{ marginBottom: 4 }}
              />

              <Text style={styles.toolTitle}>
                Resume
              </Text>

              <Text style={styles.toolSubTitle}>
                Engineering
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolCard}
              onPress={() => handleToolNavigation('GD')}
            >
              <Ionicons
                name="people"
                size={22}
                color="#0F9D58"
                style={{ marginBottom: 4 }}
              />

              <Text style={styles.toolTitle}>
                GD
              </Text>

              <Text style={styles.toolSubTitle}>
                Frameworks
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolCard}
              onPress={() => handleToolNavigation('Interview')}
            >
              <Ionicons
                name="mic"
                size={22}
                color="#EA4335"
                style={{ marginBottom: 4 }}
              />

              <Text style={styles.toolTitle}>
                Interview
              </Text>

              <Text style={styles.toolSubTitle}>
                Mastery
              </Text>
            </TouchableOpacity>

          </View>
        </View>

        <View style={styles.miniDivider} />

        <FeaturedJobs
          isActivated={resolvedActivationState}
          navigation={navigation}
        />

      </ScrollView>

      {/* SUPPORT FLOATING PANEL */}
      <View style={styles.absoluteSupportContainer}>

        <Text style={styles.supportBrand}>
          ACE CAREERS SUPPORT DESK
        </Text>

        <TouchableOpacity
          style={styles.supportButton}
          onPress={() =>
            Linking.openURL('https://wa.me/919074887447')
          }
        >
          <Text style={styles.supportLink}>
            Need Assistance? Chat on WhatsApp
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
    position: 'relative'
  },

  scrollViewFrame: {
    flex: 1
  },

  scrollContent: {
    flexGrow: 1,
    backgroundColor: BG_LIGHT,
    paddingTop: 6,
    paddingBottom: 185
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    paddingVertical: 10
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

  absoluteSupportContainer: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D2E3FC',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 999,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: -2
    }
  },

  supportBrand: {
    fontSize: 11,
    fontWeight: '800',
    color: '#103D6A',
    marginBottom: 4
  },

  supportButton: {
    width: '100%',
    alignItems: 'center'
  },

  supportLink: {
    color: GOOGLE_BLUE,
    fontWeight: '700',
    textDecorationLine: 'underline',
    fontSize: 12
  }

});