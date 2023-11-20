import { getModuleDetails } from "@/api/module";
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import React from "react";
import { Table } from "react-bootstrap";
import ModuleDetailsModal from "@/components/moduledetailsmodal";

export default function ModuleTableActive({modules}){



   // let test = {}
   // if(module && module.implementation && !display64){

   //    test = {...module, "implementation" :Buffer.from(module.implementation,'base64').toString('utf-8')}
   // }
   // else {
   //    test = module
   // }
   console.log("Inside moduletableactive")
  console.log(modules)
   return (
      <>
         <Table>
            <thead>
               <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>ID</th>
               </tr>
            </thead>
            <tbody>
               {
                  modules.map((module) => (
                    <tr key={module.id}>
                        <td>{module.name}</td>
                        <td>{module.description}</td>
                        <td>{module.id}</td>

                    </tr> 
                  ))
               }
            </tbody>
         </Table>

      </>
   )
}