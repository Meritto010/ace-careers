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
// Swapped to standard, context-aware layout boundary
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
      { label: 'PAST', icon: 'time-outline', color: '#3B82F6', text: 'Briefly mention the education or early roles that built your foundation.' },
      { label: 'PRESENT', icon: 'briefcase-outline', color: '#10B981', text: 'Focus on your current role, key responsibilities, and top achievement.' },
      { label: 'FUTURE', icon: 'rocket-outline', color: '#F59E0B', text: 'Explain why this role is the perfect next step for your growth.' }
    ],
    transcript: "I started my career in [Field]... Currently, I lead [Project/Role] where I achieved [Result]... I am looking to bring this expertise to your team to help with [Goal]."
  },
  {
    id: 'star',
    title: 'STAR Response Method',
    insight: 'Best for: Behavioral questions starting with "Tell me about a time..."',
    steps: [
      { label: 'SITUATION', icon: 'map-outline', color: '#8B5CF6', text: 'Set the scene. Give just enough context to understand the challenge.' },
      { label: 'TASK', icon: 'flag-outline', color: '#EC4899', text: 'Describe exactly what your responsibility was in that moment.' },
      { label: 'ACTION', icon: 'hammer-outline', color: '#3B82F6', text: 'Detail the specific steps YOU took. Use "I" statements, not "We".' },
      { label: 'RESULT', icon: 'checkmark-circle-outline', color: '#10B981', text: 'The punchline. Share the numbers, feedback, or positive outcome.' }
    ],
    transcript: "In my last role, we faced [Situation]. My task was to [Task]. I decided to [Action], which resulted in a [Result]% improvement."
  },
  {
    id: 'tips',
    title: 'Interview Dos & Don\'ts',
    isList: true,
    dos: ['Research the company\'s recent news', 'Prepare 3 specific questions for them', 'Sit up straight and lean in slightly', 'Listen fully before answering'],
    donts: ['Speak poorly of past colleagues', 'Lie about a skill gap', 'Give generic "I am a hard worker" answers', 'Forget to follow up via email']
  }
];

const QUESTIONS = [
  {
    type: 'Standard / Icebreakers',
    qs: [
      { q: 'Tell me about yourself.', a: 'Use PPF. Keep it under 90 seconds. Focus on professional "wins".', why: 'Setting the tone.' },
      { q: 'Why do you want to work here?', a: 'Mention a specific company value or a recent project of theirs you admire.', why: 'Testing your research.' },
      { q: 'What is your greatest strength?', a: 'Pick one skill and give a 30-second example of it in action.', why: 'Checking self-awareness.' }
    ]
  },
  {
    type: 'Behavioral & Situational',
    qs: [
      { q: 'Tell me about a time you failed.', a: 'Describe a mistake, how you owned it, and how you ensured it never happened again.', why: 'Testing resilience.' },
      { q: 'How do you handle a heavy workload?', a: 'Discuss your prioritization tools (e.g., Eisenhower Matrix) and setting boundaries.', why: 'Testing time management.' },
      { q: 'Describe a conflict with a peer.', a: 'Focus on a professional disagreement, not a personal one. Show the resolution.', why: 'Testing EQ.' }
    ]
  },
  {
    type: 'Closing & Logistics',
    qs: [
      { q: 'What are your salary expectations?', a: 'Provide a range based on market research. Mention you are open to negotiation.', why: 'Checking alignment.' },
      { q: 'Do you have questions for us?', a: 'Ask: "What does success look like in this role after 6 months?"', why: 'Testing engagement.' }
    ]
  }
];

const DRILLS = [
  {
    id: 'd1',
    title: 'Drill: Conflict Resolution',
    prompt: 'Describe a time you disagreed with a manager’s decision. How did you proceed?',
    time: 120,
    closing: 'End by emphasizing how you prioritized the team goal over your ego.',
    transcript: 'I shared my data-driven concerns privately with my manager. Though we took a different path, I fully committed to the chosen strategy to ensure the project stayed on track. This showed me the value of disagreeing and then committing for the sake of the team.'
  },
  {
    id: 'd2',
    title: 'Drill: Overcoming Failure',
    prompt: 'Tell me about a project that didn’t go as planned. What was your role?',
    time: 150,
    closing: 'Close with the specific process change you implemented to prevent a repeat.',
    transcript: 'We missed a deadline due to a vendor delay. I took responsibility for not having a backup plan. I learned to build "buffer zones" into my schedules, and in the following project, we finished two days early despite similar issues.'
  },
  {
    id: 'd3',
    title: 'Drill: Leadership/Initiative',
    prompt: 'Describe a time you took the lead on something without being asked.',
    time: 120,
    closing: 'Conclude by showing how your initiative saved time or resources.',
    transcript: 'I noticed our onboarding files were outdated, causing confusion. I spent a weekend creating a new digital guide. This reduced new-hire ramp-up time by 20% and was eventually adopted company-wide.'
  }
];

