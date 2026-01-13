import React from "react";

export default function Modal({ isOpen, onClose, children }) {

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="min-w-md bg-white p-6 rounded-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-xl font-bold"
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
}