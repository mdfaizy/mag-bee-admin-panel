"use client";
import { useEffect, useState } from "react";
import {
  getShippingSettingsAPI,
  updateShippingSettingsAPI,
  ShippingSettings,
} from "@/services/shippingSettingService";

const initialSettings: ShippingSettings = {
  freeShippingEnabled: true,
  freeShippingMinimum: 999,
  defaultShippingCharge: 50,
  codEnabled: true,
};

// Clean Reusable Switch Component
function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
        checked ? "bg-emerald-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function ShippingSettingsPage() {
  const [settings, setSettings] = useState<ShippingSettings>(initialSettings);
  const [savedSettings, setSavedSettings] =
    useState<ShippingSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Check if user made unsaved changes
  const hasUnsavedChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings);

  // Fetch settings
  useEffect(() => {
const fetchSettings = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await getShippingSettingsAPI();
    const result = response?.data;

    if (result?.success && result?.data) {
      const normalizedData: ShippingSettings = {
        ...initialSettings,
        ...result.data,
        freeShippingMinimum: Number(
          result.data.freeShippingMinimum
        ),
        defaultShippingCharge: Number(
          result.data.defaultShippingCharge
        ),
      };

      setSettings(normalizedData);
      setSavedSettings(normalizedData);
    } else {
      setError(
        result?.message || "Failed to load shipping settings."
      );
    }
  } catch (err: any) {
    console.error("Fetch shipping settings error:", err);

    setError(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to load shipping settings."
    );
  } finally {
    setLoading(false);
  }
};
    fetchSettings();
  }, []);

  // Handle field updates
  const handleChange = (
    field: keyof ShippingSettings,
    value: boolean | number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    setMessage("");
    setError("");
  };

  // Reset unsaved changes
  const handleDiscard = () => {
    setSettings(savedSettings);
    setMessage("");
    setError("");
  };

  // Save settings
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (settings.freeShippingEnabled && settings.freeShippingMinimum < 0) {
      setError("Minimum order amount cannot be negative.");
      return;
    }

    if (settings.freeShippingEnabled && settings.freeShippingMinimum === 0) {
      setError("Minimum order amount must be greater than zero.");
      return;
    }

    if (settings.defaultShippingCharge < 0) {
      setError("Shipping charge cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        freeShippingEnabled: settings.freeShippingEnabled,
        freeShippingMinimum: Number(settings.freeShippingMinimum),
        defaultShippingCharge: Number(settings.defaultShippingCharge),
        codEnabled: settings.codEnabled,
      };

      const response = await updateShippingSettingsAPI(payload);
      const result = response?.data ?? response;

      if (result?.success) {
        const updatedData: ShippingSettings = result.data
          ? {
              ...settings,
              ...result.data,
              freeShippingMinimum: Number(result.data.freeShippingMinimum),
              defaultShippingCharge: Number(result.data.defaultShippingCharge),
            }
          : payload;

        setSettings(updatedData);
        setSavedSettings(updatedData);
        setMessage(result.message || "Shipping settings saved successfully.");
      } else {
        setError(result?.message || "Failed to save settings.");
      }
    } catch (err: any) {
      console.error("Save shipping settings error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save shipping settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // Skeleton Loader (Real-world UX instead of plain spinner)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 p-4 md:p-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-8 w-56 rounded-lg bg-slate-200" />
          <div className="h-4 w-96 rounded-md bg-slate-200" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <div className="h-52 rounded-2xl bg-slate-200" />
              <div className="h-44 rounded-2xl bg-slate-200" />
              <div className="h-40 rounded-2xl bg-slate-200" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-80 rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24 text-slate-900">
      {/* Top Sticky Action Bar (Appears/highlights when changes are made) */}
      <div
        className={`sticky top-0 z-30 border-b transition-all duration-200 ${
          hasUnsavedChanges
            ? "border-amber-200 bg-amber-50/95 backdrop-blur-md"
            : "border-slate-200/80 bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-8">
          <div className="flex items-center gap-2.5">
            {hasUnsavedChanges ? (
              <>
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-sm font-medium text-amber-900">
                  Unsaved changes
                </span>
              </>
            ) : (
              <>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Store Configuration • Live
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={handleDiscard}
                disabled={saving}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50"
              >
                Discard
              </button>
            )}
            <button
              form="shipping-settings-form"
              type="submit"
              disabled={saving || !hasUnsavedChanges}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              {saving && (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-4 pt-8 md:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Shipping & Delivery
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Configure checkout delivery rates, free shipping thresholds, and
            Cash on Delivery availability.
          </p>
        </div>

        {/* Toast / Alert Banners */}
        {message && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800 shadow-xs">
            <div className="flex items-center gap-2.5 font-medium">
              <svg
                className="h-5 w-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{message}</span>
            </div>
            <button
              type="button"
              onClick={() => setMessage("")}
              className="text-emerald-600 hover:text-emerald-800"
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-800 shadow-xs">
            <div className="flex items-center gap-2.5 font-medium">
              <svg
                className="h-5 w-5 text-rose-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-rose-600 hover:text-rose-800"
            >
              ✕
            </button>
          </div>
        )}

        {/* Two-Column SaaS Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column: Form Controls */}
          <form
            id="shipping-settings-form"
            onSubmit={handleSubmit}
            className="space-y-6 lg:col-span-8"
          >
            {/* 1. Standard Shipping Rate Card */}
            <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-slate-900">
                    Standard Delivery Rate
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Base shipping fee applied to orders that do not qualify for
                    free delivery.
                  </p>

                  <div className="mt-5 max-w-xs">
                    <label
                      htmlFor="defaultShippingCharge"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600"
                    >
                      Flat Rate Fee
                    </label>
                    <div className="relative flex items-center">
                      <span className="pointer-events-none absolute left-3.5 text-sm font-medium text-slate-400">
                        ₹
                      </span>
                      <input
                        id="defaultShippingCharge"
                        type="number"
                        min="0"
                        step="0.01"
                        value={settings.defaultShippingCharge}
                        onChange={(e) =>
                          handleChange(
                            "defaultShippingCharge",
                            Number(e.target.value)
                          )
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-8 pr-14 text-sm font-medium text-slate-900 shadow-2xs transition focus:border-emerald-600 focus:outline-none focus:ring-3 focus:ring-emerald-600/15"
                        required
                      />
                      <span className="pointer-events-none absolute right-3.5 text-xs font-medium text-slate-400">
                        INR
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Free Shipping Threshold Card */}
            <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.8"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-base font-semibold text-slate-900">
                          Free Shipping Threshold
                        </h2>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            settings.freeShippingEnabled
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {settings.freeShippingEnabled ? "Active" : "Off"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Encourage higher cart values by waiving shipping fees
                        above a target amount.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    id="freeShippingToggle"
                    checked={settings.freeShippingEnabled}
                    onChange={(value) =>
                      handleChange("freeShippingEnabled", value)
                    }
                  />
                </div>
              </div>

              {settings.freeShippingEnabled && (
                <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-5">
                  <div className="max-w-xs">
                    <label
                      htmlFor="freeShippingMinimum"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600"
                    >
                      Minimum Cart Subtotal
                    </label>
                    <div className="relative flex items-center">
                      <span className="pointer-events-none absolute left-3.5 text-sm font-medium text-slate-400">
                        ₹
                      </span>
                      <input
                        id="freeShippingMinimum"
                        type="number"
                        min="1"
                        step="0.01"
                        value={settings.freeShippingMinimum}
                        onChange={(e) =>
                          handleChange(
                            "freeShippingMinimum",
                            Number(e.target.value)
                          )
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-8 pr-14 text-sm font-medium text-slate-900 shadow-2xs transition focus:border-emerald-600 focus:outline-none focus:ring-3 focus:ring-emerald-600/15"
                        required
                      />
                      <span className="pointer-events-none absolute right-3.5 text-xs font-medium text-slate-400">
                        INR
                      </span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-xs text-slate-500">
                    Orders worth{" "}
                    <span className="font-semibold text-slate-700">
                      ₹
                      {Number(settings.freeShippingMinimum).toLocaleString(
                        "en-IN"
                      )}
                    </span>{" "}
                    or more will automatically get{" "}
                    <span className="font-semibold text-emerald-700">₹0</span>{" "}
                    shipping.
                  </p>
                </div>
              )}
            </section>

            {/* 3. Cash on Delivery Card */}
            <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-base font-semibold text-slate-900">
                        Cash on Delivery (COD)
                      </h2>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          settings.codEnabled
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {settings.codEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Allow customers to pay in cash or UPI upon delivery.
                      Individual product-level COD exclusions still apply.
                    </p>
                  </div>
                </div>

                <Toggle
                  id="codToggle"
                  checked={settings.codEnabled}
                  onChange={(value) => handleChange("codEnabled", value)}
                />
              </div>
            </section>
          </form>

          {/* Right Column: Live Checkout Simulator / Summary */}
          <aside className="lg:sticky lg:top-20 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Checkout Preview
                  </h3>
                  <p className="text-xs text-slate-500">
                    How rules apply to customer carts
                  </p>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                  Live Rule
                </span>
              </div>

              {/* Scenario Simulation */}
              <div className="mt-5 space-y-4">
                {/* Scenario A: Small Order */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Sample Cart (₹499)</span>
                    <span className="font-medium text-slate-700">
                      Below Threshold
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">Shipping Fee</span>
                    <span className="font-semibold text-slate-900">
                      {settings.defaultShippingCharge === 0
                        ? "Free"
                        : `₹${Number(
                            settings.defaultShippingCharge
                          ).toLocaleString("en-IN")}`}
                    </span>
                  </div>
                </div>

                {/* Scenario B: Qualifying Order */}
                {settings.freeShippingEnabled && (
                  <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-3.5">
                    <div className="flex items-center justify-between text-xs text-emerald-700">
                      <span>
                        Cart ≥ ₹
                        {Number(settings.freeShippingMinimum).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                      <span className="font-semibold">Qualifies</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-slate-700">Shipping Fee</span>
                      <span className="font-bold text-emerald-700">FREE</span>
                    </div>
                  </div>
                )}

                {/* Active Rules Checklist */}
                <div className="border-t border-slate-100 pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Active Policy Summary
                  </p>
                  <ul className="space-y-2.5 text-sm">
                    <li className="flex items-center justify-between">
                      <span className="text-slate-600">Standard Rate</span>
                      <span className="font-semibold text-slate-900">
                        ₹
                        {Number(settings.defaultShippingCharge).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-slate-600">Free Shipping</span>
                      <span className="font-semibold text-slate-900">
                        {settings.freeShippingEnabled
                          ? `Above ₹${Number(
                              settings.freeShippingMinimum
                            ).toLocaleString("en-IN")}`
                          : "Disabled"}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-slate-600">Cash on Delivery</span>
                      <span
                        className={`inline-flex items-center gap-1.5 font-semibold ${
                          settings.codEnabled
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            settings.codEnabled
                              ? "bg-emerald-500"
                              : "bg-slate-300"
                          }`}
                        />
                        {settings.codEnabled ? "Available" : "Unavailable"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}