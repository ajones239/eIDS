import NodeConfigGraph from "@/components/nodeconfiggraph";
import React, { useEffect, useState } from "react";
import { configToDagre } from "@/utility/configToDagre";
import { JsonView, darkStyles } from "react-json-view-lite";
import 'react-json-view-lite/dist/index.css';
import { addAllConfigModuleDetails } from "@/utility/module";

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
    try{
      const data = await addAllConfigModuleDetails(initConfig);
      setModConfig(data)

    } catch (error) {
      setModConfig({"Response":"None"})
    }
  }

  // useEffect(() => {
  //   async function fetchData() {
  //     await fetchAllConfigModuleData()

  //   }
  //  fetchData();

  // }, []);
  // console.log(data)

    const [initConfig, setInitConfig] = useState(JSON.parse(exconfig))
    const [modConfig,setModConfig] = useState()
    const [dagreData, setDagreData] = useState()
    const [data,setData] = useState()

    useEffect(() => {
      async function fetchdata(){
        await fetchModConfig(initConfig)
      }
 
      fetchdata();
      // const dD = configToDagre(modC)
      // setDagreData(dD)
      // setData(dD)

    },[initConfig])
    
  //fetch all module details from list of configs

  // useEffect(() => {
  //   if(initConfig){
  //     setModConfig(addAllConfigModuleDetails(initConfig))
  //   }
  // },[initConfig])

  useEffect(() => {
    if(modConfig){
      setData(configToDagre(modConfig))
      console.log("Mod Config=============")
      console.log(modConfig)

    }
  },[modConfig])

  // useEffect(()=>{
  //   if(data){

  //     console.log("Data stored")
  //     console.log(data)
  //   }
  // },[data])



    return (
      <div class="container">
        {data && modConfig && <NodeConfigGraph initnode={data.nodes} initedge={data.edges}/>}
        {modConfig && <JsonView data={JSON.parse(exconfig)} style={darkStyles}/>}
      </div>
    )
}
