declare module 'plotly.js' {
  export interface Figure {
    data: Data[];
    layout?: Partial<Layout>;
    frames?: Frame[];
  }

  export interface Data {
    type: string;
    [key: string]: any;
  }

  export interface Layout {
    [key: string]: any;
  }

  export interface Frame {
    [key: string]: any;
  }

  export interface Config {
    [key: string]: any;
  }

  export interface PlotSelectionEvent {
    [key: string]: any;
  }

  export interface PlotRestyleEvent {
    [key: string]: any;
  }

  export interface PlotRelayoutEvent {
    [key: string]: any;
  }

  export interface PlotRedrawEvent {
    [key: string]: any;
  }

  export interface PlotHoverEvent {
    [key: string]: any;
  }

  export interface PlotUnhoverEvent {
    [key: string]: any;
  }

  export interface PlotMouseEvent {
    [key: string]: any;
  }

  export interface PlotClickAnnotationEvent {
    [key: string]: any;
  }

  export interface PlotAfterPlotEvent {
    [key: string]: any;
  }

  export interface PlotAnimateEvent {
    [key: string]: any;
  }

  export interface PlotAnimateFrameEvent {
    [key: string]: any;
  }

  export interface PlotAnimationInterruptedEvent {
    [key: string]: any;
  }

  export interface PlotAutoSizeEvent {
    [key: string]: any;
  }

  export interface PlotDeselectEvent {
    [key: string]: any;
  }

  export interface PlotDoubleClickEvent {
    [key: string]: any;
  }

  export interface PlotLegendClickEvent {
    [key: string]: any;
  }

  export interface PlotLegendDoubleClickEvent {
    [key: string]: any;
  }

  export interface PlotSliderChangeEvent {
    [key: string]: any;
  }

  export interface PlotSliderEndEvent {
    [key: string]: any;
  }

  export interface PlotSliderStartEvent {
    [key: string]: any;
  }

  export interface PlotTransitioningEvent {
    [key: string]: any;
  }

  export interface PlotTransitionInterruptedEvent {
    [key: string]: any;
  }

  export interface PlotAxisRangeChangedEvent {
    [key: string]: any;
  }
} 