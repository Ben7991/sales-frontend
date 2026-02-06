import { AnimatePresence, motion } from "motion/react";
import { LiaTimesSolid } from "react-icons/lia";

import { Backdrop } from "@/components/atoms/backdrop/Backdrop";
import { Headline } from "@/components/atoms/headline/Headline";

type OffCanvasProps = {
  title: string;
  children: React.ReactNode;
  show: boolean;
  onHide: VoidFunction;
};

export function OffCanvas({
  title,
  show,
  children,
  onHide,
}: OffCanvasProps): React.JSX.Element {
  return (
    <>
      {show && <Backdrop onToggle={onHide} />}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 right-0 w-full h-screen md:w-1/2 lg:w-1/2 xl:w-2/5 overflow-y-auto bg-white z-50 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <Headline tag="h4">{title}</Headline>
              <button className="hover:text-red-700" onClick={onHide}>
                <LiaTimesSolid className="text-2xl" />
              </button>
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
