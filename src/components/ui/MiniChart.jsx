function buildPath(values, width, height) {
  if (!values?.length) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / spread) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function MiniChart({ values = [], positive = true }) {
  const width = 148;
  const height = 48;
  const path = buildPath(values, width, height);
  const color = positive ? "#3DE7B3" : "#FF6978";

  return (
    <svg className="h-12 w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Price sparkline">
      <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill={color} opacity="0.12" />
      <path d={path} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  );
}
