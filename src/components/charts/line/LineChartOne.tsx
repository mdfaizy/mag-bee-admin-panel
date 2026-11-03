// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import dynamic from "next/dynamic";
// import type { ApexOptions } from "apexcharts";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Download,
//   IndianRupee,
//   LineChart,
//   Receipt,
//   RefreshCw,
//   ShoppingBag,
//   SlidersHorizontal,
//   TrendingDown,
//   TrendingUp,
//   X,
// } from "lucide-react";
// import { getAllOrders } from "../../../services/orders/ResentOrder";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

// /* ========================================================================
//    TYPES & CONSTANTS
// ======================================================================== */

// interface Order {
//   id: string;
//   orderCode?: string;
//   createdAt: string;
//   totalAmount: string | number;
//   status?: string;
//   paymentStatus?: string;
//   paymentMethod?: string;
// }

// interface ParsedOrder {
//   ts: number;
//   amount: number;
//   status: string;
//   method: string;
// }

// interface Agg {
//   revenue: number;
//   orders: number;
// }

// type MetricType = "sales" | "revenue" | "both";
// type Granularity = "hour" | "day" | "week" | "month";
// type GroupBy = "auto" | "day" | "week" | "month";
// type PresetKey =
//   | "today"
//   | "7d"
//   | "30d"
//   | "90d"
//   | "mtd"
//   | "lm"
//   | "ytd"
//   | "custom";

// const PRESETS: { key: PresetKey; label: string }[] = [
//   { key: "today", label: "Today" },
//   { key: "7d", label: "7 days" },
//   { key: "30d", label: "30 days" },
//   { key: "90d", label: "90 days" },
//   { key: "mtd", label: "This month" },
//   { key: "lm", label: "Last month" },
//   { key: "ytd", label: "This year" },
//   { key: "custom", label: "Custom" },
// ];

// const GROUP_OPTIONS: { key: GroupBy; label: string }[] = [
//   { key: "auto", label: "Auto" },
//   { key: "day", label: "Day" },
//   { key: "week", label: "Week" },
//   { key: "month", label: "Month" },
// ];

// const METRIC_OPTIONS: { key: MetricType; label: string }[] = [
//   { key: "sales", label: "Sales" },
//   { key: "revenue", label: "Revenue" },
//   { key: "both", label: "Both" },
// ];

// // "Valid orders" scope: these never count towards sales / revenue
// const EXCLUDED_STATUSES = new Set([
//   "CANCELLED",
//   "CANCELED",
//   "PENDING_PAYMENT",
//   "PAYMENT_FAILED",
//   "FAILED",
//   "EXPIRED",
// ]);

// const SALES_COLOR = "#465FFF";
// const REVENUE_COLOR = "#10B981";
// const PREVIOUS_COLOR = "#9CA3AF";

// const CARD =
//   "rounded-[10px] border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900";

// const FOCUS =
//   "outline-none focus-visible:ring-2 focus-visible:ring-[#465FFF]/40";

// const ICON_BTN = `flex h-10 w-10 items-center justify-center rounded-[10px] border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 ${FOCUS}`;

// /* ========================================================================
//    DATE + FORMAT HELPERS
// ======================================================================== */

// const startOfDay = (d: Date) =>
//   new Date(d.getFullYear(), d.getMonth(), d.getDate());

// const endOfDay = (d: Date) =>
//   new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

// const addDays = (d: Date, n: number) =>
//   new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

// const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

// // Week starts on Monday
// const startOfWeek = (d: Date) => addDays(startOfDay(d), -((d.getDay() + 6) % 7));

// const daysBetween = (s: Date, e: Date) =>
//   Math.round((startOfDay(e).getTime() - startOfDay(s).getTime()) / 864e5) + 1;

// const toInput = (d: Date) =>
//   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
//     d.getDate()
//   ).padStart(2, "0")}`;

// const parseInput = (s: string) => {
//   if (!s) return null;
//   const [y, m, d] = s.split("-").map(Number);
//   if (!y || !m || !d) return null;
//   return new Date(y, m - 1, d);
// };

// function bucketStart(d: Date, g: Granularity) {
//   switch (g) {
//     case "hour":
//       return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
//     case "day":
//       return startOfDay(d);
//     case "week":
//       return startOfWeek(d);
//     default:
//       return startOfMonth(d);
//   }
// }

// function nextBucket(d: Date, g: Granularity) {
//   switch (g) {
//     case "hour":
//       return new Date(
//         d.getFullYear(),
//         d.getMonth(),
//         d.getDate(),
//         d.getHours() + 1
//       );
//     case "day":
//       return addDays(d, 1);
//     case "week":
//       return addDays(d, 7);
//     default:
//       return new Date(d.getFullYear(), d.getMonth() + 1, 1);
//   }
// }

// const fmt = (d: Date, o: Intl.DateTimeFormatOptions) =>
//   d.toLocaleDateString("en-IN", o);

// function bucketLabel(d: Date, g: Granularity) {
//   if (g === "hour")
//     return d.toLocaleTimeString("en-IN", { hour: "numeric", hour12: true });
//   if (g === "month") return fmt(d, { month: "short", year: "2-digit" });
//   return fmt(d, { day: "numeric", month: "short" });
// }

// function bucketFullLabel(d: Date, g: Granularity) {
//   if (g === "hour")
//     return `${fmt(d, { day: "numeric", month: "short" })}, ${d.toLocaleTimeString(
//       "en-IN",
//       { hour: "numeric", hour12: true }
//     )}`;
//   if (g === "day")
//     return fmt(d, {
//       weekday: "short",
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });
//   if (g === "week")
//     return `${fmt(d, { day: "numeric", month: "short" })} – ${fmt(
//       addDays(d, 6),
//       { day: "numeric", month: "short" }
//     )}`;
//   return fmt(d, { month: "long", year: "numeric" });
// }

// function formatRange(s: Date, e: Date) {
//   if (daysBetween(s, e) === 1)
//     return fmt(s, { day: "numeric", month: "short", year: "numeric" });
//   const sameYear = s.getFullYear() === e.getFullYear();
//   const start = fmt(
//     s,
//     sameYear
//       ? { day: "numeric", month: "short" }
//       : { day: "numeric", month: "short", year: "numeric" }
//   );
//   return `${start} – ${fmt(e, {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   })}`;
// }

// function resolveRange(preset: PresetKey, from: string, to: string) {
//   const now = new Date();
//   const today = startOfDay(now);
//   let start = addDays(today, -29);
//   let end = endOfDay(now);

//   switch (preset) {
//     case "today":
//       start = today;
//       break;
//     case "7d":
//       start = addDays(today, -6);
//       break;
//     case "90d":
//       start = addDays(today, -89);
//       break;
//     case "mtd":
//       start = startOfMonth(now);
//       break;
//     case "lm":
//       start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//       end = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));
//       break;
//     case "ytd":
//       start = new Date(now.getFullYear(), 0, 1);
//       break;
//     case "custom": {
//       const t = parseInput(to);
//       if (t) end = endOfDay(t);
//       const f = parseInput(from);
//       start = f ?? addDays(startOfDay(end), -29);
//       if (start > end) {
//         const s = startOfDay(end);
//         end = endOfDay(start);
//         start = s;
//       }
//       // never plot the future
//       if (end > now) end = endOfDay(now);
//       if (start > end) start = startOfDay(end);
//       break;
//     }
//     default:
//       break;
//   }
//   return { start, end };
// }

