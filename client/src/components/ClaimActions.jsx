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

export default function ClaimActions({ report, claim, currentUserId, onClaimItem, onCancelClaim, onMarkSolved, onRejectClaim, onOwnerConfirm }) {
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

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

  // No active claim - Show Claim button (not for finder)
  // Also treat cancelled/rejected claims as "no claim" so item can be claimed again
  if (!claim || isInactiveClaim) {
    if (isFinder) {
      return null; // Show nothing for finder until someone claims
    }

    return (
      <div className="flex gap-3">
        <button
          onClick={onClaimItem}
          className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-full text-lg font-bold cursor-pointer hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
        >
          <Tag size={22} />
          Claim This Item
        </button>
        <button
          disabled
          className="btn-secondary flex-1 flex items-center justify-center gap-2 py-4 bg-gray-300 text-gray-500 rounded-full text-lg font-bold cursor-not-allowed"
          title="Claim the item first to send a message"
        >
          <MessageCircle size={22} />
          Send Message
        </button>
      </div>
    );
  }

  // Claim exists - Handle different statuses
  // Check boolean flags first since backend uses PENDING status with flags
  const finderConfirmed = claim.finderConfirmed;
  const ownerConfirmed = claim.ownerConfirmed;

  // If both confirmed, it's solved (backend should have set SOLVED status)
  if (claim.status === CLAIM_STATUS.SOLVED || (finderConfirmed && ownerConfirmed)) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-4xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle size={28} className="text-green-600" />
          <h3 className="text-2xl font-bold text-green-900">Item Returned!</h3>
        </div>
        <p className="text-green-700 text-sm">
          This item has been successfully returned to its owner.
        </p>
      </div>
    );
  }

  // Finder has confirmed, waiting for owner
  if (finderConfirmed && !ownerConfirmed) {
    // Owner/Claimer view - Show Confirm Received button and Message option
    if (isClaimer) {
      return (
        <div className="space-y-3">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle size={20} className="text-green-600" />
              <h3 className="text-lg font-bold text-green-900">
                {requiresMeeting ? 'Finder Confirmed Handover!' : 'Item Available for Collection!'}
              </h3>
            </div>
            <p className="text-green-700 text-sm">
              {requiresMeeting 
                ? 'The finder has confirmed the handover. Please confirm you received it.'
                : `The item is at ${report.destination}. Please collect it and confirm.`}
            </p>
          </div>

          <button
            onClick={onOwnerConfirm}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-xl text-lg font-bold hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
          >
            <CheckCircle size={22} />
            {requiresMeeting ? 'Confirm Received from Finder' : 'Confirm Collected from Location'}
          </button>

          <button
            onClick={() => navigate(`/chat/${claim.id}`)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            <MessageCircle size={20} />
            Message Finder
          </button>
        </div>
      );
    }

    // Finder view - Show waiting for owner confirmation with message option
    if (isFinder) {
      return (
        <div className="space-y-3">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock size={20} className="text-blue-600" />
              <h3 className="text-lg font-bold text-blue-900">Waiting for Owner</h3>
            </div>
            <p className="text-blue-700 text-sm">
              {requiresMeeting
                ? "You've confirmed the handover. Waiting for the owner to confirm they received it."
                : `You've confirmed the item is at ${report.destination}. Waiting for owner to collect and confirm.`}
            </p>
          </div>

          <button
            onClick={() => navigate(`/chat/${claim.id}`)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            <MessageCircle size={20} />
            Message Claimer
          </button>
        </div>
      );
    }

    // Other users
    return (
      <div className="bg-slate-100 border-2 border-slate-200 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock size={20} className="text-slate-500" />
          <h3 className="text-lg font-bold text-slate-700">Being Returned</h3>
        </div>
        <p className="text-slate-600 text-sm">
          This item is being returned to its owner.
        </p>
      </div>
    );
  }

  // Regular PENDING status (no confirmations yet)
  switch (claim.status) {
    case CLAIM_STATUS.PENDING:
      // Claimer view - Show Cancel Claim and Send Message
      if (isClaimer) {
        return (
          <>
            <div className="space-y-3">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock size={20} className="text-amber-600" />
                  <h3 className="text-lg font-bold text-amber-900">Claim Pending</h3>
                </div>
                <p className="text-amber-700 text-sm">
                  {requiresMeeting 
                    ? 'Contact the finder to arrange collection. Waiting for finder to confirm handover.'
                    : `The item is at ${report.destination}. Collect it and wait for finder confirmation.`}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/chat/${claim.id}`)}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg"
                >
                  <MessageCircle size={20} />
                  Send Message
                </button>
                
                <button
                  onClick={handleCancelClaim}
                  className="btn-outline flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 active:scale-[0.98] transition-all"
                >
                  <X size={20} />
                  Cancel Claim
                </button>
              </div>
            </div>

            {/* Cancel Confirmation Dialog */}
            {showCancelDialog && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-amber-100 rounded-full">
                      <AlertCircle size={24} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Cancel Claim?</h3>
                      <p className="text-slate-600 text-sm">
                        Are you sure you want to cancel your claim? The item will become available for others to claim.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCancelDialog(false)}
                      className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                    >
                      Keep Claim
                    </button>
                    <button
                      onClick={confirmCancelClaim}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                    >
                      Cancel Claim
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      }

      // Finder view - Show Mark Solved + Reject + Message buttons
      if (isFinder) {
        return (
          <>
            <div className="space-y-3">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                <p className="text-sm text-green-700 font-medium">
                  {requiresMeeting
                    ? 'Someone claimed this item. Verify their identity and hand over the item.'
                    : `Someone claimed this item. Confirm that you have left it at ${report.destination}.`}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onMarkSolved}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg"
                >
                  <CheckCircle size={20} />
                  {requiresMeeting ? 'Item Handed Over' : 'Item at Location'}
                </button>
                
                <button
                  onClick={handleRejectClaim}
                  className="btn-danger flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg"
                >
                  <X size={20} />
                  Reject Claim
                </button>
              </div>

              <button
                onClick={() => navigate(`/chat/${claim.id}`)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg"
              >
                <MessageCircle size={20} />
                Message Claimer
              </button>
            </div>

            {/* Reject Confirmation Dialog */}
            {showRejectDialog && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-red-100 rounded-full">
                      <AlertCircle size={24} className="text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Reject Claim?</h3>
                      <p className="text-slate-600 text-sm">
                        Are you sure you want to reject this claim? The claimer will be notified and the item will become available again.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowRejectDialog(false)}
                      className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmRejectClaim}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
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

      // Other users - Show disabled status
      if (isOtherUser) {
        return (
          <div className="bg-slate-100 border-2 border-slate-200 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock size={20} className="text-slate-500" />
              <h3 className="text-lg font-bold text-slate-700">Already Claimed</h3>
            </div>
            <p className="text-slate-600 text-sm">
              This item has been claimed by someone else.
            </p>
          </div>
        );
      }
      break;

    default:
      return null;
  }

  return null;
}
