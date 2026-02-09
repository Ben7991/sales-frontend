import { useCallback, useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router";

import {
  ContentWrapper,
  LogoutForm,
  PageHeader,
  SideDrawer,
} from "./Dashboard.partials";
import { Modal } from "@/components/organisms/modal/Modal";
import { getPaginatedData } from "@/utils/helpers.utils";

export function Dashboard(): React.JSX.Element {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [searchParams] = useSearchParams();

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

  const { query } = getPaginatedData(searchParams);

  return (
    <main className="w-full h-screen overflow-hidden lg:flex">
      <SideDrawer show={showDrawer} onToggle={toggleDrawer} />
      <article className="lg:basis-[calc(100%-300px)] bg-gray-100 h-full flex flex-col">
        <PageHeader
          key={query}
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
