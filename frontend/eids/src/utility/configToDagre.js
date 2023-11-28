import dagre from 'dagre';




export const configToDagre = (config) => {
  
  if(!config){
    return ""
  }
  console.info(config)
  const exconfig = `{
    "actionConditions": [],
    "connections": [
        {
            "in": "655a57ae2c886846999cb16f",
            "out": "65629b2384fb109fbc3ed521"
        },
        {
            "in": "655a63632c886846999cb171",
            "out": "655a57ae2c886846999cb16f"
        }
    ],
    "description": "desc",
    "modules": [
        {
            "id": "65629b2384fb109fbc3ed521",
            "level": 0
        },
        {
            "id": "655a57ae2c886846999cb16f",
            "level": 1
        },
        {
            "id": "655a63632c886846999cb171",
            "level": 2
        }
    ],
    "name": "cs0"
 }`
const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';


const makeData = (connections, modules) => {

  let test_node = [];
  let test_edge = [];
  connections.forEach((connection) => {
    test_edge.push({
      id: "out" + connection.out + "in" +connection.in,
      source: connection.out,
      target: connection.in, type: edgeType, animated: true
    })
  });
  console.log("modules before foreacg");
  console.log(typeof(modules))
  console.log(modules);

  for(const [index,arrayItem] of modules.entries()){
        console.log("arrayItem")
      console.log(arrayItem)
      test_node.push({
      id:arrayItem.id,
      randomdata:arrayItem.name,
      data:{label:arrayItem.name?arrayItem.name:arrayItem.id,},
      position:position})
  }


  // modules.forEach(function (arrayItem) {
  //   console.log("arrayItem")
  //   console.log(arrayItem)
  //   test_node.push({
  //     id:arrayItem.id,
  //     randomdata:arrayItem.name,
  //     data:{label:arrayItem.id},
  //     position:position,

  //   })
  // })
  console.log("modules after foreach")

  console.log(modules)
  // modules.forEach((m) => {
  //   let mdata = m
  //   console.log("inside makedata foreach m")
  //   console.log(mdata)
  //   test_node.push({
  //     randomdata: mdata.name,
  //     id: mdata.id,
  //     data: { label: mdata.id, configdata: JSON.stringify(mdata.name) },
  //     position,
  //   }
  //   );
  // })

  const data = { test_node: test_node, test_edge: test_edge }
  console.log("Right before return makedata")
  console.log(data)


  return {test_node,test_edge}
}


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

  const data = makeData(config.connections, config.modules);
  console.log("Returned data from makedata")
  console.log(data)
  const initialNodes = data.test_node;
  
  const initialEdges = data.test_edge;
  
  const {nodes: nodes, edges: edges} = getLayoutedElements(initialNodes,initialEdges)
  console.log('nodes')
  console.log(nodes)
  return {nodes, edges};
}