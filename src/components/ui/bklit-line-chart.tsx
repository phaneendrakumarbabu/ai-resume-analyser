import React, { createContext, useContext, useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ChartMarker {
  date: string | Date;
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

interface LineChartContextType {
  data: Record<string, any>[];
  xDataKey: string;
  status: "loading" | "ready";
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
  xPositions: number[];
  yScales: Record<string, (val: number) => number>;
  padding: { top: number; right: number; bottom: number; left: number };
  width: number;
  height: number;
  registerSeries: (key: string) => void;
  seriesKeys: string[];
}

const LineChartContext = createContext<LineChartContextType | null>(null);

export function useLineChart() {
  const ctx = useContext(LineChartContext);
  if (!ctx) {
    throw new Error("LineChart subcomponents must be used within <LineChart>");
  }
  return ctx;
}

export interface LineChartProps {
  data: Record<string, any>[];
  xDataKey?: string;
  status?: "loading" | "ready";
  loadingLabel?: string;
  yDomainTween?: boolean;
  aspectRatio?: string;
  className?: string;
  children: React.ReactNode;
}

export function LineChart({
  data = [],
  xDataKey = "date",
  status = "ready",
  loadingLabel,
  aspectRatio = "2.5 / 1",
  className,
  children,
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 260 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [seriesKeys, setSeriesKeys] = useState<string[]>([]);

  const padding = { top: 20, right: 24, bottom: 32, left: 32 };

  const registerSeries = (key: string) => {
    setSeriesKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width || 600;
        const h = entry.contentRect.height || 260;
        setDimensions({ width: w, height: Math.max(180, h) });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;
  const innerWidth = Math.max(10, width - padding.left - padding.right);
  const innerHeight = Math.max(10, height - padding.top - padding.bottom);

  // X positions calculation
  const xPositions = useMemo(() => {
    if (!data.length) return [];
    if (data.length === 1) return [padding.left + innerWidth / 2];
    return data.map((_, i) => padding.left + (i / (data.length - 1)) * innerWidth);
  }, [data, innerWidth, padding.left]);

  // Y scales calculation
  const yScales = useMemo(() => {
    const scales: Record<string, (val: number) => number> = {};
    const keys = seriesKeys.length > 0 ? seriesKeys : ["value", "skillMatch", "atsScore"];

    keys.forEach((key) => {
      const values = data
        .map((d) => Number(d[key]))
        .filter((v) => !isNaN(v));
      const min = values.length ? Math.min(...values, 0) : 0;
      const max = values.length ? Math.max(...values, 100) : 100;
      const range = max - min || 1;

      scales[key] = (val: number) => {
        const normalized = (val - min) / range;
        return padding.top + innerHeight - normalized * innerHeight;
      };
    });

    return scales;
  }, [data, seriesKeys, innerHeight, padding.top]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!xPositions.length || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    let closestIdx = 0;
    let minDiff = Infinity;
    xPositions.forEach((pos, idx) => {
      const diff = Math.abs(pos - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setHoveredIndex(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <LineChartContext.Provider
      value={{
        data,
        xDataKey,
        status,
        hoveredIndex,
        setHoveredIndex,
        xPositions,
        yScales,
        padding,
        width,
        height,
        registerSeries,
        seriesKeys,
      }}
    >
      <div
        ref={containerRef}
        className={cn("relative w-full overflow-hidden select-none", className)}
        style={{ aspectRatio }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {status === "loading" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-card/60 backdrop-blur-xs">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
            {loadingLabel && (
              <span className="text-xs font-medium text-muted-foreground animate-pulse">
                {loadingLabel}
              </span>
            )}
          </div>
        )}

        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {children}
        </svg>
      </div>
    </LineChartContext.Provider>
  );
}

// ----------------------------------------------------
// <Grid /> Component
// ----------------------------------------------------
export interface GridProps {
  horizontal?: boolean;
  vertical?: boolean;
  numTicksRows?: number;
  stroke?: string;
  strokeDasharray?: string;
  highlightRowValues?: number[];
  shimmer?: boolean;
}

export function Grid({
  horizontal = true,
  vertical = false,
  numTicksRows = 5,
  stroke = "var(--border)",
  strokeDasharray = "4,4",
  highlightRowValues,
  shimmer = false,
}: GridProps) {
  const { width, height, padding, xPositions } = useLineChart();
  const innerHeight = height - padding.top - padding.bottom;

  const rowPositions = useMemo(() => {
    const rows: number[] = [];
    for (let i = 0; i < numTicksRows; i++) {
      rows.push(padding.top + (i / (numTicksRows - 1)) * innerHeight);
    }
    return rows;
  }, [numTicksRows, innerHeight, padding.top]);

  return (
    <g className="chart-grid">
      {horizontal &&
        rowPositions.map((y, idx) => (
          <line
            key={`h-${idx}`}
            x1={padding.left}
            y1={y}
            x2={width - padding.right}
            y2={y}
            stroke={stroke}
            strokeDasharray={strokeDasharray}
            strokeOpacity={0.4}
          />
        ))}

      {vertical &&
        xPositions.map((x, idx) => (
          <line
            key={`v-${idx}`}
            x1={x}
            y1={padding.top}
            x2={x}
            y2={height - padding.bottom}
            stroke={stroke}
            strokeDasharray={strokeDasharray}
            strokeOpacity={0.3}
          />
        ))}

      {highlightRowValues &&
        highlightRowValues.map((val, idx) => (
          <line
            key={`hl-${idx}`}
            x1={padding.left}
            y1={height - padding.bottom - val}
            x2={width - padding.right}
            y2={height - padding.bottom - val}
            stroke="var(--foreground)"
            strokeWidth={1.5}
            strokeOpacity={0.6}
          />
        ))}
    </g>
  );
}

// ----------------------------------------------------
// <Line /> Component
// ----------------------------------------------------
export interface LineProps {
  dataKey: string;
  stroke?: string;
  strokeWidth?: number;
  showHighlight?: boolean;
  showMarkers?: boolean;
  dashFromIndex?: number;
  dashArray?: string;
}

export function Line({
  dataKey,
  stroke = "var(--primary)",
  strokeWidth = 2.5,
  showHighlight = true,
  showMarkers = false,
  dashFromIndex,
  dashArray = "6,4",
}: LineProps) {
  const { data, xPositions, yScales, registerSeries, hoveredIndex } = useLineChart();

  useEffect(() => {
    registerSeries(dataKey);
  }, [dataKey, registerSeries]);

  const scaleY = yScales[dataKey] || ((v: number) => 100);

  const points = useMemo(() => {
    return data.map((d, i) => ({
      x: xPositions[i] || 0,
      y: scaleY(Number(d[dataKey]) || 0),
      val: d[dataKey],
    }));
  }, [data, dataKey, xPositions, scaleY]);

  if (points.length === 0) return null;

  // Build SVG path d string using smooth bezier curves
  const pathD = useMemo(() => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  return (
    <g className="chart-line">
      {/* Glow background path */}
      <path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth + 3}
        strokeOpacity={0.15}
        strokeLinecap="round"
      />

      {/* Main animated line */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: [0.85, 0, 0.15, 1] }}
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Scatter Markers along line */}
      {showMarkers &&
        points.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r={hoveredIndex === idx ? 5 : 3}
            fill={stroke}
            className="transition-all duration-200"
          />
        ))}
    </g>
  );
}

// ----------------------------------------------------
// <XAxis /> Component
// ----------------------------------------------------
export interface XAxisProps {
  tickMode?: "data" | "domain";
  numTicks?: number;
}

export function XAxis({ tickMode = "data" }: XAxisProps) {
  const { data, xDataKey, xPositions, height, padding, hoveredIndex } = useLineChart();

  const yPos = height - padding.bottom + 18;

  return (
    <g className="chart-xaxis">
      {data.map((item, idx) => {
        const x = xPositions[idx];
        const isHovered = hoveredIndex === idx;
        const label = String(item[xDataKey] || "");

        return (
          <text
            key={idx}
            x={x}
            y={yPos}
            textAnchor="middle"
            fill={isHovered ? "var(--foreground)" : "var(--muted-foreground)"}
            fontSize={11}
            fontWeight={isHovered ? 600 : 400}
            className="transition-colors duration-150"
          >
            {label}
          </text>
        );
      })}
    </g>
  );
}

// ----------------------------------------------------
// <ChartTooltip /> Component
// ----------------------------------------------------
export interface ChartTooltipProps {
  showDatePill?: boolean;
  showCrosshair?: boolean;
  showDots?: boolean;
  children?: React.ReactNode;
}

export function ChartTooltip({
  showDatePill = true,
  showCrosshair = true,
  showDots = true,
  children,
}: ChartTooltipProps) {
  const { data, xDataKey, hoveredIndex, xPositions, yScales, seriesKeys, height, padding, width } =
    useLineChart();

  if (hoveredIndex === null || !data[hoveredIndex]) return null;

  const currentPoint = data[hoveredIndex];
  const activeX = xPositions[hoveredIndex];
  const dateLabel = String(currentPoint[xDataKey] || "");

  // Calculate tooltip popover placement (avoid overflowing container edges)
  const isRightHalf = activeX > width / 2;
  const tooltipX = isRightHalf ? activeX - 170 : activeX + 16;
  const tooltipY = padding.top + 10;

  return (
    <g className="chart-tooltip pointer-events-none">
      {/* Vertical Crosshair Line */}
      {showCrosshair && (
        <line
          x1={activeX}
          y1={padding.top}
          x2={activeX}
          y2={height - padding.bottom}
          stroke="var(--foreground)"
          strokeOpacity={0.25}
          strokeDasharray="4,4"
          strokeWidth={1.5}
        />
      )}

      {/* Dots on active points */}
      {showDots &&
        seriesKeys.map((key, idx) => {
          const scaleY = yScales[key];
          if (!scaleY) return null;
          const val = currentPoint[key];
          if (val === undefined) return null;
          const y = scaleY(Number(val));

          return (
            <g key={key}>
              <circle cx={activeX} cy={y} r={7} fill="var(--background)" stroke="var(--foreground)" strokeWidth={2} />
              <circle cx={activeX} cy={y} r={3} fill="var(--foreground)" />
            </g>
          );
        })}

      {/* ForeignObject overlay for glassmorphic HTML Tooltip Card */}
      <foreignObject x={tooltipX} y={tooltipY} width={160} height={120} className="overflow-visible">
        <div className="rounded-lg border border-border/80 bg-card/95 backdrop-blur-xl p-3 shadow-xl text-xs space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
          {showDatePill && (
            <div className="font-semibold text-foreground border-b border-border/60 pb-1 flex items-center justify-between">
              <span>{dateLabel}</span>
            </div>
          )}

          {children || (
            <div className="space-y-1 pt-0.5">
              {seriesKeys.map((key) => {
                const val = currentPoint[key];
                if (val === undefined) return null;
                return (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </span>
                    <span className="font-mono font-bold text-foreground">{val}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
}

// ----------------------------------------------------
// <ChartMarkers /> Component
// ----------------------------------------------------
export interface ChartMarkersProps {
  items: ChartMarker[];
  size?: number;
}

export function ChartMarkers({ items = [], size = 26 }: ChartMarkersProps) {
  const { data, xDataKey, xPositions, padding, height } = useLineChart();

  if (!items.length) return null;

  return (
    <g className="chart-markers">
      {items.map((marker, idx) => {
        const dateStr =
          marker.date instanceof Date ? marker.date.toLocaleDateString() : String(marker.date);

        // Find matching data index
        const matchIdx = data.findIndex(
          (d) => String(d[xDataKey]).toLowerCase() === dateStr.toLowerCase()
        );

        if (matchIdx === -1) return null;
        const x = xPositions[matchIdx];
        const y = padding.top + 8;

        return (
          <g key={idx} transform={`translate(${x - size / 2}, ${y})`} className="cursor-pointer">
            <line
              x1={size / 2}
              y1={size}
              x2={size / 2}
              y2={height - padding.bottom - y}
              stroke="var(--primary)"
              strokeOpacity={0.3}
              strokeDasharray="2,2"
            />
            <foreignObject width={size} height={size}>
              <div
                title={`${marker.title}: ${marker.description || ""}`}
                className="w-full h-full rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center text-xs shadow-sm hover:scale-110 transition-transform duration-200"
              >
                {marker.icon || "📍"}
              </div>
            </foreignObject>
          </g>
        );
      })}
    </g>
  );
}
