import NodeConfigGraph from "@/components/nodeconfiggraph";
import React, { use, useEffect, useState } from "react";
import { configToDagre } from "@/utility/configToDagre";
import { JsonView, darkStyles } from "react-json-view-lite";
import 'react-json-view-lite/dist/index.css';
import { addAllConfigModuleDetails } from "@/utility/module";
import { set } from "date-fns";
import { getAllActiveConfigDetails, getAllConfigDetails, getConfigDetails } from "@/api/configuration";
import { setConfig } from "next/config";
import { ComputeShader } from "@babylonjs/core";
import TestGraph from "./testgraph";
import GraphTable from "@/components/graphtable";
import { getAttackGraphTableData, getGraphCollectionData } from "@/api/graph";
import CollectionTable from "@/components/collectiontable";

// const config =  addModuleDataToConfig();
// const data = configToDagre(config)


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


export default function Home() {

  // const [data, setData] = useState()

  const fetchModConfig = async (initConfig) => {
    try {
      const data = await addAllConfigModuleDetails(initConfig);
      console.log("new data")
      console.warn(data)
      return data

    } catch (error) {
      setModConfig({ "Response": "None" })
    }
  }

  
  const fetchAllModConfig = async (arrConfig) => {
    try {
      var temp = []
      console.log("conf")
      console.log(arrConfig)
      for(const conf of arrConfig){
        temp.push(await fetchModConfig(conf))
      }
      console.log("arr mc")
      console.warn(temp)
      return temp

    } catch (error) {
      setModConfig({ "Response": "None" })
    }
  }

  const fetchAttackTableData = async () => {
    try {
      const data = await getAttackGraphTableData();
      setGraphTable(data.data)
    } catch (error) {
      setGraphTable([])
    }
  }

  const fetchCollectionData = async () => {
    try {
      const data = await getGraphCollectionData();
      setCollection(data.data);
    } catch (error) {
      setCollection({"m_count":0,"c_count":0});
    }
  }



  const [initConfig, setInitConfig] = useState([])
  const [modConfig, setModConfig] = useState([])
  const [dagreData, setDagreData] = useState()
  const [data, setData] = useState([])
  const [graphTable, setGraphTable] = useState([])
  const [collection, setCollection] = useState([])


  useEffect(() => {
    async function fetchdata() {
      const data = await getAllActiveConfigDetails()
      // const data = {data: []}
      setInitConfig(data.data)
      console.log(data.data)

    }
    fetchdata();
  }, [])

  useEffect(() => {
    let active = true;
    async function fetchdata() {
      if(active){

        if(initConfig){

          const data = await fetchAllModConfig(initConfig);
          setModConfig(data);
        }
      }

    }
    fetchdata();
    // const dD = configToDagre(modC)
    // setDagreData(dD)
    // setData(dD)
    return (() => active = false)
  }, [initConfig])





  useEffect(() => {

    let active = true
    async function addCoordinates() {
      if (active) {
        if (modConfig ) {
          console.log("Mod Config=============")
          console.log(modConfig)
          var temp = []
          for(const mc of modConfig){
            temp.push(configToDagre(mc))

          }
          console.warn("data")
          console.warn(temp)
  
          setData(temp)
          // setData(configToDagre(modConfig))
        }
      }

    }
    addCoordinates();
    return (() => active = false)
  }, [modConfig])



  useEffect(()=>{
    async function fetchdata(){
      await fetchAttackTableData();
      await fetchCollectionData();
    }

    fetchdata();
  },[])

  const viewActiveConfigNodes = (data) => {
    console.log(data)
    if(Array.isArray(data) && data.length > 0){
      return (
        data.map((d) => (
          <NodeConfigGraph initnode={d.nodes} initedge={d.edges} id={d.id} />
        ))
      )
    }
    else {
      return (<p>No Active Configs Running</p>)
    }
  };

  return (
    <div className="container">
      <h3>Active Config</h3>

      {data && modConfig && viewActiveConfigNodes(data)}

      <h3 className="text-center">Attacks By Date</h3>
      <TestGraph/>
      <div className="d-flex flex-row">

        <GraphTable data={graphTable}/>
        <CollectionTable className="align-self-start" d={collection}/>
      </div>
    </div>
    
  )
}
