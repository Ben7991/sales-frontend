import { Link, useSearchParams } from "react-router";
import { motion } from "motion/react";

import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { ChangePassword, PersonalInformation } from "./AccountSettings.partial";

type AccountSettingsTab = "personal" | "passcode" | null;

export function AccountSettings(): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") as AccountSettingsTab;
  const isChangePassword = activeTab === "passcode";

  return (
    <>
      <PageDescriptor
        title="Account settings"
        description="Manage your personal information and keep your account secure by changing your password."
      />
      <div className="flex items-center gap-3 border-b-gray-300 border-b-4 pb-2 relative mb-4 md:mb-7">
        <Link
          to="/dashboard/account-settings?tab=personal"
          className={`py-1.5 px-3 inline-block hover:bg-gray-200 rounded-sm ${
            !isChangePassword ? "text-green-600" : ""
          }`}
        >
          Personal Information
        </Link>
        <Link
          to="/dashboard/account-settings?tab=passcode"
          className={`py-1.5 px-3 inline-block hover:bg-gray-200 rounded-sm ${
            isChangePassword ? "text-green-600" : ""
          }`}
        >
          Change Password
        </Link>
        <motion.div
          animate={{
            translateX: isChangePassword ? "184px" : "0",
            width: isChangePassword ? "153.766px" : "171.594px",
          }}
          className="absolute -bottom-1 left-0 h-1 bg-green-600"
        />
      </div>
      {isChangePassword ? <ChangePassword /> : <PersonalInformation />}
    </>
  );
}
