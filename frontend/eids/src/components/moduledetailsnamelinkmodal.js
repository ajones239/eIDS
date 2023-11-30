import { getModuleDetails } from "@/api/module";
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ModuleDetailsNameLinkModal({moduleId,display64=false}){
   
   //first find the details by call fetch
   const [module,setModule] = useState([]);

   const fetchModuleDetails = async (moduleId) => {
      if (!moduleId) return;
      try{
        const response = await getModuleDetails(moduleId);
        console.log(response.data)
        let test = {}
        if(response.data && response.data.implementation && !display64){
     
           test = {...response.data, "implementation" :Buffer.from(response.data.implementation,'base64').toString('utf-8')}
        }
        else {
           test = response.data
        }
        setModule(test)
      } catch (error) {
        setModule({"Response":"None"})
      }
      
    }



   const [show, setShow] = useState(false)
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);

   useEffect(() => {
      async function fetchData() {
         await fetchModuleDetails(moduleId);
      }
      fetchData();
   },[])


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
            {module.name}
         </Button>
         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
               <Modal.Title>
                  ID: 
                  {module.id ? module.id : ""}
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <JsonView data={module} style={darkStyles}/>

            </Modal.Body>
            
         </Modal>

      </>
   )
}