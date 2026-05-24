import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Share,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'RESUME_BUILDER_STABLE';

export default function ResumeBuilder({ navigation }) {

  /* ---------------- TABS ---------------- */

  const [tab, setTab] = useState('build');

  /* ---------------- SECTION VISIBILITY ---------------- */

  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: false,
    experience: false,
    education: false,
    skills: false,
    certifications: false,
    additional: false,
  });

  /* ---------------- MAIN DATA ---------------- */

  const [data, setData] = useState({
    personal: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
    },

    summary: '',

    experience: [],

    education: [],

    skills: [],

    certifications: [],

    additional: [],
  });

  /* ---------------- INPUT STATES ---------------- */

  const [experienceInput, setExperienceInput] = useState({
    role: '',
    company: '',
    year: '',
    accomplishments: '',
  });

  const [educationInput, setEducationInput] = useState({
    degree: '',
    institution: '',
    year: '',
  });

  const [skillInput, setSkillInput] = useState('');

  const [certInput, setCertInput] = useState('');

  const [additionalInput, setAdditionalInput] = useState('');

  /* ---------------- STORAGE LOGIC ---------------- */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const parsed = JSON.parse(json);
        // Deep merge fallbacks
        setData({
          personal: parsed.personal || { name: '', title: '', email: '', phone: '', location: '', linkedin: '' },
          summary: parsed.summary || '',
          experience: parsed.experience || [],
          education: parsed.education || [],
          skills: parsed.skills || [],
          certifications: parsed.certifications || [],
          additional: parsed.additional || [],
        });
      }
    } catch (e) {
      console.log('Error loading data', e);
    }
  };

  const saveData = async (updatedData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (e) {
      console.log('Error saving data', e);
    }
  };

  /* ---------------- HANDLERS ---------------- */

  const updatePersonal = (field, val) => {
    const updated = {
      ...data,
      personal: { ...data.personal, [field]: val }
    };
    setData(updated);
    saveData(updated);
  };

  const updateSummary = (val) => {
    const updated = { ...data, summary: val };
    setData(updated);
    saveData(updated);
  };

  const addExperience = () => {
    if (!experienceInput.role || !experienceInput.company) return;
    const updated = {
      ...data,
      experience: [...data.experience, { ...experienceInput, id: Date.now().toString() }]
    };
    setData(updated);
    saveData(updated);
    setExperienceInput({ role: '', company: '', year: '', accomplishments: '' });
  };

  const deleteExperience = (id) => {
    const updated = {
      ...data,
      experience: data.experience.filter(item => item.id !== id)
    };
    setData(updated);
    saveData(updated);
  };

  const addEducation = () => {
    if (!educationInput.degree || !educationInput.institution) return;
    const updated = {
      ...data,
      education: [...data.education, { ...educationInput, id: Date.now().toString() }]
    };
    setData(updated);
    saveData(updated);
    setEducationInput({ degree: '', institution: '', year: '' });
  };

  const deleteEducation = (id) => {
    const updated = {
      ...data,
      education: data.education.filter(item => item.id !== id)
    };
    setData(updated);
    saveData(updated);
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    const updated = {
      ...data,
      skills: [...data.skills, { text: skillInput.trim(), id: Date.now().toString() }]
    };
    setData(updated);
    saveData(updated);
    setSkillInput('');
  };

  const deleteSkill = (id) => {
    const updated = {
      ...data,
      skills: data.skills.filter(item => item.id !== id)
    };
    setData(updated);
    saveData(updated);
  };

  const addCert = () => {
    if (!certInput.trim()) return;
    const updated = {
      ...data,
      certifications: [...data.certifications, { text: certInput.trim(), id: Date.now().toString() }]
    };
    setData(updated);
    saveData(updated);
    setCertInput('');
  };

  const deleteCert = (id) => {
    const updated = {
      ...data,
      certifications: data.certifications.filter(item => item.id !== id)
    };
    setData(updated);
    saveData(updated);
  };

  const addAdditional = () => {
    if (!additionalInput.trim()) return;
    const updated = {
      ...data,
      additional: [...data.additional, { text: additionalInput.trim(), id: Date.now().toString() }]
    };
    setData(updated);
    saveData(updated);
    setAdditionalInput('');
  };

  const deleteAdditional = (id) => {
    const updated = {
      ...data,
      additional: data.additional.filter(item => item.id !== id)
    };
    setData(updated);
    saveData(updated);
  };

  /* ---------------- EXPORT PLAIN TEXT LOGIC ---------------- */

  const generatePlainText = () => {
    let p = '';
    const hr = '========================================\n';

    // Personal
    if (data.personal.name) p += `${data.personal.name.toUpperCase()}\n`;
    if (data.personal.title) p += `${data.personal.title}\n`;
    let contact = [];
    if (data.personal.email) contact.push(data.personal.email);
    if (data.personal.phone) contact.push(data.personal.phone);
    if (data.personal.location) contact.push(data.personal.location);
    if (contact.length > 0) p += `${contact.join('  |  ')}\n`;
    if (data.personal.linkedin) p += `LinkedIn: ${data.personal.linkedin}\n`;
    p += '\n';

    // Summary
    if (data.summary.trim()) {
      p += `PROFESSIONAL SUMMARY\n${hr}${data.summary.trim()}\n\n`;
    }

    // Experience
    if (data.experience.length > 0) {
      p += `PROFESSIONAL EXPERIENCE\n${hr}`;
      data.experience.forEach(exp => {
        p += `${exp.role.toUpperCase()} - ${exp.company}`;
        if (exp.year) p += `  (${exp.year})`;
        p += '\n';
        if (exp.accomplishments.trim()) p += `${exp.accomplishments.trim()}\n`;
        p += '\n';
      });
    }

    // Education
    if (data.education.length > 0) {
      p += `EDUCATION\n${hr}`;
      data.education.forEach(edu => {
        p += `${edu.degree} \n${edu.institution}`;
        if (edu.year) p += ` (${edu.year})`;
        p += '\n\n';
      });
    }

    // Skills
    if (data.skills.length > 0) {
      p += `KEY SKILLS\n${hr}`;
      p += data.skills.map(s => s.text).join('  •  ') + '\n\n';
    }

    // Certifications
    if (data.certifications.length > 0) {
      p += `CERTIFICATIONS\n${hr}`;
      data.certifications.forEach(c => {
        p += `• ${c.text}\n`;
      });
      p += '\n';
    }

    // Additional
    if (data.additional.length > 0) {
      p += `ADDITIONAL INFORMATION\n${hr}`;
      data.additional.forEach(a => {
        p += `• ${a.text}\n`;
      });
      p += '\n';
    }

    return p;
  };

  const handleShare = async () => {
    const textOutput = generatePlainText();
    if (!textOutput.trim()) {
      alert('Please fill out some data before exporting.');
      return;
    }
    try {
      await Share.share({
        message: textOutput,
      });
    } catch (e) {
      console.log(e);
    }
  };

  /* ---------------- ACCORDION TOGGLE ---------------- */

  const toggleSection = (sec) => {
    setOpenSections({
      ...openSections,
      [sec]: !openSections[sec]
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* HEADER SEGMENT */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Resume Builder</Text>
          <TouchableOpacity style={styles.exportBtn} onPress={handleShare}>
            <Text style={styles.exportText}>Share Resume</Text>
          </TouchableOpacity>
        </View>

        {/* TABS CONTROLLER */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, tab === 'build' && styles.tabActive]}
            onPress={() => setTab('build')}
          >
            <Text style={[styles.tabText, tab === 'build' && styles.tabTextActive]}>Edit Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, tab === 'preview' && styles.tabActive]}
            onPress={() => setTab('preview')}
          >
            <Text style={[styles.tabText, tab === 'preview' && styles.tabTextActive]}>Live Preview</Text>
          </TouchableOpacity>
        </View>

        {tab === 'build' ? (
          <ScrollView contentContainerStyle={styles.scrollBody} keyboardShouldPersistTaps="handled">
            
            {/* 1. PERSONAL DETAILS */}
            <View style={styles.accordion}>
              <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('personal')}>
                <Text style={styles.sectionTitle}>1. Personal Information</Text>
                <Text style={styles.sectionArrow}>{openSections.personal ? '▾' : '▸'}</Text>
              </TouchableOpacity>
              
              {openSections.personal && (
                <View style={styles.accordionContent}>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={data.personal.name}
                    onChangeText={(v) => updatePersonal('name', v)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Professional Title (e.g. Software Engineer Graduate)"
                    value={data.personal.title}
                    onChangeText={(v) => updatePersonal('title', v)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={data.personal.email}
                    onChangeText={(v) => updatePersonal('email', v)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={data.personal.phone}
                    onChangeText={(v) => updatePersonal('phone', v)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Location (e.g. Mumbai, India)"
                    value={data.personal.location}
                    onChangeText={(v) => updatePersonal('location', v)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="LinkedIn URL"
                    autoCapitalize="none"
                    value={data.personal.linkedin}
                    onChangeText={(v) => updatePersonal('linkedin', v)}
                  />
                </View>
              )}
            </View>

            {/* 2. SUMMARY */}
            <View style={styles.accordion}>
              <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('summary')}>
                <Text style={styles.sectionTitle}>2. Professional Summary</Text>
                <Text style={styles.sectionArrow}>{openSections.summary ? '▾' : '▸'}</Text>
              </TouchableOpacity>
              
              {openSections.summary && (
                <View style={styles.accordionContent}>
                  <TextInput
                    style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                    placeholder="Brief objective statements highlighting core competencies and career aspirations..."
                    multiline={true}
                    value={data.summary}
                    onChangeText={updateSummary}
                  />
                </View>
              )}
            </View>

            {/* 3. EXPERIENCE */}
            <View style={styles.accordion}>
              <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('experience')}>
                <Text style={styles.sectionTitle}>3. Internships / Experience</Text>
                <Text style={styles.sectionArrow}>{openSections.experience ? '▾' : '▸'}</Text>
              </TouchableOpacity>
              
              {openSections.experience && (
                <View style={styles.accordionContent}>
                  {data.experience.map((item) => (
                    <View key={item.id} style={styles.card}>
                      <Text style={styles.cardTitle}>{item.role} @ {item.company}</Text>
                      {item.year ? <Text style={{ color: '#666', fontSize: 13 }}>{item.year}</Text> : null}
                      {item.accomplishments ? <Text style={{ marginTop: 4, color: '#333' }}>{item.accomplishments}</Text> : null}
                      <TouchableOpacity onPress={() => deleteExperience(item.id)}>
                        <Text style={styles.delete}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  <View style={{ borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 }}>
                    <TextInput
                      style={styles.input}
                      placeholder="Role (e.g. Web Developer Intern)"
                      value={experienceInput.role}
                      onChangeText={(v) => setExperienceInput({ ...experienceInput, role: v })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Company/Organization Name"
                      value={experienceInput.company}
                      onChangeText={(v) => setExperienceInput({ ...experienceInput, company: v })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Duration/Year (e.g. June 2023 - Aug 2023)"
                      value={experienceInput.year}
                      onChangeText={(v) => setExperienceInput({ ...experienceInput, year: v })}
                    />
                    <TextInput
                      style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
                      placeholder="Key accomplishments or tasks executed..."
                      multiline={true}
                      value={experienceInput.accomplishments}
                      onChangeText={(v) => setExperienceInput({ ...experienceInput, accomplishments: v })}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addExperience}>
                      <Text style={styles.addButtonText}>+ Add Experience Entry</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* 4. EDUCATION */}
            <View style={styles.accordion}>
              <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('education')}>
                <Text style={styles.sectionTitle}>4. Academic Qualifications</Text>
                <Text style={styles.sectionArrow}>{openSections.education ? '▾' : '▸'}</Text>
              </TouchableOpacity>
              
              {openSections.education && (
                <View style={styles.accordionContent}>
                  {data.education.map((item) => (
                    <View key={item.id} style={styles.card}>
                      <Text style={styles.cardTitle}>{item.degree}</Text>
                      <Text style={{ color: '#333' }}>{item.institution} ({item.year})</Text>
                      <TouchableOpacity onPress={() => deleteEducation(item.id)}>
                        <Text style={styles.delete}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  <View style={{ borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 }}>
                    <TextInput
                      style={styles.input}
                      placeholder="Degree/Course (e.g. B.Tech Computer Science)"
                      value={educationInput.degree}
                      onChangeText={(v) => setEducationInput({ ...educationInput, degree: v })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="University or Institutional Body"
                      value={educationInput.institution}
                      onChangeText={(v) => setEducationInput({ ...educationInput, institution: v })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Passing Year or Timeline"
                      value={educationInput.year}
                      onChangeText={(v) => setEducationInput({ ...educationInput, year: v })}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addEducation}>
                      <Text style={styles.addButtonText}>+ Add Education Entry</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* 5. SKILLS */}
            <View style={styles.accordion}>
              <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('skills')}>
                <Text style={styles.sectionTitle}>5. Technical & Soft Skills</Text>
                <Text style={styles.sectionArrow}>{openSections.skills ? '▾' : '▸'}</Text>
              </TouchableOpacity>
              
              {openSections.skills && (
                <View style={styles.accordionContent}>
                  <View style={styles.skillWrap}>
                    {data.skills.map((item) => (
                      <View key={item.id} style={styles.skillChip}>
                        <Text style={{ color: '#333', fontSize: 13 }}>{item.text}</Text>
                        <TouchableOpacity onPress={() => deleteSkill(item.id)} style={{ marginLeft: 6 }}>
                          <Text style={{ color: '#D93025', fontWeight: 'bold', fontSize: 12 }}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 8 }]}
                      placeholder="Skill name (e.g. React Native, Java)"
                      value={skillInput}
                      onChangeText={setSkillInput}
                    />
                    <TouchableOpacity style={[styles.addButton, { justifyContent: 'center' }]} onPress={addSkill}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* 6. CERTIFICATIONS */}
            <View style={styles.accordion}>
              <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('certifications')}>
                <Text style={styles.sectionTitle}>6. Certifications</Text>
                <Text style={styles.sectionArrow}>{openSections.certifications ? '▾' : '▸'}</Text>
              </TouchableOpacity>
              
              {openSections.certifications && (
                <View style={styles.accordionContent}>
                  {data.certifications.map((item) => (
                    <View key={item.id} style={styles.card}>
                      <Text style={{ color: '#333' }}>• {item.text}</Text>
                      <TouchableOpacity onPress={() => deleteCert(item.id)}>
                        <Text style={styles.delete}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  <View style={{ flexDirection: 'row', marginTop: 4 }}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 8 }]}
                      placeholder="Certification details..."
                      value={certInput}
                      onChangeText={setCertInput}
                    />
                    <TouchableOpacity style={[styles.addButton, { justifyContent: 'center' }]} onPress={addCert}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* 7. ADDITIONAL SECTIONS */}
            <View style={styles.accordion}>
              <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('additional')}>
                <Text style={styles.sectionTitle}>7. Projects / Additional Data</Text>
                <Text style={styles.sectionArrow}>{openSections.additional ? '▾' : '▸'}</Text>
              </TouchableOpacity>
              
              {openSections.additional && (
                <View style={styles.accordionContent}>
                  {data.additional.map((item) => (
                    <View key={item.id} style={styles.card}>
                      <Text style={{ color: '#333' }}>• {item.text}</Text>
                      <TouchableOpacity onPress={() => deleteAdditional(item.id)}>
                        <Text style={styles.delete}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  <View style={{ flexDirection: 'row', marginTop: 4 }}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 8 }]}
                      placeholder="Project link or general information..."
                      value={additionalInput}
                      onChangeText={setAdditionalInput}
                    />
                    <TouchableOpacity style={[styles.addButton, { justifyContent: 'center' }]} onPress={addAdditional}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

          </ScrollView>
        ) : (
          /* LIVE PREVIEW COMPONENT CANVAS */
          <ScrollView contentContainerStyle={styles.previewCanvas}>
            <View style={styles.a4Page}>
              
              {/* TOP PROFILE STAMP */}
              <Text style={styles.pName}>{data.personal.name || 'YOUR FULL NAME'}</Text>
              {data.personal.title ? <Text style={styles.pTitle}>{data.personal.title}</Text> : null}
              
              <View style={styles.pContactRow}>
                {data.personal.email ? <Text style={styles.pContactText}>{data.personal.email}</Text> : null}
                {data.personal.phone ? <Text style={styles.pContactText}> • {data.personal.phone}</Text> : null}
                {data.personal.location ? <Text style={styles.pContactText}> • {data.personal.location}</Text> : null}
              </View>
              {data.personal.linkedin ? <Text style={[styles.pContactText, { textAlign: 'center', marginTop: 2, color: '#0077B5' }]}>{data.personal.linkedin}</Text> : null}

              {/* LIVE SUMMARY PROFILE */}
              {data.summary.trim() ? (
                <View style={styles.pSection}>
                  <Text style={styles.pSectionHeading}>PROFESSIONAL SUMMARY</Text>
                  <Text style={styles.pText}>{data.summary}</Text>
                </View>
              ) : null}

              {/* LIVE EXPERIENCE MAP */}
              {data.experience.length > 0 ? (
                <View style={styles.pSection}>
                  <Text style={styles.pSectionHeading}>PROFESSIONAL EXPERIENCE</Text>
                  {data.experience.map(exp => (
                    <View key={exp.id} style={{ marginBottom: 8 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: '700', color: '#333', fontSize: 13 }}>{exp.role} - {exp.company}</Text>
                        <Text style={{ color: '#666', fontSize: 12 }}>{exp.year}</Text>
                      </View>
                      {exp.accomplishments ? <Text style={[styles.pText, { marginTop: 2 }]}>{exp.accomplishments}</Text> : null}
                    </View>
                  ))}
                </View>
              ) : null}

              {/* LIVE EDUCATION BLOCKS */}
              {data.education.length > 0 ? (
                <View style={styles.pSection}>
                  <Text style={styles.pSectionHeading}>EDUCATION</Text>
                  {data.education.map(edu => (
                    <View key={edu.id} style={{ marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={{ fontWeight: '700', color: '#333', fontSize: 13 }}>{edu.degree}</Text>
                        <Text style={{ color: '#555', fontSize: 12 }}>{edu.institution}</Text>
                      </View>
                      <Text style={{ color: '#666', fontSize: 12 }}>{edu.year}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {/* LIVE CORE SKILLS */}
              {data.skills.length > 0 ? (
                <View style={styles.pSection}>
                  <Text style={styles.pSectionHeading}>KEY SKILLS</Text>
                  <Text style={[styles.pText, { fontWeight: '500' }]}>
                    {data.skills.map(s => s.text).join('  •  ')}
                  </Text>
                </View>
              ) : null}

              {/* LIVE CERTIFICATIONS FRAME */}
              {data.certifications.length > 0 ? (
                <View style={styles.pSection}>
                  <Text style={styles.pSectionHeading}>CERTIFICATIONS</Text>
                  {data.certifications.map(c => (
                    <Text key={c.id} style={[styles.pText, { marginBottom: 2 }]}>• {c.text}</Text>
                  ))}
                </View>
              ) : null}

              {/* LIVE PROJECTS AND MISC DATA */}
              {data.additional.length > 0 ? (
                <View style={styles.pSection}>
                  <Text style={styles.pSectionHeading}>ADDITIONAL INFORMATION</Text>
                  {data.additional.map(a => (
                    <Text key={a.id} style={[styles.pText, { marginBottom: 2 }]}>• {a.text}</Text>
                  ))}
                </View>
              ) : null}

            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------------------------------------------------
   STYLES SHEET BOUNDARY
--------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
  },

  exportBtn: {
    backgroundColor: '#0077B5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },

  exportText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  tabActive: {
    borderBottomColor: '#0077B5',
  },

  tabText: {
    fontWeight: '600',
    color: '#666',
  },

  tabTextActive: {
    color: '#0077B5',
    fontWeight: '700',
  },

  scrollBody: {
    padding: 14,
    paddingBottom: 40,
  },

  accordion: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },

  sectionHeader: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#fafafa',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  sectionArrow: {
    fontSize: 22,
    color: '#0077B5',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },

  addButton: {
    backgroundColor: '#0077B5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  cardTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },

  delete: {
    color: '#D93025',
    marginTop: 8,
    fontWeight: '700',
  },

  skillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },

  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },

  accordionContent: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  previewCanvas: {
    padding: 12,
    backgroundColor: '#525659',
    minHeight: '100%',
  },

  a4Page: {
    backgroundColor: '#fff',
    padding: 20,
    minHeight: 600,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },

  pName: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111',
    letterSpacing: 0.5,
  },

  pTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#444',
    marginTop: 2,
  },

  pContactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },

  pContactText: {
    fontSize: 11,
    color: '#555',
  },

  pSection: {
    marginTop: 12,
  },

  pSectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0077B5',
    borderBottomWidth: 1,
    borderBottomColor: '#0077B5',
    paddingBottom: 2,
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  pText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
    textAlign: 'justify',
  },
});
