// "use client";
// import React, { useState } from "react";
// import ComponentCard from "../../common/ComponentCard";
// import TextArea from "../input/TextArea";
// import Label from "../Label";

// export default function TextAreaInput() {
//   const [message, setMessage] = useState("");
//   const [messageTwo, setMessageTwo] = useState("");
//   return (
//     <ComponentCard title="Textarea input field">
//       <div className="space-y-6">
//         {/* Default TextArea */}
//         <div>
//           <Label>Description</Label>
//           <TextArea
//             value={message}
//             onChange={(value) => setMessage(value)}
//             rows={6}
//           />
//         </div>

//         {/* Disabled TextArea */}
//         <div>
//           <Label>Description</Label>
//           <TextArea rows={6} disabled />
//         </div>

//         {/* Error TextArea */}
//         <div>
//           <Label>Description</Label>
//           <TextArea
//             rows={6}
//             value={messageTwo}
//             error
//             onChange={(value) => setMessageTwo(value)}
//             hint="Please enter a valid message."
//           />
//         </div>
//       </div>
//     </ComponentCard>
//   );
// }



interface TextAreaProps {
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

export default function TextArea({
  value,
  onChange,
  rows = 4,
  disabled = false,
  error = false,
  hint,
}: TextAreaProps) {
  return (
    <div>
      <textarea
        className={`border rounded p-2 w-full ${error ? 'border-red-500' : 'border-gray-300'}`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)} // convert event to value here
        rows={rows}
        disabled={disabled}
      />
      {error && hint && <p className="text-red-500 text-sm mt-1">{hint}</p>}
    </div>
  );
}
