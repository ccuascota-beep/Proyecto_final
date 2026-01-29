export default function Modal({ isOpen, onClose, children, trailerKey }) {
    if (!isOpen) return null;

    return (
        <div
            className="
                fixed inset-0 z-50 flex items-center justify-center
                bg-black/80 backdrop-blur-sm
                transition-opacity
            "
            onClick={onClose}
        >
            <div
                className="
                    relative w-full max-w-7xl h-[92vh]
                    bg-zinc-900 text-white
                    rounded-3xl
                    shadow-[0_0_60px_rgba(234,179,8,0.25)]
                    p-10
                    overflow-y-auto
                    border border-white/10
                "
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="
                        absolute top-5 right-6
                        text-white/60
                        hover:text-red-500
                        hover:scale-110
                        text-3xl font-bold
                        transition-all
                    "
                >✕
                </button>

                {children}
            </div>
        </div>
    );
}
