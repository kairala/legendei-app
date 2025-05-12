import { ScrollView, View } from "react-native";
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

export type StyleName =
  | "criativo"
  | "profissional"
  | "divertido"
  | "romântico"
  | "informativo"
  | "engraçado"
  | "inspirador"
  | "reflexivo"
  | "motivacional"
  | "descontraído"
  | "sério"
  | "dramático"
  | "sarcástico"
  | "irônico"
  | "otimista"
  | "pessimista"
  | "realista"
  | "sonhador"
  | "pragmático"
  | "idealista";

export const STYLE_OPTIONS: { value: StyleName; label: string }[] = [
  {
    label: "Criativo",
    value: "criativo",
  },
  {
    label: "Profissional",
    value: "profissional",
  },
  {
    label: "Divertido",
    value: "divertido",
  },
  {
    label: "Romântico",
    value: "romântico",
  },
  {
    label: "Informativo",
    value: "informativo",
  },
  {
    label: "Engraçado",
    value: "engraçado",
  },
  {
    label: "Inspirador",
    value: "inspirador",
  },
  {
    label: "Reflexivo",
    value: "reflexivo",
  },
  {
    label: "Motivacional",
    value: "motivacional",
  },
  {
    label: "Sarcástico",
    value: "sarcástico",
  },
  {
    label: "Irônico",
    value: "irônico",
  },
  {
    label: "Otimista",
    value: "otimista",
  },
  {
    label: "Pessimista",
    value: "pessimista",
  },
  {
    label: "Realista",
    value: "realista",
  },
  {
    label: "Sonhador",
    value: "sonhador",
  },
  {
    label: "Pragmático",
    value: "pragmático",
  },
  {
    label: "Idealista",
    value: "idealista",
  },
];

export const StyleSelect = ({
  value,
  onChange,
}: {
  value: StyleName | undefined;
  onChange: (value?: StyleName) => void;
}) => {
  const valueOption = useMemo(() => {
    return STYLE_OPTIONS.find((option) => option.value === value);
  }, [value]);

  return (
    <View>
      <Label className="mb-2">Estilo</Label>
      <Select
        defaultValue={valueOption}
        onValueChange={(option) => onChange(option?.value as StyleName)}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            className="text-foreground text-sm native:text-lg"
            placeholder="Selecione um Estilo"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <ScrollView>
              {STYLE_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  className="text-sm native:text-lg"
                >
                  {option.label}
                </SelectItem>
              ))}
            </ScrollView>
          </SelectGroup>
        </SelectContent>
      </Select>
    </View>
  );
};
