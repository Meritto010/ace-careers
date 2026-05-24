import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  LayoutAnimation,
  UIManager,
  Platform,
  Alert
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const COLORS = {
  primary: '#0F4C81',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  sub: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  warn: '#EF4444',
  accent: '#3B82F6',
  gold: '#F59E0B'
};

/* ---------------- DATA ---------------- */
const BASICS = [
  {
    id: 'ppf',
    title: 'P-P-F Introduction Strategy',
    insight: 'Best for: "Tell me about yourself" questions.',
    steps: [
      { label: 'PRESENT', desc: 'State current status, vital role, and recent major achievement.' },
      { label: 'PAST', desc: 'Reference historical background, key projects built, and verified skills.' },
      { label: 'FUTURE', desc: 'Align immediate goals directly to the company trajectory.' }
    ]
  },
  {
    id: 'star',
    title: 'S-T-A-R Competency Framework',
    insight: 'Best for: Behavior or situational queries.',
    steps: [
      { label: 'SITUATION', desc: 'Set context clearly with baseline context constraints.' },
      { label: 'TASK', desc: 'Define your direct responsibility or target metrics required.' },
      { label: 'ACTION', desc: 'Detail exactly what you did, the tools used, and technical steps.' },
      { label: 'RESULT', desc: 'Quantify metrics achieved (e.g., speed increased by 20%).' }
    ]
  }
];

const DRILLS = [
  { id: 'q1', prompt: 'Tell me about yourself.', strategy: 'Use the P-P-F Strategy.', timer: 90 },
  { id: 'q2', prompt: 'Describe a difficult technical problem you solved.', strategy: 'Use the S-T-A-R Method.', timer: 120 },
  { id: 'q3', prompt: 'Why should we hire you for this role?', strategy: 'Highlight 3 unique skills matching the job.', timer: 60 },
  { id: 'q4', prompt: 'Where do you see yourself in 5 years?', strategy: 'Show growth, learning intent, and loyalty.', timer: 60 }
];

