// src/parseData.js
import rawTsv from "./data/cunningham.tsv?raw";

export function parseDancerData() {
  const lines = rawTsv.trim().split(/\r?\n/);
  const spectacles = [];
  let current = null;

  const isCandidateName = (name) => {
    if (!name || name.length < 2) return false;
    if (name === "N" || name === "Y") return false;
    if (/^-?\d+(\.\d+)?(,-?\d+(\.\d+)?)?$/.test(name)) return false; // coordinates or numbers
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(name)) return false; // dates
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(name)) return false; // time durations
    return true;
  };

  const gatherCastNames = (cols, indexes = [6]) => {
    indexes.forEach((idx) => {
      const cell = cols[idx];
      const name = cell?.trim();
      if (!isCandidateName(name)) return;
      if (current && !current.cast.includes(name)) {
        current.cast.push(name);
      }
    });
  };

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim()) continue;

    const cols = rawLine.split("\t");
    const firstCol = cols[0]?.trim();

    if (firstCol) {
      current = { title: firstCol, cast: [] };
      spectacles.push(current);
      gatherCastNames(cols, [6]);
    } else if (current) {
      gatherCastNames(cols, [5, 6]);
    }
  }

  // Aggregate
  const counts = {};
  spectacles.forEach((s) =>
    s.cast.forEach((name) => {
      counts[name] = (counts[name] || 0) + 1;
    }),
  );

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const topN = 15;
  const top = sorted.slice(0, topN).map(([name, count]) => ({ name, count }));
  const otherCount = sorted.slice(topN).reduce((sum, [, c]) => sum + c, 0);
  if (otherCount > 0) top.push({ name: "Other", count: otherCount });

  const total = top.reduce((s, d) => s + d.count, 0);
  top.forEach((d) => (d.pct = d.count / total));

  return { dancers: top, total, spectacleCount: spectacles.length };
}
