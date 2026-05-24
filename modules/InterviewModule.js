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
  {\r
    id: 'ppf',\r
    title: 'P-P-F Introduction Strategy',\r
    insight: 'Best for: \"Tell me about yourself\" questions.',\r
    steps: [\r
      { label: 'PRESENT', desc: 'State current status, vital role, and recent major achievement.' },\r
      { label: 'PAST', desc: 'Reference historical background, key projects built, and verified skills.' },\r
      { label: 'FUTURE', desc: 'Align immediate goals directly to the company trajectory.' }\r
    ]\r
  },\r
  {\r
    id: 'star',\r
    title: 'S-T-A-R Competency Framework',\r
    insight: 'Best for: Behavior or situational queries.',\r
    steps: [\r
      { label: 'SITUATION', desc: 'Set context clearly with baseline context constraints.' },\r
      { label: 'TASK', desc: 'Define your direct responsibility or target metrics required.' },\r
      { label: 'ACTION', desc: 'Detail exactly what you did, the tools used, and technical steps.' },\r
      { label: 'RESULT', desc: 'Quantify metrics achieved (e.g., speed increased by 20%).' }\r
    ]\r
  }\r
];

const DRILLS = [\r
  { id: 'q1', prompt: 'Tell me about yourself.', strategy: 'Use the P-P-F Strategy.', timer: 90 },\r
  { id: 'q2', prompt: 'Describe a difficult technical problem you solved.', strategy: 'Use the S-T-A-R Method.', timer: 120 },\r
  { id: 'q3', prompt: 'Why should we hire you for this role?', strategy: 'Highlight 3 unique skills matching the job.', timer: 60 },\r
  { id: 'q4', prompt: 'Where do you see yourself in 5 years?', strategy: 'Show growth, learning intent, and loyalty.', timer: 60 }\r
];

/* ---------------- COMPONENT ---------------- */
export default function InterviewModule({ navigation }) {\r
  const [activeTab, setActiveTab] = useState('Frameworks');\r
  const [openFramework, setOpenFramework] = useState(null);\r
  const [activeDrill, setActiveDrill] = useState(null);\r
  const [timer, setTimer] = useState(0);\r
  const [timerActive, setTimerActive] = useState(false);\r
\r
  /* ---------------- TIMER ENGINE ---------------- */\r
  useEffect(() => {\r
    let interval = null;\r
    if (timerActive && timer > 0) {\r
      interval = setInterval(() => {\r
        setTimer((t) => t - 1);\r
      }, 1000);\r
    } else if (timer === 0 && timerActive) {\r
      setTimerActive(false);\r
      Alert.alert('Time Up!', 'Excellent attempt. Try evaluating your clarity and pace.');\r
    }\r
    return () => clearInterval(interval);\r
  }, [timerActive, timer]);\r
\r
  const toggleFramework = (id) => {\r
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);\r
    setOpenFramework(openFramework === id ? null : id);\r
  };\r
\r
  const startDrill = (drill) => {\r
    setActiveDrill(drill);\r
    setTimer(drill.timer);\r
    setTimerActive(false);\r
  };\r
\r
  const handleCopyText = async (text) => {\r
    await Clipboard.setStringAsync(text);\r
    Alert.alert('Copied', 'Strategy details copied to clipboard.');\r
  };\r
