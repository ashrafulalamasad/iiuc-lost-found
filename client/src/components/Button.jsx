import { Link } from "react-router-dom";

const Button = ({
  children,
  onClick,
  to,
  icon: Icon,
  type = "button",
  disabled = false,
  className = "",
  size = "normal",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  hoverBgColor = "bg-blue-700",
  hoverTextColor = "group-hover/btn:text-white",

  ...props
}) => {
  
  const sizeClasses = {
    small: "px-4 py-2 text-xs",
    normal: "px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base",
    large: "px-10 py-5 text-lg",
  };

  const standardClasses = [
    "group/btn relative inline-flex items-center justify-center gap-2",
    "font-semibold rounded-full",
    "overflow-hidden transition-all duration-300 transform hover:scale-105",
    "shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2",

    sizeClasses[size] || sizeClasses.normal,

    bgColor,
    textColor,
    disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
    
    className,
  ].filter(Boolean).join(" ");

  const content = (
    <>
      <span
        className={`absolute inset-0 ${hoverBgColor} pointer-events-none transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left`}
      />
      <span className={`relative flex items-center justify-center gap-2 transition-colors duration-300 ${hoverTextColor}`}>
        {Icon && <Icon size={size === "small" ? 16 : 20} />}
        {children}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={standardClasses} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={standardClasses} {...props}>
      {content}
    </button>
  );
};

export default Button;
