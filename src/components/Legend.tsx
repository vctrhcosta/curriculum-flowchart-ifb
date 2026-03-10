const items = [
  { color: 'bg-blue-500', label: 'Obrigatória' },
  { color: 'bg-emerald-500', label: 'Optativa' },
  { color: 'bg-green-700', label: 'Concluída' },
  { color: 'bg-amber-400', label: 'Cursando (borda)', border: true },
  { color: 'bg-blue-500/40', label: 'Bloqueada (pré-req.)' },
];

export default function Legend() {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-gray-700">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div
            className={`w-4 h-4 rounded ${item.color} ${item.border ? 'ring-2 ring-amber-400' : ''}`}
          />
          <span>{item.label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        Clique para alternar: padrão &rarr; cursando &rarr; concluída &rarr; padrão
      </div>
    </div>
  );
}