// // Move the visible period one step back / forward
// function shiftRange(
//   start: Date,
//   end: Date,
//   preset: PresetKey,
//   dir: -1 | 1
// ) {
//   if (preset === "mtd" || preset === "lm") {
//     const s = new Date(start.getFullYear(), start.getMonth() + dir, 1);
//     return {
//       start: s,
//       end: endOfDay(new Date(s.getFullYear(), s.getMonth() + 1, 0)),
//     };
//   }
//   if (preset === "ytd") {
//     const y = start.getFullYear() + dir;
//     return {
//       start: new Date(y, 0, 1),
//       end: endOfDay(new Date(y, 11, 31)),
//     };
//   }
//   const len = daysBetween(start, end);
//   return {
//     start: addDays(startOfDay(start), dir * len),
//     end: endOfDay(addDays(startOfDay(end), dir * len)),
//   };
// }

// const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

// const inrCompact = (n: number) => {
//   const v =
//     n >= 1e7
//       ? `${(n / 1e7).toFixed(1)}Cr`
//       : n >= 1e5
//         ? `${(n / 1e5).toFixed(1)}L`
//         : n >= 1e3
//           ? `${(n / 1e3).toFixed(1)}K`
//           : `${Math.round(n)}`;
//   return `₹${v.replace(/\.0(?=[A-Za-z])/, "")}`;
// };

// const normalizeStatus = (s?: string) =>
//   (s || "UNKNOWN").toUpperCase().trim().replace(/[\s-]+/g, "_");

// const prettify = (s: string) => {
//   if (s === "COD") return "COD";
//   const t = s.toLowerCase().replace(/_/g, " ");
//   return t.charAt(0).toUpperCase() + t.slice(1);
// };

// const calcDelta = (cur: number, prev: number) => {
//   if (prev === 0) return cur === 0 ? 0 : null;
//   return ((cur - prev) / prev) * 100;
// };

// function buildSeries(
//   orders: ParsedOrder[],
//   s: Date,
//   e: Date,
//   g: Granularity
// ) {
//   const buckets: Date[] = [];
//   for (let c = bucketStart(s, g); c <= e; c = nextBucket(c, g)) {
//     buckets.push(c);
//   }

//   const map = new Map<number, Agg>(
//     buckets.map((b) => [b.getTime(), { revenue: 0, orders: 0 }])
//   );
//   const total: Agg = { revenue: 0, orders: 0 };
//   const st = s.getTime();
//   const et = e.getTime();

//   for (const o of orders) {
//     if (o.ts < st || o.ts > et) continue;
//     total.revenue += o.amount;
//     total.orders += 1;
//     const slot = map.get(bucketStart(new Date(o.ts), g).getTime());
//     if (slot) {
//       slot.revenue += o.amount;
//       slot.orders += 1;
//     }
//   }

//   return { buckets, values: buckets.map((b) => map.get(b.getTime())!), total };
// }

// function useIsDark() {
//   const [dark, setDark] = useState(false);
//   useEffect(() => {
//     const el = document.documentElement;
//     const read = () => setDark(el.classList.contains("dark"));
//     read();
//     const mo = new MutationObserver(read);
//     mo.observe(el, { attributes: true, attributeFilter: ["class"] });
//     return () => mo.disconnect();
//   }, []);
//   return dark;
// }

// /* ========================================================================
//    SMALL UI PIECES
// ======================================================================== */

// function Segmented<T extends string>({
//   value,
//   options,
//   onChange,
//   isDisabled,
//   fullWidth = true,
// }: {
//   value: T;
//   options: { key: T; label: string }[];
//   onChange: (k: T) => void;
//   isDisabled?: (k: T) => boolean;
//   fullWidth?: boolean;
// }) {
//   return (
//     <div
//       className={`inline-flex rounded-[10px] border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800 ${
//         fullWidth ? "w-full sm:w-auto" : ""
//       }`}
//     >
//       {options.map((o) => {
//         const disabled = isDisabled?.(o.key) ?? false;
//         const active = value === o.key;
//         return (
//           <button
//             key={o.key}
//             type="button"
//             disabled={disabled}
//             onClick={() => onChange(o.key)}
//             aria-pressed={active}
//             className={`flex-1 rounded-[8px] px-3 py-1.5 text-sm font-medium transition-colors sm:flex-none ${FOCUS} ${
//               active
//                 ? "bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
//                 : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//             } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
//           >
//             {o.label}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// function FilterSelect({
//   label,
//   value,
//   onChange,
//   children,
// }: {
//   label: string;
//   value: string;
//   onChange: (v: string) => void;
//   children: React.ReactNode;
// }) {
//   return (
//     <label className="flex min-w-0 flex-col gap-1">
//       <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
//         {label}
//       </span>
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className={`h-10 w-full rounded-[10px] border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 sm:min-w-[170px] ${FOCUS}`}
//       >
//         {children}
//       </select>
//     </label>
//   );
// }

// function Delta({ value }: { value: number | null }) {
//   if (value === null) {
//     return (
//       <span className="text-xs text-gray-400 dark:text-gray-500">
//         No prior data
//       </span>
//     );
//   }
//   const up = value >= 0;
//   const Icon = up ? TrendingUp : TrendingDown;
//   return (
//     <span
//       className={`inline-flex items-center gap-1 text-xs font-medium ${
//         up
//           ? "text-emerald-600 dark:text-emerald-400"
//           : "text-rose-600 dark:text-rose-400"
//       }`}
//     >
//       <Icon className="h-3.5 w-3.5" />
//       {Math.abs(value).toFixed(1)}%
//       <span className="font-normal text-gray-400 dark:text-gray-500">
//         vs previous
//       </span>
//     </span>
//   );
// }

// function StatCard({
//   icon: Icon,
//   label,
//   value,
//   delta,
// }: {
//   icon: React.ComponentType<{ className?: string }>;
//   label: string;
//   value: string;
//   delta: number | null;
// }) {
//   return (
//     <div className="flex min-w-0 items-center gap-3 rounded-[10px] border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
//       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
//         <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
//       </div>
//       <div className="min-w-0">
//         <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
//         <p className="truncate text-lg font-bold text-gray-800 dark:text-white">
//           {value}
//         </p>
//         <Delta value={delta} />
//       </div>
//     </div>
//   );
// }

// /* ========================================================================
//    MAIN COMPONENT
// ======================================================================== */

// export default function DynamicLineChart() {
//   const dark = useIsDark();

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // filters
//   const [preset, setPreset] = useState<PresetKey>("30d");
//   const [customFrom, setCustomFrom] = useState("");
//   const [customTo, setCustomTo] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("valid");
//   const [methodFilter, setMethodFilter] = useState<string>("all");
//   const [groupBy, setGroupBy] = useState<GroupBy>("auto");
//   const [compare, setCompare] = useState(false);
//   const [activeMetric, setActiveMetric] = useState<MetricType>("both");
//   const [showFilters, setShowFilters] = useState(false);

//   /* ---------- fetch ---------- */

//   const load = useCallback(async (silent = false) => {
//     try {
//       if (silent) setRefreshing(true);
//       else setLoading(true);
//       setError(null);

//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const res: any = await getAllOrders();
//       const list = Array.isArray(res?.orders)
//         ? res.orders
//         : Array.isArray(res)
//           ? res
//           : [];
//       setOrders(list);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setError("Couldn't load orders. Check your connection and try again.");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   /* ---------- derived data ---------- */

//   const parsed = useMemo<ParsedOrder[]>(
//     () =>
//       orders.flatMap((o) => {
//         const ts = Date.parse(o.createdAt);
//         if (Number.isNaN(ts)) return [];
//         return [
//           {
//             ts,
//             amount: Number(o.totalAmount) || 0,
//             status: normalizeStatus(o.status),
//             method: (o.paymentMethod || "UNKNOWN").toUpperCase(),
//           },
//         ];
//       }),
//     [orders]
//   );

