import React from "react";
import { X } from "lucide-react";

const MobileModal = ({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  maxWidth = "max-w-lg",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-950/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className={`bg-brand-900/90 backdrop-blur-sm w-full md:${maxWidth} rounded-t-lg md:rounded-lg border border-brand-700/50 shadow-lg max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="sticky top-0 bg-brand-900/80 border-b border-brand-700/50 p-4 md:p-6 flex items-center justify-between backdrop-blur-sm">
          <h2 className="text-lg md:text-xl font-semibold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-800 rounded-lg transition text-brand-300 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 text-white">{children}</div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="sticky bottom-0 bg-brand-900/80 border-t border-brand-700/50 p-4 md:p-6 flex gap-3 flex-col-reverse md:flex-row backdrop-blur-sm">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${action.className || "btn-primary"}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileModal;
