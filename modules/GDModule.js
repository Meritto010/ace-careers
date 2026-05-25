import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, StatusBar, LayoutAnimation, Platform, KeyboardAvoidingView
} from 'react-native';
// Swapped to standard, context-aware layout boundary
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

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    let timer = null;
    if (isRunning) {
      timer = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = s => `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`;

  const getPhase = () => {
    if (seconds < 90) return 'Opening';
    if (seconds < 480) return 'Discussion';
    return 'Summary';
  };

  const getPhasePrompt = () => {
    if (seconds === 0) return 'Prepare your opening';
    if (seconds < 90) return 'Define scope, stay neutral';
    if (seconds < 480) return 'Expand using H.E.P logic';
    return 'Synthesize & conclude';
  };

  const toggleAccordion = key => {
    LayoutAnimation.easeInEaseOut();
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  /* ---------------- GUIDELINES ---------------- */
  const GuidelineBlock = ({ id, title, content }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => toggleAccordion(id)} style={styles.accHeader}>
        <Text style={styles.accTitle}>{title}</Text>
        <Ionicons name={activeAccordion === id ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.primary} />
      </TouchableOpacity>
      {activeAccordion === id && <Text style={styles.accContent}>{content}</Text>}
    </View>
  );

  const renderGuidelines = () => (
    <View>
      <GuidelineBlock id="eval" title="How GDs Are Evaluated" content="Evaluators look for clarity, logical thinking, ability to listen, and contribution to group quality. Loudness and dominance reduce scores." />
      <GuidelineBlock id="entry" title="Entering a GD (First 60 Seconds)" content="Define the scope. Avoid extremes. Set context, not conclusions. Early clarity signals maturity." />
      <GuidelineBlock id="peel" title="Structuring Points (PEEL)" content="Point → Explain → Evidence → Link. PEEL structures sentences, not ideas." />
      <GuidelineBlock id="hep" title="Expanding Ideas (H.E.P)" content="Human: ethics & society. Economic: cost & feasibility. Political: policy & law. Use selectively." />
      <GuidelineBlock id="group" title="Managing Group Dynamics" content="Build on others’ ideas. Invite silent members. Intervene only when discussion derails." />
      <GuidelineBlock id="close" title="Closing & Synthesizing" content="Summarize viewpoints neutrally. Offer a balanced way forward. Avoid repetition." />
      <GuidelineBlock id="mistakes" title="Common Mistakes" content="Interrupting, repeating points, emotional tone, jargon without clarity, dominating airtime." />
    </View>
  );

  /* ---------------- TOPICS ---------------- */
  const renderTopics = () => (
    <View>
      {[
        { c: 'Opinion', t: ['Work from Home vs Office', 'Online Education Effectiveness'] },
        { c: 'Multi-Stakeholder', t: ['AI and Employment', 'Electric Vehicles'] },
        { c: 'Policy', t: ['Reservation Reforms', 'Data Privacy vs Security'] },
        { c: 'Ethical', t: ['Profit vs Principles', 'Whistleblowing'] },
        { c: 'Abstract', t: ['Zero is more than a number', 'Silence is powerful'] }
      ].map(sec => (
        <View key={sec.c}>
          <TouchableOpacity 
            style={styles.topicAccordionHeader} 
            onPress={() => toggleAccordion(sec.c)}
          >
            <Text style={styles.cat}>{sec.c}</Text>
            <Ionicons name={activeAccordion === sec.c ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.primary} />
          </TouchableOpacity>
          
          {activeAccordion === sec.c && sec.t.map(item => (
            <TouchableOpacity
              key={item}
              style={styles.topicItem}
              onPress={() => {
                setTopic(item);
                setActiveTab('Simulator');
                setActiveAccordion(null);
              }}
            >
              <Text style={styles.topicItemText}>{item}</Text>
              <Ionicons name="arrow-forward-circle" size={16} color={COLORS.secondary} />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );

  /* ---------------- SIMULATOR ---------------- */
  const renderSimulator = () => (
    <View>
      <View style={styles.timerCard}>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
        <Text style={styles.phase}>{getPhase()} Phase</Text>
        <Text style={styles.phaseHint}>{getPhasePrompt()}</Text>
        <TouchableOpacity
          style={[styles.playBtn, { backgroundColor: isRunning ? COLORS.error : COLORS.secondary }]}
          onPress={() => setIsRunning(!isRunning)}
        >
          <Ionicons name={isRunning ? 'pause' : 'play'} size={18} color="#fff" />
          <Text style={styles.playText}>{isRunning ? 'PAUSE' : 'START'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Current Topic</Text>
        <Text style={styles.topicText}>{topic}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>H.E.P Notes</Text>
        {['human', 'economic', 'political'].map(k => (
          <TextInput
            key={k}
            style={styles.input}
            placeholder={k.toUpperCase()}
            multiline
            scrollEnabled={false}
            value={hepNotes[k]}
            onChangeText={t => setHepNotes({ ...hepNotes, [k]: t })}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.reset}
        onPress={() => {
          setSeconds(0);
          setIsRunning(false);
          setHepNotes({ human: '', economic: '', political: '' });
        }}
      >
        <Text style={styles.resetText}>Reset Drill</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} />
          </TouchableOpacity>
          <Text style={styles.headerText}>GD Masterclass</Text>
        </View>

        <View style={styles.tabs}>
          {TABS.map(t => (
            <TouchableOpacity key={t} style={styles.tab} onPress={() => setActiveTab(t)}>
              <Text style={[styles.tabText, activeTab === t && styles.activeTab]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView 
          contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {activeTab === 'Guidelines' && renderGuidelines()}
          {activeTab === 'Topics' && renderTopics()}
          {activeTab === 'Simulator' && renderSimulator()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  headerText: { fontSize: 18, fontWeight: '700', marginLeft: 12 },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, padding: 14, alignItems: 'center' },
  tabText: { fontWeight: '700', color: COLORS.subtext },
  activeTab: { color: COLORS.primary, borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  container: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 16, elevation: 1 },
  accHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
  topicAccordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  cat: { fontWeight: '900', color: COLORS.primary, fontSize: 13, textTransform: 'uppercase' },
  topicItem: { padding: 14, backgroundColor: '#fff', borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  topicItemText: { flex: 1, color: COLORS.text, fontWeight: '600' }
});