//   const firstOrderTs = useMemo(
//     () => (parsed.length ? Math.min(...parsed.map((o) => o.ts)) : null),
//     [parsed]
//   );

//   const statusOptions = useMemo(
//     () => Array.from(new Set(parsed.map((o) => o.status))).sort(),
//     [parsed]
//   );
//   const methodOptions = useMemo(
//     () => Array.from(new Set(parsed.map((o) => o.method))).sort(),
//     [parsed]
//   );

//   const scoped = useMemo(
//     () =>
//       parsed.filter((o) => {
//         if (statusFilter === "valid" && EXCLUDED_STATUSES.has(o.status))
//           return false;
//         if (
//           statusFilter !== "valid" &&
//           statusFilter !== "all" &&
//           o.status !== statusFilter
//         )
//           return false;
//         if (methodFilter !== "all" && o.method !== methodFilter) return false;
//         return true;
//       }),
//     [parsed, statusFilter, methodFilter]
//   );

//   const { start, end } = useMemo(
//     () => resolveRange(preset, customFrom, customTo),
//     [preset, customFrom, customTo]
//   );

//   const days = daysBetween(start, end);

//   const granularity: Granularity =
//     days === 1
//       ? "hour"
//       : groupBy === "auto"
//         ? days <= 31
//           ? "day"
//           : days <= 120
//             ? "week"
//             : "month"
//         : groupBy === "day" && days > 92
//           ? "week"
//           : groupBy;

//   const current = useMemo(
//     () => buildSeries(scoped, start, end, granularity),
//     [scoped, start, end, granularity]
//   );

//   const previous = useMemo(() => {
//     const prevEnd = endOfDay(addDays(start, -1));
//     const prevStart = addDays(startOfDay(start), -days);
//     return buildSeries(scoped, prevStart, prevEnd, granularity);
//   }, [scoped, start, days, granularity]);

//   const aov = (a: Agg) => (a.orders ? a.revenue / a.orders : 0);

//   const salesData = current.values.map((a) => a.orders);
//   const revenueData = current.values.map((a) => a.revenue);
//   const prevSalesData = previous.values.map((a) => a.orders);
//   const prevRevenueData = previous.values.map((a) => a.revenue);

//   const hasData = current.total.orders > 0;
//   const showCompare = compare && activeMetric !== "both";

//   const peakSource = activeMetric === "sales" ? salesData : revenueData;
//   const peakIndex = peakSource.reduce(
//     (best, v, i) => (v > peakSource[best] ? i : best),
//     0
//   );

//   const fullLabels = current.buckets.map((b) => bucketFullLabel(b, granularity));

//   /* ---------- navigation ---------- */

//   const canGoNext = end.getTime() < endOfDay(new Date()).getTime();
//   const canGoPrev = firstOrderTs !== null && firstOrderTs < start.getTime();

//   const navigate = (dir: -1 | 1) => {
//     const next = shiftRange(start, end, preset, dir);
//     setCustomFrom(toInput(next.start));
//     setCustomTo(toInput(next.end));
//     setPreset("custom");
//   };

//   const selectPreset = (key: PresetKey) => {
//     if (key === "custom" && !customFrom && !customTo) {
//       setCustomFrom(toInput(start));
//       setCustomTo(toInput(end));
//     }
//     setPreset(key);
//   };

//   /* ---------- filter chips / reset ---------- */

//   const activeChips: { label: string; clear: () => void }[] = [];
//   if (statusFilter !== "valid")
//     activeChips.push({
//       label: `Status: ${statusFilter === "all" ? "All orders" : prettify(statusFilter)}`,
//       clear: () => setStatusFilter("valid"),
//     });
//   if (methodFilter !== "all")
//     activeChips.push({
//       label: `Payment: ${prettify(methodFilter)}`,
//       clear: () => setMethodFilter("all"),
//     });
//   if (groupBy !== "auto")
//     activeChips.push({
//       label: `Group by: ${prettify(groupBy)}`,
//       clear: () => setGroupBy("auto"),
//     });

//   const resetAll = () => {
//     setPreset("30d");
//     setStatusFilter("valid");
//     setMethodFilter("all");
//     setGroupBy("auto");
//     setCompare(false);
//   };

//   /* ---------- export ---------- */

