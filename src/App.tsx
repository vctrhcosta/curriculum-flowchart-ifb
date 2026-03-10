import FlowChart from './components/FlowChart';
import ElectivesPanel from './components/ElectivesPanel';
import Legend from './components/Legend';
import StatsBar from './components/StatsBar';
import { useCourseState } from './hooks/useCourseState';

export default function App() {
  const {
    getStatus,
    arePrereqsMet,
    toggleStatus,
    reset,
    completedMandatory,
    completedElectives,
  } = useCourseState();

  return (
    <div className="min-h-screen bg-white p-6 max-w-[1400px] mx-auto flex flex-col gap-5">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Fluxograma Curricular - Design de Produto (IFB)
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Tecnologia em Design de Produto - Instituto Federal de Brasilia
        </p>
      </header>

      <StatsBar
        completedMandatory={completedMandatory}
        completedElectives={completedElectives}
        onReset={reset}
      />

      <Legend />

      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Disciplinas Obrigatórias + Optativas com Pré-requisito
        </h2>
        <FlowChart
          getStatus={getStatus}
          arePrereqsMet={arePrereqsMet}
          toggleStatus={toggleStatus}
        />
      </section>

      <section>
        <ElectivesPanel getStatus={getStatus} toggleStatus={toggleStatus} />
      </section>
    </div>
  );
}
