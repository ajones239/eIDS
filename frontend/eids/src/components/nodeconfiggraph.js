import { useState, useEffect } from "react"
import { useCallback } from 'react';
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

import {
  ReactFlow,
  NodeToolbar,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
} from 'reactflow';

import 'reactflow/dist/style.css';
import Modal from 'react-bootstrap/Modal';
import { configToDagre } from "@/utility/configToDagre";
import { fetchModuleDetails } from "@/utility/module";


export default function NodeConfigGraph({ initnode,initedge }) {

  const [modulesInfo,setModulesInfo] = useState("")
  const [module, setModule] = useState("")
  const [nodes, setNodes, onNodesChange] = useNodesState(initnode);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initedge);
  const [nodeInfo, setNodeInfo] = useState("")

  //modal
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false);
  const handleShow = useCallback((e, node) => {
    setShow(true);
    console.log("nodeinfo")
    console.log(nodeInfo)
    setNodeInfo(node)
  }, [nodeInfo])


  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
      ),
    []
  );
  const updateModalModuleDetail = async () => {
    try{
      const response = await fetchModuleDetails(nodeInfo.id);
      console.log(response)
      console.log(typeof(response))
      setModule(response)
    } catch (error) {
      console.log("error")
      setModule({"Response":"None"})
    }
  }

  useEffect(()=>{
    async function fetchData() {

      await updateModalModuleDetail();
 
    }
    console.log("Trying to fetch")
    fetchData();
    console.log(module)
  },[nodeInfo])



  return (
    <div className="container">

      <h4>Config 1</h4>
      <div className={"container"} style={{ height: "15vh", minHeight: "100px" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          // onNodesChange={onNodesChange}
          // onEdgesChange={onEdgesChange}
          nodesConnectable={false}
          nodesDraggable={false}
          panOnDrag={false}
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.SmoothStep}
          onNodeClick={handleShow}
          proOptions={{ hideAttribution: true }}
          fitView
        >
        </ReactFlow>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              ID:
              {nodeInfo.id ? nodeInfo.id : "No data found"}

            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <JsonView data={module ? module : "No data found"}  style={darkStyles}/>
            {/* {console.log(nodeInfo)} */}
            {/* {modules? ? modules?.nodeInfo?.id : "No data found"} */}

          </Modal.Body>

        </Modal>
      </div>
    </div>
  );
};