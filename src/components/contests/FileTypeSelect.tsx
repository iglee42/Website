import Select, {
  SingleValue,
  StylesConfig,
} from "react-select";
import { FileType } from "../../types/contest";
import React from "react";

export type StatusOption = {
  value: FileType;
  isDisabled: boolean;

};

type StatusSelectProps = {
  types: FileType[];
  onChange?: (option: StatusOption | null) => void;
  currentFileType: FileType | null;
  disabled?: boolean
};

const customStyles: StylesConfig<StatusOption, false> = {
  control: (base) => ({
    ...base,
    padding: "4px 8px",
    borderRadius: "0.5rem",
    borderColor: "#d1d5db", // gray-300
    boxShadow: "none",
    "&:hover": { borderColor: "#9ca3af" },
  }),
  option: (base, state) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: state.isFocused ? "#f3f4f6" : "white",
    color: "black",
    padding: "8px 12px",
  }),
  singleValue: (base) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }),
};

export default function FileTypeSelect({
  types,
  onChange,
  currentFileType,
  disabled
}: StatusSelectProps) {
  const options: StatusOption[] = types.map((t) => ({
    value: t,
    isDisabled: t === currentFileType,
  }));

  const formatOptionLabel = (option: StatusOption) => (
    <div className="flex items-center">
      <span>{option.value.name} ({option.value.allowed_types})</span>
    </div>
  );

  const handleChange = (selected: SingleValue<StatusOption>) => {
    onChange?.(selected);
  };

  return (
    <Select<StatusOption, false>
      options={options}
      styles={customStyles}
      formatOptionLabel={formatOptionLabel}
      onChange={handleChange}
      isDisabled={disabled}
      className="mb-1 mt-1"
      aria-label="Select a Status"
    />
  );
}
