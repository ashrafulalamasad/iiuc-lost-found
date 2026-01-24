import "../loading-screen.css";

/**
 * Full-screen loading experience shown while the app boots
 * (Firebase auth restore + backend user sync).
 *
 * IMPORTANT: the markup and styles here are intentionally IDENTICAL to the
 * inline pre-React loader in index.html, so the handoff between the two is
 * completely invisible to the user.
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
      {/* Ambient floating orbs */}
      <span className="ls-orb ls-orb-1" />
      <span className="ls-orb ls-orb-2" />
      <span className="ls-orb ls-orb-3" />
      <span className="ls-grid" />

      <div className="ls-content">
        {/* Radar / sonar animation — "searching" for lost items */}
        <div className="ls-radar">
          <span className="ls-ring" />
          <span className="ls-ring ls-ring-2" />
          <span className="ls-ring ls-ring-3" />
          <span className="ls-sweep" />
          <div className="ls-logo">
            <img src="/search.png" alt="" draggable="false" />
          </div>
        </div>

        <div className="ls-text">
          <h1 className="ls-title">
            IIUC <span className="ls-grad">Lost</span> &amp;{" "}
            <span className="ls-grad">Found</span>
          </h1>
          <p className="ls-tagline">Every lost item has a way home…</p>
        </div>

        <div className="ls-bar">
          <div className="ls-fill" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