/* ---------------- COMPONENT ---------------- */
export default function InterviewModule({ navigation }) {
  const [activeTab, setActiveTab] = useState('Frameworks');
  const [openFramework, setOpenFramework] = useState(null);
  const [activeDrill, setActiveDrill] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  /* ---------------- TIMER ENGINE ---------------- */
  useEffect(() => {
    let interval = null;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0 && timerActive) {
      setTimerActive(false);
      Alert.alert('Time Up!', 'Excellent attempt. Try evaluating your clarity and pace.');
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const toggleFramework = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenFramework(openFramework === id ? null : id);
  };

  const startDrill = (drill) => {
    setActiveDrill(drill);
    setTimer(drill.timer);
    setTimerActive(false);
  };

  const handleCopyText = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Strategy details copied to clipboard.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />

      {/* MODULE NAVIGATION BAR */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Speaking Frameworks</Text>
      </View>

      {/* INTERNAL SEGMENT TABS */}
      <View style={styles.tabContainer}>
        {['Frameworks', 'Practice Drills'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {activeTab === 'Frameworks' ? (
          <View>
            <Text style={styles.sectionLabel}>Structural Methods</Text>
            {BASICS.map((item) => {
              const isOpen = openFramework === item.id;
              return (
                <View key={item.id} style={styles.accordionCard}>
                  <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleFramework(item.id)}>
                    <View style={styles.headerTitleRow}>
                      <Ionicons name="bulb-outline" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
                      <Text style={styles.cardMainTitle}>{item.title}</Text>
                    </View>
                    <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.sub} />
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={styles.accordionContent}>
                      <Text style={styles.insightText}>{item.insight}</Text>
                      {item.steps.map((step, sIdx) => (
                        <View key={sIdx} style={styles.stepBlock}>
                          <View style={styles.stepBadge}>
                            <Text style={styles.stepBadgeText}>{step.label}</Text>
                          </View>
                          <Text style={styles.stepDescText}>{step.desc}</Text>
                        </View>
                      ))}
                      <TouchableOpacity style={styles.copyBtn} onPress={() => handleCopyText(`${item.title}\n${item.insight}`)}>
                        <Ionicons name="copy-outline" size={14} color={COLORS.accent} />
                        <Text style={styles.copyBtnText}>Copy Outline</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          /* DRILLS SYSTEM INTERFACE */
          <View>
            <Text style={styles.sectionLabel}>Active Drills</Text>
            <View style={styles.drillLayout}>
              {DRILLS.map((drill) => (
                <TouchableOpacity
                  key={drill.id}
                  style={[styles.drillCard, activeDrill?.id === drill.id && styles.selectedDrillCard]}
                  onPress={() => startDrill(drill)}
                >
                  <Text style={styles.drillPromptText}>{drill.prompt}</Text>
                  <View style={styles.drillMeta}>
                    <Ionicons name="time-outline" size={12} color={COLORS.sub} />
                    <Text style={styles.drillMetaText}> {drill.timer}s</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {activeDrill && (
              <View style={styles.activeDrillControlCard}>
                <Text style={styles.drillHeaderLabel}>CURRENT SELECTED TARGET</Text>
                <Text style={styles.mainPromptText}>"{activeDrill.prompt}"</Text>
                <View style={styles.strategyTipBox}>
                  <Text style={styles.strategyTipText}>{activeDrill.strategy}</Text>
                </View>

                {/* TIMER ELEMENT MODULE */}
                <View style={styles.timerDisplayContainer}>
                  <Text style={styles.largeTimerText}>{timer}s</Text>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: timerActive ? COLORS.warn : COLORS.primary }]}
                    onPress={() => setTimerActive(!timerActive)}
                  >
                    <Ionicons name={timerActive ? 'pause' : 'play'} size={18} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.actionBtnText}>{timerActive ? 'Pause Clock' : 'Start Mock'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES SHEET ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  navBar: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { marginRight: 12 },
  navTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.sub, fontWeight: '700' },
  activeTabText: { color: COLORS.primary },
  scrollBody: { padding: 16, paddingBottom: 60 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: COLORS.sub, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  
  // Accordion Architecture
  accordionCard: { backgroundColor: COLORS.card, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFF' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  cardMainTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  accordionContent: { padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#FCFDFE' },
  insightText: { fontSize: 12, color: COLORS.accent, fontWeight: '600', marginBottom: 12 },
  stepBlock: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  stepBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 10, minWidth: 85, alignItems: 'center' },
  stepBadgeText: { fontSize: 10, fontWeight: '800', color: COLORS.primary },
  stepDescText: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 18 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  copyBtnText: { fontSize: 12, color: COLORS.accent, fontWeight: '700', marginLeft: 4 },

  // Drills Grid Elements
  drillLayout: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  drillCard: { backgroundColor: COLORS.card, width: '48%', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  selectedDrillCard: { borderColor: COLORS.primary, backgroundColor: '#EFF6FF' },
  drillPromptText: { fontSize: 13, fontWeight: '700', color: COLORS.text, height: 36 },
  drillMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  drillMetaText: { fontSize: 11, color: COLORS.sub, fontWeight: '600' },

  // Active Box
  activeDrillControlCard: { backgroundColor: COLORS.card, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, marginTop: 10 },
  drillHeaderLabel: { fontSize: 10, fontWeight: '800', color: COLORS.sub, letterSpacing: 0.5 },
  mainPromptText: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginVertical: 6 },
  strategyTipBox: { backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  strategyTipText: { fontSize: 11, color: COLORS.success, fontWeight: '700' },
  timerDisplayContainer: { alignItems: 'center', marginTop: 20 },
  largeTimerText: { fontSize: 40, fontWeight: '900', color: COLORS.primary, marginBottom: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  actionBtnText: { color: '#FFF', fontWeight: '800', fontSize: 13 }
});