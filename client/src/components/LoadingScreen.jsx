import "../loading-screen.css";

/**
 * Full-screen loading experience shown while the app boots
 * (Firebase auth restore + backend user sync).
 *
 * The markup matches the pre-React loader in index.html so the handoff between
 * the two is completely invisible to the user.
 *
 * Props:
 *  - exiting: boolean -> triggers the fade-out transition
 */
const LoadingScreen = ({ exiting = false }) => {
  return (
    <div
      className={`ls-overlay ${exiting ? "ls-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading IIUC Lost & Found"
    >
      <div className="ls-panel">
        <div className="ls-brand">
          <div className="ls-logo">
            <img src="/iiuc-logo.png" alt="" draggable="false" />
          </div>
          <span className="ls-status-dot" />
        </div>

        <div className="ls-text">
          <h1 className="ls-title">
            IIUC <span>Lost</span> &amp; <span>Found</span>
          </h1>
          <p className="ls-tagline">Getting everything ready for you</p>
        </div>

        <div className="ls-bar">
          <div className="ls-fill" />
        </div>
        <div className="ls-loading-meta">
          <p className="ls-loading-label">Preparing your experience</p>
          <div className="ls-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
