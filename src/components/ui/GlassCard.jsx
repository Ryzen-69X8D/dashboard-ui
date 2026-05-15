export default function GlassCard({ children, className = "", as: Component = "section" }) {
  return <Component className={`glass-surface rounded-lg ${className}`}>{children}</Component>;
}
