declare module 'react-simple-maps' {
  import React from 'react';

  export type Geography = {
    rsmKey: string;
    properties: any;
  };

  export type GeographyProps = {
    geography: any;
    fill?: string;
    stroke?: string;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  };

  export type ZoomableGroupProps = {
    zoom?: number;
    center?: [number, number];
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void;
    children?: React.ReactNode;
  };

  export type GeographiesProps = {
    geography: string;
    children?: (props: { geographies: Geography[] }) => React.ReactNode;
  };

  export type ComposableMapProps = {
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      rotate?: [number, number, number];
    };
    width?: number;
    height?: number;
    children?: React.ReactNode;
  };

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;
}