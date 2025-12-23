import { Link } from 'react-router-dom';

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25 border border-transparent",
  secondary: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
  outline: "bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
  success: "bg-green-600 text-white hover:bg-green-700 shadow-sm"
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-8 py-4 text-base"
};

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  to, 
  className = '', 
  children, 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;
  
  const combinedClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClassName} {...props}>
        {Icon && <Icon size={size === 'lg' ? 20 : size === 'sm' ? 14 : 18} />}
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {Icon && <Icon size={size === 'lg' ? 20 : size === 'sm' ? 14 : 18} />}
      {children}
    </button>
  );
}
