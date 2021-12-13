import { ReactNode, createElement } from "react";
import MapComponent from "./components/Map";
import { ArcGISContainerProps } from "../typings/ArcGISProps";
import esriConfig from "@arcgis/core/config.js";
import "./ui/ArcGIS.css";

esriConfig.assetsPath = "./widgets/mendix/arcgis/assets";

const ArcGIS = (props: ArcGISContainerProps): ReactNode => {

    const {apiKey, defaultZoom, layer, basemap, onclick, onclickattr, onclickfield, width, height} = props;

    esriConfig.apiKey = apiKey;

    return (<MapComponent
               defaultZoom = {defaultZoom}
               layers = {layer}
               basemap = {basemap}
               onclick = {onclick}
               onclickattr = {onclickattr}
               onclickfield = {onclickfield}
               width = {width}
               height = {height}
            />);
}

export default ArcGIS;
