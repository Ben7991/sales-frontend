import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { LiaTimesSolid } from "react-icons/lia";

import { Backdrop } from "@/components/atoms/backdrop/Backdrop";
import { Headline } from "@/components/atoms/headline/Headline";

type ModalProps = {
  children: React.ReactNode;
  title: string;
  show: boolean;
  onHide: VoidFunction;
};

export function Modal({
  title,
  show,
  children,
  onHide: onHide,
}: ModalProps): React.JSX.Element {
  return createPortal(
    <>
      {show && <Backdrop onToggle={onHide} />}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 -translate-1/2 bg-white rounded-lg w-[90%] md:w-125 z-50"
          >
            <div className="flex items-center justify-between border-b border-b-gray-300 py-4 px-5 rounded-t-lg overflow-hidden">
              <Headline tag="h4">{title}</Headline>
              <button className="hover:text-red-600" onClick={onHide}>
                <LiaTimesSolid className="text-2xl" />
              </button>
            </div>
            <div className="py-4 px-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.querySelector("#portal-modal") as HTMLDivElement,
  );
}
