import React from 'react';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import DatePicker from 'react-datepicker';
import { Check, Download } from 'lucide-react';
import { format } from 'date-fns';
import SignatureCanvas from 'react-signature-canvas';

const inputStyles = "w-full box-border text-left bg-white/40 border border-white/60 rounded-2xl px-4 py-3 outline-none focus:border-[#FF1493] focus:ring-2 focus:ring-[#FF1493]/20 transition-all text-slate-800 placeholder:text-slate-400 backdrop-blur-md shadow-inner text-base md:text-sm";
const labelStyles = "block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider";

export const Step1 = ({ formData, setFormData, onNext, loading }) => (
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
      onClick={onNext}
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

export const Step2 = ({ formData, setFormData, onNext, onBack }) => (
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
        onClick={onBack}
        className="w-1/3 py-4 text-slate-600 bg-white/40 border border-white/60 font-bold rounded-2xl hover:bg-white/60 transition-all uppercase tracking-wider"
      >
        Back
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,176,255,0.2)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        disabled={!formData.fullName || !formData.dob || !formData.gender}
        className="w-2/3 bg-[#00B0FF] text-white font-black py-4 rounded-2xl shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest"
      >
        Continue
      </motion.button>
    </div>
  </motion.div>
);

export const Step3 = ({ formData, setFormData, onBack, onSubmit, sigCanvas, loading, waiverText, calculateAge }) => (
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
        dangerouslySetInnerHTML={{ __html: waiverText }}
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
          onClick={() => sigCanvas.current.clear()}
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
        onClick={onBack}
        className="w-1/3 py-4 text-slate-600 bg-white/40 border border-white/60 font-bold rounded-2xl hover:bg-white/60 transition-all uppercase tracking-wider"
      >
        Back
      </motion.button>
      <motion.button
        whileHover={formData.agreed && !loading ? { scale: 1.05, boxShadow: '0 10px 25px rgba(255,20,147,0.3)' } : {}}
        whileTap={formData.agreed && !loading ? { scale: 0.95 } : {}}
        onClick={onSubmit}
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

export const Step4 = () => (
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

export const Step5 = ({ pdfPreviewUrl, onDownload, onSkip }) => (
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
        onClick={onDownload}
        className="w-full bg-[#FF1493] text-white font-black py-4 rounded-2xl shadow-lg transition-all uppercase tracking-widest flex items-center justify-center gap-2"
      >
        <Download size={20} />
        Download PDF
      </motion.button>

      <button
        onClick={onSkip}
        className="w-full py-3 text-slate-400 font-bold uppercase text-xs tracking-[0.2em] hover:text-slate-600 transition-colors"
      >
        Skip & Finish
      </button>
    </div>
  </motion.div>
);
