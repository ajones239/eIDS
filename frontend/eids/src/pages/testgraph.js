import { getAttackGraphData, getGraphData } from "@/api/graph";
import GraphDateTime from "@/components/graphdatetime";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

const graphDataId="graph_id2"
export default function TestGraph(){
   const [graphData,setGraphData] = useState()


   const testtime = () => {
      const date = "Mon, 06 Nov 2023 11:22:33 GMT"
      console.log(Date.parse(date))
   }



  const fetchAllGraphData = async (graphDataId) => {
    try{
      const response = await getAttackGraphData(graphDataId);
      console.log(response.data)
      setGraphData(response.data)
    } catch (error) {
      setGraphData([])
    }
  }


  //refresh page with new data
  useEffect(() => {
    async function fetchData() {
      await fetchAllGraphData(graphDataId);

    }
    fetchData();

  },[]);

   return(
      
      <>
      {/* {console.log(graphData)} */}
      {/* {testtime()} */}
      {graphData &&  <GraphDateTime graphData={graphData}/>}
      </>

   )
}