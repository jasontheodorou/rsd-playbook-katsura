// Copied from the-rsd-playbook src/components/DiscoveryStar.tsx for the pattern library's record of the original build.
'use client'

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import "./DiscoveryStar.css";

export type DiscoveryStarPoint = {
  id: string;
  title: string;
  body: string;
  icon?: ReactNode;
};

export type DiscoveryStarProps = {
  points: [
    DiscoveryStarPoint,
    DiscoveryStarPoint,
    DiscoveryStarPoint,
    DiscoveryStarPoint,
    DiscoveryStarPoint,
    DiscoveryStarPoint
  ];
  className?: string;
  ariaLabel?: string;
  /**
   * Text shown in the pill at the centre of the star once every point has
   * been discovered. Pass an empty string to suppress the pill entirely (the
   * celebration animation still runs).
   */
  completionMessage?: string;
};

// Positions sit right on the six tips of the star. The star shape uses
// inset:7% and a polygon whose extremities are 0%/100% in x and 0%/100% in y
// within that inset box, so the true tips in the outer container are:
//   top          (50%,  7%)
//   top-right    (93%, 29.4%)
//   bottom-right (93%, 70.6%)
//   bottom       (50%, 93%)
//   bottom-left  (7%,  70.6%)
//   top-left     (7%,  29.4%)
const HOTSPOTS = [
  { left: "50%", top: "7%" },
  { left: "93%", top: "29.4%" },
  { left: "93%", top: "70.6%" },
  { left: "50%", top: "93%" },
  { left: "7%", top: "70.6%" },
  { left: "7%", top: "29.4%" },
] as const;

// Card opens on the same side of the star as the clicked point. Top and bottom
// default to right/left for visual balance across the six positions.
//
// `origin` is the CSS transform-origin for the card, chosen so the emergence
// animation appears to spawn from the star point that was clicked. Right cards
// originate at their left edge; left cards at their right edge. The vertical %
// is where the star point aligns inside the card box.
const CARD_POSITIONS = [
  { side: "right", top: "2%",  origin: "0% 20%" },    // 0 — top
  { side: "right", top: "20%", origin: "0% 40%" },    // 1 — top-right
  { side: "right", top: "56%", origin: "0% 55%" },    // 2 — bottom-right
  { side: "left",  top: "72%", origin: "100% 75%" },  // 3 — bottom
  { side: "left",  top: "56%", origin: "100% 55%" },  // 4 — bottom-left
  { side: "left",  top: "20%", origin: "100% 40%" },  // 5 — top-left
] as const;

export function DiscoveryStar({
  points,
  className = "",
  ariaLabel = "Interactive six-point star",
  completionMessage = "You've discovered all six.",
}: DiscoveryStarProps) {
  const [active, setActive] = useState<number | null>(null);
  const [visited, setVisited] = useState<Set<number>>(() => new Set());
  const [celebrated, setCelebrated] = useState(false);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  // Progress-bar completion happens the moment the sixth point is clicked.
  // The star colour cycle and "We're all in" text hold back until the final
  // card is dismissed, so the user has time to read it first.
  const allVisited = visited.size === points.length;

  useEffect(() => {
    if (allVisited && active === null && !celebrated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- copied unchanged from the original build
      setCelebrated(true);
    }
  }, [allVisited, active, celebrated]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      // Non-Element targets (rare — text nodes, window itself) count as outside.
      if (!(target instanceof Element)) {
        setActive(null);
        return;
      }
      // Keep the card open if the click was on a hotspot (about to switch cards)
      // or on the card itself (user is reading / interacting). Everything else
      // — star body, page background, other slide content — closes it.
      if (
        target.closest(".v-discovery-star__hotspot") ||
        target.closest(".v-discovery-star__card")
      ) {
        return;
      }
      setActive(null);
    }

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function select(index: number) {
    setActive(index);
    setVisited((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Escape", "Enter", " "].includes(event.key)) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setActive(null);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(index);
      return;
    }

    event.preventDefault();
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = (index + delta + points.length) % points.length;
    const nextButton = rootRef.current?.querySelector<HTMLButtonElement>(
      `[data-point="${next}"]`
    );
    nextButton?.focus();
    select(next);
  }

  const activePoint = active !== null ? points[active] : null;
  const activePosition = active !== null ? CARD_POSITIONS[active] : null;

  return (
    <div
      ref={rootRef}
      className={`v-discovery-star ${className}`}
      aria-label={ariaLabel}
      data-completed={celebrated}
    >
      <div className="v-discovery-star__shape" aria-hidden="true" />

      {points.map((point, index) => {
        const isActive = active === index;
        const isVisited = visited.has(index);
        const hotspot = HOTSPOTS[index];

        return (
          <button
            key={point.id}
            type="button"
            className="v-discovery-star__hotspot"
            style={{ left: hotspot.left, top: hotspot.top }}
            data-active={isActive}
            data-visited={isVisited}
            data-point={index}
            aria-label={`Open ${point.title}`}
            aria-expanded={isActive}
            onClick={(event) => {
              event.stopPropagation();
              select(index);
            }}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span className="v-discovery-star__pulse" aria-hidden="true" />
            <span className="v-discovery-star__dot" aria-hidden="true" />
          </button>
        );
      })}

      <div
        className="v-discovery-star__progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={points.length}
        aria-valuenow={visited.size}
        aria-label="Points discovered"
      >
        <div className="v-discovery-star__progress-track">
          <div
            className="v-discovery-star__progress-fill"
            style={{ width: `${(visited.size / points.length) * 100}%` }}
          />
        </div>
        <span className="v-discovery-star__progress-label">
          {allVisited ? "All six discovered" : `${visited.size} of ${points.length}`}
        </span>
      </div>

      <div className="v-discovery-star__completion-wrap" aria-hidden={!celebrated}>
        <AnimatePresence>
          {celebrated && completionMessage && (
            <motion.span
              key="completion"
              className="v-discovery-star__completion"
              initial={reduced ? false : { opacity: 0, scale: 0.75 }}
              animate={
                reduced
                  ? { opacity: 1, scale: 1 }
                  : { opacity: [0, 1, 1, 0], scale: [0.75, 1.06, 1, 0.9] }
              }
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 1.8, times: [0, 0.16, 0.66, 1], delay: 1.9, ease: [0.2, 0.8, 0.2, 1] }
              }
              role="status"
              aria-live="polite"
            >
              {completionMessage}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activePoint && activePosition && (
          <motion.aside
            key={activePoint.id}
            className="v-discovery-star__card"
            data-side={activePosition.side}
            style={{ top: activePosition.top, transformOrigin: activePosition.origin }}
            initial={
              reduced
                ? false
                : {
                    opacity: 0,
                    scale: 0.12,
                    x: activePosition.side === "right" ? -24 : 24,
                  }
            }
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={
              reduced
                ? undefined
                : {
                    opacity: 0,
                    scale: 0.2,
                    x: activePosition.side === "right" ? -12 : 12,
                  }
            }
            transition={{ duration: reduced ? 0 : 0.42, ease: [0.16, 0.8, 0.24, 1] }}
            role="dialog"
            aria-live="polite"
          >
            <button
              type="button"
              className="v-discovery-star__close"
              aria-label="Close"
              onClick={() => setActive(null)}
            >
              ×
            </button>

            <div className="v-discovery-star__eyebrow">
              {activePoint.icon && (
                <span className="v-discovery-star__eyebrow-icon" aria-hidden="true">
                  {activePoint.icon}
                </span>
              )}
              {activePoint.title}
            </div>

            <p className="v-discovery-star__body">
              {activePoint.body}
            </p>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
