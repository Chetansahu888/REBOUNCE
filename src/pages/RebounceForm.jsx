import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Download, FileText, Check } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import SignatureCanvas from 'react-signature-canvas';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import AntiGravityBackground from '../components/AntiGravityBackground';
import { supabase } from '../supabase';

const WAIVER_TEXT = `<strong>Participant Agreement, Release and Assumption of Risk Agreement</strong>
(REBOUNCE RAIPUR LLP)

I have voluntarily elected to use and, if applicable, to allow minor child / children identified in this form, and all minor children under my supervision and referred to individually and collectively herein as “Child”, to use the REBOUNCE RAIPUR LLP facilities and equipment located at following centers (the “REBOUNCE RAIPUR LLP”):
1.) REBOUNCE, Plot 338/31 Labhandi signal, opp. Indira Gandhi Agricultural University, Raipur, Chhattisgarh 492012

In consideration for being allowed to use REBOUNCE RAIPUR LLP Facility, and any other services provided by REBOUNCE RAIPUR LLP or its employees or agents at the aforesaid locations, or any other location, I represent, acknowledge and agree as follow:

<strong>General Release</strong>
From the date of signing and for all future visits of myself and my Child, I acknowledge and agree that this Agreement covers and is intended to release and provide other benefits, legal protections, and consideration to the REBOUNCE RAIPUR LLP, and their respective and collective agents, owners, officers, managers, shareholders, affiliates, volunteers, participants, employees, and all other persons or entities acting in any capacity on their respective or collective behalf.

<strong>Release of Potential Injuries</strong>
I acknowledge and agree that the use of trampolines and the other equipment at the REBOUNCE RAIPUR LLP Facility and that participating in trampoline and other activities is inherently and obviously dangerous. These risks include serious physical or emotional injury, paralysis, death, damage to myself, the Child, and/or third parties, and damage to personal property of any or all such persons.
I understand that such risks simply cannot be eliminated without jeopardizing the essential qualities of the activity, which I further agree is for recreational purposes and completely voluntary.
I acknowledge and agree that, while the trampoline and other activities that take place at the REBOUNCE RAIPUR LLP Facility are monitored generally by REBOUNCE RAIPUR LLP Facility employees, it is not feasible for such employees to monitor the activities and actions of all customers at all times or all customers simultaneously.
Further, I understand that there may arise situations or circumstances when employees of REBOUNCE RAIPUR LLP may have difficult jobs to perform, and may seek safety, but they are not infallible. They might be unaware of a participant’s health or abilities, or may give incomplete warnings or instructions, and the equipment being used might malfunction.

<strong>Voluntary Assumption of Risk</strong>
I acknowledge and agree that I and the Child are participating voluntarily at our own risk. I acknowledge and agree that the actions or activities of other customers or the actions or inactions of REBOUNCE RAIPUR LLP Facility employees could cause me or the Child significant bodily injury (as described in this Agreement), and that REBOUNCE RAIPUR LLP Facility is not responsible for the actions or activities of customers using the REBOUNCE RAIPUR LLP Facility or the negligence of its employees in supervising the REBOUNCE RAIPUR LLP Facility or its usage, including actions, activities, or omissions that result in such harm. Some of the risks include, but are not limited to, the following:
Participants may die or become paralyzed, partially or fully, through their use of the REBOUNCE RAIPUR LLP Facility and participation in REBOUNCE RAIPUR LLP Facility.
Participants may suffer physical injury, including but not limited to, cuts, scrapes, bumps, bruises, the transmission of disease strains and allergic reactions through use of the REBOUNCE RAIPUR LLP Facility equipment or contact with other participants or surfaces they have contacted. Participants may sprain, pull, break or otherwise seriously externally or internally injure their head, face (including nose and teeth/jaw), neck, torso, spine, arms, wrists, hands, legs, ankles, feet or other body parts as a result of falling off the trampoline(s) or other equipment, landing improperly on the trampolines or other equipment, or making contact with other participants. As noted in paragraph (a) above, such injuries can lead to paralysis, disfigurement or death. Participation may result in heat stroke, heart attacks, dehydration and other exertion-related medical events.
Participants may fall on each other, resulting in broken bones and other serious injuries. Further, certain activities, such as double bouncing more than one person per trampoline, flipping, running and bouncing off of the walls and wall-mounted trampolines, and other participant body movements (whether planned or unplanned) can create a rebound effect and lead to unpredictable body movements and anticipated or unanticipated bodily contact, any or all of which can lead to serious injury.
Traveling to and from trampolines can result in similar physical injury (even if the participant is not himself or herself bouncing at the time).
Observing, standing, sitting or taking photographs at or near any trampoline or activity can result in similar physical injury (even if the observer is not himself or herself participating at the time).

<strong>Agreement to Pay My Own Medical Expenses</strong>
I acknowledge, accept, and assume the risk of any and all medical conditions, limitations, or disabilities (whether temporary or permanent) that I or the Child possess, whether known or unknown, which might contribute to or exacerbate any injury I or the Child might sustain as a result of using the REBOUNCE RAIPUR LLP Facility or any of its equipment. I acknowledge and agree that if medical assistance (of any form, including emergency care, hospitalization, out-patient care, and/or physical therapy) is required or performed as a result of any injury I or the Child sustains while using the REBOUNCE RAIPUR LLP Facility, such assistance shall be at my own expense.

<strong>Release of Liability</strong>
I, the Child and/or any person claiming under or on behalf of me and/or the Child (hereinafter referred to as the “Releasing Parties”) forever, irrevocably and unconditionally release, waive, relinquish, discharge from liability and covenant not to sue REBOUNCE RAIPUR LLP, and their successors, predecessors-in-interest, and insurers from any and all claims, demands, rights, actions, suits, causes of action, obligations, debts, costs, losses, charges, expenses, attorneys' fees, damages, judgments and liabilities, of whatever kind or nature, in law, equity or otherwise, whether now known or unknown, suspected or unsuspected, and whether or not concealed or hidden, related to or arising, directly or indirectly, from my or the Child's access to and/or use of the REBOUNCE RAIPUR LLP Facility, premises and/or its equipment (whether trampolines or otherwise), the Child's and/or my entry into the REBOUNCE RAIPUR LLP Facility, the condition, maintenance, inspection, supervision, control or security of the REBOUNCE RAIPUR LLP Facility, the failure to warn of dangerous conditions in connection with the REBOUNCE RAIPUR LLP Facility, and/or the acts or omissions of REBOUNCE RAIPUR LLP, including, without limitation, any claim for negligence, failure to warn or other omission, property damage, personal injury, emotional injury, illness, bodily harm, paralysis or death.
I understand that this release and waiver applies not only to use of the trampolines, but also all other equipment, and all activities and games at the REBOUNCE RAIPUR LLP Facility.
I understand that this release and waiver applies to and includes all activities that I or the Child engage in at the premises, whether inside or outside the REBOUNCE RAIPUR LLP Facility.
In the event that any claim released herein is brought by, or asserted on behalf of, the Releasing Parties, I shall immediately defend, indemnify and hold harmless the REBOUNCE RAIPUR LLP Facility and/or its employees, and any of them, from any loss or liability, including reasonable attorneys' fees, associated therewith or arising therefrom.

<strong>Arbitration of Disputes and Time Limit to Bring Claim</strong>
I understand that by agreeing to arbitrate any dispute as set forth in this section, I am waiving my right, and the right(s) of the Child, to maintain a lawsuit against REBOUNCE RAIPUR LLP for any and all claims covered by this Agreement.
By agreeing to arbitrate, I understand that I will not have the right to have my claim determined by a jury, and the Child will not have the right to have claim(s) determined by a jury. Reciprocally, REBOUNCE RAIPUR LLP and the other releasees waive their right to maintain a lawsuit against me and the Child for any and all claims covered by this Agreement, and they will not have the right to have their claim(s) determined by a jury.
Any dispute, claim or controversy arising out of or relating to my or the Child's access to and/or use of the REBOUNCE RAIPUR LLP Facility and/or REBOUNCE RAIPUR LLP’s premises and/or its equipment, including the determination of the scope or applicability of this agreement to arbitrate, shall be brought within one year of its accrual (i.e., the date of the alleged injury) and be determined by arbitration in the state of Karnataka before one arbitrator. The arbitration shall be administered by the Arbitration and Conciliation Act, 1996. The judgment on the award may be entered in any court having jurisdiction. This clause shall not preclude parties from seeking provisional remedies in aid of arbitration from a court of appropriate jurisdiction.
This Agreement shall be governed by, construed and interpreted in accordance with the laws of India, without regard to choice of law principles. Notwithstanding the provision with respect to the applicable substantive law, any arbitration conducted pursuant to the terms of this Agreement shall be governed by the Arbitration and Conciliation Act, 1996.

<strong>Photo/Video/Social Media Waiver</strong>
In connection with my and the Child's use of the REBOUNCE RAIPUR LLP Facility, I consent to the recording of the Child's and my physical likeness and/or voice through mechanical, photographic, technical, digital, electronic or other means (hereinafter referred to as "Recordings").
I hereby consent to and authorize REBOUNCE RAIPUR LLP and its agents, representatives, employees, successors and assigns to use, in perpetuity, such Recordings, as well as the Child's name and my name, for any purpose, including advertising, promoting, exploiting and/or publicizing any REBOUNCE RAIPUR LLP Facility.
I further agree that the foregoing includes the consent to use the Child's and/or my physical likeness in any form.
In addition, I waive any and all claims I may have in connection with the Recordings.

<strong>Term of Agreement</strong>
I understand that this agreement extends forever into the future and will have full force and legal effect each and every time I or the Child visit REBOUNCE RAIPUR LLP Facility, whether at the current location or any other location or facility.

<strong>Safety is my Responsibility</strong>
I and the Child agree to follow the code of patron responsibility:
I acknowledge that there are inherent risks in the participation in the activities or equipment at REBOUNCE RAIPUR LLP Facility, and that such risks include not only the use of trampolines, but other activities and equipment. Patrons of an activity court who use the equipment, and those who engage in any other activities or use any other equipment, by participation, accept the risks inherent in such participation of which the ordinary prudent person is or should be aware. Patrons have a duty to exercise good judgment and act in a responsible manner while using the equipment, and while engaging in such activities. Patrons have a duty to obey all oral or written warnings, or both, prior to or during participation, or both.
I have a duty to not participate or engage in any activity or use any equipment, when under the influence of drugs or alcohol.
I have a duty to properly use all safety equipment provided at REBOUNCE RAIPUR LLP Facility.
I have a duty to not participate in any activity or use other equipment, if I have pre-existing medical conditions, circulatory conditions, heart or lung conditions, recent surgeries, back or neck conditions, knee or ankle conditions, high blood pressure, known pregnancy, any history of spine, musculoskeletal or head injuries, or if you may be pregnant.
I have a duty to remove inappropriate attire including hard, sharp or dangerous objects such as buckles, pens, purses, badges and so forth.
I have a duty to avoid bodily contact with other patrons.
I have a duty to conform with or meet height, weight or age restrictions imposed by the manufacturer or owner to use or participate in any activity or use of equipment at REBOUNCE RAIPUR LLP Facility.
I have a duty to avoid crowding or overloading individual sections of the REBOUNCE RAIPUR LLP Facility.
I have a duty to use the equipment at REBOUNCE RAIPUR LLP Facility, within own limitations, training and acquired skills.
I have a duty to avoid landing on the head or neck. Serious injuries, paralysis or death can occur when landing on the equipment at REBOUNCE RAIPUR LLP Facility.
I also agree to follow and obey all posted and stated warnings and patron education signs.
I agree to explain all safety rules to each Child you accompany, and to ensure that each Child obeys the safety rules.

<strong>Other terms and/or conditions</strong>
I would like to receive email promotions, discounts, and other advertisements from REBOUNCE RAIPUR LLP and its partners at the email address provided below. I may unsubscribe at any time.
I have had sufficient opportunity to read this document. I have read and understood and agree to be bound by its terms.
I understand that employees working at the REBOUNCE RAIPUR LLP Facility, including the manager, do not have the authority to waive any provision of this Agreement. This Agreement constitutes and contains the entire agreement between REBOUNCE RAIPUR LLP and me relating to the Child's and my use of the REBOUNCE RAIPUR LLP Facility. There are no other agreements, oral, written, or implied, with respect to such matters.
I agree that if any portion of this Agreement is found to be unenforceable, the remaining portions shall remain in full force.
By signing below, (either by manual signature or in digital form) I represent and warrant that I am the parent, legal guardian, or power-of-attorney of the Child and have the authority to execute this Agreement on his/her or their behalf and to act on his/her or their behalf.
I have read each and every paragraph in this document and I and they agree to be bound by the terms stated therein, including the release of liability contained therein.
I further agree to indemnify and hold harmless REBOUNCE RAIPUR LLP from any and all claims which are brought by or on behalf of the Child, or any of them, which are in any way connected with, arise out of, or result from their use of the REBOUNCE RAIPUR LLP Facility.
I am 18 years of age or older. I am entering this agreement on behalf of myself, my spouse or domestic partner, the Child, and our respective and/or collective issue, parents, siblings, heirs, assigns, personal representatives, estate(s), and anyone else who can claim by or through such person or persons (in summary, by my signature below, I acknowledge that if I or any of my children are injured in any way, this waiver prevents and prohibits any recovery of money from any REBOUNCE RAIPUR LLP Facility).`;

const RebounceForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: '',
    fullName: '',
    dob: null,
    email: '',
    gender: '',
    signature: null,
    agreed: false,
  });
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

  const sigCanvas = useRef(null);

  const handleNext = async () => {
    if (step === 1) {
      // Small delay just to show "Checking" for feedback, then jump
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(2);
        if (formData.fullName) {
          toast.success("Details Auto-filled!", { icon: '✨' });
        }
      }, 300);
      return;
    }
    setStep(step + 1);
  };
  const handleBack = () => setStep(step - 1);

  const downloadPDF = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rebounce_Waiver_${formData.fullName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStep(4); // Move to success step after download
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const diff = Date.now() - dob.getTime();
    const age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
  };

  const handleClearSignature = () => {
    sigCanvas.current.clear();
    setFormData({ ...formData, signature: null });
  };

  // Pre-fetch user data as they type for "Instant" feel
  useEffect(() => {
    const fetchExistingUser = async () => {
      // Check if mobile number is complete (usually 12 digits including 91 for India)
      if (formData.mobile.length >= 12 && step === 1) {
        try {
          const { data } = await supabase
            .from('submissions')
            .select('full_name, email, dob, gender')
            .eq('mobile', formData.mobile)
            .limit(1)
            .maybeSingle();

          if (data) {
            setFormData(prev => ({
              ...prev,
              fullName: prev.fullName || data.full_name || '',
              email: prev.email || data.email || '',
              dob: prev.dob || (data.dob ? new Date(data.dob) : null),
              gender: prev.gender || data.gender || '',
            }));
          }
        } catch (err) {
          console.error("Background fetch error:", err);
        }
      }
    };

    fetchExistingUser();
  }, [formData.mobile, step]);

  useEffect(() => {
    let timer;
    if (step === 4) {
      timer = setTimeout(() => {
        setStep(1);
        setFormData({ mobile: '', fullName: '', dob: null, email: '', gender: '', signature: null, agreed: false });
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const generatePDF = (data) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Header Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`--Participant: ${data.fullName}`, margin, 40);
    doc.text(`Signed By: ${data.fullName}`, margin, 48);
    doc.text(`Signed: ${format(new Date(data.submittedAt), 'd/M/yyyy HH:mm')}`, margin, 56);

    // Title
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Participant Agreement, Release and Assumption of Risk Agreement", pageWidth / 2, 75, { align: 'center' });
    doc.text("(REBOUNCE RAIPUR LLP)", pageWidth / 2, 82, { align: 'center' });

    // Waiver Content
    let yPos = 95;
    const pageHeight = doc.internal.pageSize.getHeight();

    // Split text by lines and handle bold tags
    const lines = WAIVER_TEXT.split('\n');

    lines.forEach(line => {
      if (!line.trim()) {
        yPos += 5; // Add space for empty lines
        return;
      }

      // Check for bold content
      const hasBold = line.includes('<strong>');

      if (hasBold) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        const cleanLine = line.replace(/<strong>/g, '').replace(/<\/strong>/g, '');

        // Handle potential wrapping even for bold headings
        const wrappedHeadings = doc.splitTextToSize(cleanLine, contentWidth);
        wrappedHeadings.forEach(hLine => {
          if (yPos > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(hLine, margin, yPos);
          yPos += 6;
        });
        doc.setFont("helvetica", "normal");
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const wrappedLines = doc.splitTextToSize(line, contentWidth);
        wrappedLines.forEach(wLine => {
          if (yPos > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(wLine, margin, yPos);
          yPos += 5;
        });
      }
    });

    // Signature Section at the bottom of the last page
    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = margin;
    }

    yPos += 10;
    // Border for details and signature
    doc.rect(margin, yPos, contentWidth / 2, 60); // Details box
    doc.rect(margin + contentWidth / 2, yPos, contentWidth / 2, 60); // Signature box

    // Labels
    doc.setFont("helvetica", "bold");
    doc.text("PARTICIPANT", margin + 5, yPos - 3);
    doc.text("Participant Signature", margin + contentWidth / 2 + 5, yPos - 3);

    // Details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Date Of Birth: ${data.dob ? format(new Date(data.dob), 'dd/MM/yyyy') : ''} (Age ${calculateAge(new Date(data.dob))})`, margin + 5, yPos + 10);
    doc.text(`Full Name: ${data.fullName}`, margin + 5, yPos + 20);
    doc.text(`Gender: ${data.gender}`, margin + 5, yPos + 30);
    doc.text(`Contact Number: ${data.mobile}`, margin + 5, yPos + 40);
    doc.text(`Email: ${data.email || 'N/A'}`, margin + 5, yPos + 50);

    // Add Signature Image
    if (data.signature) {
      doc.addImage(data.signature, 'PNG', margin + contentWidth / 2 + 10, yPos + 5, contentWidth / 2 - 20, 50);
    }

    // Add "Powered by Botivate" Footer with Link on ALL pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);

      const footerText = "Powered by Botivate";
      // Calculate text width approximately for centering
      const textWidth = doc.getStringUnitWidth(footerText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const x = (pageWidth - textWidth) / 2;
      const y = pageHeight - 10;

      doc.text(footerText, x, y);
      doc.link(x, y - 4, textWidth, 6, { url: 'https://botivate.in/' });
    }

    return doc.output('blob');
  };

  const handleSubmit = async () => {
    if (sigCanvas.current.isEmpty()) {
      toast.error("Please provide a signature first.", {
        style: {
          borderRadius: '16px',
          background: '#334155',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
        },
      });
      return;
    }
    if (!sigCanvas.current) return;
    const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');

    const finalData = {
      ...formData,
      signature: signatureData,
      submittedAt: new Date().toISOString()
    };

    setLoading(true);

    try {
      // 1. Generate PDF and get blob
      const pdfBlob = generatePDF(finalData);

      // 2. Upload PDF to Supabase Storage
      const fileName = `waiver_${Date.now()}_${formData.fullName.replace(/\s+/g, '_')}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('wavier')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`PDF Upload Failed: ${uploadError.message}`);
      }

      const pdfUrl = uploadData
        ? supabase.storage.from('wavier').getPublicUrl(uploadData.path).data.publicUrl
        : null;

      // 3. Save to Supabase Database
      const { error: supabaseError } = await supabase
        .from('submissions')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
          dob: formData.dob ? format(formData.dob, 'yyyy-MM-dd') : null,
          gender: formData.gender,
          signature: signatureData,
          agreed: formData.agreed,
          submitted_at: finalData.submittedAt,
          pdf_url: pdfUrl
        }]);

      if (supabaseError) throw supabaseError;

      // Generate PDF and show preview
      const blob = generatePDF(finalData);
      setPdfBlob(blob);

      const publicUrl = pdfUrl || URL.createObjectURL(blob);
      setPdfPreviewUrl(publicUrl);

      toast.success("Waiver saved successfully!", {
        style: {
          borderRadius: '16px',
          background: '#334155',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
        },
      });

      setStep(5); // Preview step
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.message || "Failed to submit waiver.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full box-border text-left bg-white/40 border border-white/60 rounded-2xl px-4 py-3 outline-none focus:border-[#FF1493] focus:ring-2 focus:ring-[#FF1493]/20 transition-all text-slate-800 placeholder:text-slate-400 backdrop-blur-md shadow-inner text-base md:text-sm";
  const labelStyles = "block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <div className="w-full">
              <h2 className="text-3xl font-black text-slate-800 mb-2 text-center tracking-tight uppercase">
                WELCOME TO <span className="text-[#FF1493]">REBOUNCE</span>
              </h2>
              <p className="text-center text-slate-500 font-medium mb-8">Ready to jump?</p>

              <div className="mb-6">
                <label className={labelStyles}>Please Enter Your Mobile No</label>
                <div className="relative rounded-2xl shadow-sm glass-effect p-2">
                  <PhoneInput
                    country={'in'}
                    value={formData.mobile}
                    onChange={(phone) => setFormData({ ...formData, mobile: phone })}
                    containerStyle={{ width: '100%' }}
                    inputStyle={{
                      width: '100%',
                      height: '50px',
                      fontSize: '16px',
                      border: 'none',
                      background: 'transparent',
                      paddingLeft: '50px'
                    }}
                    buttonStyle={{
                      border: 'none',
                      background: 'transparent',
                      paddingLeft: '10px'
                    }}
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={!loading ? { scale: 1.05, boxShadow: '0 10px 20px rgba(255,20,147,0.2)' } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              onClick={handleNext}
              disabled={formData.mobile.length < 10 || loading}
              className="w-full mt-6 bg-[#FF1493] text-white font-black py-4 rounded-2xl shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                "Continue"
              )}
            </motion.button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <div className="w-full pb-4">
              <h2 className="text-2xl font-black text-slate-800 mb-6 text-center tracking-tight uppercase">
                Your <span className="text-[#FF1493]">Details</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={labelStyles}>Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={inputStyles}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="relative datepicker-container">
                  <label className={labelStyles}>Date Of Birth</label>
                  <DatePicker
                    selected={formData.dob}
                    onChange={(date) => setFormData({ ...formData, dob: date })}
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    placeholderText="Select your birthday"
                    className={`${inputStyles} w-full cursor-pointer`}
                    wrapperClassName="w-full"
                    popperPlacement="bottom-start"
                  />
                </div>

                <div>
                  <label className={labelStyles}>Phone No</label>
                  <input
                    type="text"
                    value={formData.mobile}
                    readOnly
                    className={`${inputStyles} opacity-70 cursor-not-allowed bg-slate-100`}
                  />
                </div>

                <div>
                  <label className={labelStyles}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputStyles}
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className={labelStyles}>Gender</label>
                  <div className="flex gap-2 sm:gap-4">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <label key={g} className={`flex items-center space-x-1 sm:space-x-2 cursor-pointer px-2 sm:px-4 py-3 rounded-2xl border transition-all flex-1 justify-center ${formData.gender === g ? 'bg-[#FF1493] border-[#FF1493] text-white' : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-600'}`}>
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === g}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="hidden"
                        />
                        <span className={`text-xs sm:text-sm font-bold uppercase tracking-tight`}>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBack}
                className="w-1/3 py-4 text-slate-600 bg-white/40 border border-white/60 font-bold rounded-2xl hover:bg-white/60 transition-all uppercase tracking-wider"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,176,255,0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={!formData.fullName || !formData.dob || !formData.gender}
                className="w-2/3 bg-[#00B0FF] text-white font-black py-4 rounded-2xl shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pb-6 px-1">
              <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">
                Please Review And Sign
              </h2>
              <p className="text-xs text-slate-500 text-center mb-4">
                By submitting this form I acknowledge and agree to the following:
              </p>

              <div className="bg-white/30 border border-white/60 p-4 rounded-2xl mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Participant:</div>
                  <div className="font-bold text-slate-800">{formData.fullName}</div>

                  <div className="text-slate-500 font-bold uppercase text-[10px]">DOB:</div>
                  <div className="font-bold text-slate-800">
                    {formData.dob ? format(formData.dob, 'dd/MM/yyyy') : ''}
                    {formData.dob ? ` (Age ${calculateAge(formData.dob)})` : ''}
                  </div>

                  <div className="text-slate-500 font-bold uppercase text-[10px]">Gender:</div>
                  <div className="font-bold text-slate-800">{formData.gender}</div>

                  <div className="text-slate-500 font-bold uppercase text-[10px]">Mobile:</div>
                  <div className="font-bold text-slate-800">+{formData.mobile}</div>
                </div>
              </div>

              <div
                className="bg-white/20 border border-white/40 rounded-2xl p-4 h-40 md:h-48 overflow-y-auto text-[11px] text-slate-600 whitespace-pre-wrap mb-4 scrollbar-hide text-justify font-sans"
                dangerouslySetInnerHTML={{ __html: WAIVER_TEXT }}
              />

              <div className="flex items-center space-x-3 mb-6 px-1 group cursor-pointer" onClick={() => setFormData({ ...formData, agreed: !formData.agreed })}>
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.agreed ? 'bg-[#FF1493] border-[#FF1493]' : 'border-slate-300 bg-white'}`}>
                  {formData.agreed && <Check size={16} className="text-white" strokeWidth={4} />}
                </div>
                <label htmlFor="agreed" className="text-[11px] font-bold text-slate-700 leading-tight cursor-pointer select-none">
                  I have read and agree to the Terms & Conditions and Waiver Agreement.
                </label>
              </div>

              <div className="bg-white/30 border-2 border-dashed border-[#FF1493]/30 rounded-2xl p-2 relative touch-none">
                <div className="absolute top-2 left-3 text-[10px] text-[#FF1493] font-black uppercase">Sign Here</div>
                <button
                  onClick={handleClearSignature}
                  className="absolute top-2 right-2 text-[10px] text-white bg-[#FF1493] px-3 py-1 rounded-full font-bold hover:scale-110 transition-all z-10 uppercase"
                >
                  Clear
                </button>
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="#000"
                  canvasProps={{
                    className: 'w-full h-32 cursor-crosshair rounded-xl mt-6 touch-none'
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/40 bg-white/20 -mx-6 -mb-6 p-6 md:-mx-8 md:-mb-8 md:p-8 rounded-b-[2rem] md:rounded-b-[2.5rem]">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBack}
                className="w-1/3 py-4 text-slate-600 bg-white/40 border border-white/60 font-bold rounded-2xl hover:bg-white/60 transition-all uppercase tracking-wider"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={formData.agreed && !loading ? { scale: 1.05, boxShadow: '0 10px 25px rgba(255,20,147,0.3)' } : {}}
                whileTap={formData.agreed && !loading ? { scale: 0.95 } : {}}
                onClick={handleSubmit}
                disabled={!formData.agreed || loading}
                className="w-2/3 bg-[#FF1493] text-white font-black py-4 rounded-2xl shadow-lg transition-all uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "SUBMIT WAIVER"
                )}
              </motion.button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200"
            >
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>

            <h2 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">
              AWESOME!
            </h2>
            <p className="text-slate-500 mb-2 max-w-xs font-medium leading-relaxed">
              Your waiver has been successfully submitted. <br />
              <span className="text-[#FF1493]">Time to jump and fly!</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-4 italic animate-pulse">
              Redirecting to home in a moment...
            </p>
          </motion.div>
        );
      case 5: // PDF Preview Step
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center py-2"
          >
            <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight uppercase">
              Preview <span className="text-[#FF1493]">Waiver</span>
            </h2>

            <div className="w-full h-[45vh] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner mb-6 relative group">
              {pdfPreviewUrl ? (
                <div className="w-full h-full relative overflow-hidden bg-white">
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfPreviewUrl)}&embedded=true`}
                    className="absolute inset-0 w-full h-full border-none"
                    title="Waiver Preview"
                  />
                  {/* Overlay to catch clicks and prevent jumping out on mobile */}
                  <div className="absolute inset-0 z-10 pointer-events-none" />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 font-bold uppercase text-xs tracking-widest">
                  Loading Preview...
                </div>
              )}
            </div>

            <div className="flex flex-col w-full gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadPDF}
                className="w-full bg-[#FF1493] text-white font-black py-4 rounded-2xl shadow-lg transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download PDF
              </motion.button>

              <button
                onClick={() => setStep(4)}
                className="w-full py-3 text-slate-400 font-bold uppercase text-xs tracking-[0.2em] hover:text-slate-600 transition-colors"
              >
                Skip & Finish
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4 relative overflow-hidden safe-area-padding">
      <style dangerouslySetInnerHTML={{
        __html: `
        .safe-area-padding {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
        @media screen and (max-width: 768px) {
          input { font-size: 16px !important; }
        }
      `}} />
      <AntiGravityBackground />
      <Toaster position="top-center" reverseOrder={false} />

      {/* Home Icon Button - Positioned at Screen Right Corner */}
      <button
        onClick={() => navigate('/login')}
        className="fixed top-6 right-6 z-50 p-4 bg-white/40 hover:bg-white/60 backdrop-blur-lg rounded-2xl border border-white/60 text-[#FF1493] transition-all shadow-xl hover:scale-110 active:scale-95 group"
        title="Login"
      >
        <Home size={28} className="group-hover:rotate-12 transition-transform" />
      </button>

      <div className="w-full max-w-md relative z-10 animate-bounce-in px-4 md:px-0 flex flex-col justify-center max-h-full py-4">
        {/* Main White Glass Card */}
        <div className={`glass-card w-full box-border rounded-[2rem] md:rounded-[2.5rem] flex flex-col relative max-h-[85vh] scrollbar-hide ${step === 3 ? 'overflow-hidden h-[80vh]' : 'overflow-y-auto p-6 md:p-8'}`}>
          <div className={`${step === 3 ? 'p-6 md:p-8 flex flex-col h-full' : ''}`}>
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 md:mt-8 text-center animate-bounce-in opacity-50" style={{ animationDelay: '0.5s' }}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Powered by <span className="text-[#FF1493] font-black">Botivate</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RebounceForm;


