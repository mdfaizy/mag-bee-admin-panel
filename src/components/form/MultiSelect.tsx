// import React from 'react';
// import Select from 'react-select';

// export interface PrivilegeOption {
//   value: string;
//   label: string;
// }

// interface MultiSelecterInputProps {
//   options: PrivilegeOption[];
//   value: PrivilegeOption[];
//   onChange: (selected: PrivilegeOption[] | null) => void;
//   placeholder?: string;
// }

// const MultiSelecterInput: React.FC<MultiSelecterInputProps> = ({
//   options,
//   value,
//   onChange,
//   placeholder,
// }) => {
//   return (
//     <Select
//       isMulti
//       options={options}
//       value={value}
//       onChange={(selected) => onChange(selected as PrivilegeOption[] | null)}
//       placeholder={placeholder}
//     />
//   );
// };

// export default MultiSelecterInput;



"use client";
import React from "react";
import Select, { GroupBase, MultiValue } from "react-select";

export interface PrivilegeOption {
  value: string;
  label: string;
}

interface MultiSelecterInputProps {
  options: PrivilegeOption[];
  value: PrivilegeOption[];
  onChange: (selected: PrivilegeOption[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const MultiSelecterInput: React.FC<MultiSelecterInputProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select privileges",
  isDisabled = false,
  isLoading = false,
}) => {
  // 🔹 Group privileges (USER, PRODUCT, ORDER...)
  const groupedOptions: GroupBase<PrivilegeOption>[] = React.useMemo(() => {
    const groups: Record<string, PrivilegeOption[]> = {};

    options.forEach((opt) => {
      const group = opt.label.split("_")[0]; // USER, PRODUCT, ORDER
      if (!groups[group]) groups[group] = [];
      groups[group].push(opt);
    });

    return Object.keys(groups).map((key) => ({
      label: key,
      options: groups[key],
    }));
  }, [options]);

  return (
    <Select
      isMulti
      isSearchable
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      options={groupedOptions}
      value={value}
      onChange={(val: MultiValue<PrivilegeOption>) =>
        onChange(val as PrivilegeOption[])
      }
      placeholder={placeholder}
      isDisabled={isDisabled}
      isLoading={isLoading}
      menuPlacement="auto"
      classNamePrefix="react-select"
      styles={{
        menu: (base) => ({
          ...base,
          maxHeight: 260,
          overflowY: "auto",
        }),
        control: (base) => ({
          ...base,
          minHeight: 44,
          borderRadius: 8,
        }),
      }}
    />
  );
};

export default MultiSelecterInput;
