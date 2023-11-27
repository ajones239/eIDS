import  {useState,useEffect} from "react"
import { useCallback } from 'react';
import {
    ReactFlow,
    NodeToolbar,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import dagre from 'dagre';


import 'reactflow/dist/style.css';
import Modal from 'react-bootstrap/Modal';


const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';


const exconfig = `{ "name": "cs0","description": "desc","modules": [
        {
            "id": "ModuleA",
            "data": "Data for moduleA",
            "level": 0
        },
        {
          "id": "ModuleB",
          "data": "Data for moduleB",
          "level": 1
        },
        {
          "id": "ModuleC",
          "data": "Data for moduleC",
          "level": 2
        },
        {
          "id": "ModuleD",
          "data": "Data for moduleD",
          "level": 3
        },
        {
          "id": "ModuleE",
          "data": "Data for moduleE",
          "level": 4
        }
    ],
    "connections": [
      {
        "in": "ModuleA",
        "out": "ModuleB"
      },
      {
        "in": "ModuleB",
        "out": "ModuleC"
      },
      {
        "in": "ModuleC",
        "out": "ModuleD"
      },
      {
        "in": "ModuleD",
        "out": "ModuleE"
      }
    ]
}`

const makeData = (connections,modules)  => {
  
    var test_node = []
    var test_edge = []
  
    connections.forEach((connection) => {
      test_edge.push({ id: "e" + connection.in  + connection.out, 
                      source: connection.in,
                       target: connection.out, type: edgeType, animated: true })
    });
    modules.forEach((m) => {
      test_node.push(  {
        id: m.id,
        data: { label: m.id, data: m.data},
        position,}
      )})
    
    var data = {test_node: test_node, test_edge: test_edge}
  
    return data
  }

const obexconfig = JSON.parse(exconfig)

const data = makeData(obexconfig.connections,obexconfig.modules)
console.log(data)
const initialNodes = data.test_node;

const initialEdges = data.test_edge;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
);


export default function TestModule() {
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
    const [nodeInfo,setNodeInfo] = useState("")

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = (e,node) => {
        setShow(true)
        setNodeInfo(node)
    };
 

    const onConnect = useCallback(
      (params) =>
        setEdges((eds) =>
          addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
        ),
      []
    );

  
    return (
        <div className="container">
            <h3>Active Config</h3>

            <h4>Config 1</h4>
            <div className={"container"} style={{ height: "15vh", minHeight:"100px" }}>
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
                    proOptions={ {hideAttribution: true} }
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
                        {nodeInfo?.data?.data ? nodeInfo.data.data : "No data found"}

                    </Modal.Body>

                </Modal>
            </div>
        </div>
    );
  };