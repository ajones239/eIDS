import 'react-json-view-lite/dist/index.css';
import React from "react";
import { Table } from "react-bootstrap";
import ModuleDetailsNameLinkModal from './moduledetailsnamelinkmodal';
export default function ConfigTable({configs}){

   const stringifyModules = (modules) => {


      return (
         <>
            {
               modules && modules.map((module) => (

                  <p key={module.id}>Level: {module.level} | <ModuleDetailsNameLinkModal moduleId={module.id}/></p>
               ))
            }
         </>
      )
   }

   return (
      <>
         <Table>
            <thead>
               <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>ID</th>
                  <th>Modules</th>
               </tr>
            </thead>
            <tbody>
               {
                  configs && configs.map((config) => (
                    <tr key={config.id}>
                        <td>{config.name}</td>
                        <td>{config.description}</td>
                        <td>{config.id}</td>
                        <td>{stringifyModules(config.modules)}</td>

                    </tr> 
                  ))
               }
            </tbody>
         </Table>

      </>
   )
}