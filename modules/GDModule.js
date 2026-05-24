import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, StatusBar, LayoutAnimation, Platform, KeyboardAvoidingView
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#0F4C81',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#F8FAFC',
  text: '#1E293B',
  subtext: '#64748B',
  border: '#E2E8F0',
  error: '#EF4444'
};

const TABS = ['Guidelines', 'Topics', 'Simulator'];

export default function GDModule({ navigation }) {
  const [activeTab, setActiveTab] = useState('Guidelines');
  const [topic, setTopic] = useState('Select a topic to begin');
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [hepNotes, setHepNotes] = useState({ human: '', economic: '', political: '' });
  const [activeAccordion, setActiveAccordion] = useState(null);

  /* ---------------- TIMER ENGINE ---------------- */
  useEffect(() => {
    let timer = null;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const selectTopic = (selectedTopic) => {
    setTopic(selectedTopic);
    setActiveTab('Simulator');
    setSeconds(0);
    setIsRunning(false);
  };

  const toggleAccordion = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* MODULE HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Discussion Desk</Text>
      </View>

      {/* INTERNAL CONTROLLER SEGMENT TABS */}
      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
          
          {/* TAB CONTENT: GUIDELINES FRAMEWORKS */}
          {activeTab === 'Guidelines' && (
            <View>
              <Text style={styles.sectionTitle}>Framework Strategies</Text>
              {[
                { title: 'HEP Framework (Structured Thinking)', content: 'Analyze any GD topic across three critical pillars:\n\n• Human/Social: Impact on local people, community behavior, lifestyle adjustments, and cultural changes.\n\n• Economic: Resource allocation constraints, market stability metrics, career shifts, and commercial updates.\n\n• Political/Legal: Operational rules, system monitoring compliance, state infrastructure, and policy definitions.' },
                { title: 'Golden Entry Techniques', content: '• Complete validation alignment: "I agree with your point, and to augment that..."\n• Constructive counter strategy: "That is a valid baseline perspective, however looking closely at the alternate metrics..."\n• Analytical summary bridge: "Given the diverse points brought forward regarding human and economic updates, we can gather that..."' }
              ].map((item, index) => (
                <View key={index} style={styles.accordionCard}>
                  <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleAccordion(index)}>
                    <Text style={styles.accTitle}>{item.title}</Text>
                    <Ionicons name={activeAccordion === index ? "chevron-up" : "chevron-down"} size={16} color={COLORS.subtext} />
                  </TouchableOpacity>
                  {activeAccordion === index && (
                    <Text style={styles.accContent}>{item.content}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* TAB CONTENT: TOPICS BANK */}
          {activeTab === 'Topics' && (
            <View>
              <Text style={styles.sectionTitle}>Select Practice Topic</Text>
              {[
                'Artificial Intelligence: Job Killer or Productivity Booster?',
                'Is Remote Work Sustainable for Long-Term Corporate Growth?',
                'Cryptocurrency and Digital Assets: Future of Finance or Safe Bubble?',
                'Electric Vehicles vs Hydrogen Fuel Cells: The Real Future of Green Mobility',
                'Social Media Networks: Enhancing Connection or Amplifying Social Isolation?'
              ].map((item, index) => (
                <TouchableOpacity key={index} style={styles.topicCardItem} onPress={() => selectTopic(item)}>
                  <Text style={styles.topicCardText}>{item}</Text>
                  <View style={styles.topicCardFooter}>
                    <Text style={styles.simulateLink}>Simulate Topic</Text>
                    <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* TAB CONTENT: SIMULATOR CANVAS */}
          {activeTab === 'Simulator' && (
            <View>
              <View style={styles.timerCard}>
                <Text style={styles.label}>ELAPSED PRACTICE TIMELINE</Text>
                <Text style={styles.timer}>{formatTime(seconds)}</Text>
                <TouchableOpacity 
                  style={[styles.playBtn, { backgroundColor: isRunning ? COLORS.error : COLORS.primary }]}
                  onPress={() => setIsRunning(!isRunning)}
                >
                  <Ionicons name={isRunning ? "pause" : "play"} size={16} color="#fff" />
                  <Text style={styles.playText}>{isRunning ? 'Pause Engine' : 'Begin Simulation'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.accordionCard}>
                <Text style={styles.label}>ACTIVE PRACTICE TOPIC TARGET</Text>
                <Text style={styles.topicText}>{topic}</Text>
              </View>

              {/* HEP MATRICES ARCHITECTURE FIELD BOXES */}
              <Text style={styles.sectionTitle}>Live HEP Ledger Scratchpad</Text>
              
              <View style={styles.accordionCard}>
                <Text style={[styles.label, { color: COLORS.secondary }]}>HUMAN / SOCIAL DIMENSIONS</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Note down human/social impacts, public sentiment, or structural mindset elements..."
                  multiline
                  value={hepNotes.human}
                  onChangeText={v => setHepNotes(prev => ({ ...prev, human: v }))}
                />
              </View>

              <View style={styles.accordionCard}>
                <Text style={[styles.label, { color: COLORS.accent }]}>ECONOMIC FACTORS</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Note down capital implications, resource efficiency, employment impact..."
                  multiline
                  value={hepNotes.economic}
                  onChangeText={v => setHepNotes(prev => ({ ...prev, economic: v }))}
                />
              </View>

              <View style={styles.accordionCard}>
                <Text style={[styles.label, { color: COLORS.primary }]}>POLITICAL / REGULATORY CHECKS</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Note down framework controls, legal boundaries, compliance issues..."
                  multiline
                  value={hepNotes.political}
                  onChangeText={v => setHepNotes(prev => ({ ...prev, political: v }))}
                />
              </View>

              <TouchableOpacity 
                style={styles.reset}
                onPress={() => {
                  setSeconds(0);
                  setIsRunning(false);
                  setHepNotes({ human: '', economic: '', political: '' });
                }}
              >
                <Text style={styles.resetText}>Reset Simulator</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES ARCHITECTURE
========================================================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.subtext, fontWeight: '700' },
  activeTabText: { color: COLORS.primary },
  scrollBody: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: COLORS.subtext, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, marginTop: 4 },
  
  accordionCard: { backgroundColor: '#fff', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12 },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accTitle: { fontWeight: '800', color: COLORS.primary },
  accContent: { marginTop: 10, color: COLORS.subtext, lineHeight: 20 },
  timerCard: { backgroundColor: '#fff', padding: 24, borderRadius: 20, alignItems: 'center', marginBottom: 16 },
  timer: { fontSize: 48, fontWeight: '900', color: COLORS.primary },
  phase: { fontWeight: '800', marginTop: 6 },
  phaseHint: { color: COLORS.subtext, marginVertical: 6 },
  playBtn: { flexDirection: 'row', padding: 12, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  playText: { color: '#fff', fontWeight: '800', marginLeft: 8 },
  label: { fontSize: 12, fontWeight: '800', color: COLORS.subtext },
  topicText: { fontWeight: '800', marginTop: 6, fontSize: 15 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, marginTop: 10, textAlignVertical: 'top', minHeight: 60 },
  reset: { alignItems: 'center', marginTop: 10, paddingBottom: 20 },
  resetText: { color: COLORS.subtext, fontWeight: '700' },
  
  // Topic Bank Items
  topicCardItem: { backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  topicCardText: { fontSize: 14, fontWeight: '700', color: COLORS.text, lineHeight: 20 },
  topicCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10 },
  simulateLink: { fontSize: 12, fontWeight: '800', color: COLORS.primary, marginRight: 4 }
});
