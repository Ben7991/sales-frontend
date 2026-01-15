import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { LiaTimesSolid } from "react-icons/lia";

import { Backdrop } from "@/components/atoms/backdrop/Backdrop";
import { Headline } from "@/components/atoms/headline/Headline";

type ModalProps = {
  children: React.ReactNode;
  title: string;
  show: boolean;
  onToggle: VoidFunction;
};

export function Modal({
  title,
  show,
  children,
  onToggle,
}: ModalProps): React.JSX.Element {
  return createPortal(
    <>
      {show && <Backdrop onToggle={onToggle} />}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 -translate-1/2 bg-white rounded-lg overflow-hidden w-[90%] md:w-112.5"
          >
            <div className="flex items-center justify-between border border-gray-300 p-4">
              <Headline tag="h4">{title}</Headline>
              <button className="hover:text-red-600" onClick={onToggle}>
                <LiaTimesSolid className="text-2xl" />
              </button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.querySelector("#portal-modal") as HTMLDivElement
  );
}
