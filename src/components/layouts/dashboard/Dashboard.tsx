import { useState } from "react";
import { Outlet } from "react-router";

import {
  ContentWrapper,
  LogoutForm,
  PageHeader,
  SideDrawer,
} from "./Dashboard.partials";
import { Modal } from "@/components/organisms/modal/Modal";

export function Dashboard(): React.JSX.Element {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleDrawer = (): void => {
    setShowDrawer((prevState) => !prevState);
  };

  const toggleLogoutModal = (): void => {
    setShowLogoutModal((prevState) => !prevState);
    setShowSettings(false);
  };

  return (
    <main className="w-full h-screen overflow-auto lg:overflow-hidden lg:flex">
      <SideDrawer show={showDrawer} onToggle={toggleDrawer} />
      <article className="lg:grow bg-gray-100 h-full">
        <PageHeader
          showSettings={showSettings}
          onToggleDrawer={toggleDrawer}
          onToggleLogoutModal={toggleLogoutModal}
          onToggleSettings={() => setShowSettings((prevState) => !prevState)}
        />
        <ContentWrapper className="py-4">
          <Outlet />
        </ContentWrapper>
      </article>
      <Modal title="Logout" show={showLogoutModal} onToggle={toggleLogoutModal}>
        <LogoutForm />
      </Modal>
    </main>
  );
}
