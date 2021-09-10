import { ReactNode, createElement } from "react";
import MapComponent from "./components/Map";
import { ArcGISContainerProps } from "../typings/ArcGISProps";
import esriConfig from "@arcgis/core/config.js";
import "./ui/ArcGIS.css";

esriConfig.assetsPath = "./widgets/mendix/arcgis/assets";

const ArcGIS = (props: ArcGISContainerProps): ReactNode => {

    const {apiKey, defaultZoom, layer, basemap} = props;

    esriConfig.apiKey = apiKey;

    return (<MapComponent
               defaultZoom = {defaultZoom}
               layers = {layer}
               basemap = {basemap}
            />);
    
}

export default ArcGIS;