\r
  return (\r
    <SafeAreaView style={styles.safe}>\r
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />\r
\r
      {/* MODULE NAVIGATION BAR */}\r
      <View style={styles.navBar}>\r
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>\r
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />\r
        </TouchableOpacity>\r
        <Text style={styles.navTitle}>Speaking Frameworks</Text>\r
      </View>\r
\r
      {/* INTERNAL SEGMENT TABS */}\r
      <View style={styles.tabContainer}>\r
        {['Frameworks', 'Practice Drills'].map((tab) => (\r
          <TouchableOpacity\r
            key={tab}\r
            style={[styles.tab, activeTab === tab && styles.activeTab]}\r
            onPress={() => setActiveTab(tab)}\r
          >\r
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>\r
          </TouchableOpacity>\r
        ))}\r
      </View>\r
\r
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>\r
        {activeTab === 'Frameworks' ? (\r
          <View>\r
            <Text style={styles.sectionLabel}>Structural Methods</Text>\r
            {BASICS.map((item) => {\r
              const isOpen = openFramework === item.id;\r
              return (\r
                <View key={item.id} style={styles.accordionCard}>\r
                  <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleFramework(item.id)}>\r
                    <View style={styles.headerTitleRow}>\r
                      <Ionicons name="bulb-outline" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />\r
                      <Text style={styles.cardMainTitle}>{item.title}</Text>\r
                    </View>\r
                    <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.sub} />\r
                  </TouchableOpacity>\r
\r
                  {isOpen && (\r
                    <View style={styles.accordionContent}>\r
                      <Text style={styles.insightText}>{item.insight}</Text>\r
                      {item.steps.map((step, sIdx) => (\r
                        <View key={sIdx} style={styles.stepBlock}>\r
                          <View style={styles.stepBadge}>\r
                            <Text style={styles.stepBadgeText}>{step.label}</Text>\r
                          </View>\r
                          <Text style={styles.stepDescText}>{step.desc}</Text>\r
                        </View>\r
                      ))}\r
                      <TouchableOpacity style={styles.copyBtn} onPress={() => handleCopyText(`${item.title}\n${item.insight}`)}>\r
                        <Ionicons name="copy-outline" size={14} color={COLORS.accent} />\r
                        <Text style={styles.copyBtnText}>Copy Outline</Text>\r
                      </TouchableOpacity>\r
                    </View>\r
                  )}\r
                </View>\r
              );\r
            })}\r
          </View>\r
        ) : (\r
          /* DRILLS SYSTEM INTERFACE */\r
          <View>\r
            <Text style={styles.sectionLabel}>Active Drills</Text>\r
            <View style={styles.drillLayout}>\r
              {DRILLS.map((drill) => (\r
                <TouchableOpacity\r
                  key={drill.id}\r
                  style={[styles.drillCard, activeDrill?.id === drill.id && styles.selectedDrillCard]}\r
                  onPress={() => startDrill(drill)}\r
                >\r
                  <Text style={styles.drillPromptText}>{drill.prompt}</Text>\r
                  <View style={styles.drillMeta}>\r
                    <Ionicons name="time-outline" size={12} color={COLORS.sub} />\r
                    <Text style={styles.drillMetaText}> {drill.timer}s</Text>\r
                  </View>\r
                </TouchableOpacity>\r
              ))}\r
            </View>\r
\r
            {activeDrill && (\r
              <View style={styles.activeDrillControlCard}>\r
                <Text style={styles.drillHeaderLabel}>CURRENT SELECTED TARGET</Text>\r
                <Text style={styles.mainPromptText}>\"{activeDrill.prompt}\"</Text>\r
                <View style={styles.strategyTipBox}>\r
                  <Text style={styles.strategyTipText}>{activeDrill.strategy}</Text>\r
                </View>\r
\r
                {/* TIMER ELEMENT MODULE */}\r
                <View style={styles.timerDisplayContainer}>\r
                  <Text style={styles.largeTimerText}>{timer}s</Text>\r
                  <TouchableOpacity\r
                    style={[styles.actionBtn, { backgroundColor: timerActive ? COLORS.warn : COLORS.primary }]}\r
                    onPress={() => setTimerActive(!timerActive)}\r
                  >\r
                    <Ionicons name={timerActive ? 'pause' : 'play'} size={18} color="#FFF" style={{ marginRight: 6 }} />\r
                    <Text style={styles.actionBtnText}>{timerActive ? 'Pause Clock' : 'Start Mock'}</Text>\r
                  </TouchableOpacity>\r
                </View>\r
              </View>\r
            )}\r
          </View>\r
        )}\r
      </ScrollView>\r
    </SafeAreaView>\r
  );\r
}\r
\r
/* ---------------- STYLES SHEET ---------------- */\r
const styles = StyleSheet.create({\r
  safe: { flex: 1, backgroundColor: COLORS.bg },\r
  navBar: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: COLORS.border },\r
  backBtn: { marginRight: 12 },\r
  navTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },\r
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: COLORS.border },\r
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },\r
  activeTab: { borderBottomColor: COLORS.primary },\r
  tabText: { fontSize: 13, color: COLORS.sub, fontWeight: '700' },\r
  activeTabText: { color: COLORS.primary },\r
  scrollBody: { padding: 16, paddingBottom: 60 },\r
  sectionLabel: { fontSize: 11, fontWeight: '800', color: COLORS.sub, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },\r
  \r
  // Accordion Architecture\r
  accordionCard: { backgroundColor: COLORS.card, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },\r
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFF' },\r
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },\r
  cardMainTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },\r
  accordionContent: { padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#FCFDFE' },\r
  insightText: { fontSize: 12, color: COLORS.accent, fontWeight: '600', marginBottom: 12 },\r
  stepBlock: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },\r
  stepBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 10, minWidth: 85, alignItems: 'center' },\r
  stepBadgeText: { fontSize: 10, fontWeight: '800', color: COLORS.primary },\r
  stepDescText: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 18 },\r
  copyBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },\r
  copyBtnText: { fontSize: 12, color: COLORS.accent, fontWeight: '700', marginLeft: 4 },\r
\r
  // Drills Grid Elements\r
  drillLayout: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },\r
  drillCard: { backgroundColor: COLORS.card, width: '48%', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },\r
  selectedDrillCard: { borderColor: COLORS.primary, backgroundColor: '#EFF6FF' },\r
  drillPromptText: { fontSize: 13, fontWeight: '700', color: COLORS.text, height: 36 },\r
  drillMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },\r
  drillMetaText: { fontSize: 11, color: COLORS.sub, fontWeight: '600' },\r
\r
  // Active Box\r
  activeDrillControlCard: { backgroundColor: COLORS.card, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, marginTop: 10 },\r
  drillHeaderLabel: { fontSize: 10, fontWeight: '800', color: COLORS.sub, letterSpacing: 0.5 },\r
  mainPromptText: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginVertical: 6 },\r
  strategyTipBox: { backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },\r
  strategyTipText: { fontSize: 11, color: COLORS.success, fontWeight: '700' },\r
  timerDisplayContainer: { alignItems: 'center', marginTop: 20 },\r
  largeTimerText: { fontSize: 40, fontWeight: '900', color: COLORS.primary, marginBottom: 10 },\r
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },\r
  actionBtnText: { color: '#FFF', fontWeight: '800', fontSize: 13 }\r
});
