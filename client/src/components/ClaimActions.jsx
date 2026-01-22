import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, CheckCircle, X, AlertCircle, Clock, MessageCircle } from 'lucide-react';

// Claim status constants
export const CLAIM_STATUS = {
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  FINDER_CONFIRMED: 'FINDER_CONFIRMED', // Finder marked as solved, waiting for owner confirmation
  SOLVED: 'SOLVED'
};

export default function ClaimActions({ report, claim, currentUserId, onClaimItem, onCancelClaim, onMarkSolved, onRejectClaim, onOwnerConfirm, isOppositeGender }) {
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showMessageWarning, setShowMessageWarning] = useState(false);

  const isFinder = currentUserId === report?.finderId;
  const isClaimer = claim && currentUserId === claim?.claimerId;
  const isOtherUser = claim && !isFinder && !isClaimer;
  
  // Check if location requires meeting with finder
  const requiresMeeting = report?.destination === 'With Me (Self)';
  const isDesignatedLocation = !requiresMeeting;
  
  // Treat cancelled/rejected claims as "no active claim" - item can be claimed again
  const isInactiveClaim = claim && (claim.status === CLAIM_STATUS.CANCELLED || claim.status === CLAIM_STATUS.REJECTED);
  const hasActiveClaim = claim && !isInactiveClaim;

  // Handler wrappers with confirmation dialogs
  const handleCancelClaim = () => {
    setShowCancelDialog(true);
  };

  const confirmCancelClaim = () => {
    setShowCancelDialog(false);
    onCancelClaim?.();
  };

  const handleRejectClaim = () => {
    setShowRejectDialog(true);
  };

  const confirmRejectClaim = () => {
    setShowRejectDialog(false);
    onRejectClaim?.();
  };

  const handleSendMessage = () => {
    setShowMessageWarning(true);
  };

  const confirmSendMessage = () => {
    setShowMessageWarning(false);
    navigate(`/chat/${claim.id}`);
  };

  // Render content based on state
  let content = null;

  // No active claim - Show Claim button (not for finder)
  // Also treat cancelled/rejected claims as "no claim" so item can be claimed again
  if (!claim || isInactiveClaim) {
    if (isFinder) {
      content = null; // Show nothing for finder until someone claims
    } else {
      content = (
        <div className="flex gap-3">
          <button
            onClick={onClaimItem}
            className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 bg-green-600 text-black rounded-xl text-lg max-[400px]:text-sm font-bold cursor-pointer hover:bg-black hover:text-white active:scale-[0.98] transition-all shadow-lg hover:shadow-xl border-2 border-black"
          >
            <Tag size={22} strokeWidth={2.5} />
            Claim This Item
          </button>
          <button
            disabled
            className="btn-secondary flex-1 flex items-center justify-center gap-2 py-4 bg-gray-300 text-gray-600 rounded-xl text-lg max-[400px]:text-sm font-bold cursor-not-allowed border-2 border-gray-400"
            title="Claim the item first to send a message"
          >
            <MessageCircle size={22} strokeWidth={2.5} />
            Send Message
          </button>
        </div>
      );
    }
  }

  // Claim exists - Handle different statuses
  // Check boolean flags first since backend uses PENDING status with flags
  if (claim) {
    const finderConfirmed = claim.finderConfirmed;
    const ownerConfirmed = claim.ownerConfirmed;

    // If both confirmed, it's solved (backend should have set SOLVED status)
    if (claim.status === CLAIM_STATUS.SOLVED || (finderConfirmed && ownerConfirmed)) {
      content = (
        <div className="bg-green-50 border-2 border-green-600 rounded-xl p-6 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle size={28} className="text-green-600" strokeWidth={2.5} />
            <h3 className="text-2xl font-bold text-black">Item Returned!</h3>
          </div>
          <p className="text-gray-800 text-sm font-medium">
            This item has been successfully returned to its owner.
          </p>
        </div>
      );
    }

    // Finder has confirmed, waiting for owner
    else if (finderConfirmed && !ownerConfirmed) {
      // Owner/Claimer view - Show Confirm Received button and Message option
      if (isClaimer) {
        content = (
          <div className="space-y-3">
            <div className="bg-green-50 border-2 border-green-600 rounded-xl p-4 text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle size={20} className="text-green-600" strokeWidth={2.5} />
                <h3 className="text-lg font-bold text-black">
                  {requiresMeeting ? 'Finder Confirmed Handover!' : 'Item Available for Collection!'}
                </h3>
              </div>
              <p className="text-gray-800 text-sm font-medium">
                {requiresMeeting 
                  ? 'The finder has confirmed the handover. Please confirm you received it.'
                  : `The item is at ${report.destination}. Please collect it and confirm.`}
              </p>
            </div>

            <button
              onClick={onOwnerConfirm}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-black rounded-xl text-lg font-bold hover:bg-black hover:text-white active:scale-[0.98] transition-all shadow-lg hover:shadow-xl border-2 border-black"
            >
              <CheckCircle size={22} strokeWidth={2.5} />
              {requiresMeeting ? 'Confirm Received from Finder' : 'Confirm Collected from Location'}
            </button>

            <button
              onClick={handleSendMessage}
              className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl font-bold hover:bg-green-600 hover:text-black active:scale-[0.98] transition-all border-2 border-gray-400 shadow-lg"
            >
              <MessageCircle size={20} strokeWidth={2.5} />
              Message Finder
            </button>
          </div>
        );
      }

      // Finder view - Show waiting for owner confirmation with message option
      else if (isFinder) {
        content = (
          <div className="space-y-3">
            <div className="bg-gray-100 border-2 border-gray-400 rounded-xl p-4 text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock size={20} className="text-gray-700" strokeWidth={2.5} />
                <h3 className="text-lg font-bold text-black">Waiting for Owner</h3>
              </div>
              <p className="text-gray-800 text-sm font-medium">
                {requiresMeeting
                  ? "You've confirmed the handover. Waiting for the owner to confirm they received it."
                  : `You've confirmed the item is at ${report.destination}. Waiting for owner to collect and confirm.`}
              </p>
            </div>

            <button
              onClick={handleSendMessage}
              className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl font-bold hover:bg-green-600 hover:text-black active:scale-[0.98] transition-all border-2 border-gray-400 shadow-lg"
            >
              <MessageCircle size={20} strokeWidth={2.5} />
              Message Claimer
            </button>
          </div>
        );
      }

      // Other users
      else {
        content = (
          <div className="bg-gray-100 border-2 border-gray-400 rounded-xl p-4 text-center shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock size={20} className="text-gray-700" strokeWidth={2.5} />
              <h3 className="text-lg font-bold text-black">Being Returned</h3>
            </div>
            <p className="text-gray-800 text-sm font-medium">
              This item is being returned to its owner.
            </p>
          </div>
        );
      }
    }

    // Regular PENDING status (no confirmations yet)
    else if (claim.status === CLAIM_STATUS.PENDING) {
      // Claimer view - Show Cancel Claim and Send Message
      if (isClaimer) {
        content = (
          <div className="space-y-3">
            <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-4 text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock size={20} className="text-amber-600" strokeWidth={2.5} />
                <h3 className="text-lg font-bold text-black">Claim Pending</h3>
              </div>
              <p className="text-gray-800 text-sm font-medium">
                {requiresMeeting 
                  ? 'Contact the finder to arrange collection. Waiting for finder to confirm handover.'
                  : `The item is at ${report.destination}. Collect it and wait for finder confirmation.`}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSendMessage}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl font-bold hover:bg-green-600 hover:text-black active:scale-[0.98] transition-all shadow-lg border-2 border-gray-400"
              >
                <MessageCircle size={20} strokeWidth={2.5} />
                Send Message
                </button>
                
                <button
                  onClick={handleCancelClaim}
                  className="btn-outline flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-red-500 text-red-600 rounded-xl font-bold hover:bg-red-50 active:scale-[0.98] transition-all shadow-lg"
                >
                  <X size={20} strokeWidth={2.5} />
                  Cancel Claim
                </button>
              </div>
            </div>
        );
      }

      // Finder view - Show Mark Solved + Reject + Message buttons
      else if (isFinder) {
        content = (
          <div className="space-y-3">
            <div className="bg-green-50 border-2 border-green-600 rounded-xl p-4 text-center shadow-lg">
              <p className="text-sm text-gray-800 font-bold">
                {requiresMeeting
                  ? 'Someone claimed this item. Verify their identity and hand over the item.'
                  : `Someone claimed this item. Confirm that you have left it at ${report.destination}.`}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onMarkSolved}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-black rounded-xl font-bold hover:bg-black hover:text-white active:scale-[0.98] transition-all shadow-lg border-2 border-black"
              >
                <CheckCircle size={20} strokeWidth={2.5} />
                {requiresMeeting ? 'Item Handed Over' : 'Item at Location'}
              </button>
              
              <button
                onClick={handleRejectClaim}
                className="btn-danger flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg border-2 border-red-700"
              >
                <X size={20} strokeWidth={2.5} />
                Reject Claim
              </button>
            </div>

            <button
              onClick={handleSendMessage}
              className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl font-bold hover:bg-green-600 hover:text-black active:scale-[0.98] transition-all shadow-lg border-2 border-gray-400"
            >
              <MessageCircle size={20} strokeWidth={2.5} />
              Message Claimer
            </button>
          </div>
        );
      }

      // Other users - Show disabled status
      else if (isOtherUser) {
        content = (
          <div className="bg-gray-100 border-2 border-gray-400 rounded-xl p-4 text-center shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock size={20} className="text-gray-700" strokeWidth={2.5} />
              <h3 className="text-lg font-bold text-black">Already Claimed</h3>
            </div>
            <p className="text-gray-800 text-sm font-medium">
              This item has been claimed by someone else.
            </p>
          </div>
        );
      }
    }
  }

  return (
    <>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {content}
      </div>

      {/* Message Warning Dialog */}
      {showMessageWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border-2 border-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <div className="flex items-start gap-4 mb-6">
              <div className={`p-3 rounded-full ${
                isOppositeGender ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <AlertCircle size={24} className={isOppositeGender ? 'text-red-600' : 'text-gray-700'} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-black mb-2">
                  {isOppositeGender ? 'Opposite Gender Warning' : 'Important Notice'}
                </h3>
                <p className="text-gray-800 text-sm leading-relaxed font-medium">
                  {isOppositeGender ? (
                    <>
                      You are about to send a message to someone of the <strong>opposite gender</strong>. 
                      Please follow <strong>university guidelines regarding male–female interaction</strong>. 
                      Any violation of the policy may result in <strong>disciplinary action</strong>. 
                      All conversations are monitored by administrators.
                    </>
                  ) : (
                    <>
                      Please be respectful in your communication. All chats are <strong>monitored by administrators </strong> 
                      to ensure compliance with university policies. Do not share inappropriate content or violate 
                      any university guidelines.
                    </>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowMessageWarning(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-black rounded-xl font-bold hover:bg-gray-200 transition-colors border-2 border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmSendMessage}
                className={`flex-1 px-4 py-3 text-white rounded-xl font-bold transition-colors border-2 ${
                  isOppositeGender 
                    ? 'bg-red-600 hover:bg-red-700 border-red-700' 
                    : 'bg-black hover:bg-green-600 hover:text-black border-gray-400'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border-2 border-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-amber-100 rounded-full">
                <AlertCircle size={24} className="text-amber-600" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-black mb-2">Cancel Claim?</h3>
                <p className="text-gray-800 text-sm font-medium">
                  Are you sure you want to cancel your claim? The item will become available for others to claim.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-black rounded-xl font-bold hover:bg-gray-200 transition-colors border-2 border-gray-400"
              >
                Keep Claim
              </button>
              <button
                onClick={confirmCancelClaim}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors border-2 border-red-700"
              >
                Cancel Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border-2 border-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle size={24} className="text-red-600" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-black mb-2">Reject Claim?</h3>
                <p className="text-gray-800 text-sm font-medium">
                  Are you sure you want to reject this claim? The claimer will be notified and the item will become available again.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectDialog(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-black rounded-xl font-bold hover:bg-gray-200 transition-colors border-2 border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejectClaim}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors border-2 border-red-700"
              >
                Reject Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
