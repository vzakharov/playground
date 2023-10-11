export type SidebarProps<Id extends string = string> = {
  menu?: {
    items: { 
      id: Id,
      emoji: string,
      caption: string,
      disabled?: boolean,
      disabledTooltip?: string
    }[],
    selectedId: Id,
    onSelect: (id: Id) => void
  }
};