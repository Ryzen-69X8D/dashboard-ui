import { Plus, Trash2, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";

const starterHoldings = [
  { ticker: "RELIANCE.NS", shares: 12, average_buy_price: 2788.4 },
  { ticker: "TCS.NS", shares: 8, average_buy_price: 3860.2 },
  { ticker: "INFY.NS", shares: 20, average_buy_price: 1468.1 },
];

const emptyHolding = {
  ticker: "",
  shares: "",
  average_buy_price: "",
};

export default function Portfolio() {
  const [holdings, setHoldings] = useState(starterHoldings);
  const [draft, setDraft] = useState(emptyHolding);
  const cashBalance = 85000;

  const totals = useMemo(() => {
    const holdingsValue = holdings.reduce(
      (sum, item) => sum + Number(item.shares) * Number(item.average_buy_price),
      0,
    );
    return {
      holdingsValue,
      total: holdingsValue + cashBalance,
    };
  }, [holdings]);

  function updateDraft(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  }

  function addHolding(event) {
    event.preventDefault();
    if (!draft.ticker || !draft.shares || !draft.average_buy_price) return;

    const next = {
      ticker: draft.ticker.toUpperCase(),
      shares: Number(draft.shares),
      average_buy_price: Number(draft.average_buy_price),
    };
    setHoldings((current) => {
      const withoutExisting = current.filter((item) => item.ticker !== next.ticker);
      return [...withoutExisting, next];
    });
    setDraft(emptyHolding);
  }

  function removeHolding(ticker) {
    setHoldings((current) => current.filter((item) => item.ticker !== ticker));
  }

  return (
    <div className="grid gap-5 pb-24 lg:pb-4">
      <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/50">Portfolio value</p>
              <h2 className="text-2xl font-black text-white">
                INR {totals.total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </h2>
            </div>
            <WalletCards className="h-6 w-6 text-amber" aria-hidden="true" />
          </div>

          <div className="my-7 grid place-items-center">
            <div className="h-44 w-44 rounded-full bg-[conic-gradient(#3DE7B3_0_46%,#42D9F5_46%_72%,#F7B955_72%_86%,#FF6978_86%_100%)] p-5">
              <div className="grid h-full w-full place-items-center rounded-full bg-ink text-center">
                <div>
                  <p className="text-xs text-white/45">Cash</p>
                  <p className="text-lg font-black text-white">
                    INR {cashBalance.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-2 text-sm">
            {holdings.map((item) => (
              <div className="flex items-center justify-between gap-3" key={item.ticker}>
                <span className="truncate text-white/70">{item.ticker}</span>
                <span className="font-semibold text-white">
                  INR {(item.shares * item.average_buy_price).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white/50">Holdings</p>
              <h2 className="text-xl font-black text-white">Positions</h2>
            </div>
            <p className="rounded-lg border border-mint/30 bg-mint/10 px-3 py-2 text-sm text-mint">
              +1.42% today
            </p>
          </div>

          <form className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_120px_160px_auto]" onSubmit={addHolding}>
            <input
              className="min-h-11 rounded-lg border border-line bg-white/7 px-3 text-sm text-white outline-none focus:border-mint"
              name="ticker"
              onChange={updateDraft}
              placeholder="Ticker"
              value={draft.ticker}
            />
            <input
              className="min-h-11 rounded-lg border border-line bg-white/7 px-3 text-sm text-white outline-none focus:border-mint"
              inputMode="decimal"
              name="shares"
              onChange={updateDraft}
              placeholder="Shares"
              type="number"
              value={draft.shares}
            />
            <input
              className="min-h-11 rounded-lg border border-line bg-white/7 px-3 text-sm text-white outline-none focus:border-mint"
              inputMode="decimal"
              name="average_buy_price"
              onChange={updateDraft}
              placeholder="Avg price"
              type="number"
              value={draft.average_buy_price}
            />
            <Button icon={Plus} type="submit">
              Add
            </Button>
          </form>

          <div className="mt-5 overflow-x-auto thin-scrollbar">
            <table className="w-full min-w-[620px] border-collapse">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase text-white/42">
                  <th className="pb-3 font-semibold">Ticker</th>
                  <th className="pb-3 font-semibold">Shares</th>
                  <th className="pb-3 font-semibold">Avg price</th>
                  <th className="pb-3 font-semibold">Book value</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((item) => (
                  <tr className="border-b border-line/70 last:border-0" key={item.ticker}>
                    <td className="py-4 font-bold text-white">{item.ticker}</td>
                    <td className="py-4 text-white/75">{item.shares}</td>
                    <td className="py-4 text-white/75">
                      INR {item.average_buy_price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 font-semibold text-white">
                      INR {(item.shares * item.average_buy_price).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        className="inline-grid h-9 w-9 place-items-center rounded-lg border border-rose/30 bg-rose/10 text-rose transition hover:bg-rose/20"
                        onClick={() => removeHolding(item.ticker)}
                        title={`Remove ${item.ticker}`}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
