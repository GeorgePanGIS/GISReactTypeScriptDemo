/* eslint-disable @typescript-eslint/no-unused-vars */

import MapView from "@arcgis/core/views/MapView";
import GMap from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import * as typeRendererCreator from "@arcgis/core/smartMapping/renderers/type";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import Expand from "@arcgis/core/widgets/Expand";

export function initializeMap(ref: HTMLDivElement) {
  const graphicsLayer = new GraphicsLayer();
  // create from a web map?
  const map = new GMap({
    basemap: "topo-vector",
    layers: [graphicsLayer] // "arcgis-topographic" // Basemap layer service // topo-vector
  });

  const view = new MapView({
    container: ref,
    map: map,
    center: [-102.644, 40.206], // Longitude, latitude [-118.805, 34.027] //California [-119.694, 36.276],
    zoom: 4 // Zoom level
  });

  view.when(() => {
    const sketch = new Sketch({
      layer: graphicsLayer,
      view: view,
      // graphic will be selected as soon as it is created
      creationMode: "update",
      container: document.createElement("div")
    });
    const expandSketch = new Expand({
      view: view,
      content: sketch,
      label: "Sketch"
    });
  
    view.ui.add(expandSketch, "top-right");
  });


  const fieldInfos = [
    {
      fieldName: "M172_07",
      label: "Wheat",
      format: {
        digitSeparator: true,
        places: 0
      }
    },
    {
      fieldName: "M188_07",
      label: "Cotton",
      format: {
        digitSeparator: true,
        places: 0
      }
    },
    {
      fieldName: "M193_07",
      label: "Soybeans",
      format: {
        digitSeparator: true,
        places: 0
      }
    },
    {
      fieldName: "M217_07",
      label: "Vegetables",
      format: {
        digitSeparator: true,
        places: 0
      }
    },
    {
      fieldName: "M163_07",
      label: "Corn",
      format: {
        digitSeparator: true,
        places: 0
      }
    }
  ];

  const layer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/US_county_crops_2007_clean/FeatureServer/0",
    outFields: [
      "M172_07",
      "M188_07",
      "M193_07",
      "M217_07",
      "M163_07",
      "TOT_CROP_ACRES",
      "DOM_CROP_ACRES",
      "COUNTY",
      "STATE"
    ],
    title: "U.S. Counties - crop harvest",
    popupTemplate: {
      // autocasts as new PopupTemplate()
      title: "{COUNTY}, {STATE}",
      content: [
        {
          type: "text",
          text:
            "{TOT_CROP_ACRES} acres of crops were harvested in {COUNTY}, {STATE}" +
            " in 2007. The table below breaks down the number of acres that were" +
            " harvested for each type of crop."
        },
        {
          type: "fields",
          fieldInfos: fieldInfos
        }
      ],
      fieldInfos: [
        {
          fieldName: "TOT_CROP_ACRES",
          label: "Total harvest acres of crops",
          format: {
            digitSeparator: true,
            places: 0
          }
        }
      ]
    }
  });

  // Generate the renderer when the view becomes ready
  reactiveUtils
  .whenOnce(() => !view.updating)
  .then(() => {
    generateRenderer();
  });

function generateRenderer() {
  // configure parameters for the color renderer generator.
  // The layer must be specified along with a field name
  // The view and other properties determine
  // the appropriate default color scheme.

  const typeParams = {
    layer: layer,
    view: view,
    field: "DOM_CROP_ACRES",
    legendOptions: {
      title: "Dominant crop in harvested acres by county (2007)"
    }
  };

  // Generate a unique value renderer based on the
  // unique values of the DOM_CROPS_ACRES field.
  // The generated renderer creates a visualization,
  // assigning each feature to a category.
  //
  // This resolves to an object containing several helpful
  // properties, including the type scheme, unique value infos,
  // excluded values (if any), and the renderer object

  typeRendererCreator
    .createRenderer(typeParams)
    .then((response) => {
      // set the renderer to the layer and add it to the map

      layer.renderer = response.renderer;

      if (!map.layers.includes(layer)) {
        map.add(layer);
      }
    })
    .catch((error) => {
      console.error("there was an error: ", error);
    });
}



  

  return view;
}
