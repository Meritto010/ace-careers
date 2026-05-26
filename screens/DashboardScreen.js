import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LatestOpportunities from '../components/LatestOpportunities'; // Adjust path if needed

const GOOGLE_BLUE = '#1A73E8';
const BRAND_DARK = '#103D6A';

export default function DashboardScreen({ navigation, isActivated, onOpenPaywall }) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =========================================================
           1. TOP HEADER (Keeps original clean spacing perfectly untouched)
        ========================================================= */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.welcomeText}>WELCOME TO</Text>
            <Text style={styles.brandTitle}>ACE CAREERS</Text>
          </View>

          <View style={styles.headerRightRow}>
            <View style={styles.proBadge}>
              <View style={styles.proDot} />
              <Text style={styles.proText}>PRO</Text>
            </View>

            <TouchableOpacity 
              style={styles.settingsBtn}
              onPress={() => navigation.navigate('Settings')}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={22} color={BRAND_DARK} />
            </TouchableOpacity>
          </View>
        </View>

        {/* =========================================================
           2. CAREER MASTERY TOOLS SECTION
        ========================================================= */}
        <View style={styles.sectionWrapper}>
          <View style={styles.headingRow}>
            <Text style={styles.sectionHeading}>CAREER MASTERY TOOLS</Text>
            <View style={styles.miniBadge}>
              <Text style={styles.miniBadgeText}>PRO</Text>
            </View>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toolsScrollContent}
          >
            {/* RESUME MODULE CARD */}
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => navigation.navigate('Resume')}
              activeOpacity={0.8}
            >
              <Ionicons name="document-text" size={26} color={GOOGLE_BLUE} />
              <Text style={styles.toolTitle}>Resume</Text>
              <Text style={styles.toolSub}>Engineering</Text>
            </TouchableOpacity>

            {/* GD MODULE CARD */}
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => navigation.navigate('GD')}
              activeOpacity={0.8}
            >
              <Ionicons name="people" size={26} color="#34A853" />
              <Text style={styles.toolTitle}>GD</Text>
              <Text style={styles.toolSub}>Frameworks</Text>
            </TouchableOpacity>

            {/* INTERVIEW MODULE CARD */}
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => navigation.navigate('Interview')}
              activeOpacity={0.8}
            >
              <Ionicons name="mic" size={26} color="#EA4335" />
              <Text style={styles.toolTitle}>Interview</Text>
              <Text style={styles.toolSub}>Mastery</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* =========================================================
           3. CORPORATE PLACEMENTS SECTION (Campus Connect Text Dropped!)
        ========================================================= */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionHeading}>CORPORATE PLACEMENTS</Text>
          
          <LatestOpportunities 
            isActivated={isActivated}
            onOpenPaywall={onOpenPaywall}
            navigation={navigation}
          />
        </View>

        {/* =========================================================
           4. LATEST HUB ACTIVITY (Lifted up and completely visible)
        ========================================================= */}
        <View style={styles.activityWrapper}>
          <View style={styles.activityCard}>
            <View style={styles.activityHeaderRow}>
              <Ionicons name="trending-up-outline" size={16} color={BRAND_DARK} />
              <Text style={styles.activityMainHeading}>LATEST HUB ACTIVITY</Text>
            </View>
            
            <View style={styles.divider} />

            {/* Row 1 */}
            <View style={styles.activityRow}>
              <View style={[styles.iconBox, { backgroundColor: '#E8F0FE' }]}>
                <Ionicons name="briefcase" size={16} color={GOOGLE_BLUE} />
              </View>
              <View style={styles.activityTextCol}>
                <Text style={styles.activityTitle}>4 Active Vacancies</Text>
                <Text style={styles.activitySub}>Total openings aggregated inside live dataset</Text>
              </View>
            </View>

            {/* Row 2 */}
            <View style={styles.activityRow}>
              <View style={[styles.iconBox, { backgroundColor: '#E6F4EA' }]}>
                <Ionicons name="checkmark-circle" size={16} color="#1E8E3E" />
              </View>
              <View style={styles.activityTextCol}>
                <Text style={styles.activityTitle}>3 Verified Campus Drives</Text>
                <Text style={styles.activitySub}>Active corporate drives verified by core team</Text>
              </View>
            </View>

            {/* Row 3 */}
            <View style={styles.activityRow}>
              <View style={[styles.iconBox, { backgroundColor: '#FCE8E6' }]}>
                <Ionicons name="shield-checkmark" size={16} color="#D93025" />
              </View>
              <View style={styles.activityTextCol}>
                <Text style={styles.activityTitle}>100% Secure Access</Text>
                <Text style={styles.activitySub}>Live automated connection with production repo</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Clean Ultra-light gray base
  },
  scrollContent: {
    paddingBottom: 30, // Ensures safe clearance space below the bottom elements
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 12,
  },
  welcomeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7F8C8D',
    letterSpacing: 0.5,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: BRAND_DARK,
    letterSpacing: -0.2,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  proDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#25D366',
    marginRight: 5,
  },
  proText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#5F6368',
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EAED',
    elevation: 1,
  },
  sectionWrapper: {
    marginTop: 12, // Lowered layout footprint spacing
    marginBottom: 2,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5F6368',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  miniBadge: {
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  miniBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: GOOGLE_BLUE,
  },
  toolsScrollContent: {
    paddingHorizontal: 11,
    paddingBottom: 4,
  },
  toolCard: {
    backgroundColor: '#FFF',
    width: 105,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#F1F3F4',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  toolTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: BRAND_DARK,
    marginTop: 6,
  },
  toolSub: {
    fontSize: 10,
    color: GOOGLE_BLUE,
    fontWeight: '600',
    marginTop: 1,
  },
  activityWrapper: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  activityCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F3F4',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  activityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityMainHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: BRAND_DARK,
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F3F4',
    marginBottom: 12,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND_DARK,
  },
  activitySub: {
    fontSize: 10,
    color: '#7F8C8D',
    marginTop: 1,
  },
});
