import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import LatestOpportunities from '../components/LatestOpportunities'; // Adjust path if needed

export default function DashboardScreen(props) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =========================================================
           1. TOP HEADER (Keeps original top spaces perfectly untouched)
        ========================================================= */}
        <View style={styles.headerContainer}>
          {/* Your profile and welcome views remain here unchanged */}
        </View>

        {/* =========================================================
           2. CAREER MASTERY TOOLS SECTION
        ========================================================= */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionHeading}>CAREER MASTERY TOOLS</Text>
          {/* Your horizontal row components for Resume, GD, Interview modules */}
        </View>

        {/* =========================================================
           3. CORPORATE PLACEMENTS SECTION (Campus Connect Removed!)
        ========================================================= */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionHeading}>CORPORATE PLACEMENTS</Text>
          
          {/* FIXED: "CAMPUS CONNECT" text element dropped completely from here! */}

          <LatestOpportunities 
            isActivated={props.isActivated}
            onOpenPaywall={props.onOpenPaywall}
            navigation={props.navigation}
          />
        </View>

        {/* =========================================================
           4. LATEST HUB ACTIVITY (Will now be 100% fully visible)
        ========================================================= */}
        <View style={styles.activityWrapper}>
          {/* Your 3-row list cards (Active Vacancies, Verified Drives, Secure Access) */}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 24, // Ensures safe clearance room below the last activity card
  },
  headerContainer: {
    // Keep your exact original metrics here
  },
  sectionWrapper: {
    marginTop: 16, // Clean micro spacing layout
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5F6368',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  activityWrapper: {
    marginTop: 12,
    paddingHorizontal: 16,
  }
});
