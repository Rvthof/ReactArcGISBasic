import { Component, ReactNode, createElement } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";

export interface HelloWorldSampleProps {
    sampleText?: string;
}

export class HelloWorldSample extends Component<HelloWorldSampleProps> {
    componentDidMount(): MapView {
        const map = new Map({
            basemap: "arcgis-topographic" // Basemap layer service
        });

        const view = new MapView({
            map,
            center: [-118.805, 34.027], // Longitude, latitude
            zoom: 13, // Zoom level
            container: "viewDiv" // Div element
        });

        console.log("Map Mounted");

        return view;
    }

    render(): ReactNode {
        return <div id="viewDiv" style={{ height: "500px" }} />;
    }
}
