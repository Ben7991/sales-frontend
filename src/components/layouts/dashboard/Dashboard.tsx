import { useCallback, useEffect, useState } from "react";
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

  const handleOutsideClick = useCallback((): void => {
    setShowSettings(false);
  }, []);

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [handleOutsideClick]);

  const toggleDrawer = (): void => {
    setShowDrawer((prevState) => !prevState);
  };

  const toggleLogoutModal = (): void => {
    setShowLogoutModal((prevState) => !prevState);
    setShowSettings(false);
  };

  return (
    <main className="w-full h-screen overflow-hidden lg:flex">
      <SideDrawer show={showDrawer} onToggle={toggleDrawer} />
      <article className="lg:grow bg-gray-100 h-full flex flex-col">
        <PageHeader
          showSettings={showSettings}
          onToggleDrawer={toggleDrawer}
          onToggleLogoutModal={toggleLogoutModal}
          onToggleSettings={() => setShowSettings((prevState) => !prevState)}
        />
        <ContentWrapper className="py-4 overflow-x-auto grow">
          <Outlet />
        </ContentWrapper>
      </article>
      <Modal title="Logout" show={showLogoutModal} onHide={toggleLogoutModal}>
        <LogoutForm />
      </Modal>
    </main>
  );
}
