import type { AuthLayoutProps } from "./Auth.types";

import css from "./Auth.module.css";
import { AppLogo } from "@/components/molecules/app-logo/AppLogo";
import { AuthDescriptor } from "./Auth.partials";

export function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps): React.JSX.Element {
  return (
    <main
      className={`${css.main} md:w-full md:h-screen flex items-center justify-center`}
    >
      <section className="md:w-[90%] lg:w-[85%] xl:w-283.75 mx-auto flex justify-end">
        <div>
          <article className="bg-white border border-gray-200 w-125 rounded-lg shadow-md p-4 md:p-8">
            <AppLogo className="mb-4" />
            <AuthDescriptor title={title} description={description} />
            {children}
          </article>
          <p className="text-center mt-8">
            &copy; Jofak Enterprise 2025 - {new Date().getFullYear()} | All
            rights reserved
          </p>
        </div>
      </section>
    </main>
  );
}
