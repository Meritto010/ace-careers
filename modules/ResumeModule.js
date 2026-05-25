import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
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

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    try {

      const saved =
        await AsyncStorage.getItem(STORAGE_KEY);

      if (saved) {
        setData(JSON.parse(saved));
      }

    } catch (e) {
      console.log(e);
    }
  };

  /* ---------------- DELAYED SAVE ---------------- */

  useEffect(() => {

    const timer = setTimeout(() => {

      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );

    }, 1000);

    return () => clearTimeout(timer);

  }, [data]);

  /* ---------------- SHARE ---------------- */

  const handleShare = async () => {

    try {

      await Share.share({
        message: buildPreviewText(),
      });

    } catch (e) {
      console.log(e);
    }
  };

  /* ---------------- PREVIEW ---------------- */

  const buildPreviewText = () => {

    const p = data.personal;

    return `
${p.name}

${p.title}

${p.email}
${p.phone}
${p.location}
${p.linkedin}

SUMMARY

${data.summary}

EXPERIENCE

${data.experience.map(
  e =>
`${e.role} - ${e.company} (${e.year})

${e.accomplishments}`
).join('\n\n')}

EDUCATION

${data.education.map(
  e =>
`${e.degree} - ${e.institution} (${e.year})`
).join('\n')}

SKILLS

${data.skills.join(', ')}

CERTIFICATIONS

${data.certifications.join(', ')}

ADDITIONAL

${data.additional.join('\n')}
`.trim();
  };

  /* ---------------- TOGGLE SECTION ---------------- */

  const toggleSection = key => {

    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* ---------------- MAIN ---------------- */

  return (

    <SafeAreaView style={styles.safe}>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        {/* HEADER */}

        <View style={styles.header}>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >

            <Text style={styles.back}>
              ‹ Back
            </Text>

          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Resume Builder
          </Text>

        </View>

        {/* TABS */}

        <View style={styles.tabs}>

          <Tab
            label="BUILD"
            active={tab === 'build'}
            onPress={() => setTab('build')}
          />

          <Tab
            label="PREVIEW"
            active={tab === 'preview'}
            onPress={() => setTab('preview')}
          />

          <Tab
            label="SHARE"
            active={false}
            onPress={handleShare}
          />

        </View>

        {/* CONTENT */}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 120,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
        >

          {tab === 'build'
            ? renderBuild()
            : renderPreview()}

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );

  /* ---------------- BUILD ---------------- */

  function renderBuild() {

    return (

      <>

        {/* PERSONAL */}

        <Section
          title="Personal Information"
          open={openSections.personal}
          onPress={() => toggleSection('personal')}
        >

          <Input
            placeholder="Full Name"
            value={data.personal.name}
            onChangeText={v =>
              setData(prev => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  name: v,
                },
              }))
            }
          />

          <Input
            placeholder="Professional Title"
            value={data.personal.title}
            onChangeText={v =>
              setData(prev => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  title: v,
                },
              }))
            }
          />

          <Input
            placeholder="Email"
            value={data.personal.email}
            onChangeText={v =>
              setData(prev => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  email: v,
                },
              }))
            }
          />

          <Input
            placeholder="Phone"
            value={data.personal.phone}
            onChangeText={v =>
              setData(prev => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  phone: v,
                },
              }))
            }
          />

          <Input
            placeholder="Location"
            value={data.personal.location}
            onChangeText={v =>
              setData(prev => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  location: v,
                },
              }))
            }
          />

          <Input
            placeholder="LinkedIn"
            value={data.personal.linkedin}
            onChangeText={v =>
              setData(prev => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  linkedin: v,
                },
              }))
            }
          />

        </Section>

        {/* SUMMARY */}

        <Section
          title="Professional Summary"
          open={openSections.summary}
          onPress={() => toggleSection('summary')}
        >

          <Input
            multiline
            placeholder="Professional Summary"
            value={data.summary}
            onChangeText={v =>
              setData(prev => ({
                ...prev,
                summary: v,
              }))
            }
          />

        </Section>

        {/* EXPERIENCE */}

        <Section
          title="Experience"
          open={openSections.experience}
          onPress={() => toggleSection('experience')}
        >

          {data.experience.map((item, idx) => (

            <Card key={idx}>

              <Text style={styles.cardTitle}>
                {item.role}
              </Text>

              <Text>
                {item.company}
              </Text>

              <Text>
                {item.year}
              </Text>

              <Text>
                {item.accomplishments}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setData(prev => ({
                    ...prev,
                    experience:
                      prev.experience.filter(
                        (_, i) => i !== idx
                      ),
                  }))
                }
              >

                <Text style={styles.delete}>
                  Delete
                </Text>

              </TouchableOpacity>

            </Card>

          ))}

          <Input
            placeholder="Role"
            value={experienceInput.role}
            onChangeText={v =>
              setExperienceInput({
                ...experienceInput,
                role: v,
              })
            }
          />

          <Input
            placeholder="Company"
            value={experienceInput.company}
            onChangeText={v =>
              setExperienceInput({
                ...experienceInput,
                company: v,
              })
            }
          />

          <Input
            placeholder="Year"
            value={experienceInput.year}
            onChangeText={v =>
              setExperienceInput({
                ...experienceInput,
                year: v,
              })
            }
          />

          <Input
            multiline
            placeholder="Accomplishments"
            value={
              experienceInput.accomplishments
            }
            onChangeText={v =>
              setExperienceInput({
                ...experienceInput,
                accomplishments: v,
              })
            }
          />

          <AddButton
            title="Add Experience"
            onPress={() => {

              if (
                !experienceInput.role.trim()
              ) return;

              setData(prev => ({
                ...prev,
                experience: [
                  ...prev.experience,
                  experienceInput,
                ],
              }));

              setExperienceInput({
                role: '',
                company: '',
                year: '',
                accomplishments: '',
              });
            }}
          />

        </Section>

        {/* EDUCATION */}

        <Section
          title="Education"
          open={openSections.education}
          onPress={() => toggleSection('education')}
        >

          {data.education.map((item, idx) => (

            <Card key={idx}>

              <Text style={styles.cardTitle}>
                {item.degree}
              </Text>

              <Text>
                {item.institution}
              </Text>

              <Text>
                {item.year}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setData(prev => ({
                    ...prev,
                    education:
                      prev.education.filter(
                        (_, i) => i !== idx
                      ),
                  }))
                }
              >

                <Text style={styles.delete}>
                  Delete
                </Text>

              </TouchableOpacity>

            </Card>

          ))}

          <Input
            placeholder="Degree"
            value={educationInput.degree}
            onChangeText={v =>
              setEducationInput({
                ...educationInput,
                degree: v,
              })
            }
          />

          <Input
            placeholder="Institution"
            value={educationInput.institution}
            onChangeText={v =>
              setEducationInput({
                ...educationInput,
                institution: v,
              })
            }
          />

          <Input
            placeholder="Year"
            value={educationInput.year}
            onChangeText={v =>
              setEducationInput({
                ...educationInput,
                year: v,
              })
            }
          />

          <AddButton
            title="Add Education"
            onPress={() => {

              if (
                !educationInput.degree.trim()
              ) return;

              setData(prev => ({
                ...prev,
                education: [
                  ...prev.education,
                  educationInput,
                ],
              }));

              setEducationInput({
                degree: '',
                institution: '',
                year: '',
              });
            }}
          />

        </Section>

        {/* SKILLS */}

        <Section
          title="Skills"
          open={openSections.skills}
          onPress={() => toggleSection('skills')}
        >

          <View style={styles.skillWrap}>

            {data.skills.map((skill, idx) => (

              <View
                key={idx}
                style={styles.skillChip}
              >

                <Text>
                  {skill}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setData(prev => ({
                      ...prev,
                      skills:
                        prev.skills.filter(
                          (_, i) => i !== idx
                        ),
                    }))
                  }
                >

                  <Text style={styles.delete}>
                    ×
                  </Text>

                </TouchableOpacity>

              </View>

            ))}

          </View>

          <Input
            placeholder="Add Skill"
            value={skillInput}
            onChangeText={setSkillInput}
            onSubmitEditing={() => {

              if (!skillInput.trim()) return;

              setData(prev => ({
                ...prev,
                skills: [
                  ...prev.skills,
                  skillInput.trim(),
                ],
              }));

              setSkillInput('');
            }}
          />

        </Section>

        {/* CERTIFICATIONS */}

        <Section
          title="Certifications"
          open={openSections.certifications}
          onPress={() =>
            toggleSection('certifications')
          }
        >

          {data.certifications.map((item, idx) => (

            <Card key={idx}>

              <Text>
                {item}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setData(prev => ({
                    ...prev,
                    certifications:
                      prev.certifications.filter(
                        (_, i) => i !== idx
                      ),
                  }))
                }
              >

                <Text style={styles.delete}>
                  Delete
                </Text>

              </TouchableOpacity>

            </Card>

          ))}

          <Input
            placeholder="Add Certification"
            value={certInput}
            onChangeText={setCertInput}
            onSubmitEditing={() => {

              if (!certInput.trim()) return;

              setData(prev => ({
                ...prev,
                certifications: [
                  ...prev.certifications,
                  certInput.trim(),
                ],
              }));

              setCertInput('');
            }}
          />

        </Section>

        {/* ADDITIONAL */}

        <Section
          title="Additional Qualifications"
          open={openSections.additional}
          onPress={() =>
            toggleSection('additional')
          }
        >

          {data.additional.map((item, idx) => (

            <Card key={idx}>

              <Text>
                {item}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setData(prev => ({
                    ...prev,
                    additional:
                      prev.additional.filter(
                        (_, i) => i !== idx
                      ),
                  }))
                }
              >

                <Text style={styles.delete}>
                  Delete
                </Text>

              </TouchableOpacity>

            </Card>

          ))}

          <Input
            placeholder="Add Qualification"
            value={additionalInput}
            onChangeText={setAdditionalInput}
            onSubmitEditing={() => {

              if (
                !additionalInput.trim()
              ) return;

              setData(prev => ({
                ...prev,
                additional: [
                  ...prev.additional,
                  additionalInput.trim(),
                ],
              }));

              setAdditionalInput('');
            }}
          />

        </Section>

      </>
    );
  }

  /* ---------------- PREVIEW ---------------- */

  function renderPreview() {

    return (

      <View>

        <Text style={styles.previewName}>
          {data.personal.name}
        </Text>

        <Text style={styles.previewTitle}>
          {data.personal.title}
        </Text>

        <Text style={styles.previewMeta}>
          {data.personal.email}
        </Text>

        <Text style={styles.previewMeta}>
          {data.personal.phone}
        </Text>

        <Text style={styles.previewMeta}>
          {data.personal.location}
        </Text>

        <Text style={styles.previewMeta}>
          {data.personal.linkedin}
        </Text>

        <Preview title="Summary" value={data.summary} />

        <Preview
          title="Experience"
          value={data.experience.map(
            e =>
`${e.role} - ${e.company} (${e.year})

${e.accomplishments}`
          ).join('\n\n')}
        />

        <Preview
          title="Education"
          value={data.education.map(
            e =>
`${e.degree} - ${e.institution} (${e.year})`
          ).join('\n')}
        />

        <Preview
          title="Skills"
          value={data.skills.join(', ')}
        />

        <Preview
          title="Certifications"
          value={data.certifications.join(', ')}
        />

        <Preview
          title="Additional"
          value={data.additional.join('\n')}
        />

      </View>
    );
  }
}

