import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import React from "react";

export default function ConfigDetails({config}){

   return (
      <div>
         {/* <p>{getConfigDetails(config_id)}</p> */}
         <pre>
            <JsonView data={config} style={darkStyles}/>
            {/* {JSON.stringify(test, null, 2)} */}

         </pre>
      </div>
   )
}