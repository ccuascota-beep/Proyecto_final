export default function SearchBar({ value, onChange }) {
    return (
        <div className="mb-10 max-w-md relative group">
            <span className="absolute inset-y-0 left-4 flex items-center text-zinc-400 group-focus-within:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </span>
            <input
                type="text"
                placeholder="Buscar película..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-50
                border border-zinc-200 transition-all duration-200
                hover:border-zinc-300
                focus:bg-white focus:border-black focus:outline-none focus:shadow-lg"
            />
        </div>
    );
}