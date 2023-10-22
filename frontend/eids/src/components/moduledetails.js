import { getModuleDetails } from "@/api/module";
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import React from "react";

export default function ModuleDetails({module,display64=false}){
   let test = {}
   if(module && module.implementation && !display64){

      test = {...module, "implementation" :Buffer.from(module.implementation,'base64').toString('utf-8')}
   }
   else {
      test = module
   }
  
   return (
      <div>
         {/* <p>{getModuleDetails(module_id)}</p> */}
         <pre>
            <JsonView data={test} style={darkStyles}/>
            {/* {JSON.stringify(test, null, 2)} */}

         </pre>
      </div>
   )
}