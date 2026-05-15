const variants = {
  primary: "bg-mint text-ink hover:bg-[#65f0c7]",
  secondary: "border border-line bg-white/5 text-white hover:bg-white/10",
  danger: "border border-rose/40 bg-rose/15 text-rose hover:bg-rose/25",
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  icon: Icon,
  type = "button",
  ...props
}) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`}
      type={type}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
