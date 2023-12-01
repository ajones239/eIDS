import 'react-json-view-lite/dist/index.css';
import React from "react";
import { Table } from "react-bootstrap";
import ModuleDetailsNameLinkModal from './moduledetailsnamelinkmodal';
const exgraphtable = [
   { _id: null, x_value: null, y_value: 13 },
   { _id: 1, x_value: 1, y_value: 71 },
   { _id: 2, x_value: 2, y_value: 7 },
   { _id: 38, x_value: 38, y_value: 1 },
   { _id: 102, x_value: 102, y_value: 1 },
   { _id: 20000000000000, x_value: 20000000000000, y_value: 2 },
   { _id: 'DDos', x_value: 'DDos', y_value: 2 }
 ]

export default function GraphTable({ data=exgraphtable}){
   console.log("graphtable")
   console.log(data)

   return (
      <>
         <Table>
            <thead>
               <tr>
                  <th>Attack</th>
                  <th>Count</th>
               </tr>
            </thead>
            <tbody>
               {
                  data && data.map((d) => (
                    <tr key={d.x_value}>
                        <td>{d.x_value ? d.x_value: "Unknown"}</td>
                        <td>{d.y_value}</td>

                    </tr> 
                  ))
               }
            </tbody>
         </Table>

      </>
   )
}