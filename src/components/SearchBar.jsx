import React from "react";

export default function SearchBar({ value, onChange }) {
    return (
        <div className="mb-8 max-w-md mx-auto bg-black">
            <input
                type="text"
                placeholder="Buscar película..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
          w-full px-4 py-3
          rounded-2xl
          bg-white/90
          border border-zinc-300
          text-zinc-800
          shadow-md
          transition-all duration-300
          hover:border-zinc-400
          focus:outline-none
          focus:ring-2
          focus:ring-black
          focus:border-black

        "
            />
        </div>
    );
}