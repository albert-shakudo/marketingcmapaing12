declare module 'react-plotly.js' {
  import * as Plotly from 'plotly.js';
  import * as React from 'react';

  interface PlotParams {
    data: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
    frames?: Plotly.Frame[];
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
    onInitialized?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onUpdate?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onPurge?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onError?: (err: Error) => void;
    onSelected?: (event: Plotly.PlotSelectionEvent) => void;
    onSelecting?: (event: Plotly.PlotSelectionEvent) => void;
    onRestyle?: (data: Plotly.PlotRestyleEvent) => void;
    onRelayout?: (data: Plotly.PlotRelayoutEvent) => void;
    onRedraw?: (data: Plotly.PlotRedrawEvent) => void;
    onHover?: (data: Plotly.PlotHoverEvent) => void;
    onUnhover?: (data: Plotly.PlotUnhoverEvent) => void;
    onClick?: (data: Plotly.PlotMouseEvent) => void;
    onClickAnnotation?: (data: Plotly.PlotClickAnnotationEvent) => void;
    onAfterPlot?: (data: Plotly.PlotAfterPlotEvent) => void;
    onAnimated?: (data: Plotly.PlotAnimateEvent) => void;
    onAnimatingFrame?: (data: Plotly.PlotAnimateFrameEvent) => void;
    onAnimationInterrupted?: (data: Plotly.PlotAnimationInterruptedEvent) => void;
    onAutoSize?: (data: Plotly.PlotAutoSizeEvent) => void;
    onDeselect?: (data: Plotly.PlotDeselectEvent) => void;
    onDoubleClick?: (data: Plotly.PlotDoubleClickEvent) => void;
    onLegendClick?: (data: Plotly.PlotLegendClickEvent) => void;
    onLegendDoubleClick?: (data: Plotly.PlotLegendDoubleClickEvent) => void;
    onSliderChange?: (data: Plotly.PlotSliderChangeEvent) => void;
    onSliderEnd?: (data: Plotly.PlotSliderEndEvent) => void;
    onSliderStart?: (data: Plotly.PlotSliderStartEvent) => void;
    onTransitioning?: (data: Plotly.PlotTransitioningEvent) => void;
    onTransitionInterrupted?: (data: Plotly.PlotTransitionInterruptedEvent) => void;
    onAxisRangeChanged?: (data: Plotly.PlotAxisRangeChangedEvent) => void;
  }

  class Plot extends React.Component<PlotParams> {}
  export default Plot;
} 