//   const exportCsv = () => {
//     const rows: (string | number)[][] = [
//       ["Period", "Orders", "Revenue (INR)", "Avg order value (INR)"],
//       ...current.buckets.map((b, i) => {
//         const a = current.values[i];
//         return [
//           bucketFullLabel(b, granularity),
//           a.orders,
//           a.revenue.toFixed(2),
//           a.orders ? (a.revenue / a.orders).toFixed(2) : "0.00",
//         ];
//       }),
//     ];
//     const csv = rows
//       .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
//       .join("\n");
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `sales-${toInput(start)}_to_${toInput(end)}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   /* ---------- chart ---------- */

//   const axisColor = dark ? "#9CA3AF" : "#64748B";
//   const isBoth = activeMetric === "both";
//   const pointCount = current.buckets.length;

//   const fmtValue = (v: number, seriesIndex: number) => {
//     if (isBoth) return seriesIndex === 0 ? `${Math.round(v)} sales` : inr(v);
//     return activeMetric === "sales" ? `${Math.round(v)} sales` : inr(v);
//   };

//   const yaxis: ApexOptions["yaxis"] = isBoth
//     ? [
//         {
//           seriesName: "Sales",
//           min: 0,
//           labels: {
//             style: { colors: [SALES_COLOR], fontSize: "11px" },
//             formatter: (v: number) => `${Math.round(v)}`,
//           },
//         },
//         {
//           seriesName: "Revenue",
//           opposite: true,
//           min: 0,
//           labels: {
//             style: { colors: [REVENUE_COLOR], fontSize: "11px" },
//             formatter: (v: number) => inrCompact(v),
//           },
//         },
//       ]
//     : {
//         min: 0,
//         labels: {
//           style: { colors: [axisColor], fontSize: "11px" },
//           formatter: (v: number) =>
//             activeMetric === "sales" ? `${Math.round(v)}` : inrCompact(v),
//         },
//       };

//   const options: ApexOptions = {
//     chart: {
//       type: "line",
//       fontFamily: "Outfit, sans-serif",
//       background: "transparent",
//       toolbar: { show: false },
//       zoom: { enabled: false },
//       animations: { enabled: true, speed: 400 },
//     },
//     theme: { mode: dark ? "dark" : "light" },
//     colors: isBoth
//       ? [SALES_COLOR, REVENUE_COLOR]
//       : activeMetric === "sales"
//         ? [SALES_COLOR, PREVIOUS_COLOR]
//         : [REVENUE_COLOR, PREVIOUS_COLOR],
//     stroke: {
//       curve: "smooth",
//       width: isBoth ? [3, 3] : showCompare ? [3, 2] : [3],
//       dashArray: showCompare ? [0, 5] : 0,
//     },
//     fill: { type: "solid", opacity: 1 },
//     markers: {
//       size: pointCount <= 31 ? 3 : 0,
//       strokeWidth: 0,
//       hover: { size: 6 },
//     },
//     dataLabels: { enabled: false },
//     legend: {
//       show: isBoth || showCompare,
//       position: "top",
//       horizontalAlign: "right",
//       fontSize: "12px",
//       labels: { colors: axisColor },
//       markers: { size: 6, shape: "circle" },
//     },
//     grid: {
//       borderColor: dark ? "rgba(156,163,175,0.15)" : "#E5E7EB",
//       strokeDashArray: 5,
//       xaxis: { lines: { show: false } },
//       yaxis: { lines: { show: true } },
//       padding: { top: 0, right: 8, bottom: 0, left: 8 },
//     },
//     xaxis: {
//       type: "category",
//       categories: current.buckets.map((b) => bucketLabel(b, granularity)),
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//       tooltip: { enabled: false },
//       tickAmount: pointCount > 12 ? 8 : undefined,
//       labels: {
//         rotate: 0,
//         hideOverlappingLabels: true,
//         style: { colors: axisColor, fontSize: "11px", fontWeight: 500 },
//       },
//     },
//     yaxis,
//     tooltip: {
//       shared: true,
//       intersect: false,
//       theme: dark ? "dark" : "light",
//       x: {
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         formatter: (_v: number, opts?: any) =>
//           fullLabels[opts?.dataPointIndex ?? 0] ?? "",
//       },
//       y: {
//         formatter: (
//           v: number,
//           { seriesIndex }: { seriesIndex: number }
//         ) =>
//           v === null || v === undefined ? "–" : fmtValue(v, seriesIndex),
//       },
//     },
//   };

//   const series = isBoth
//     ? [
//         { name: "Sales", data: salesData },
//         { name: "Revenue", data: revenueData },
//       ]
//     : [
//         {
//           name: activeMetric === "sales" ? "Sales" : "Revenue",
//           data: activeMetric === "sales" ? salesData : revenueData,
//         },
//         ...(showCompare
//           ? [
//               {
//                 name: "Previous period",
//                 data: (activeMetric === "sales"
//                   ? prevSalesData
//                   : prevRevenueData
//                 ).length
//                   ? current.buckets.map(
//                       (_, i) =>
//                         (activeMetric === "sales"
//                           ? prevSalesData
//                           : prevRevenueData)[i] ?? null
//                     )
//                   : [],
//               },
//             ]
//           : []),
//       ];

//   /* ====================================================================
//      LOADING / ERROR
//   ==================================================================== */

//   if (loading) {
//     return (
//       <div className={`${CARD} w-full min-w-0 p-4 sm:p-6`}>
//         <div className="mb-5 flex items-center gap-3">
//           <div className="h-10 w-10 animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800" />
//           <div className="space-y-2">
//             <div className="h-5 w-40 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
//             <div className="h-3 w-28 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
//           </div>
//         </div>
//         <div className="mb-5 grid gap-3 sm:grid-cols-3">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <div
//               key={i}
//               className="h-[88px] animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800"
//             />
//           ))}
//         </div>
//         <div className="h-64 animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         className={`${CARD} flex w-full min-w-0 flex-col items-center gap-3 p-8 text-center`}
//       >
//         <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
//           <LineChart className="h-5 w-5 text-gray-500" />
//         </div>
//         <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
//         <button
//           type="button"
//           onClick={() => load()}
//           className={`h-10 rounded-[10px] bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 ${FOCUS}`}
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   /* ====================================================================
//      MAIN UI
//   ==================================================================== */

//   return (
//     <div className={`${CARD} w-full min-w-0 p-4 sm:p-6`}>
//       {/* HEADER */}
//       <div className="mb-4 flex items-start justify-between gap-3">
//         <div className="flex min-w-0 items-center gap-3">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
//             <LineChart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
//           </div>
//           <div className="min-w-0">
//             <h2 className="truncate text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
//               Sales analytics
//             </h2>
//             <p className="truncate text-xs text-gray-500 dark:text-gray-400">
//               Orders and revenue trend
//             </p>
//           </div>
//         </div>

//         <div className="flex shrink-0 items-center gap-2">
//           <button
//             type="button"
//             onClick={() => load(true)}
//             disabled={refreshing}
//             aria-label="Refresh data"
//             className={ICON_BTN}
//           >
//             <RefreshCw
//               className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
//             />
//           </button>
//           <button
//             type="button"
//             onClick={exportCsv}
//             disabled={!hasData}
//             aria-label="Export CSV"
//             className={`flex h-10 items-center justify-center gap-2 rounded-[10px] border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 ${FOCUS}`}
//           >
//             <Download className="h-4 w-4" />
//             <span className="hidden sm:inline">Export CSV</span>
//           </button>
//         </div>
//       </div>

//       {/* DATE PRESETS */}
//       <div className="-mx-4 mb-3 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
//         <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
//           {PRESETS.map((p) => (
//             <button
//               key={p.key}
//               type="button"
//               onClick={() => selectPreset(p.key)}
//               aria-pressed={preset === p.key}
//               className={`h-9 whitespace-nowrap rounded-[10px] border px-3 text-sm font-medium transition-colors ${FOCUS} ${
//                 preset === p.key
//                   ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
//                   : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
//               }`}
//             >
//               {p.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* CUSTOM RANGE */}
//       {preset === "custom" && (
//         <div className="mb-3 grid grid-cols-2 gap-3 sm:flex sm:items-end">
//           {(
//             [
//               ["From", customFrom, setCustomFrom],
//               ["To", customTo, setCustomTo],
//             ] as const
//           ).map(([label, val, set]) => (
//             <label key={label} className="flex min-w-0 flex-col gap-1">
//               <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
//                 {label}
//               </span>
//               <input
//                 type="date"
//                 value={val}
//                 max={toInput(new Date())}
//                 onChange={(e) => set(e.target.value)}
//                 className={`h-10 w-full rounded-[10px] border border-gray-200 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 ${FOCUS}`}
//               />
//             </label>
//           ))}
//         </div>
//       )}

//       {/* FILTER TOGGLE (mobile) */}
//       <button
//         type="button"
//         onClick={() => setShowFilters((v) => !v)}
//         aria-expanded={showFilters}
//         className={`mb-3 flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 sm:hidden ${FOCUS}`}
//       >
//         <SlidersHorizontal className="h-4 w-4" />
//         Filters
//         {activeChips.length > 0 && (
//           <span className="rounded-full bg-[#465FFF] px-1.5 text-xs text-white">
//             {activeChips.length}
//           </span>
//         )}
//       </button>

//       {/* FILTERS */}
//       <div
//         className={`${
//           showFilters ? "grid" : "hidden"
//         } mb-3 grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end`}
//       >
//         <FilterSelect
//           label="Order status"
//           value={statusFilter}
//           onChange={setStatusFilter}
//         >
//           <option value="valid">Valid orders</option>
//           <option value="all">All orders</option>
//           {statusOptions.map((s) => (
//             <option key={s} value={s}>
//               {prettify(s)}
//             </option>
//           ))}
//         </FilterSelect>

//         <FilterSelect
//           label="Payment method"
//           value={methodFilter}
//           onChange={setMethodFilter}
//         >
//           <option value="all">All methods</option>
//           {methodOptions.map((m) => (
//             <option key={m} value={m}>
//               {prettify(m)}
//             </option>
//           ))}
//         </FilterSelect>

//         <div className="col-span-2 flex flex-col gap-1 sm:col-span-1">
//           <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
//             Group by
//           </span>
//           <Segmented
//             value={days === 1 ? "auto" : groupBy}
//             options={GROUP_OPTIONS}
//             onChange={setGroupBy}
//             isDisabled={(k) => days === 1 || (k === "day" && days > 92)}
//           />
//         </div>

//         <label
//           className={`col-span-2 flex h-10 items-center gap-2 text-sm text-gray-700 dark:text-gray-200 sm:col-span-1 ${
//             isBoth ? "cursor-not-allowed opacity-50" : "cursor-pointer"
//           }`}
//           title={
//             isBoth
//               ? "Choose Sales or Revenue to compare with the previous period"
//               : undefined
//           }
//         >
//           <input
//             type="checkbox"
//             checked={compare}
//             disabled={isBoth}
//             onChange={(e) => setCompare(e.target.checked)}
//             className="h-4 w-4 rounded border-gray-300 accent-[#465FFF]"
//           />
//           Compare with previous period
//         </label>
//       </div>

//       {/* ACTIVE FILTER CHIPS */}
//       {activeChips.length > 0 && (
//         <div className="mb-3 flex flex-wrap items-center gap-2">
//           {activeChips.map((c) => (
//             <span
//               key={c.label}
//               className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 py-1 pl-3 pr-1.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
//             >
//               {c.label}
//               <button
//                 type="button"
//                 onClick={c.clear}
//                 aria-label={`Clear ${c.label}`}
//                 className={`rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 ${FOCUS}`}
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </span>
//           ))}
//           <button
//             type="button"
//             onClick={resetAll}
//             className={`rounded px-1 text-xs font-medium text-[#465FFF] hover:underline ${FOCUS}`}
//           >
//             Reset all
//           </button>
//         </div>
//       )}

//       {/* STAT CARDS */}
//       <div className="mb-5 mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
//         <StatCard
//           icon={ShoppingBag}
//           label="Total sales"
//           value={current.total.orders.toLocaleString("en-IN")}
//           delta={calcDelta(current.total.orders, previous.total.orders)}
//         />
//         <StatCard
//           icon={IndianRupee}
//           label="Total revenue"
//           value={inr(current.total.revenue)}
//           delta={calcDelta(current.total.revenue, previous.total.revenue)}
//         />
//         <StatCard
//           icon={Receipt}
//           label="Avg. order value"
//           value={inr(aov(current.total))}
//           delta={calcDelta(aov(current.total), aov(previous.total))}
//         />
//       </div>

//       {/* CHART TOOLBAR: period navigation + metric */}
//       <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             disabled={!canGoPrev}
//             aria-label="Previous period"
//             className={ICON_BTN}
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </button>
//           <div className="min-w-0 flex-1 text-center sm:min-w-[190px] sm:text-left">
//             <p className="truncate text-sm font-semibold text-gray-800 dark:text-white">
//               {formatRange(start, end)}
//             </p>
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               {days === 1 ? "Hourly" : `${days} days`} · by{" "}
//               {granularity === "hour" ? "hour" : granularity}
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={() => navigate(1)}
//             disabled={!canGoNext}
//             aria-label="Next period"
//             className={ICON_BTN}
//           >
//             <ChevronRight className="h-4 w-4" />
//           </button>
//         </div>

//         <Segmented
//           value={activeMetric}
//           options={METRIC_OPTIONS}
//           onChange={setActiveMetric}
//         />
//       </div>

//       {/* CHART */}
//       {hasData ? (
//         <>
//           <div className="h-[260px] w-full min-w-0 sm:h-[320px] lg:h-[360px]">
//             <ReactApexChart
//               options={options}
//               series={series}
//               type="line"
//               height="100%"
//               width="100%"
//             />
//           </div>

//           {peakSource[peakIndex] > 0 && (
//             <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
//               Best {granularity}:{" "}
//               <span className="font-medium text-gray-700 dark:text-gray-200">
//                 {fullLabels[peakIndex]}
//               </span>{" "}
//               with{" "}
//               {activeMetric === "sales"
//                 ? `${salesData[peakIndex]} sales`
//                 : inr(revenueData[peakIndex])}
//             </p>
//           )}
//         </>
//       ) : (
//         <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
//           <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
//             <TrendingUp className="h-5 w-5 text-gray-400" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
//               No orders in this period
//             </p>
//             <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
//               Try a longer date range or clear the filters.
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               type="button"
//               onClick={() => setPreset("90d")}
//               className={`h-9 rounded-[10px] border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 ${FOCUS}`}
//             >
//               Show 90 days
//             </button>
//             <button
//               type="button"
//               onClick={resetAll}
//               className={`h-9 rounded-[10px] bg-gray-900 px-3 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 ${FOCUS}`}
//             >
//               Reset filters
//             </button>
//           </div>
//         </div>
//       )}

//       {/* FOOTER */}
//       <div className="mt-4 flex flex-col gap-1 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
//         <span>
//           {statusFilter === "valid"
//             ? "Valid orders exclude cancelled and unpaid orders."
//             : statusFilter === "all"
//               ? "Includes every order, even cancelled and unpaid."
//               : `Only ${prettify(statusFilter).toLowerCase()} orders.`}
//         </span>
//         <span>
//           {current.total.orders.toLocaleString("en-IN")} orders ·{" "}
//           {inr(current.total.revenue)} revenue
//         </span>
//       </div>
//     </div>
//   );
// }
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  IndianRupee,
  LineChart,
  Receipt,
  RefreshCw,
  ShoppingBag,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { getAllOrders } from "../../../services/orders/ResentOrder";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/* ========================================================================
   TYPES & CONSTANTS
======================================================================== */

interface Order {
  id: string;
  orderCode?: string;
  createdAt: string;
  totalAmount: string | number;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
}

interface ParsedOrder {
  ts: number;
  amount: number;
  status: string;
  method: string;
}

interface Agg {
  revenue: number;
  orders: number;
}

type MetricType = "sales" | "revenue" | "both";
type Granularity = "hour" | "day" | "week" | "month";
type GroupBy = "auto" | "day" | "week" | "month";
type PresetKey =
  | "today"
  | "7d"
  | "30d"
  | "90d"
  | "mtd"
  | "lm"
  | "ytd"
  | "custom";

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
  { key: "mtd", label: "This month" },
  { key: "lm", label: "Last month" },
  { key: "ytd", label: "This year" },
  { key: "custom", label: "Custom" },
];

