import 'react-json-view-lite/dist/index.css';
import React from "react";
import { Table } from "react-bootstrap";

export default function ConfigTableActive({configs}){

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
                  configs.map((config) => (
                    <tr key={config.id}>
                        <td>{config.name}</td>
                        <td>{config.description}</td>
                        <td>{config.id}</td>
                        <td>{JSON.stringify(config.modules)}</td>

                    </tr> 
                  ))
               }
            </tbody>
         </Table>

      </>
   )
}