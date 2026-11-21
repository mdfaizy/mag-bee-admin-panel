import GstRateForm from "@/components/features/gst/components/GstRateForm";

export default function CreateGstRatePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Create GST Rate
        </h1>

        <p className="text-sm text-gray-500">
          Add a new GST tax rate.
        </p>
      </div>

      <GstRateForm />
    </div>
  );
}