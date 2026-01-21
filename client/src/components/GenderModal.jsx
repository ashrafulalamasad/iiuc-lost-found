import { useState } from 'react';

const GenderModal = ({ onGenderSelect, userName, isUpdating = false }) => {
  const [selectedGender, setSelectedGender] = useState('');

  const handleSubmit = () => {
    if (!selectedGender) {
      alert('Please select your gender');
      return;
    }
    onGenderSelect(selectedGender);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 pt-24 z-99999 overflow-y-auto">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="bg-sky-600 p-6 rounded-t-xl">
          <h2 className="text-white text-2xl font-semibold">
            Complete Your Profile
          </h2>
        </div>
        
        {/* Body */}
        <div className="p-4 sm:p-6 md:p-8">
          <p className="text-slate-800 text-base mb-6 leading-relaxed">
            Welcome, <strong className="text-slate-900">{userName || 'Student'}</strong>! Please select your gender to continue using the IIUC Lost & Found system.
          </p>
          
          {/* Gender Selection */}
          <div className="mb-6">
            <label className="block text-md font-semibold text-slate-800 mb-3">
              Select Gender
            </label>
            
            <div className="flex gap-4">
              <label 
                className={`flex-1 p-4 border-2 rounded-full cursor-pointer transition-all ${
                  selectedGender === 'MALE' 
                    ? 'border-sky-600 bg-sky-50' 
                    : 'border-slate-400 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="MALE"
                    checked={selectedGender === 'MALE'}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-4 h-4 text-sky-600 mr-2"
                  />
                  <span className="text-base font-medium">♂ Male</span>
                </div>
              </label>
              
              <label 
                className={`flex-1 p-4 border-2 rounded-full cursor-pointer transition-all ${
                  selectedGender === 'FEMALE' 
                    ? 'border-sky-600 bg-sky-50' 
                    : 'border-slate-400 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="FEMALE"
                    checked={selectedGender === 'FEMALE'}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-4 h-4 text-sky-600 mr-2"
                  />
                  <span className="text-base font-medium">♀ Female</span>
                </div>
              </label>
            </div>
          </div>
          
          {/* Warning Box */}
          <div className="bg-amber-50 border-2 border-amber-700 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">⚠️</span>
              <div>
                <h4 className="text-sm font-semibold text-amber-900 mb-2">
                  Important Notice
                </h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  As this is an Islamic university, gender information is required to ensure compliance with university policies. Any misconduct, misrepresentation, or violation of university rules will result in <strong>strict disciplinary action</strong>.
                </p>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedGender || isUpdating}
            className={`w-full py-3.5 rounded-full text-md md:text-lg font-semibold transition-all ${
              selectedGender && !isUpdating
                ? 'bg-sky-600 hover:bg-amber-700 text-white hover:text-black cursor-pointer active:scale-[0.98]'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            } ${isUpdating ? 'opacity-70' : ''}`}
          >
            {isUpdating ? 'Saving...' : 'Continue'}
          </button>
          
          <p className="text-sm text-slate-800 text-center mt-4">
            By continuing, you acknowledge that you have read and understood the university policies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenderModal;