/* ---------------- COMPONENTS ---------------- */

const Tab = ({ label, active, onPress }) => (

  <TouchableOpacity
    style={[
      styles.tab,
      active && styles.tabActive,
    ]}
    onPress={onPress}
  >

    <Text
      style={[
        styles.tabText,
        active && styles.tabTextActive,
      ]}
    >

      {label}

    </Text>

  </TouchableOpacity>

);

const Section = ({
  title,
  children,
  open,
  onPress,
}) => (

  <View style={styles.section}>

    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={onPress}
    >

      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      <Text style={styles.sectionArrow}>
        {open ? '−' : '+'}
      </Text>

    </TouchableOpacity>

    {open && (
      <View style={{ marginTop: 12 }}>
        {children}
      </View>
    )}

  </View>

);

const Input = props => (

  <TextInput
    {...props}
    style={[
      styles.input,
      props.multiline && {
        minHeight: 100,
        textAlignVertical: 'top',
      },
    ]}
    placeholderTextColor="#999"
  />

);

const AddButton = ({ title, onPress }) => (

  <TouchableOpacity
    style={styles.addButton}
    onPress={onPress}
  >

    <Text style={styles.addButtonText}>
      {title}
    </Text>

  </TouchableOpacity>

);

const Card = ({ children }) => (

  <View style={styles.card}>
    {children}
  </View>

);

const Preview = ({ title, value }) =>

  value ? (

    <View style={styles.previewBlock}>

      <Text style={styles.previewHeading}>
        {title}
      </Text>

      <Text style={styles.previewValue}>
        {value}
      </Text>

    </View>

  ) : null;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:
      Platform.OS === 'android'
        ? 24
        : 0,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  back: {
    color: '#0077B5',
    marginRight: 16,
    fontSize: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },

  tabActive: {
    borderBottomWidth: 2,
    borderColor: '#0077B5',
  },

  tabText: {
    color: '#666',
  },

  tabTextActive: {
    color: '#0077B5',
    fontWeight: '700',
  },

  section: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 14,
  },

  sectionHeader: {
    flexDirection: 'row',
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
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  previewName: {
    fontSize: 24,
    fontWeight: '700',
  },

  previewTitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },

  previewMeta: {
    marginBottom: 4,
    color: '#444',
  },

  previewBlock: {
    marginTop: 18,
  },

  previewHeading: {
    fontWeight: '700',
    marginBottom: 6,
    fontSize: 16,
  },

  previewValue: {
    lineHeight: 22,
    color: '#333',
  },

});