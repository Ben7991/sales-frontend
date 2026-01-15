export type SideDrawerProps = {
  show: boolean;
  onToggle: VoidFunction;
};

export type ContentWrapperProps = {
  className?: string;
  children: React.ReactNode;
};

export type PageHeaderProps = {
  showSettings: boolean;
  onToggleLogoutModal: VoidFunction;
  onToggleSettings: VoidFunction;
  onToggleDrawer: VoidFunction;
};
