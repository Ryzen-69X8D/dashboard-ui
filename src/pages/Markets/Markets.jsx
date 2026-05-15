import { Activity, Building2, CandlestickChart } from "lucide-react";
import GlassCard from "../../components/ui/GlassCard";
import MiniChart from "../../components/ui/MiniChart";
import { useStockData } from "../../hooks/useStockData";

const sectors = [
  { name: "Banking", value: -0.21 },
  { name: "Energy", value: 1.08 },
  { name: "Information Technology", value: 0.35 },
  { name: "FMCG", value: 0.12 },
  { name: "Auto", value: 0.87 },
  { name: "Pharma", value: -0.44 },
];

export default function Markets() {
  const { tickers } = useStockData();

  return (
    <div className="grid gap-5 pb-24 lg:pb-4">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/50">Indices and equities</p>
              <h2 className="text-xl font-black text-white">Market board</h2>
            </div>
            <CandlestickChart className="h-6 w-6 text-mint" aria-hidden="true" />
          </div>

          <div className="mt-5 grid gap-3">
            {tickers.map((item) => {
              const positive = item.changePct >= 0;
              return (
                <div
                  className="grid gap-4 rounded-lg border border-line bg-white/5 p-4 md:grid-cols-[minmax(0,1fr)_140px_180px]"
                  key={item.ticker}
                >
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-white/45">{item.ticker}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/45">Last price</p>
                    <p className="mt-1 font-bold text-white">
                      INR {item.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className={positive ? "text-mint" : "text-rose"}>
                        {positive ? "+" : ""}
                        {item.changePct.toFixed(2)}%
                      </span>
                      <span className="text-sm text-white/45">{item.volume}</span>
                    </div>
                    <MiniChart positive={positive} values={item.sparkline} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber/18 text-amber">
              <Activity className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-white/50">Sector heat</p>
              <h2 className="text-xl font-black text-white">Performance</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {sectors.map((sector) => {
              const width = Math.min(100, Math.abs(sector.value) * 55 + 18);
              const positive = sector.value >= 0;
              return (
                <div key={sector.name}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="text-white/75">{sector.name}</span>
                    <span className={positive ? "text-mint" : "text-rose"}>
                      {positive ? "+" : ""}
                      {sector.value.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/8">
                    <div
                      className={`h-full rounded-full ${positive ? "bg-mint" : "bg-rose"}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {["Market breadth", "Delivery volume", "Volatility"].map((label, index) => (
          <GlassCard className="p-5" key={label}>
            <Building2 className={index === 1 ? "h-5 w-5 text-cyan" : "h-5 w-5 text-mint"} aria-hidden="true" />
            <p className="mt-4 text-sm text-white/50">{label}</p>
            <p className="mt-1 text-2xl font-black text-white">
              {index === 0 ? "34 / 16" : index === 1 ? "1.8x" : "12.4"}
            </p>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}
