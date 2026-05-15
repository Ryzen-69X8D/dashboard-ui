import { BrainCircuit, DatabaseZap, GitBranch, ShieldCheck } from "lucide-react";
import PredictForm from "../../components/forms/PredictForm";
import GlassCard from "../../components/ui/GlassCard";

const modelStack = [
  { label: "LSTM", value: "Sequence signal", icon: BrainCircuit },
  { label: "XGBoost", value: "Tree ensemble", icon: GitBranch },
  { label: "Random Forest", value: "Bagged baseline", icon: ShieldCheck },
];

export default function Predictions() {
  return (
    <div className="grid gap-5 pb-24 lg:pb-4">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-mint text-ink">
              <DatabaseZap className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-white/50">Inference request</p>
              <h2 className="text-2xl font-black text-white">Run prediction</h2>
            </div>
          </div>
          <div className="mt-6">
            <PredictForm />
          </div>
        </GlassCard>

        <div className="grid gap-5">
          <GlassCard className="p-5">
            <p className="text-sm text-white/50">Model stack</p>
            <h2 className="text-xl font-black text-white">Ensemble voters</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {modelStack.map((model) => {
                const Icon = model.icon;
                return (
                  <div className="rounded-lg border border-line bg-white/5 p-4" key={model.label}>
                    <Icon className="h-5 w-5 text-mint" aria-hidden="true" />
                    <p className="mt-3 font-bold text-white">{model.label}</p>
                    <p className="mt-1 text-sm text-white/50">{model.value}</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-sm text-white/50">Payload fields</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {["Open", "High", "Low", "Close", "Volume", "Ticker"].map((field) => (
                <span className="rounded-lg border border-line bg-white/5 px-3 py-2 text-sm text-white/75" key={field}>
                  {field}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
