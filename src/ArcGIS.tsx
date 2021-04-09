import { Component, ReactNode, createElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";
import { ArcGISContainerProps } from "../typings/ArcGISProps";

// import "@arcgis/core/assets/esri/themes/dark/main.css";
// import "./ui/ArcGIS.sass";   SASS loader not working (Due to webpack?)
import esriConfig from "@arcgis/core/config.js";

esriConfig.assetsPath = "./widgets/mendix/arcgis/assets";
esriConfig.apiKey = "" /* Goes here */;

export default class ArcGIS extends Component<ArcGISContainerProps> {
    render(): ReactNode {
        return <HelloWorldSample sampleText={this.props.sampleText ? this.props.sampleText : "World"} />;
    }
}
