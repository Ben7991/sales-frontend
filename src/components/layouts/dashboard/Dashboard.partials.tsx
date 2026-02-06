import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { RxCaretDown, RxCaretUp, RxDashboard } from "react-icons/rx";
import {
  LiaClipboardCheckSolid,
  LiaUserCogSolid,
  LiaUsersCogSolid,
} from "react-icons/lia";
import {
  PiChartLineUp,
  PiClipboardText,
  PiHamburger,
  PiUsers,
  PiUsersThree,
} from "react-icons/pi";
import {
  TbFileDescription,
  TbFilePencil,
  TbLogout,
  TbReport,
} from "react-icons/tb";
import { LuCircleUserRound } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";
import { BsDashLg } from "react-icons/bs";
import { RiPencilLine } from "react-icons/ri";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { FaRegMoneyBillAlt } from "react-icons/fa";

import { Form } from "@/components/atoms/form/Form";
import { Button } from "@/components/atoms/button/Button";
import { UserProfile } from "@/components/molecules/user-profile/UserProfile";
import type {
  ContentWrapperProps,
  PageHeaderProps,
  SideDrawerProps,
} from "./Dashboard.types";
import { Backdrop } from "@/components/atoms/backdrop/Backdrop";
import {
  isPreferredUrl,
  logout,
  rootNavLinkClasses,
  subNavLinkClasses,
} from "./Dashboard.utils";
import { AppLogo } from "@/components/molecules/app-logo/AppLogo";
import { useAppDispatch } from "@/store/index.util";
import { removeAuthUser } from "@/store/slice/auth/auth.slice";
import { AUTH_STATE } from "@/utils/constants.utils";
import { getPaginatedData } from "@/utils/helpers.utils";