const EMAILS = [
  {
    id: 'e1',
    title: 'Post-Interview Thank You',
    body: 'Dear [Manager Name],\n\nThank you for the opportunity to interview today. I especially enjoyed our discussion regarding [Topic]. After our talk, I am even more excited about the [Position] role.\n\nBest regards,\n[Your Name]'
  }
];

export default function InterviewModule({ navigation }) {
  const [tab, setTab] = useState('Basics');
  const [open, setOpen] = useState(null);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let t;
    if (running && timer > 0) {
      t = setInterval(() => setTimer(v => v - 1), 1000);
    } else if (timer === 0 && running) {
      setRunning(false);
      Alert.alert("Time's Up!", "How did you do? Review the sample response to compare.");
    }
    return () => clearInterval(t);
  }, [running, timer]);

  const toggle = id => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(open === id ? null : id);
    setRunning(false);
  };

  const copyText = async text => {
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* HEADER */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interview Ready</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {['Basics', 'Questions', 'Drills', 'Emails'].map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => { setTab(t); setOpen(null); setRunning(false); }}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {copied && <View style={styles.toast}><Text style={styles.toastText}>Copied!</Text></View>}

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
        {/* BASICS */}
        {tab === 'Basics' && BASICS.map(b => (
          <View key={b.id} style={styles.card}>
            <TouchableOpacity onPress={() => toggle(b.id)} style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{b.title}</Text>
              <Ionicons name={open === b.id ? "chevron-up" : "chevron-down"} size={20} color={COLORS.sub} />
            </TouchableOpacity>
            {open === b.id && (
              <View style={styles.cardBody}>
                {b.insight && <View style={styles.insightTag}><Text style={styles.insightText}>💡 {b.insight}</Text></View>}
                {b.steps?.map((step, idx) => (
                  <View key={idx} style={styles.stepRow}>
                    <View style={styles.iconColumn}>
                      <View style={[styles.iconCircle, { backgroundColor: step.color }]}>
                        <Ionicons name={step.icon} size={14} color="#FFF" />
                      </View>
                      {idx < b.steps.length - 1 && <View style={styles.line} />}
                    </View>
                    <View style={styles.stepTextContent}>
                      <Text style={[styles.stepLabel, { color: step.color }]}>{step.label}</Text>
                      <Text style={styles.stepText}>{step.text}</Text>
                    </View>
                  </View>
                ))}
                {b.isList && (
                  <View style={styles.listContainer}>
                    <Text style={styles.listH}>✅ The Dos</Text>
                    {b.dos.map((item, i) => <Text key={i} style={styles.listItem}>• {item}</Text>)}
                    <Text style={[styles.listH, { marginTop: 10 }]}>❌ The Don'ts</Text>
                    {b.donts.map((item, i) => <Text key={i} style={styles.listItem}>• {item}</Text>)}
                  </View>
                )}
                {b.transcript && (
                  <View style={styles.transcriptBox}>
                    <Text style={styles.transcriptH}>Model Script:</Text>
                    <Text style={styles.transcriptText}>"{b.transcript}"</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}

        {/* QUESTIONS */}
        {tab === 'Questions' && QUESTIONS.map(sec => (
          <View key={sec.type} style={styles.card}>
            <TouchableOpacity onPress={() => toggle(sec.type)} style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{sec.type}</Text>
              <Ionicons name={open === sec.type ? "folder-open" : "folder"} size={20} color={COLORS.primary} />
            </TouchableOpacity>
            {open === sec.type && sec.qs.map((q, i) => (
              <View key={i} style={styles.qBox}>
                <Text style={styles.qT}>{q.q}</Text>
                <View style={styles.whyBox}><Text style={styles.whyT}>Insight: {q.why}</Text></View>
                <Text style={styles.aT}>{q.a}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* DRILLS */}
        {tab === 'Drills' && DRILLS.map(d => (
          <View key={d.id} style={styles.card}>
            <TouchableOpacity onPress={() => { toggle(d.id); setTimer(d.time); }} style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{d.title}</Text>
              <Ionicons name="mic-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            {open === d.id && (
              <View style={styles.drillBody}>
                <Text style={styles.prompt}>{d.prompt}</Text>
                <View style={styles.timerWrap}>
                  <Text style={[styles.timerD, timer < 15 && { color: COLORS.warn }]}>
                    {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                  </Text>
                  <TouchableOpacity 
                    style={[styles.btn, { backgroundColor: running ? COLORS.warn : COLORS.success }]} 
                    onPress={() => setRunning(!running)}
                  >
                    <Text style={styles.btnT}>{running ? 'STOP' : 'START'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.closeBox}>
                  <Text style={styles.closeT}>Closing Tip:</Text>
                  <Text style={styles.closeD}>{d.closing}</Text>
                </View>
                <TouchableOpacity onPress={() => toggle(d.id + 't')} style={styles.revBtn}>
                  <Text style={styles.revBtnT}>{open === d.id + 't' ? 'Hide Sample' : 'See Model Answer'}</Text>
                </TouchableOpacity>
                {open === d.id + 't' && <Text style={styles.sampleT}>{d.transcript}</Text>}
              </View>
            )}
          </View>
        ))}

        {/* EMAILS */}
        {tab === 'Emails' && EMAILS.map(e => (
          <View key={e.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{e.title}</Text>
              <TouchableOpacity onPress={() => copyText(e.body)}>
                <Ionicons name="copy-outline" size={22} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.emailP} numberOfLines={open === e.id ? 0 : 3}>{e.body}</Text>
            <TouchableOpacity onPress={() => toggle(e.id)}>
              <Text style={styles.expand}>{open === e.id ? 'Hide' : 'Expand'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  navHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#FFF' },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.text },
  tabs: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: COLORS.primary },
  tabText: { color: COLORS.sub, fontWeight: '700', fontSize: 13 },
  tabTextActive: { color: COLORS.primary },
  
  toast: { position: 'absolute', top: 120, alignSelf: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, zIndex: 10 },
  toastText: { color: '#FFF', fontWeight: 'bold' },

  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  cardBody: { marginTop: 15 },
  
  insightTag: { backgroundColor: '#F1F5F9', padding: 8, borderRadius: 8, marginBottom: 15 },
  insightText: { fontSize: 12, color: COLORS.sub, fontWeight: '600' },

  stepRow: { flexDirection: 'row' },
  iconColumn: { alignItems: 'center', width: 24 },
  iconCircle: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  line: { width: 2, flex: 1, backgroundColor: COLORS.border, marginVertical: 2 },
  stepTextContent: { flex: 1, marginLeft: 12, paddingBottom: 15 },
  stepLabel: { fontSize: 11, fontWeight: '900' },
  stepText: { fontSize: 13, color: COLORS.text, marginTop: 2 },

  listContainer: { paddingLeft: 5 },
  listH: { fontWeight: '800', fontSize: 14, color: COLORS.text, marginBottom: 5 },
  listItem: { fontSize: 13, color: COLORS.sub, marginBottom: 3 },

  transcriptBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  transcriptH: { fontSize: 11, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  transcriptText: { fontSize: 13, color: COLORS.text, fontStyle: 'italic' },

  qBox: { marginTop: 15, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 15 },
  qT: { fontWeight: '800', color: COLORS.text, fontSize: 14 },
  whyBox: { backgroundColor: '#EEF2FF', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 5 },
  whyT: { fontSize: 11, color: COLORS.accent, fontWeight: '700' },
  aT: { color: COLORS.sub, marginTop: 8, fontSize: 13 },

  drillBody: { marginTop: 10 },
  prompt: { fontSize: 15, color: COLORS.text, fontWeight: '700', textAlign: 'center' },
  timerWrap: { alignItems: 'center', marginVertical: 20 },
  timerD: { fontSize: 44, fontWeight: '900', color: COLORS.primary, marginBottom: 15 },
  btn: { paddingHorizontal: 40, paddingVertical: 12, borderRadius: 25 },
  btnT: { color: '#FFF', fontWeight: '800' },
  closeBox: { borderLeftWidth: 3, borderLeftColor: COLORS.gold, paddingLeft: 12, marginVertical: 15 },
  closeT: { fontSize: 12, fontWeight: '800', color: COLORS.gold },
  closeD: { fontSize: 13, color: COLORS.sub, marginTop: 2 },
  revBtn: { alignSelf: 'center', marginBottom: 10 },
  revBtnT: { color: COLORS.accent, fontWeight: '700' },
  sampleT: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 8, fontSize: 13, color: COLORS.text, fontStyle: 'italic' },

  emailP: { marginTop: 10, fontSize: 13, color: COLORS.sub, lineHeight: 20 },
  expand: { marginTop: 10, color: COLORS.primary, fontWeight: '800' }
});