const GROUP_OPTIONS: { key: GroupBy; label: string }[] = [
  { key: "auto", label: "Auto" },
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
];

const METRIC_OPTIONS: { key: MetricType; label: string }[] = [
  { key: "sales", label: "Sales" },
  { key: "revenue", label: "Revenue" },
  { key: "both", label: "Both" },
];

// "Valid orders" scope: these never count towards sales / revenue
const EXCLUDED_STATUSES = new Set([
  "CANCELLED",
  "CANCELED",
  "PENDING_PAYMENT",
  "PAYMENT_FAILED",
  "FAILED",
  "EXPIRED",
]);

const SALES_COLOR = "#465FFF";
const REVENUE_COLOR = "#10B981";
const PREVIOUS_COLOR = "#9CA3AF";

const CARD =
  "rounded-[10px] border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900";

const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#465FFF]/40";

const ICON_BTN = `flex h-10 w-10 items-center justify-center rounded-[10px] border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 ${FOCUS}`;

/* ========================================================================
   DATE + FORMAT HELPERS
======================================================================== */

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const endOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

// Week starts on Monday
const startOfWeek = (d: Date) => addDays(startOfDay(d), -((d.getDay() + 6) % 7));

const daysBetween = (s: Date, e: Date) =>
  Math.round((startOfDay(e).getTime() - startOfDay(s).getTime()) / 864e5) + 1;

const toInput = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const parseInput = (s: string) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

function bucketStart(d: Date, g: Granularity) {
  switch (g) {
    case "hour":
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
    case "day":
      return startOfDay(d);
    case "week":
      return startOfWeek(d);
    default:
      return startOfMonth(d);
  }
}

function nextBucket(d: Date, g: Granularity) {
  switch (g) {
    case "hour":
      return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours() + 1
      );
    case "day":
      return addDays(d, 1);
    case "week":
      return addDays(d, 7);
    default:
      return new Date(d.getFullYear(), d.getMonth() + 1, 1);
  }
}

