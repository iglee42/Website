import Select, {
    SingleValue,
    StylesConfig,
} from "react-select";
import { getIconByStatus, getStatusByNumber, Idea } from "../types/idea";
import React from "react";

export type StatusOption = {
    value: number;
    label: string;
    icon: React.ReactNode;
    isDisabled: boolean;
};

type StatusSelectProps = {
    statusEntries: [string, number][];
    onChange?: (option: StatusOption | null) => void;
    currentIdea: Idea;
};

// Styles typés
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
};

export default function StatusSelect({ statusEntries, onChange, currentIdea }: StatusSelectProps) {
    const options: StatusOption[] = statusEntries.map(([_, value]) => ({
        value,
        label: getStatusByNumber(value),
        icon: getIconByStatus(value, "mr-2 icon"),
        isDisabled: value === currentIdea.status,
    }));

    const formatOptionLabel = (option: StatusOption) => (
        <div className="flex items-center">
            {option.icon}
            <span>{option.label}</span>
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
            className="mb-1 mt-1"
            id="mod-sel"
            aria-label="Select a Status"
        />
    );
}
  