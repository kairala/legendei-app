import { View } from "react-native";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMemo } from "react";

export type PlatformName = "Instagram" | "Facebook" | "TickTok" | "LinkedIn";

export const PLATFORM_OPTIONS: { value: PlatformName; label: string }[] = [
  {
    label: "Instagram",
    value: "Instagram",
  },
  {
    label: "Facebook",
    value: "Facebook",
  },
  {
    label: "TickTok",
    value: "TickTok",
  },
  {
    label: "LinkedIn",
    value: "LinkedIn",
  },
];

export const PlatformSelect = ({
  value,
  onChange,
}: {
  value: PlatformName | undefined;
  onChange: (value?: PlatformName) => void;
}) => {
  const valueOption = useMemo(() => {
    return PLATFORM_OPTIONS.find((option) => option.value === value);
  }, [value]);

  return (
    <View>
      <Label className="mb-2">Plataforma</Label>
      <Select
        defaultValue={valueOption}
        onValueChange={(option) => onChange(option?.value as PlatformName)}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            className="text-foreground text-sm native:text-lg"
            placeholder="Selecione uma Plataforma"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {PLATFORM_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                label={option.label}
                className="text-sm native:text-lg"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </View>
  );
};
