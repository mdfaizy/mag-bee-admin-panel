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
export default function ShippingSettingsPage() {
  const [settings, setSettings] = useState<ShippingSettings>(initialSettings);
  const [savedSettings, setSavedSettings] =
    useState<ShippingSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    fetchSettings();
  }, []);
 const fetchSettings = async () => {
  try {
    setLoading(true);
    setError("");
    const response = await getShippingSettingsAPI();
    const result = response.data;
    if (result.success && result.data) {
      const normalizedData: ShippingSettings = {
        ...initialSettings,
        ...result.data,
        freeShippingMinimum: Number(result.data.freeShippingMinimum),
        defaultShippingCharge: Number(result.data.defaultShippingCharge),
      };
      setSettings(normalizedData);
      setSavedSettings(normalizedData);
    } else {
      setError(
        result.message || "Failed to load shipping settings."
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
  const openEditor = () => {
    setSettings(savedSettings);
    setMessage("");
    setError("");
    setEditing(true);
  };

  const closeEditor = () => {
    setSettings(savedSettings); // Revert unsaved changes on cancel
    setError("");
    setEditing(false);
  };

  const handleChange = (
    field: keyof ShippingSettings,
    value: boolean | number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (settings.freeShippingEnabled && settings.freeShippingMinimum <= 0) {
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

const result = response.data;

if (result.success) {
  const updated: ShippingSettings = {
    ...settings,
    ...result.data,
    freeShippingMinimum: Number(
      result.data.freeShippingMinimum
    ),
    defaultShippingCharge: Number(
      result.data.defaultShippingCharge
    ),
  };

  setSettings(updated);
  setSavedSettings(updated);
  setEditing(false);
  setMessage(result.message || "Shipping settings updated successfully.");
} else {
  setError(result.message || "Update failed");
}
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to update shipping settings"
      );
    } finally {
      setSaving(false);
    }
  };

  // Skeleton Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/70 p-4 md:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-7 w-48 rounded-lg bg-slate-200" />
              <div className="h-4 w-72 rounded-md bg-slate-200" />
            </div>
            <div className="h-10 w-32 rounded-lg bg-slate-200" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-200" />
            ))}
          </div>
          <div className="h-72 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Shipping Settings
              </h1>
              <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                Global
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Manage store-wide delivery charges, free shipping rules, and COD
              availability.
            </p>
          </div>

          <button
            type="button"
            onClick={openEditor}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/15"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Edit Settings
          </button>
        </div>

        {/* Toast Notification (When drawer is closed) */}
        {message && !editing && (
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            <div className="flex items-center gap-2.5">
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
              onClick={() => setMessage("")}
              className="text-emerald-600 hover:text-emerald-900"
            >
              ✕
            </button>
          </div>
        )}

        {error && !editing && (
          <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-rose-600 hover:text-rose-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* 4 KPI Status Cards (Uses savedSettings so preview stays accurate) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Free Shipping
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <Status enabled={savedSettings.freeShippingEnabled} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Minimum Order
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                  />
                </svg>
              </span>
            </div>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {savedSettings.freeShippingEnabled
                ? `₹${savedSettings.freeShippingMinimum.toLocaleString("en-IN")}`
                : "N/A"}
            </h3>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Default Charge
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                  />
                </svg>
              </span>
            </div>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              ₹{savedSettings.defaultShippingCharge.toLocaleString("en-IN")}
            </h3>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cash on Delivery
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <Status enabled={savedSettings.codEnabled} />
            </div>
          </div>
        </div>

        {/* Configuration Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Active Shipping Rules
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Click any rule to modify global checkout behavior.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Rule Name
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Configured Value
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* Row 1 */}
                <tr
                  onClick={openEditor}
                  className="cursor-pointer transition hover:bg-slate-50/90"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      Free Shipping Threshold
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      Waives delivery charges above minimum subtotal
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm font-medium text-slate-700">
                    {savedSettings.freeShippingEnabled
                      ? `Min ₹${savedSettings.freeShippingMinimum.toLocaleString(
                          "en-IN"
                        )}`
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <Status enabled={savedSettings.freeShippingEnabled} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900">
                      Configure →
                    </span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr
                  onClick={openEditor}
                  className="cursor-pointer transition hover:bg-slate-50/90"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      Default Shipping Charge
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      Standard flat delivery fee per order
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm font-medium text-slate-700">
                    ₹
                    {savedSettings.defaultShippingCharge.toLocaleString(
                      "en-IN"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Status enabled={true} label="Active" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900">
                      Configure →
                    </span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr
                  onClick={openEditor}
                  className="cursor-pointer transition hover:bg-slate-50/90"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      Cash on Delivery (COD)
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      Global pay-on-delivery option at checkout
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {savedSettings.codEnabled ? "Allowed" : "Restricted"}
                  </td>
                  <td className="px-6 py-4">
                    <Status enabled={savedSettings.codEnabled} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900">
                      Configure →
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Real-World Slide-Over Drawer for Editing */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={closeEditor}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Edit Shipping Rules
                </h2>
                <p className="text-xs text-slate-500">
                  Changes apply immediately across your store checkout.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <form
              id="drawer-settings-form"
              onSubmit={handleSave}
              className="flex-1 space-y-6 overflow-y-auto p-6"
            >
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700">
                  {error}
                </div>
              )}

              {/* Free Shipping Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Enable Free Shipping
                    </h3>
                    <p className="text-xs text-slate-500">
                      Offer free delivery above a cart value
                    </p>
                  </div>
                  <Toggle
                    checked={settings.freeShippingEnabled}
                    onChange={(value) =>
                      handleChange("freeShippingEnabled", value)
                    }
                  />
                </div>

                {settings.freeShippingEnabled && (
                  <div className="border-t border-slate-200/80 pt-4">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Minimum Order Amount
                    </label>
                    <div className="relative flex items-center">
                      <span className="pointer-events-none absolute left-3.5 text-sm font-medium text-slate-400">
                        ₹
                      </span>
                      <input
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
                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-8 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Default Shipping Charge */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Default Shipping Charge
                </label>
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-3.5 text-sm font-medium text-slate-400">
                    ₹
                  </span>
                  <input
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
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-8 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                    required
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  Applied when an order doesn&apos;t qualify for free shipping.
                </p>
              </div>

              {/* COD Box */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Cash on Delivery (COD)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Allow pay-on-delivery at checkout
                  </p>
                </div>
                <Toggle
                  checked={settings.codEnabled}
                  onChange={(value) => handleChange("codEnabled", value)}
                />
              </div>
            </form>

            {/* Drawer Sticky Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={closeEditor}
                disabled={saving}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                form="drawer-settings-form"
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Crisp Status Badge with Dot */
function Status({
  enabled,
  label,
}: {
  enabled: boolean;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        enabled
          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
          : "bg-slate-100 text-slate-600 ring-slate-500/10"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          enabled ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {label || (enabled ? "Enabled" : "Disabled")}
    </span>
  );
}

/* Reusable Accessible Switch */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
        checked ? "bg-emerald-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}