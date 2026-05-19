import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import 'react-phone-input-2/lib/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import AntiGravityBackground from '../components/AntiGravityBackground';
import { supabase } from '../supabase';
import { Step1, Step2, Step3, Step4, Step5 } from '../components/RebounceFormSteps';
import BotivateFooter from '../components/BotivateFooter';

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
    setStep(4);
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const diff = Date.now() - dob.getTime();
    const age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
  };

  // Pre-fetch user data as they type
  useEffect(() => {
    const fetchExistingUser = async () => {
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

  // Handle high-precision responsive scaling for the Signature Canvas to prevent distortion/offset
  useEffect(() => {
    if (step === 3 && sigCanvas.current) {
      const canvas = sigCanvas.current.getCanvas();
      if (canvas) {
        const resizeCanvas = () => {
          const ratio = Math.max(window.devicePixelRatio || 1, 1);
          const width = canvas.offsetWidth;
          const height = canvas.offsetHeight;
          if (width > 0 && height > 0) {
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
            sigCanvas.current.clear(); // initialize backing store with correct size
          }
        };

        // Delay slightly to let the glass-card transition/render settle
        const timer = setTimeout(resizeCanvas, 150);

        window.addEventListener('resize', resizeCanvas);
        return () => {
          clearTimeout(timer);
          window.removeEventListener('resize', resizeCanvas);
        };
      }
    }
  }, [step]);


  const generatePDF = (data) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    doc.setFontSize(10);
    doc.text(`--Participant: ${data.fullName}`, margin, 40);
    doc.text(`Signed By: ${data.fullName}`, margin, 48);
    doc.text(`Signed: ${format(new Date(data.submittedAt), 'd/M/yyyy HH:mm')}`, margin, 56);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Participant Agreement, Release and Assumption of Risk Agreement", pageWidth / 2, 75, { align: 'center' });
    doc.text("(REBOUNCE RAIPUR LLP)", pageWidth / 2, 82, { align: 'center' });

    let yPos = 95;
    const pageHeight = doc.internal.pageSize.getHeight();
    const lines = WAIVER_TEXT.split('\n');

    lines.forEach(line => {
      if (!line.trim()) {
        yPos += 5;
        return;
      }
      const hasBold = line.includes('<strong>');
      if (hasBold) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        const cleanLine = line.replace(/<strong>/g, '').replace(/<\/strong>/g, '');
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

    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = margin;
    }
    yPos += 10;
    doc.rect(margin, yPos, contentWidth / 2, 60);
    doc.rect(margin + contentWidth / 2, yPos, contentWidth / 2, 60);
    doc.setFont("helvetica", "bold");
    doc.text("PARTICIPANT", margin + 5, yPos - 3);
    doc.text("Participant Signature", margin + contentWidth / 2 + 5, yPos - 3);
    doc.setFont("helvetica", "normal");
    doc.text(`Date Of Birth: ${data.dob ? format(new Date(data.dob), 'dd/MM/yyyy') : ''} (Age ${calculateAge(new Date(data.dob))})`, margin + 5, yPos + 10);
    doc.text(`Full Name: ${data.fullName}`, margin + 5, yPos + 20);
    doc.text(`Gender: ${data.gender}`, margin + 5, yPos + 30);
    doc.text(`Contact Number: ${data.mobile}`, margin + 5, yPos + 40);
    doc.text(`Email: ${data.email || 'N/A'}`, margin + 5, yPos + 50);

    if (data.signature) {
      doc.addImage(data.signature, 'PNG', margin + contentWidth / 2 + 10, yPos + 5, contentWidth / 2 - 20, 50);
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      const footerText = "Powered by Botivate";
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
      toast.error("Please provide a signature first.");
      return;
    }
    const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    const finalData = { ...formData, signature: signatureData, submittedAt: new Date().toISOString() };
    setLoading(true);

    try {
      const pdfBlob = generatePDF(finalData);
      const fileName = `waiver_${Date.now()}_${formData.fullName.replace(/\s+/g, '_')}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('wavier').upload(fileName, pdfBlob, { contentType: 'application/pdf' });

      if (uploadError) throw uploadError;

      const pdfUrl = uploadData ? supabase.storage.from('wavier').getPublicUrl(uploadData.path).data.publicUrl : null;

      const { error: supabaseError } = await supabase.from('submissions').insert([{
        full_name: formData.fullName, email: formData.email, mobile: formData.mobile,
        dob: formData.dob ? format(formData.dob, 'yyyy-MM-dd') : null,
        gender: formData.gender, signature: signatureData, agreed: formData.agreed,
        submitted_at: finalData.submittedAt, pdf_url: pdfUrl
      }]);

      if (supabaseError) throw supabaseError;

      setPdfBlob(pdfBlob);
      setPdfPreviewUrl(pdfUrl || URL.createObjectURL(pdfBlob));
      toast.success("Waiver saved successfully!");
      setStep(5);
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.message || "Failed to submit waiver.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 formData={formData} setFormData={setFormData} onNext={handleNext} loading={loading} />;
      case 2: return <Step2 formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;
      case 3: return <Step3 formData={formData} setFormData={setFormData} onBack={handleBack} onSubmit={handleSubmit} sigCanvas={sigCanvas} loading={loading} waiverText={WAIVER_TEXT} calculateAge={calculateAge} />;
      case 4: return <Step4 />;
      case 5: return <Step5 pdfPreviewUrl={pdfPreviewUrl} onDownload={downloadPDF} onSkip={() => setStep(4)} />;
      default: return null;
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4 relative overflow-hidden safe-area-padding">
      <style dangerouslySetInnerHTML={{ __html: `
        .safe-area-padding { padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom); }
        @media screen and (max-width: 768px) { input { font-size: 16px !important; } }
      `}} />
      <AntiGravityBackground />
      <Toaster position="top-center" />

      <button
        onClick={() => navigate('/login')}
        className="fixed top-6 right-6 z-50 p-4 bg-white/40 hover:bg-white/60 backdrop-blur-lg rounded-2xl border border-white/60 text-[#FF1493] transition-all shadow-xl hover:scale-110 active:scale-95 group"
        title="Login"
      >
        <Home size={28} className="group-hover:rotate-12 transition-transform" />
      </button>

      <div className="w-full max-w-md md:max-w-2xl relative z-10 animate-bounce-in px-4 md:px-0 flex flex-col justify-center max-h-full py-4">
        <div className={`glass-card w-full box-border rounded-[2rem] md:rounded-[2.5rem] flex flex-col relative max-h-[85vh] scrollbar-hide ${step === 3 ? 'overflow-hidden h-[80vh] md:h-auto' : 'overflow-y-auto p-6 md:p-8'}`}>
          <div className={`${step === 3 ? 'p-6 md:p-8 flex flex-col h-full md:h-auto' : ''}`}>
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>
        </div>
        <BotivateFooter variant="simple" />
      </div>
    </div>
  );
};

export default RebounceForm;
