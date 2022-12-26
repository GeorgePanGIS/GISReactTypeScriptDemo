import { useEffect, useRef, useState } from "react";
import View from "@arcgis/core/views/MapView";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import Search from "@arcgis/core/widgets/Search";
import Legend from "@arcgis/core/widgets/Legend";
import Expand from "@arcgis/core/widgets/Expand";
import Print from "@arcgis/core/widgets/Print";

import { initializeMap } from "./esri/gmap";

export const MapView = (args: any) => {
  const mapRef = useRef() as any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState<View | null>(null);

  useEffect(() => {
    const view = initializeMap(mapRef.current);
    
    // Add a legend to the view

    const legend = new Legend({
      view: view,
      style: "card"
    });
    view.ui.add(legend, "bottom-left");
    

    const bg = new BasemapGallery({
      view: view,
      container: document.createElement("div")
    });

    // Call generateRenderer() anytime the user switches the basemap

    

    const expandBasemapGallery = new Expand({
      view: view,
      content: bg
    });
    view.ui.add(expandBasemapGallery, "top-right");


    view.when(() => {
      const print = new Print({
        view: view,
        // specify your own print service
        printServiceUrl:
          "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
        container: document.createElement("div")
      });

      const expandPrint = new Expand({
        view: view,
        content: print
      });
      
      // Add widget to the top right corner of the view
      view.ui.add(expandPrint, "top-right");

      
    });




    const scaleBar = new ScaleBar({
      view: view,
      style: "ruler"
      
    });
    // Add widget to the bottom left corner of the view
    view.ui.add(scaleBar, {
      position: "bottom-left"
    });
    const searchWidget = new Search({
      view: view
    });
    // Adds the search widget below other elements in
    // the top left corner of the view
    view.ui.add(searchWidget, {
      position: "top-left",
      index: 2
    });

    // Create FeatureLayer instance with popupTemplate

    

    
    
    

     

    setView(view);
  }, []); // only after first render

  return <div className="mapDiv" ref={mapRef}></div>;
};
