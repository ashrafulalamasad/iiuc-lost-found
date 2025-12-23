import { Link } from "react-router-dom";

const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  icon: Icon,
  to,

  // Color customization
  bgColor = "bg-blue-600",
  textColor = "text-white",
  hoverBgColor = "bg-blue-700", // Fill color on hover
  hoverTextColor = "text-white", // Text color when hover is active

  // Additional classes if needed
  className = "",

  ...props
}) => {
  // Predefined hover text color mapping to ensure Tailwind generates these classes
  const hoverTextColorMap = {
    "text-black": "group-hover/btn:text-black",
    "text-white": "group-hover/btn:text-white",
    "text-gray-900": "group-hover/btn:text-gray-900",
    "text-gray-800": "group-hover/btn:text-gray-800",
    "text-gray-700": "group-hover/btn:text-gray-700",
    "text-gray-600": "group-hover/btn:text-gray-600",
    "text-indigo-600": "group-hover/btn:text-indigo-600",
    "text-indigo-700": "group-hover/btn:text-indigo-700",
    "text-blue-600": "group-hover/btn:text-blue-600",
    "text-blue-700": "group-hover/btn:text-blue-700",
    "text-red-600": "group-hover/btn:text-red-600",
    "text-green-600": "group-hover/btn:text-green-600",
    "text-yellow-600": "group-hover/btn:text-yellow-600",
    "text-purple-600": "group-hover/btn:text-purple-600",
    "text-pink-600": "group-hover/btn:text-pink-600",
  };

  // Get the correct hover class or fallback to empty string
  const hoverTextClass = hoverTextColorMap[hoverTextColor] || "";

  // Standardized classes - same for all buttons
  const standardClasses = [
    "relative inline-flex items-center justify-center gap-2",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation",
    "overflow-hidden",
    "px-6 py-3 sm:px-8 sm:py-4",
    "text-sm sm:text-base",
    "font-semibold",
    "rounded-full",
    "shadow-lg hover:shadow-2xl",
    "transition-all duration-300",
    "transform hover:scale-105",
    bgColor,
    textColor,
    disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {/* Fill Effect Overlay - always present, pointer-events-none so it doesn't block content */}
      <span
        className={`absolute inset-0 ${hoverBgColor} pointer-events-none transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left`}
      />

      {/* Button Content */}
      <span
        className={`relative flex items-center justify-center gap-2 ${hoverTextClass}`}
      >
        {Icon && <Icon size={20} />}
        {children}
      </span>
    </>
  );

  // If 'to' prop is provided, render as Link
  if (to) {
    return (
      <Link to={to} className={`${standardClasses} group/btn`} {...props}>
        {content}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      className={`${standardClasses} group/btn`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
