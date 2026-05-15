import { useEffect, useMemo, useState } from "react";

const baseTickers = [
  {
    ticker: "NIFTY_50",
    name: "Nifty 50",
    price: 22580.35,
    changePct: 0.74,
    volume: "245M",
    sparkline: [22410, 22480, 22452, 22505, 22530, 22580],
  },
  {
    ticker: "RELIANCE.NS",
    name: "Reliance Industries",
    price: 2875.4,
    changePct: 1.18,
    volume: "12.6M",
    sparkline: [2830, 2842, 2858, 2850, 2869, 2875],
  },
  {
    ticker: "TCS.NS",
    name: "Tata Consultancy Services",
    price: 3924.65,
    changePct: -0.32,
    volume: "3.1M",
    sparkline: [3944, 3938, 3949, 3932, 3928, 3924],
  },
  {
    ticker: "INFY.NS",
    name: "Infosys",
    price: 1498.2,
    changePct: 0.41,
    volume: "8.7M",
    sparkline: [1482, 1489, 1492, 1491, 1496, 1498],
  },
  {
    ticker: "HDFCBANK.NS",
    name: "HDFC Bank",
    price: 1548.75,
    changePct: -0.58,
    volume: "18.4M",
    sparkline: [1565, 1558, 1550, 1554, 1549, 1548],
  },
];

export function useStockData() {
  const [tickers, setTickers] = useState(baseTickers);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTickers((current) =>
        current.map((item) => {
          const drift = (Math.random() - 0.48) * 0.16;
          const nextPrice = Number((item.price * (1 + drift / 100)).toFixed(2));
          const nextChange = Number((item.changePct + drift).toFixed(2));
          return {
            ...item,
            price: nextPrice,
            changePct: nextChange,
            sparkline: [...item.sparkline.slice(1), nextPrice],
          };
        }),
      );
    }, 3500);

    return () => window.clearInterval(id);
  }, []);

  const movers = useMemo(() => {
    const sorted = [...tickers].sort((a, b) => b.changePct - a.changePct);
    return {
      gainers: sorted.slice(0, 3),
      losers: sorted.slice(-3).reverse(),
    };
  }, [tickers]);

  return { tickers, movers };
}
