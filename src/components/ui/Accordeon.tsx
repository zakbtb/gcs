"use client";

/**
 * Accordéon accessible (FAQ) – adapté du composant « Accordion » de 21st.dev (@ddoemonn) :
 * ouverture animée par ressort, hauteur mesurée automatiquement, navigation clavier
 * (flèches, Début, Fin) et respect de prefers-reduced-motion.
 */
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";

const DISCLOSE = { type: "spring", stiffness: 480, damping: 40, mass: 0.6 } as const;
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function useAutoHeight() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [ready, setReady] = useState(false);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setHeight(el.getBoundingClientRect().height);
    read();
    setReady(true);
    const obs = new ResizeObserver(read);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, height, ready };
}

export type ItemAccordeon = { q: string; r: React.ReactNode };

export function Accordeon({ items, sombre = false }: { items: ItemAccordeon[]; sombre?: boolean }) {
  const base = useId();
  const [ouvert, setOuvert] = useState<number | null>(0);
  const boutons = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();

  const deplacer = useCallback(
    (i: number) => boutons.current[(i + items.length) % items.length]?.focus(),
    [items.length],
  );

  return (
    <div className={`divide-y overflow-hidden rounded-2xl border ${sombre ? "divide-white/10 border-white/10 bg-white/[0.03]" : "divide-line border-line bg-white shadow-card"}`}>
      {items.map((item, i) => (
        <Ligne
          key={item.q}
          item={item}
          ouvert={ouvert === i}
          reduced={Boolean(reduced)}
          sombre={sombre}
          idEntete={`${base}-h-${i}`}
          idPanneau={`${base}-p-${i}`}
          refBouton={(n) => {
            boutons.current[i] = n;
          }}
          onToggle={() => setOuvert(ouvert === i ? null : i)}
          onKey={(e) => {
            const cible = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1 }[e.key];
            if (cible === undefined) return;
            e.preventDefault();
            deplacer(cible);
          }}
        />
      ))}
    </div>
  );
}

function Ligne({
  item,
  ouvert,
  reduced,
  sombre,
  idEntete,
  idPanneau,
  refBouton,
  onToggle,
  onKey,
}: {
  item: ItemAccordeon;
  ouvert: boolean;
  reduced: boolean;
  sombre: boolean;
  idEntete: string;
  idPanneau: string;
  refBouton: (n: HTMLButtonElement | null) => void;
  onToggle: () => void;
  onKey: (e: React.KeyboardEvent) => void;
}) {
  const { ref, height, ready } = useAutoHeight();
  return (
    <div>
      <h3 className="font-sans text-base">
        <button
          ref={refBouton}
          id={idEntete}
          type="button"
          aria-expanded={ouvert}
          aria-controls={idPanneau}
          onClick={onToggle}
          onKeyDown={onKey}
          className={`flex w-full items-center gap-4 px-5 py-5 text-left font-semibold transition-colors sm:px-6 ${sombre ? "text-white hover:bg-white/5" : "text-ink hover:bg-surface"}`}
        >
          <span className="flex-1">{item.q}</span>
          <motion.span
            aria-hidden
            initial={false}
            animate={{ rotate: ouvert ? 45 : 0 }}
            transition={reduced ? { duration: 0 } : DISCLOSE}
            className={`grid size-8 shrink-0 place-items-center rounded-full ${ouvert ? "bg-brand text-white" : sombre ? "bg-white/10 text-white" : "bg-surface text-ink"}`}
          >
            <Plus className="size-4" />
          </motion.span>
        </button>
      </h3>
      <motion.div
        initial={false}
        animate={ready ? { height: ouvert ? height : 0 } : {}}
        transition={reduced ? { duration: 0 } : DISCLOSE}
        style={{ overflow: "hidden", height: ready ? undefined : ouvert ? "auto" : 0 }}
      >
        <div
          ref={ref}
          id={idPanneau}
          role="region"
          aria-labelledby={idEntete}
          inert={!ouvert}
          className={`px-5 pb-6 leading-relaxed sm:px-6 ${sombre ? "text-white/70" : "text-muted"}`}
        >
          {item.r}
        </div>
      </motion.div>
    </div>
  );
}
