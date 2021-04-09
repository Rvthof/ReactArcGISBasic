import { Component, ReactNode, createElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";
import { ArcGISPreviewProps } from "../typings/ArcGISProps";

declare function require(name: string): string;

export class preview extends Component<ArcGISPreviewProps> {
    render(): ReactNode {
        return <HelloWorldSample sampleText={this.props.sampleText} />;
    }
}

export function getPreviewCss(): string {
    return require("./ui/ArcGIS.css");
}
