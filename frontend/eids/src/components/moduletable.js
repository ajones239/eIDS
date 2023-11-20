import { getModuleDetails } from "@/api/module";
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import React from "react";
import { Table } from "react-bootstrap";
import ModuleDetailsModal from "@/components/moduledetailsmodal";

export default function ModuleTable({modules,display64=false}){



   // let test = {}
   // if(module && module.implementation && !display64){

   //    test = {...module, "implementation" :Buffer.from(module.implementation,'base64').toString('utf-8')}
   // }
   // else {
   //    test = module
   // }
  
   return (
      <>
         <Table>
            <thead>
               <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Dependencies</th>
                  <th>Actions</th>

               </tr>
            </thead>
            <tbody>
               {
                  modules.map((module) => (
                    <tr key={module.id}>
                        <td>{module.name}</td>
                        <td>{module.description}</td>
                        <td>{module.dependencies.toString()}</td>
                        <td><ModuleDetailsModal module={module} display64={display64}/></td>
                    </tr> 
                  ))
               }
            </tbody>
         </Table>

      </>
   )
}