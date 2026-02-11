import { useEffect, useRef } from "react";
import { LiaCheckCircle, LiaTimesCircle, LiaTimesSolid } from "react-icons/lia";
import { motion } from "motion/react";

import type { AlertProps } from "./Alert.types";

export function Alert({
  message,
  variant,
  onHide,
}: AlertProps): React.JSX.Element {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onHide();
    }, 2000);

    window.addEventListener("click", onHide);
    return () => {
      window.removeEventListener("click", onHide);
    };
  }, [onHide]);

  const isSuccess = variant === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 10 }}
      className={`fixed top-10 left-1/2 -translate-x-1/2 flex items-center justify-between w-[90%] md:w-112.5 py-3 px-4 rounded-md z-50 ${
        isSuccess
          ? "bg-green-100 border border-green-300"
          : "bg-red-100 border border-red-300"
      } shadow-md`}
    >
      <div
        className={`flex gap-2 basis-3/4 ${
          isSuccess ? "text-green-600" : "text-red-600"
        }`}
      >
        <div className="basis-8">
          {variant === "success" ? (
            <LiaCheckCircle className="text-2xl" />
          ) : (
            <LiaTimesCircle className="text-2xl" />
          )}
        </div>
        {message}
      </div>
      <button
        className="inline-block text-gray-600 hover:text-red-600"
        onClick={onHide}
      >
        <LiaTimesSolid className="text-2xl" />
      </button>
    </motion.div>
  );
}