const fmt = (d: Date, o: Intl.DateTimeFormatOptions) =>
  d.toLocaleDateString("en-IN", o);

function bucketLabel(d: Date, g: Granularity) {
  if (g === "hour")
    return d.toLocaleTimeString("en-IN", { hour: "numeric", hour12: true });
  if (g === "month") return fmt(d, { month: "short", year: "2-digit" });
  return fmt(d, { day: "numeric", month: "short" });
}

function bucketFullLabel(d: Date, g: Granularity) {
  if (g === "hour")
    return `${fmt(d, { day: "numeric", month: "short" })}, ${d.toLocaleTimeString(
      "en-IN",
      { hour: "numeric", hour12: true }
    )}`;
  if (g === "day")
    return fmt(d, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  if (g === "week")
    return `${fmt(d, { day: "numeric", month: "short" })} – ${fmt(
      addDays(d, 6),
      { day: "numeric", month: "short" }
    )}`;
  return fmt(d, { month: "long", year: "numeric" });
}

function formatRange(s: Date, e: Date) {
  if (daysBetween(s, e) === 1)
    return fmt(s, { day: "numeric", month: "short", year: "numeric" });
  const sameYear = s.getFullYear() === e.getFullYear();
  const start = fmt(
    s,
    sameYear
      ? { day: "numeric", month: "short" }
      : { day: "numeric", month: "short", year: "numeric" }
  );
  return `${start} – ${fmt(e, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

function resolveRange(preset: PresetKey, from: string, to: string) {
  const now = new Date();
  const today = startOfDay(now);
  let start = addDays(today, -29);
  let end = endOfDay(now);

  switch (preset) {
    case "today":
      start = today;
      break;
    case "7d":
      start = addDays(today, -6);
      break;
    case "90d":
      start = addDays(today, -89);
      break;
    case "mtd":
      start = startOfMonth(now);
      break;
    case "lm":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));
      break;
    case "ytd":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case "custom": {
      const t = parseInput(to);
      if (t) end = endOfDay(t);
      const f = parseInput(from);
      start = f ?? addDays(startOfDay(end), -29);
      if (start > end) {
        const s = startOfDay(end);
        end = endOfDay(start);
        start = s;
      }
      // never plot the future
      if (end > now) end = endOfDay(now);
      if (start > end) start = startOfDay(end);
      break;
    }
    default:
      break;
  }
  return { start, end };
}

// Move the visible period one step back / forward
function shiftRange(
  start: Date,
  end: Date,
  preset: PresetKey,
  dir: -1 | 1
) {
  if (preset === "mtd" || preset === "lm") {
    const s = new Date(start.getFullYear(), start.getMonth() + dir, 1);
    return {
      start: s,
      end: endOfDay(new Date(s.getFullYear(), s.getMonth() + 1, 0)),
    };
  }
  if (preset === "ytd") {
    const y = start.getFullYear() + dir;
    return {
      start: new Date(y, 0, 1),
      end: endOfDay(new Date(y, 11, 31)),
    };
  }
  const len = daysBetween(start, end);
  return {
    start: addDays(startOfDay(start), dir * len),
    end: endOfDay(addDays(startOfDay(end), dir * len)),
  };
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const inrCompact = (n: number) => {
  const v =
    n >= 1e7
      ? `${(n / 1e7).toFixed(1)}Cr`
      : n >= 1e5
        ? `${(n / 1e5).toFixed(1)}L`
        : n >= 1e3
          ? `${(n / 1e3).toFixed(1)}K`
          : `${Math.round(n)}`;
  return `₹${v.replace(/\.0(?=[A-Za-z])/, "")}`;
};

const normalizeStatus = (s?: string) =>
  (s || "UNKNOWN").toUpperCase().trim().replace(/[\s-]+/g, "_");

const prettify = (s: string) => {
  if (s === "COD") return "COD";
  const t = s.toLowerCase().replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const calcDelta = (cur: number, prev: number) => {
  if (prev === 0) return cur === 0 ? 0 : null;
  return ((cur - prev) / prev) * 100;
};

function buildSeries(
  orders: ParsedOrder[],
  s: Date,
  e: Date,
  g: Granularity
) {
  const buckets: Date[] = [];
  for (let c = bucketStart(s, g); c <= e; c = nextBucket(c, g)) {
    buckets.push(c);
  }

  const map = new Map<number, Agg>(
    buckets.map((b) => [b.getTime(), { revenue: 0, orders: 0 }])
  );
  const total: Agg = { revenue: 0, orders: 0 };
  const st = s.getTime();
  const et = e.getTime();

  for (const o of orders) {
    if (o.ts < st || o.ts > et) continue;
    total.revenue += o.amount;
    total.orders += 1;
    const slot = map.get(bucketStart(new Date(o.ts), g).getTime());
    if (slot) {
      slot.revenue += o.amount;
      slot.orders += 1;
    }
  }

  return { buckets, values: buckets.map((b) => map.get(b.getTime())!), total };
}

function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setDark(el.classList.contains("dark"));
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

/* ========================================================================
   SMALL UI PIECES
======================================================================== */

function Segmented<T extends string>({
  value,
  options,
  onChange,
  isDisabled,
  fullWidth = true,
}: {
  value: T;
  options: { key: T; label: string }[];
  onChange: (k: T) => void;
  isDisabled?: (k: T) => boolean;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`inline-flex rounded-[10px] border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800 ${
        fullWidth ? "w-full sm:w-auto" : ""
      }`}
    >
      {options.map((o) => {
        const disabled = isDisabled?.(o.key) ?? false;
        const active = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(o.key)}
            aria-pressed={active}
            className={`flex-1 rounded-[8px] px-3 py-1.5 text-sm font-medium transition-colors sm:flex-none ${FOCUS} ${
              active
                ? "bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 w-full rounded-[10px] border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 sm:min-w-[170px] ${FOCUS}`}
      >
        {children}
      </select>
    </label>
  );
}

function Delta({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="text-xs text-gray-400 dark:text-gray-500">
        No prior data
      </span>
    );
  }
  const up = value >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        up
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {Math.abs(value).toFixed(1)}%
      <span className="font-normal text-gray-400 dark:text-gray-500">
        vs previous
      </span>
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: number | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-[10px] border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
        <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="truncate text-lg font-bold text-gray-800 dark:text-white">
          {value}
        </p>
        <Delta value={delta} />
      </div>
    </div>
  );
}

/* ========================================================================
   MAIN COMPONENT
======================================================================== */

