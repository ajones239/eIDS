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



  // useEffect(() => {
  //   async function fetchData() {
  //     await fetchAllConfigModuleData()

  //   }
  //  fetchData();

  // }, []);
  // console.log(data)

  const [initConfig, setInitConfig] = useState([])
  const [modConfig, setModConfig] = useState([])
  const [dagreData, setDagreData] = useState()
  const [data, setData] = useState([])
  useEffect(() => {
    async function fetchdata() {
      const data = await getAllActiveConfigDetails()
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
        if (modConfig) {
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

  // useEffect(()=>{
  //   if(data){

  //     console.log("Data stored")
  //     console.log(data)
  //   }
  // },[data])

  const viewActiveConfigNodes = (data) => {
    console.log(data)
    if(Array.isArray(data) && data.length > 0){
      return (
        data.map((d) => (
          <NodeConfigGraph initnode={d.nodes} initedge={d.edges} />
        ))
      )
    }
    else {
      return (<p>None</p>)
    }
  };

  return (
    <div className="container">
      <h3>Active Config</h3>

      {data && modConfig && viewActiveConfigNodes(data)}

    </div>
  )
}
