/**
 * This file was generated from ArcGIS.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue, ListValue } from "mendix";

export type PointTypeEnum = "point" | "polyline" | "polygon";

export interface LayerType {
    arcGISManaged: boolean;
    layerURL: string;
    layerDS?: ListValue;
    pointType: PointTypeEnum;
}

export interface LayerPreviewType {
    arcGISManaged: boolean;
    layerURL: string;
    layerDS: {} | null;
    pointType: PointTypeEnum;
}

export interface ArcGISContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    apiKey: string;
    defaultZoom: number;
    basemap: string;
    onclick?: ActionValue;
    onclickattr?: EditableValue<string>;
    layer: LayerType[];
}

export interface ArcGISPreviewProps {
    class: string;
    style: string;
    apiKey: string;
    defaultZoom: number | null;
    basemap: string;
    onclick: {} | null;
    onclickattr: string;
    layer: LayerPreviewType[];
}
