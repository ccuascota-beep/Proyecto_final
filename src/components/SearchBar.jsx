import React from "react";

export default function SearchBar({ value, onChange }) {
    return (
        <div className="mb-8 max-w-md">
            <input
                type="text"
                placeholder=" Buscar película..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 rounded-xl border border-zinc-300
                           focus:outline-none focus:ring-2 focus:ring-black"
            />
        </div>
    );
}