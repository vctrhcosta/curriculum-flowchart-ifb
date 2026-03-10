interface StatsBarProps {
  completedMandatory: number;
  completedElectives: number;
  onReset: () => void;
}

export default function StatsBar({ completedMandatory, completedElectives, onReset }: StatsBarProps) {
  return (
    <div className="flex items-center justify-between bg-gray-100 rounded-xl px-5 py-3">
      <div className="flex gap-6 text-sm font-medium text-gray-700">
        <span>
          Obrigatórias:{' '}
          <span className="text-blue-600 font-bold">{completedMandatory}/18</span>
        </span>
        <span>
          Optativas:{' '}
          <span className="text-emerald-600 font-bold">{completedElectives}/34</span>
        </span>
        <span>
          Total:{' '}
          <span className="text-gray-900 font-bold">
            {completedMandatory + completedElectives}/52
          </span>
        </span>
      </div>
      <button
        onClick={onReset}
        className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
      >
        Resetar Progresso
      </button>
    </div>
  );
}
