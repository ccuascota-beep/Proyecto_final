export default function Modal({ isOpen, onClose, children, trailerKey }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
                       bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-7xl h-[92vh]
                           bg-zinc-900 text-white rounded-3xl
                           shadow-2xl p-10 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-5 right-6
                               text-white/70 hover:text-red-500
                               text-3xl font-bold transition-colors"
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
}
