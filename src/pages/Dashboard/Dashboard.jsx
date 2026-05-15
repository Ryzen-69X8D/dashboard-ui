import { ArrowDownRight, ArrowUpRight, BriefcaseBusiness, IndianRupee, RadioTower } from "lucide-react";
import PredictForm from "../../components/forms/PredictForm";
import GlassCard from "../../components/ui/GlassCard";
import MiniChart from "../../components/ui/MiniChart";
import { useStockData } from "../../hooks/useStockData";

function formatInr(value) {
  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function ChangeBadge({ value }) {
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${
        positive ? "bg-mint/12 text-mint" : "bg-rose/12 text-rose"
      }`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

export default function Dashboard() {
  const { tickers, movers } = useStockData();
  const [nifty, reliance, tcs, infy] = tickers;

  return (
    <div className="grid gap-5 pb-24 lg:pb-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tickers.slice(0, 4).map((item) => (
          <GlassCard className="p-4" key={item.ticker}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white/58">{item.name}</p>
                <h2 className="mt-1 truncate text-xl font-black text-white">{item.ticker}</h2>
              </div>
              <ChangeBadge value={item.changePct} />
            </div>
            <p className="mt-4 text-2xl font-black text-white">INR {formatInr(item.price)}</p>
            <div className="mt-4">
              <MiniChart positive={item.changePct >= 0} values={item.sparkline} />
            </div>
          </GlassCard>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
        <GlassCard className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white/50">Live tape</p>
              <h2 className="text-xl font-black text-white">Market overview</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/6 px-3 py-2 text-sm text-white/70">
              <RadioTower className="h-4 w-4 text-mint" aria-hidden="true" />
              Polling
            </div>
          </div>

          <div className="mt-5 overflow-x-auto thin-scrollbar">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase text-white/42">
                  <th className="pb-3 font-semibold">Ticker</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold">Change</th>
                  <th className="pb-3 font-semibold">Volume</th>
                  <th className="pb-3 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {tickers.map((item) => (
                  <tr className="border-b border-line/70 last:border-0" key={item.ticker}>
                    <td className="py-4">
                      <p className="font-bold text-white">{item.ticker}</p>
                      <p className="text-sm text-white/45">{item.name}</p>
                    </td>
                    <td className="py-4 font-semibold text-white">INR {formatInr(item.price)}</td>
                    <td className="py-4">
                      <ChangeBadge value={item.changePct} />
                    </td>
                    <td className="py-4 text-white/70">{item.volume}</td>
                    <td className="py-4">
                      <div className="w-36">
                        <MiniChart positive={item.changePct >= 0} values={item.sparkline} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-4">
            <p className="text-sm text-white/50">autoData engine</p>
            <h2 className="text-xl font-black text-white">Next close</h2>
          </div>
          <PredictForm compact />
        </GlassCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <GlassCard className="p-5">
          <h2 className="text-lg font-black text-white">Top gainers</h2>
          <div className="mt-4 grid gap-3">
            {movers.gainers.map((item, index) => (
              <div className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3" key={item.ticker}>
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/7 text-sm text-white/60">
                  {index + 1}
                </span>
                <span className="truncate font-semibold text-white">{item.ticker}</span>
                <ChangeBadge value={item.changePct} />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="text-lg font-black text-white">Top losers</h2>
          <div className="mt-4 grid gap-3">
            {movers.losers.map((item, index) => (
              <div className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3" key={item.ticker}>
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/7 text-sm text-white/60">
                  {index + 1}
                </span>
                <span className="truncate font-semibold text-white">{item.ticker}</span>
                <ChangeBadge value={item.changePct} />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/50">Portfolio summary</p>
              <h2 className="text-lg font-black text-white">Allocation</h2>
            </div>
            <BriefcaseBusiness className="h-5 w-5 text-amber" aria-hidden="true" />
          </div>
          <div className="mt-5 flex items-center gap-5">
            <div className="h-24 w-24 rounded-full bg-[conic-gradient(#3DE7B3_0_44%,#42D9F5_44%_70%,#F7B955_70%_86%,#FF6978_86%_100%)]" />
            <div>
              <p className="text-sm text-white/50">Book value</p>
              <p className="mt-1 flex items-center gap-1 text-2xl font-black text-white">
                <IndianRupee className="h-5 w-5 text-mint" aria-hidden="true" />
                24.65L
              </p>
              <p className="mt-2 text-sm text-mint">+1.42% today</p>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
