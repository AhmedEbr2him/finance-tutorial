'use client';

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreateableSelect from "react-select/creatable";

interface SelectProps {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { label: string, value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
}

export const Select = (
  { onChange,
    onCreate,
    disabled,
    options = [],
    placeholder,
    value
  }: SelectProps) => {
  const onSelect = (
    options: SingleValue<{ label: string, value: string }>
  ) => {
    onChange(options?.value);
  }

  const formattedValue = useMemo(() => {
    return options.find(option => option.value === value);
  }, [options, value]);


  return (
    <CreateableSelect
      placeholder={placeholder}
      className="text-sm h-10"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2e8f0",
          ":hover": {
            borderColor: "#e2e8f0",
          }
        })
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  )
}