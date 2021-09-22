import { ReactElement, createElement, useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import { LayerType } from "../../typings/ArcGISProps";
import Legend from "@arcgis/core/widgets/Legend";
import { ActionValue, EditableValue } from "mendix";

export interface MapProps {
    defaultZoom: number;
    layers: LayerType[];
    basemap: string;
    onclick?: ActionValue;
    onclickattr?: EditableValue<string>;
}

// Feature layers will not display. Tried converting the view to useState instead. Feature layers are loaded (can be seen in the network calls but are simply not shown). Have tried reording the ways
// that layers are added.

const MapComponent = (props: MapProps): ReactElement => {

    const mapDiv = useRef (null)

    useEffect(() => {
        if (mapDiv.current) {
            MountMap(props)
        }  
    }, [])

    const MountMap = (props: MapProps): MapView => {

        const { defaultZoom, layers, basemap } = props

        let legend = new Legend();

        const map = createMapAndLayers(layers, legend, basemap)

        const view = new MapView({
            map,
            center: [0.029, 51.2560], // Longitude, latitude
            zoom: defaultZoom, // Zoom level
            container: mapDiv.current as unknown as HTMLDivElement // Div element
        });

        legend.view = view
        view.ui.add(legend, "bottom-right");
        view.on("click", (event: MouseEvent) => {
            const opts = {
                include: map.layers
            }
            view.hitTest(event, opts).then((resp) => {
                if (resp.results.length) {
                    console.dir(resp);
                    const elem = resp.results[0];
                    props.onclickattr?.setValue(elem.graphic.attributes.objectid);
                    const onclickaction = props.onclick;
                    if (onclickaction) {
                        onclickaction.execute();
                    }
                }
            })
            
        })

        return view
    }

    const createMapAndLayers = (layers: LayerType[], legend: Legend, basemap: string): Map => {

        //To ensure async processing
        const addFeatureLayers = (layers: LayerType[]): FeatureLayer[] => {
            let featureLayers: FeatureLayer[] = []
            layers.map((layer, i) => {

                let layerToAdd = new FeatureLayer({
                    url: layer.layerURL,
                })
                layerToAdd.queryObjectIds().then(function (ids) {
                    console.log(ids);  // an array of object IDs
                });
                console.log(`Layer Added: ${layer.layerURL} at ${i}`)
                console.dir(layerToAdd)

                featureLayers.push(layerToAdd)
                legend.layerInfos.push(
                    {
                        layer: layerToAdd,
                        title: layerToAdd.title,
                        hideLayers: []
                    }
                )
            })

            return featureLayers
        }

        const featureLayers = addFeatureLayers(layers)
        console.log (basemap)
        const map = new Map({
            basemap: basemap, // Basemap layer service
            layers: featureLayers
        });

        return map
    }

    return (<div id="viewDiv" ref={mapDiv} style={{ height: "500px" }} />);
}

export default MapComponent
