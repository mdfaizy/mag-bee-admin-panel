
import React from "react";
import Select, { ActionMeta, MultiValue } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface MultiSelecterInputProps {
  options: Option[];
  value: Option[];
  onChange: (newValue: MultiValue<Option>, actionMeta: ActionMeta<Option>) => void;
  placeholder?: string;
}

const MultiSelecterInput: React.FC<MultiSelecterInputProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
}) => {
  return (
    <Select
      isMulti
     
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      inputId="multi-selecter-input" 
    />
  );
};

export default MultiSelecterInput;
