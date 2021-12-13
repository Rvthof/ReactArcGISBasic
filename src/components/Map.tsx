import { ReactElement, createElement, useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import { LayerType } from "../../typings/ArcGISProps";
import Legend from "@arcgis/core/widgets/Legend";
import { ActionValue, EditableValue } from "mendix";
import * as popupUtils from "@arcgis/core/support/popupUtils";
import FieldsContent from "@arcgis/core/popup/content/FieldsContent";
import PopupTemplate from "@arcgis/core/PopupTemplate";

export interface MapProps {
    defaultZoom: number;
    layers: LayerType[];
    basemap: string;
    onclick?: ActionValue;
    onclickattr?: EditableValue<string>;
    onclickfield: string;
    width: number;
    height: number;
}

// Feature layers will not display. Tried converting the view to useState instead. Feature layers are loaded (can be seen in the network calls but are simply not shown). Have tried reording the ways
// that layers are added.

const MapComponent = (props: MapProps): ReactElement => {

    const mapDiv = useRef (null)
    const { width, height } = props

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

        const layersList = map.layers;
        
        if (layersList != null) {
            const firstLayer = layersList.getItemAt(0);

            if (firstLayer != null) {
                firstLayer.when(() => {
                    view.goTo(firstLayer.fullExtent);
                });
            }
        }

        view.on("click", (event: MouseEvent) => {
            const opts = {
                include: map.layers
            }
            view.hitTest(event, opts).then((resp) => {
                if (resp.results.length) {
                    console.dir(resp);
                    const elem = resp.results[0];
                    props.onclickattr?.setValue(elem.graphic.attributes[props.onclickfield]);
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
                    popupEnabled: true,
                    outFields: ["*"]
                });
                if (layer.usePopup) {
                    layerToAdd.load().then(() => {
                        let fields:string[] = [];
                        layerToAdd.fields.map((field) => {
                            fields.push(field.name);
                        })
                        const templateOptions = {
                            ignoreFieldTypes: [""],
                            visibleFieldNames: new Set(fields)
                        };
                        // Set the FieldInfo
                        const fieldsConfig = {fields: layerToAdd.fields};
                        
                        // Create the FieldInfos
                        const fieldInfos = popupUtils.createFieldInfos(fieldsConfig, templateOptions);
                        
                        // Sets the FieldsContent
                        const fieldsContent = new FieldsContent({
                            fieldInfos: fieldInfos
                        });
                        
                        // Create the template and pass in the fields content
                        const template = new PopupTemplate({
                            title: "Site",
                            outFields: ["*"],
                            content: [fieldsContent]
                        });
                        
                        // Set the feature layer's popup template
                        layerToAdd.popupTemplate = template;
                    })
                }

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

    const style = {
        height: `${height}px`,
        width: `${width}px`
    }
    return (<div id="viewDiv" ref={mapDiv} style={style} />);
}

export default MapComponent
