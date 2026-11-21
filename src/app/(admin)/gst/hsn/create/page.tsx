import HsnForm from "@/components/features/gst/components/HsnForm";

export default function CreateHsnPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Create HSN
        </h1>

        <p className="text-sm text-gray-500">
          Add a new HSN code.
        </p>
      </div>

      <HsnForm />
    </div>
  );
}