export function SideDrawer({
  show,
  onToggle,
}: SideDrawerProps): React.JSX.Element {
  const { pathname } = useLocation();

  const [showInventoryLinks, setShowInventoryLinks] = useState(false);
  const [showSalesLinks, setShowSalesLinks] = useState(false);

  return (
    <>
      {show && <Backdrop onToggle={onToggle} />}
      <aside
        className={`fixed top-0 left-0 overflow-x-hidden overflow-y-auto h-screen lg:static lg:basis-75 bg-gray-200 py-5 lg:px-5 lg:py-10 flex flex-col justify-between ${
          show ? "w-75 px-5 transition-[width] z-10" : "w-0 "
        }`}
      >
        <div>
          <AppLogo className="mb-5 px-3 lg:mb-10" />
          <div className="flex flex-col gap-2">
            <NavLink to="/dashboard" className={rootNavLinkClasses} end>
              <RxDashboard className="text-xl" />
              <span>Dashboard</span>
            </NavLink>

            <p className="mt-4 ps-3 flex items-center gap-2">
              <BsDashLg className="text-xl" />
              <strong className="font-semibold">Product Sourcing</strong>
            </p>
            <NavLink to="/dashboard/suppliers" className={rootNavLinkClasses}>
              <PiUsers className="text-xl" />
              <span>Suppliers</span>
            </NavLink>
            <NavLink to="/dashboard/purchase" className={rootNavLinkClasses}>
              <span className="flex items-center gap-2">
                <PiClipboardText className="text-xl" />
                <span>Purchase</span>
              </span>
            </NavLink>

            <p className="mt-4 ps-3 flex items-center gap-2">
              <BsDashLg className="text-xl" />
              <strong className="font-semibold">Sales Management</strong>
            </p>
            <NavLink to="/dashboard/customers" className={rootNavLinkClasses}>
              <PiUsersThree className="text-xl" />
              <span>Customers</span>
            </NavLink>
            <button
              className={`flex items-center justify-between py-1.5 px-3  rounded-md ${
                isPreferredUrl(pathname, "/dashboard/inventory")
                  ? "bg-green-700 text-white"
                  : "hover:bg-gray-300"
              }`}
              onClick={() => setShowInventoryLinks((prevState) => !prevState)}
            >
              <span className="flex items-center gap-2">
                <LiaClipboardCheckSolid className="text-xl" />
                <span>Inventory</span>
              </span>
              {showInventoryLinks ? (
                <RxCaretUp className="text-xl" />
              ) : (
                <RxCaretDown className="text-xl" />
              )}
            </button>
            <AnimatePresence>
              {showInventoryLinks && (
                <motion.div
                  className="ps-6 space-y-1 overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                >
                  <NavLink
                    to="/dashboard/inventory/categories-products"
                    className={subNavLinkClasses}
                  >
                    <TbFilePencil className="text-[1.15rem]" />
                    <span>Categories & Products</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard/inventory/available-stocks"
                    className={subNavLinkClasses}
                  >
                    <TbFileDescription className="text-[1.15rem]" />
                    <span>Available Stocks</span>
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className={`flex items-center justify-between py-1.5 px-3  rounded-md ${
                isPreferredUrl(pathname, "/dashboard/sales")
                  ? "bg-green-700 text-white"
                  : "hover:bg-gray-300"
              }`}
              onClick={() => setShowSalesLinks((prevState) => !prevState)}
            >
              <span className="flex items-center gap-2">
                <PiChartLineUp className="text-xl" />
                <span>Sales</span>
              </span>
              {showSalesLinks ? (
                <RxCaretUp className="text-xl" />
              ) : (
                <RxCaretDown className="text-xl" />
              )}
            </button>
            <AnimatePresence>
              {showSalesLinks && (
                <motion.div
                  className="ps-6 space-y-1 overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                >
                  <NavLink
                    to="/dashboard/sales/order"
                    className={subNavLinkClasses}
                  >
                    <RiPencilLine className="text-[1.15rem]" />
                    <span>Create or Edit Order</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard/sales/order-history"
                    className={subNavLinkClasses}
                  >
                    <MdOutlineFormatListBulleted className="text-[1.15rem]" />
                    <span>Order History</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard/sales/arrears"
                    className={subNavLinkClasses}
                  >
                    <FaRegMoneyBillAlt className="text-[1.15rem]" />
                    <span>Arrears</span>
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>

            <NavLink to="/dashboard/report" className={rootNavLinkClasses}>
              <TbReport className="text-xl" />
              <span>Report</span>
            </NavLink>

            <p className="mt-4 ps-3 flex items-center gap-2">
              <BsDashLg className="text-xl" />
              <strong className="font-semibold">Employee Management</strong>
            </p>
            <NavLink to="/dashboard/employees" className={rootNavLinkClasses}>
              <LiaUsersCogSolid className="text-xl" />
              <span>Employees</span>
            </NavLink>
          </div>
        </div>
        <UserProfile className="mt-10 md:mt-0" />
      </aside>
    </>
  );
}

export function LogoutForm(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await logout();
      dispatch(removeAuthUser());
      localStorage.removeItem(AUTH_STATE);
      navigate("/");
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <p className="mb-4">
        Are you sure you want to sign out of your account? Any unsaved changes
        may be lost.
      </p>
      <Form.Group>
        <Button
          type="submit"
          el="button"
          disabled={isLoading}
          variant="primary"
        >
          {isLoading ? <Button.Loader /> : "Yes, logout"}
        </Button>
      </Form.Group>
    </Form>
  );
}

export function ContentWrapper({
  className,
  children,
}: ContentWrapperProps): React.JSX.Element {
  return <div className={`px-4 lg:px-6 xl:px-8 ${className}`}>{children}</div>;
}

export function PageHeader({
  showSettings,
  onToggleLogoutModal,
  onToggleSettings,
  onToggleDrawer,
}: PageHeaderProps): React.JSX.Element {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const { perPage, query } = getPaginatedData(searchParams);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const query = event.currentTarget.value;

    debounceTimerRef.current = setTimeout(() => {
      if (query) {
        navigate(`${pathname}?page=${1}&perPage=${perPage}&q=${query}`);
      } else {
        navigate(`${pathname}?page=${1}&perPage=${perPage}`);
      }
    }, 500);
  };

  return (
    <header className="py-4 border-b border-b-gray-300">
      <ContentWrapper className="flex items-center justify-between">
        <div className="basis-50 md:basis-75">
          <Form.Control
            id="search"
            type="search"
            placeholder="Search"
            leftIcon={<IoSearchOutline />}
            onChange={handleSearch}
            defaultValue={query}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            className="inline-block lg:hidden"
            onClick={onToggleDrawer}
            type="button"
          >
            <PiHamburger className="text-2xl" />
          </button>
          <div className="relative">
            <button
              className="flex items-center gap-1 hover:text-green-600 hover:cursor-pointer"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSettings();
              }}
            >
              <LuCircleUserRound className="text-2xl" />
              <RxCaretDown />
            </button>
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="absolute top-10 right-0 overflow-y-hidden flex flex-col bg-white w-50 space-y-2 p-2 shadow-lg border border-gray-200 rounded-md"
                >
                  <Link
                    to="/dashboard/account-settings"
                    className="flex items-center gap-1 hover:bg-gray-200 px-2 rounded-sm py-1"
                    onClick={onToggleSettings}
                  >
                    <LiaUserCogSolid className="text-2xl" />
                    <span>Account Settings</span>
                  </Link>
                  <button
                    className="flex items-center gap-1 w-full hover:bg-gray-200 px-2 rounded-sm py-1"
                    type="button"
                    onClick={onToggleLogoutModal}
                  >
                    <TbLogout className="text-2xl" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ContentWrapper>
    </header>
  );
}
