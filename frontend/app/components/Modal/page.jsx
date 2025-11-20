"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, children, title }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  // disable background scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // handle ESC key
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // trap focus basic: move focus into dialog on open
  useEffect(() => {
    if (open && dialogRef.current) {
      // focus first focusable element or the dialog
      const focusable = dialogRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable || dialogRef.current).focus();
    }
  }, [open]);

  if (!open) return null;

  const modalContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onMouseDown={(e) => {
          // close when user clicks the backdrop (not when clicking inside content)
          if (e.target === overlayRef.current || e.target === e.currentTarget) {
            onClose();
          }
        }}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        className="relative z-10 w-[min(95%)] md:w-[min(68%)] max-h-[90vh] overflow-auto rounded-2xl bg-white p-6 shadow-xl
                   transform transition-all duration-200 ease-out
                   scale-100"
        // stop propagation so clicks inside don't trigger backdrop close
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-start justify-between gap-4">
         

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="mt-4 text-[#525252]">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
