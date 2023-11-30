import { getModuleDetails } from "@/api/module";
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ModuleDetailsModal({module,display64=false}){
   let test = {}
   if(module && module.implementation && !display64){

      test = {...module, "implementation" :Buffer.from(module.implementation,'base64').toString('utf-8')}
   }
   else {
      test = module
   }

   const [show, setShow] = useState(false)
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);

   // let test = {}
   // if(module && module.implementation && !display64){

   //    test = {...module, "implementation" :Buffer.from(module.implementation,'base64').toString('utf-8')}
   // }
   // else {
   //    test = module
   // }
  

   return (
      <>
         <Button variant='dark' onClick={handleShow}>
            View
         </Button>
         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
               <Modal.Title>
                  ID: 
                  {module.id ? module.id : ""}
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <JsonView data={test} style={darkStyles}/>

            </Modal.Body>
            
         </Modal>

      </>
   )
}