import type { ReplayMoment } from "@/data/moments";

type MatchSelectorProps = {
    moments: readonly ReplayMoment[]
    onSelect: (id: string) => void;
}

export default function MatchSelector({
    moments,
    onSelect
}: MatchSelectorProps) {
    return(
    <main>
        <section className="hero">
            <div className="hero-left">
                <h1>
                    360
                </h1>
            </div>
            <div className="hero-right">
                <h2>
                Data driven
                <br />
                football visualisations
                </h2>
            </div>
        
        </section>
      <section>
        <div>
          {moments.map((moment) => (
            <button
              key={moment.id}
              disabled={moment.status === "coming-soon"}
              onClick={() => onSelect(moment.id)}
            >
              <span>{moment.fixture}</span>
              <span>
                {moment.status === "ready"
                  ? moment.description
                  : "Coming soon"}
              </span>
            </button>
          ))}
        </div>
        <div>{/* Empty preview frame for now */}</div>
      </section>
    </main>
    )
}