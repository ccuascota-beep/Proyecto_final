export default function SearchBar({ value, onChange }) {
    return (
        <div className="mb-10 max-w-md mx-auto">
            <input
                type="text"
                placeholder="Buscar película..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 rounded-xl bg-white
                border border-zinc-300 shadow-md
                focus:outline-none focus:ring-2 focus:ring-black"
            />
        </div>
    );
}
