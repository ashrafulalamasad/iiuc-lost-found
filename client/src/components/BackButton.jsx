import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-2xl font-bold text-slate-800 hover:text-indigo-600 mb-8 transition-colors group"
      >
        <ArrowLeft
          size={28}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back
      </button>
    </div>
  );
};

export default BackButton;
