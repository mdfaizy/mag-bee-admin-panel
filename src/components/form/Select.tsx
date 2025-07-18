// import React, { useState } from "react";

// interface Option {
//   value: string;
//   label: string;
// }

// interface SelectProps {
//   options: Option[];
//   placeholder?: string;
//   onChange: (value: string) => void;
//   className?: string;
//   defaultValue?: string;
// }
  
// const Select: React.FC<SelectProps> = ({
//   options,
//   placeholder = "Select an option",
//   onChange,
//   className = "",
//   defaultValue = "",
// }) => {
//   // Manage the selected value
//   const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

//   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedValue(value);
//     onChange(value); // Trigger parent handler
//   };
 
//   return (
//     <select
//       className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
//         selectedValue
//           ? "text-gray-800 dark:text-white/90"
//           : "text-gray-400 dark:text-gray-400"
//       } ${className}`}
//       value={selectedValue}
//       onChange={handleChange}
//     >
//       {/* Placeholder option */}
//       <option
//         value=""
//         disabled
//         className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
//       >
//         {placeholder}
//       </option>
//       {/* Map over options */}
//       {options.map((option) => (
//         <option
//           key={option.value}
//           value={option.value}
//           className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
//         >
//           {option.label}
//         </option>
//       ))}
//     </select>
//   );
// };

// export default Select;


// import React from "react";

// interface RoleOption {
//   value: string;
//   label: string;
// }

// interface SelectProps {
//   options: RoleOption[];
//   value?: string;
//   placeholder?: string;
//   onChange: (value: string) => void;
// }

// export default function Select({ options, placeholder, onChange, value }: SelectProps) {
//   return (
//     <select
//       className="w-full border rounded p-2"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//     >
//       {placeholder && <option value="">{placeholder}</option>}
//       {options.map((opt) => (
//         <option key={opt.value} value={opt.value}>
//           {opt.label}
//         </option>
//       ))}
//     </select>
//   );
// }













import React from "react";

interface RoleOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: RoleOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;  // Allow custom styles
}

export default function Select({
  options,
  placeholder,
  onChange,
  value,
  className
}: SelectProps) {
  return (
    <select
      className={`w-full border rounded p-2 ${className || ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