export default function DynamicLineChart() {
  const dark = useIsDark();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [preset, setPreset] = useState<PresetKey>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("valid");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [groupBy, setGroupBy] = useState<GroupBy>("auto");
  const [compare, setCompare] = useState(false);
  const [activeMetric, setActiveMetric] = useState<MetricType>("both");
  const [showFilters, setShowFilters] = useState(false);

  /* ---------- fetch ---------- */

  const load = useCallback(async (silent = false) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await getAllOrders();
      const list = Array.isArray(res?.orders)
        ? res.orders
        : Array.isArray(res)
          ? res
          : [];
      setOrders(list);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Couldn't load orders. Check your connection and try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ---------- derived data ---------- */

  const parsed = useMemo<ParsedOrder[]>(
    () =>
      orders.flatMap((o) => {
        const ts = Date.parse(o.createdAt);
        if (Number.isNaN(ts)) return [];
        return [
          {
            ts,
            amount: Number(o.totalAmount) || 0,
            status: normalizeStatus(o.status),
            method: (o.paymentMethod || "UNKNOWN").toUpperCase(),
          },
        ];
      }),
    [orders]
  );

  const firstOrderTs = useMemo(
    () => (parsed.length ? Math.min(...parsed.map((o) => o.ts)) : null),
    [parsed]
  );

  const statusOptions = useMemo(
    () => Array.from(new Set(parsed.map((o) => o.status))).sort(),
    [parsed]
  );
  const methodOptions = useMemo(
    () => Array.from(new Set(parsed.map((o) => o.method))).sort(),
    [parsed]
  );

  const scoped = useMemo(
    () =>
      parsed.filter((o) => {
        if (statusFilter === "valid" && EXCLUDED_STATUSES.has(o.status))
          return false;
        if (
          statusFilter !== "valid" &&
          statusFilter !== "all" &&
          o.status !== statusFilter
        )
          return false;
        if (methodFilter !== "all" && o.method !== methodFilter) return false;
        return true;
      }),
    [parsed, statusFilter, methodFilter]
  );

  const { start, end } = useMemo(
    () => resolveRange(preset, customFrom, customTo),
    [preset, customFrom, customTo]
  );

  const days = daysBetween(start, end);

  const granularity: Granularity =
    days === 1
      ? "hour"
      : groupBy === "auto"
        ? days <= 31
          ? "day"
          : days <= 120
            ? "week"
            : "month"
        : groupBy === "day" && days > 92
          ? "week"
          : groupBy;

  const current = useMemo(
    () => buildSeries(scoped, start, end, granularity),
    [scoped, start, end, granularity]
  );

  const previous = useMemo(() => {
    const prevEnd = endOfDay(addDays(start, -1));
    const prevStart = addDays(startOfDay(start), -days);
    return buildSeries(scoped, prevStart, prevEnd, granularity);
  }, [scoped, start, days, granularity]);

  const aov = (a: Agg) => (a.orders ? a.revenue / a.orders : 0);

  const salesData = current.values.map((a) => a.orders);
  const revenueData = current.values.map((a) => a.revenue);
  const prevSalesData = previous.values.map((a) => a.orders);
  const prevRevenueData = previous.values.map((a) => a.revenue);

  const hasData = current.total.orders > 0;
  const showCompare = compare && activeMetric !== "both";

  const peakSource = activeMetric === "sales" ? salesData : revenueData;
  const peakIndex = peakSource.reduce(
    (best, v, i) => (v > peakSource[best] ? i : best),
    0
  );

  const fullLabels = current.buckets.map((b) => bucketFullLabel(b, granularity));

  /* ---------- navigation ---------- */

  const canGoNext = end.getTime() < endOfDay(new Date()).getTime();
  const canGoPrev = firstOrderTs !== null && firstOrderTs < start.getTime();

  const navigate = (dir: -1 | 1) => {
    const next = shiftRange(start, end, preset, dir);
    setCustomFrom(toInput(next.start));
    setCustomTo(toInput(next.end));
    setPreset("custom");
  };

  const selectPreset = (key: PresetKey) => {
    if (key === "custom" && !customFrom && !customTo) {
      setCustomFrom(toInput(start));
      setCustomTo(toInput(end));
    }
    setPreset(key);
  };

  /* ---------- filter chips / reset ---------- */

  const activeChips: { label: string; clear: () => void }[] = [];
  if (statusFilter !== "valid")
    activeChips.push({
      label: `Status: ${statusFilter === "all" ? "All orders" : prettify(statusFilter)}`,
      clear: () => setStatusFilter("valid"),
    });
  if (methodFilter !== "all")
    activeChips.push({
      label: `Payment: ${prettify(methodFilter)}`,
      clear: () => setMethodFilter("all"),
    });
  if (groupBy !== "auto")
    activeChips.push({
      label: `Group by: ${prettify(groupBy)}`,
      clear: () => setGroupBy("auto"),
    });

  const resetAll = () => {
    setPreset("30d");
    setStatusFilter("valid");
    setMethodFilter("all");
    setGroupBy("auto");
    setCompare(false);
  };

  /* ---------- export ---------- */

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["Period", "Orders", "Revenue (INR)", "Avg order value (INR)"],
      ...current.buckets.map((b, i) => {
        const a = current.values[i];
        return [
          bucketFullLabel(b, granularity),
          a.orders,
          a.revenue.toFixed(2),
          a.orders ? (a.revenue / a.orders).toFixed(2) : "0.00",
        ];
      }),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-${toInput(start)}_to_${toInput(end)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- chart ---------- */

  const axisColor = dark ? "#9CA3AF" : "#64748B";
  const isBoth = activeMetric === "both";
  const pointCount = current.buckets.length;

  const fmtValue = (v: number, seriesIndex: number) => {
    if (isBoth) return seriesIndex === 0 ? `${Math.round(v)} sales` : inr(v);
    return activeMetric === "sales" ? `${Math.round(v)} sales` : inr(v);
  };

  const yaxis: ApexOptions["yaxis"] = isBoth
    ? [
        {
          seriesName: "Sales",
          min: 0,
          labels: {
            style: { colors: [SALES_COLOR], fontSize: "11px" },
            formatter: (v: number) => `${Math.round(v)}`,
          },
        },
        {
          seriesName: "Revenue",
          opposite: true,
          min: 0,
          labels: {
            style: { colors: [REVENUE_COLOR], fontSize: "11px" },
            formatter: (v: number) => inrCompact(v),
          },
        },
      ]
    : {
        min: 0,
        labels: {
          style: { colors: [axisColor], fontSize: "11px" },
          formatter: (v: number) =>
            activeMetric === "sales" ? `${Math.round(v)}` : inrCompact(v),
        },
      };

  const options: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "Outfit, sans-serif",
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 400 },
    },
    theme: { mode: dark ? "dark" : "light" },
    colors: isBoth
      ? [SALES_COLOR, REVENUE_COLOR]
      : activeMetric === "sales"
        ? [SALES_COLOR, PREVIOUS_COLOR]
        : [REVENUE_COLOR, PREVIOUS_COLOR],
    stroke: {
      curve: "smooth",
      width: isBoth ? [3, 3] : showCompare ? [3, 2] : [3],
      dashArray: showCompare ? [0, 5] : 0,
    },
    fill: { type: "solid", opacity: 1 },
    markers: {
      size: pointCount <= 31 ? 3 : 0,
      strokeWidth: 0,
      hover: { size: 6 },
    },
    dataLabels: { enabled: false },
    legend: {
      show: isBoth || showCompare,
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      labels: { colors: axisColor },
      markers: { size: 6, shape: "circle" },
    },
    grid: {
      borderColor: dark ? "rgba(156,163,175,0.15)" : "#E5E7EB",
      strokeDashArray: 5,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 8, bottom: 0, left: 8 },
    },
    xaxis: {
      type: "category",
      categories: current.buckets.map((b) => bucketLabel(b, granularity)),
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      tickAmount: pointCount > 12 ? 8 : undefined,
      labels: {
        rotate: 0,
        hideOverlappingLabels: true,
        style: { colors: axisColor, fontSize: "11px", fontWeight: 500 },
      },
    },
    yaxis,
    tooltip: {
      shared: true,
      intersect: false,
      theme: dark ? "dark" : "light",
      x: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (_v: number, opts?: any) =>
          fullLabels[opts?.dataPointIndex ?? 0] ?? "",
      },
      y: {
        formatter: (
          v: number,
          { seriesIndex }: { seriesIndex: number }
        ) =>
          v === null || v === undefined ? "–" : fmtValue(v, seriesIndex),
      },
    },
  };

  const series = isBoth
    ? [
        { name: "Sales", data: salesData },
        { name: "Revenue", data: revenueData },
      ]
    : [
        {
          name: activeMetric === "sales" ? "Sales" : "Revenue",
          data: activeMetric === "sales" ? salesData : revenueData,
        },
        ...(showCompare
          ? [
              {
                name: "Previous period",
                data: (activeMetric === "sales"
                  ? prevSalesData
                  : prevRevenueData
                ).length
                  ? current.buckets.map(
                      (_, i) =>
                        (activeMetric === "sales"
                          ? prevSalesData
                          : prevRevenueData)[i] ?? null
                    )
                  : [],
              },
            ]
          : []),
      ];

  /* ====================================================================
     LOADING / ERROR
  ==================================================================== */

  if (loading) {
    return (
      <div className={`${CARD} w-full min-w-0 p-4 sm:p-6`}>
        <div className="mb-5 flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800" />
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-3 w-28 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[88px] animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${CARD} flex w-full min-w-0 flex-col items-center gap-3 p-8 text-center`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
          <LineChart className="h-5 w-5 text-gray-500" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
        <button
          type="button"
          onClick={() => load()}
          className={`h-10 rounded-[10px] bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 ${FOCUS}`}
        >
          Retry
        </button>
      </div>
    );
  }

  /* ====================================================================
     MAIN UI
  ==================================================================== */

  return (
    <div className={`${CARD} w-full min-w-0 p-4 sm:p-6`}>
      {/* HEADER */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
            <LineChart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
              Sales analytics
            </h2>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              Orders and revenue trend
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => load(true)}
            disabled={refreshing}
            aria-label="Refresh data"
            className={ICON_BTN}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!hasData}
            aria-label="Export CSV"
            className={`flex h-10 items-center justify-center gap-2 rounded-[10px] border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 ${FOCUS}`}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* DATE PRESETS */}
      <div className="-mx-4 mb-3 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => selectPreset(p.key)}
              aria-pressed={preset === p.key}
              className={`h-9 whitespace-nowrap rounded-[10px] border px-3 text-sm font-medium transition-colors ${FOCUS} ${
                preset === p.key
                  ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* CUSTOM RANGE */}
      {preset === "custom" && (
        <div className="mb-3 grid grid-cols-2 gap-3 sm:flex sm:items-end">
          {(
            [
              ["From", customFrom, setCustomFrom],
              ["To", customTo, setCustomTo],
            ] as const
          ).map(([label, val, set]) => (
            <label key={label} className="flex min-w-0 flex-col gap-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {label}
              </span>
              <input
                type="date"
                value={val}
                max={toInput(new Date())}
                onChange={(e) => set(e.target.value)}
                className={`h-10 w-full rounded-[10px] border border-gray-200 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 ${FOCUS}`}
              />
            </label>
          ))}
        </div>
      )}

      {/* FILTER TOGGLE (mobile) */}
      <button
        type="button"
        onClick={() => setShowFilters((v) => !v)}
        aria-expanded={showFilters}
        className={`mb-3 flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 sm:hidden ${FOCUS}`}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeChips.length > 0 && (
          <span className="rounded-full bg-[#465FFF] px-1.5 text-xs text-white">
            {activeChips.length}
          </span>
        )}
      </button>

      {/* FILTERS */}
      <div
        className={`${
          showFilters ? "grid" : "hidden"
        } mb-3 grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end`}
      >
        <FilterSelect
          label="Order status"
          value={statusFilter}
          onChange={setStatusFilter}
        >
          <option value="valid">Valid orders</option>
          <option value="all">All orders</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {prettify(s)}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Payment method"
          value={methodFilter}
          onChange={setMethodFilter}
        >
          <option value="all">All methods</option>
          {methodOptions.map((m) => (
            <option key={m} value={m}>
              {prettify(m)}
            </option>
          ))}
        </FilterSelect>

        <div className="col-span-2 flex flex-col gap-1 sm:col-span-1">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Group by
          </span>
          <Segmented
            value={days === 1 ? "auto" : groupBy}
            options={GROUP_OPTIONS}
            onChange={setGroupBy}
            isDisabled={(k) => days === 1 || (k === "day" && days > 92)}
          />
        </div>

        <label
          className={`col-span-2 flex h-10 items-center gap-2 text-sm text-gray-700 dark:text-gray-200 sm:col-span-1 ${
            isBoth ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
          title={
            isBoth
              ? "Choose Sales or Revenue to compare with the previous period"
              : undefined
          }
        >
          <input
            type="checkbox"
            checked={compare}
            disabled={isBoth}
            onChange={(e) => setCompare(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-[#465FFF]"
          />
          Compare with previous period
        </label>
      </div>

      {/* ACTIVE FILTER CHIPS */}
      {activeChips.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {activeChips.map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 py-1 pl-3 pr-1.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              {c.label}
              <button
                type="button"
                onClick={c.clear}
                aria-label={`Clear ${c.label}`}
                className={`rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 ${FOCUS}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={resetAll}
            className={`rounded px-1 text-xs font-medium text-[#465FFF] hover:underline ${FOCUS}`}
          >
            Reset all
          </button>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="mb-5 mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={ShoppingBag}
          label="Total sales"
          value={current.total.orders.toLocaleString("en-IN")}
          delta={calcDelta(current.total.orders, previous.total.orders)}
        />
        <StatCard
          icon={IndianRupee}
          label="Total revenue"
          value={inr(current.total.revenue)}
          delta={calcDelta(current.total.revenue, previous.total.revenue)}
        />
        <StatCard
          icon={Receipt}
          label="Avg. order value"
          value={inr(aov(current.total))}
          delta={calcDelta(aov(current.total), aov(previous.total))}
        />
      </div>

      {/* CHART TOOLBAR: period navigation + metric */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={!canGoPrev}
            aria-label="Previous period"
            className={ICON_BTN}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1 text-center sm:min-w-[190px] sm:text-left">
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-white">
              {formatRange(start, end)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {days === 1 ? "Hourly" : `${days} days`} · by{" "}
              {granularity === "hour" ? "hour" : granularity}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(1)}
            disabled={!canGoNext}
            aria-label="Next period"
            className={ICON_BTN}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <Segmented
          value={activeMetric}
          options={METRIC_OPTIONS}
          onChange={setActiveMetric}
        />
      </div>

      {/* CHART */}
      {hasData ? (
        <>
          <div className="h-[260px] w-full min-w-0 sm:h-[320px] lg:h-[360px]">
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              height="100%"
              width="100%"
            />
          </div>

          {peakSource[peakIndex] > 0 && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Best {granularity}:{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {fullLabels[peakIndex]}
              </span>{" "}
              with{" "}
              {activeMetric === "sales"
                ? `${salesData[peakIndex]} sales`
                : inr(revenueData[peakIndex])}
            </p>
          )}
        </>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              No orders in this period
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Try a longer date range or clear the filters.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreset("90d")}
              className={`h-9 rounded-[10px] border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 ${FOCUS}`}
            >
              Show 90 days
            </button>
            <button
              type="button"
              onClick={resetAll}
              className={`h-9 rounded-[10px] bg-gray-900 px-3 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 ${FOCUS}`}
            >
              Reset filters
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-4 flex flex-col gap-1 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {statusFilter === "valid"
            ? "Valid orders exclude cancelled and unpaid orders."
            : statusFilter === "all"
              ? "Includes every order, even cancelled and unpaid."
              : `Only ${prettify(statusFilter).toLowerCase()} orders.`}
        </span>
        <span>
          {current.total.orders.toLocaleString("en-IN")} orders ·{" "}
          {inr(current.total.revenue)} revenue
        </span>
      </div>
    </div>
  );
}