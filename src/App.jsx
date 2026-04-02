// src/App.jsx
import React, { useMemo } from "react";
import StackedBar from "./StackedBar";
import { parseDancerData } from "./parseData";

export default function App() {
  const data = useMemo(() => parseDancerData(), []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1 style={{ fontSize: 20 }}>Merce Cunningham Dance Company</h1>
      <h2 style={{ fontSize: 15, fontWeight: 400, color: "#666" }}>
        Dancer Appearances — Number and Percentage of Total Performances
      </h2>
      <StackedBar data={data} width={960} height={300} />
      <p style={{ marginTop: 12, fontSize: 13, color: "#444" }}>
        Bardiot, C. (2020). Merce Cunningham (Version 1) [Data set]. Zenodo.
        https://doi.org/10.5281/zenodo.3774548
      </p>
    </div>
  );
}
