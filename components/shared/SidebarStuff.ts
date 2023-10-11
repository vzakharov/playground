export type SidebarMenu<MenuItemId extends string> = {
  items: {
    id: MenuItemId;
    emoji?: string;
    caption?: string;
    disabled?: boolean;
    disabledTooltip?: string;
  }[];
  selectionRef: { value: MenuItemId };
};