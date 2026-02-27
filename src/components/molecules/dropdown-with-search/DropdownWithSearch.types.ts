import type { PreferredAlertPropsForForm } from "@/utils/types.utils";

export type DropdownWithSearchProps<T> = {
  placeholder: string;
  selectedItem?: T;
  children?: React.ReactNode;
  onSetSelectedItem: (item?: T) => void;
  onGetValue: (item?: T) => string;
  onGetItems: (query: string) => Promise<{ count: number; data: Array<T> }>;
} & Pick<PreferredAlertPropsForForm, "onSetAlertDetails">;
