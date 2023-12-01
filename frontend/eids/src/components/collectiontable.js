import 'react-json-view-lite/dist/index.css';
import React from "react";
import { Table } from "react-bootstrap";
import ModuleDetailsNameLinkModal from './moduledetailsnamelinkmodal';

export default function CollectionTable({ d }) {



   return (
      <>
         <Table className="align-self-start">
            <thead>
               <tr>
                  <th>Collection</th>
                  <th>Count</th>
               </tr>
            </thead>
            <tbody>

               <tr >
                  <td>Modules</td>
                  <td>{d.m_count ? d.m_count : 0}</td>

               </tr>
               <tr >
                  <td>Configuration Sets</td>
                  <td>{d.c_count ? d.c_count : 0}</td>

               </tr>

            </tbody>
         </Table>

      </>
   )
}