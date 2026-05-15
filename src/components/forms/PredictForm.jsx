import { WandSparkles } from "lucide-react";
import { useState } from "react";
import { usePredict } from "../../hooks/usePredict";
import Button from "../ui/Button";

const initialForm = {
  ticker: "NIFTY_50",
  Open: "22500",
  High: "22640",
  Low: "22420",
  Close: "22580",
  Volume: "240000000",
};

export default function PredictForm({ compact = false }) {
  const [form, setForm] = useState(initialForm);
  const { result, error, loading, runPrediction } = usePredict();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      ticker: form.ticker,
      Open: Number(form.Open),
      High: Number(form.High),
      Low: Number(form.Low),
      Close: Number(form.Close),
      Volume: Number(form.Volume),
    };
    await runPrediction(payload).catch(() => null);
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className={compact ? "grid gap-3" : "grid gap-3 md:grid-cols-2"}>
        <label className={compact ? "grid gap-2" : "grid gap-2 md:col-span-2"}>
          <span className="text-xs font-semibold uppercase text-white/55">Ticker</span>
          <input
            className="min-h-11 rounded-lg border border-line bg-white/7 px-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-mint"
            name="ticker"
            onChange={handleChange}
            value={form.ticker}
          />
        </label>

        {["Open", "High", "Low", "Close", "Volume"].map((field) => (
          <label className="grid gap-2" key={field}>
            <span className="text-xs font-semibold uppercase text-white/55">{field}</span>
            <input
              className="min-h-11 rounded-lg border border-line bg-white/7 px-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-mint"
              inputMode="decimal"
              name={field}
              onChange={handleChange}
              type="number"
              value={form[field]}
            />
          </label>
        ))}
      </div>

      <Button className="w-full" disabled={loading} icon={WandSparkles} type="submit">
        {loading ? "Running" : "Run Prediction"}
      </Button>

      {error ? (
        <p className="rounded-lg border border-rose/30 bg-rose/10 px-3 py-2 text-sm text-rose">{error}</p>
      ) : null}

      {result ? (
        <div className="rounded-lg border border-mint/30 bg-mint/10 p-4">
          <p className="text-sm text-white/60">Predicted next close</p>
          <strong className="mt-1 block text-3xl text-mint">
            INR {Number(result.predicted_close_price).toLocaleString("en-IN")}
          </strong>
          <p className="mt-2 text-sm text-white/70">{result.note}</p>
        </div>
      ) : null}
    </form>
  );
}
