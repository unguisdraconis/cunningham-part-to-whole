// StackedBar.jsx
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const MARGIN = { top: 40, right: 30, bottom: 60, left: 30 };

export default function StackedBar({ data, width = 900, height = 220 }) {
  const svgRef = useRef();

  useEffect(() => {
    console.log("StackedBar render", { data });
    if (!data?.dancers?.length) {
      console.warn("StackedBar: no dancers found", data);
      return;
    }

    const { dancers, total, spectacleCount } = data;
    const innerW = width - MARGIN.left - MARGIN.right;
    const innerH = height - MARGIN.top - MARGIN.bottom;
    const barHeight = 48;

    // Cumulative x positions
    const x = d3.scaleLinear().domain([0, total]).range([0, innerW]);

    const color = d3
      .scaleOrdinal()
      .domain(dancers.map((d) => d.name))
      .range([
        "#1f77b4",
        "#ff7f0e",
        "#2ca02c",
        "#d62728",
        "#9467bd",
        "#8c564b",
        "#e377c2",
        "#7f7f7f",
        "#bcbd22",
        "#17becf",
        "#aec7e8",
        "#ffbb78",
        "#98df8a",
        "#ff9896",
        "#c5b0d5",
        "#c7c7c7",
      ]);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    // Title
    g.append("text")
      .attr("x", innerW / 2)
      .attr("y", -16)
      .attr("text-anchor", "middle")
      .attr("font-size", 15)
      .attr("font-weight", 600)
      .text(`Cast Appearances Across ${spectacleCount} Works (${total} total)`);

    // Build cumulative offsets
    let cumulative = 0;
    const segments = dancers.map((d) => {
      const seg = { ...d, x0: cumulative };
      cumulative += d.count;
      return seg;
    });

    // Tooltip
    const tooltip = d3
      .select("body")
      .selectAll(".stacked-tip")
      .data([0])
      .join("div")
      .attr("class", "stacked-tip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("background", "#222")
      .style("color", "#fff")
      .style("padding", "6px 10px")
      .style("border-radius", "4px")
      .style("font-size", "13px")
      .style("opacity", 0);

    // Bar segments
    g.selectAll("rect.segment")
      .data(segments)
      .join("rect")
      .attr("class", "segment")
      .attr("x", (d) => x(d.x0))
      .attr("y", 0)
      .attr("width", (d) => x(d.count))
      .attr("height", barHeight)
      .attr("fill", (d) => color(d.name))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.name}</strong><br/>${d.count} appearances (${(d.pct * 100).toFixed(1)}%)`,
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    // Inline labels for segments wide enough (clamp to chart edges)
    g.selectAll("text.label")
      .data(segments)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => {
        const center = x(d.x0) + x(d.count) / 2;
        return Math.min(Math.max(center, 10), innerW - 10);
      })
      .attr("y", barHeight / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => {
        const segmentW = x(d.count);
        if (segmentW < 80) return "start";
        if (segmentW > innerW - 20) return "end";
        return "middle";
      })
      .attr("font-size", 11)
      .attr("fill", "#fff")
      .attr("pointer-events", "none")
      .text((d) => {
        const segmentW = x(d.count);
        if (segmentW < 50) return "";
        if (segmentW < 120) {
          const firstParts = d.name.split(" ").slice(0, 2).join(" ");
          return firstParts.length < d.name.length
            ? `${firstParts}...`
            : d.name;
        }
        return d.name;
      });

    // Legend below the bar
    const legendY = barHeight + 20;
    const cols = 4;
    const colW = innerW / cols;

    const legend = g
      .selectAll("g.legend")
      .data(segments)
      .join("g")
      .attr("class", "legend")
      .attr(
        "transform",
        (_, i) =>
          `translate(${(i % cols) * colW}, ${legendY + Math.floor(i / cols) * 20})`,
      );

    legend
      .append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("rx", 2)
      .attr("fill", (d) => color(d.name));

    legend
      .append("text")
      .attr("x", 16)
      .attr("y", 10)
      .attr("font-size", 11)
      .text((d) => `${d.name} (${d.count})`);

    // Percentage axis on top of bar
    const pctAxis = d3
      .axisBottom(d3.scaleLinear().domain([0, 100]).range([0, innerW]))
      .ticks(10)
      .tickFormat((d) => d + "%");

    g.append("g")
      .attr("transform", `translate(0, ${barHeight})`)
      .call(pctAxis)
      .selectAll("text")
      .attr("font-size", 10);
  }, [data, width, height]);

  return <svg ref={svgRef} />;
}
