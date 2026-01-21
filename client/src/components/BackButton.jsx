import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-3xl font-bold text-black hover:text-green-700 mb-8 transition-colors group"
      >
        <ArrowLeft
          size={32}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back
      </button>
    </div>
  );
};

export default BackButton;
