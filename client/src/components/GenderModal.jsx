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
    <div className="modal-overlay" style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      paddingTop: '6rem',
      zIndex: 99999,
      overflowY: 'auto'
    }}>
      <div className="modal-container" style={{ maxWidth: '500px' }}>
        <div className="modal-header" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1.5rem',
          borderRadius: '12px 12px 0 0'
        }}>
          <h2 style={{ 
            color: 'white', 
            fontSize: '1.5rem', 
            fontWeight: '600',
            margin: 0 
          }}>
            Complete Your Profile
          </h2>
        </div>
        
        <div className="modal-body" style={{ padding: '2rem' }}>
          <p style={{ 
            fontSize: '1rem', 
            color: '#4a5568', 
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Welcome, <strong>{userName || 'Student'}</strong>! Please select your gender to continue using the IIUC Lost & Found system.
          </p>
          
          {/* Gender Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.95rem', 
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '0.75rem'
            }}>
              Select Gender *
            </label>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label 
                style={{ 
                  flex: 1,
                  padding: '1rem',
                  border: selectedGender === 'MALE' ? '2px solid #667eea' : '2px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: selectedGender === 'MALE' ? '#f7fafc' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                <input 
                  type="radio" 
                  name="gender" 
                  value="MALE"
                  checked={selectedGender === 'MALE'}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span>♂ Male</span>
              </label>
              
              <label 
                style={{ 
                  flex: 1,
                  padding: '1rem',
                  border: selectedGender === 'FEMALE' ? '2px solid #667eea' : '2px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: selectedGender === 'FEMALE' ? '#f7fafc' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                <input 
                  type="radio" 
                  name="gender" 
                  value="FEMALE"
                  checked={selectedGender === 'FEMALE'}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span>♀ Female</span>
              </label>
            </div>
          </div>
          
          {/* Warning Box */}
          <div style={{ 
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚠️</span>
              <div>
                <h4 style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: '600', 
                  color: '#92400e',
                  marginBottom: '0.5rem'
                }}>
                  Important Notice
                </h4>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#78350f', 
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  As this is an Islamic university, gender information is required to ensure compliance with university policies. Any misconduct, misrepresentation, or violation of university rules will result in <strong>strict disciplinary action</strong>.
                </p>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedGender || isUpdating}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: selectedGender && !isUpdating
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : '#cbd5e0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: selectedGender && !isUpdating ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              opacity: isUpdating ? 0.7 : 1
            }}
          >
            {isUpdating ? 'Saving...' : 'Continue'}
          </button>
          
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#718096', 
            textAlign: 'center',
            marginTop: '1rem',
            marginBottom: 0
          }}>
            By continuing, you acknowledge that you have read and understood the university policies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenderModal;
