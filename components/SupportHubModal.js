import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Linking,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND_DARK = '#103D6A';
const GOOGLE_BLUE = '#1A73E8';

export default function SupportHubModal({ visible, onClose, isPro }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [docAccordionOpen, setDocAccordionOpen] = useState(false); // Controls document accordion state

  const faqs = [
    {
      q: "How do I activate my PRO license?",
      a: "Go to Settings -> Activate License Key (or click the UNLOCK banner), paste your alphanumeric code, and tap activate. Your status updates instantly!"
    },
    {
      q: "Where do these job postings come from?",
      a: "Our feeds are aggregated directly from premium engineering boards and curated daily by the Ace Careers team."
    },
    {
      q: "I paid but my account is still FREE.",
      a: "Try restarting the app. If it still shows FREE, use the WhatsApp button below to send us your transaction ID."
    }
  ];

  const requiredDocuments = [
    { icon: "document-text", text: "Professional Resume" },
    { icon: "image", text: "Passport Size Photograph" },
    { icon: "school", text: "SSLC / Class 10 Marksheet" },
    { icon: "ribbon", text: "Class 12 Marksheet" },
    { icon: "analytics", text: "Marksheet of Professional Education" },
    { icon: "medal", text: "Course Completion Certificates" },
    { icon: "card", text: "Aadhaar ID & PAN Card" },
    { icon: "cash", text: "Aadhaar Linked Bank Details" }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleContact = (type) => {
    const message = isPro
      ? "Hello Team, I am an ACE PRO user and need help regarding my placement services portfolio."
      : "Hello Team, I am using the ACE app and want to query regarding career dashboard tools.";
      
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919074887447?text=${encodedMessage}`;
    
    if (type === 'whatsapp') {
      Linking.openURL(whatsappUrl).catch(() => {
        alert("WhatsApp is not installed on this device.");
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.dragHandle} />
              
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Support Hub</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color="#5F6368" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                contentContainerStyle={styles.modalContent}
                showsVerticalScrollIndicator={false}
              >
                {/* FAQ SECTION */}
                <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
                {faqs.map((faq, index) => (
                  <View key={index} style={styles.faqCard}>
                    <TouchableOpacity 
                      style={styles.faqHeader} 
                      onPress={() => toggleFaq(index)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.faqQuestion}>{faq.q}</Text>
                      <Ionicons 
                        name={activeFaq === index ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color="#5F6368" 
                      />
                    </TouchableOpacity>
                    {activeFaq === index && (
                      <View style={styles.faqAnswerContainer}>
                        <Text style={styles.faqAnswer}>{faq.a}</Text>
                      </View>
                    )}
                  </View>
                ))}

                {/* PLACEMENT DOCUMENTATION ACCORDION PANEL */}
                <Text style={[styles.sectionTitle, { marginTop: 18 }]}>CAMPUS RECRUITMENT RESOURCE</Text>
                <View style={styles.accordionDocCard}>
                  <TouchableOpacity 
                    style={styles.accordionDocHeader}
                    activeOpacity={0.7}
                    onPress={() => setDocAccordionOpen(!docAccordionOpen)}
                  >
                    <View style={styles.headerLeftRow}>
                      <Ionicons name="folder-open" size={16} color={GOOGLE_BLUE} style={{ marginRight: 8 }} />
                      <Text style={styles.accordionDocTitle}>Mandatory Placement Documents</Text>
                    </View>
                    <Ionicons 
                      name={docAccordionOpen ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color="#5F6368" 
                    />
                  </TouchableOpacity>

                  {docAccordionOpen && (
                    <View style={styles.accordionDocBody}>
                      <Text style={styles.documentsSubtitle}>
                        Keep clear soft copies ready before applying for drives:
                      </Text>
                      <View style={styles.docListVertical}>
                        {requiredDocuments.map((doc, idx) => (
                          <View key={idx} style={styles.docRowItem}>
                            <View style={styles.docIconWrapper}>
                              <Ionicons name={doc.icon} size={13} color={GOOGLE_BLUE} />
                            </View>
                            {/* Removed numberOfLines restriction to allow full length wraps perfectly */}
                            <Text style={styles.docText}>
                              {doc.text}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                {/* CONTACT AREA */}
                <TouchableOpacity 
                  style={styles.contactButton}
                  activeOpacity={0.85}
                  onPress={() => handleContact('whatsapp')}
                >
                  <Ionicons name="logo-whatsapp" size={18} color="#FFF" />
                  <Text style={styles.contactButtonText}> Chat with Academic Support</Text>
                </TouchableOpacity>

                <Text style={styles.footerNote}>
                  Live Help Desk Response Hours: 9 AM - 6 PM IST
                </Text>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '50%'
  },
  dragHandle: {
    width: 36,
    height: 5,
    backgroundColor: '#E8EAED',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: BRAND_DARK
  },
  closeBtn: {
    padding: 2
  },
  modalContent: {
    padding: 20,
    paddingBottom: 40
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5F6368',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  faqCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8EAED',
    marginBottom: 8,
    overflow: 'hidden'
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND_DARK,
    flex: 1,
    paddingRight: 10
  },
  faqAnswerContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    backgroundColor: '#FFF'
  },
  faqAnswer: {
    fontSize: 12,
    color: '#4A4A4A',
    lineHeight: 18
  },
  // ACCORDION DOCUMENT CONTAINER DESIGN
  accordionDocCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8EAED',
    marginBottom: 20,
    overflow: 'hidden'
  },
  accordionDocHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  accordionDocTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND_DARK
  },
  accordionDocBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4'
  },
  documentsSubtitle: {
    fontSize: 12,
    color: '#70757A',
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 12
  },
  docListVertical: {
    flexDirection: 'column'
  },
  docRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10
  },
  docIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  docText: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND_DARK,
    flex: 1,
    lineHeight: 16
  },
  contactButton: {
    backgroundColor: '#1E8E3E',
    flexDirection: 'row',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 }
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800'
  },
  footerNote: {
    fontSize: 10,
    color: '#70757A',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500'
  }
});
