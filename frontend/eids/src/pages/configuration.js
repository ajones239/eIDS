import React, { useState, useEffect } from "react";
import ConfigDetails from "@/components/configdetails"
import { addConfig, getAllConfigDetails, getConfigDetails, startConfig } from "@/api/configuration";
export default function Configuration() {
  //post module using  form
  const [postFormConfig, setPostFormConfig] = useState({});

  const handlePostFormConfigInputChange = (event) => {
    const name = event.target.name;
    let value = null;
    if (name === "modules" || name === "connections") {
      try {
        value = JSON.parse(event.target.value);
        
      } catch (error) {
        // console.log(error)
        return
      }
    }
    else {
      value = event.target.value;
    }

    setPostFormConfig({
      ...postFormConfig,
      [name]: value
    })
    // console.log(postFormConfig)
  }
  const handlePostFormConfigSubmit = async e => {
    // alert(JSON.stringify(postFormConfig,null,2));
    e.preventDefault();
    try {
      const response = await addConfig(postFormConfig);
      alert("Module ID: " + response.data["id"]);
      window.location.reload();
    } catch (error) {
      console.log(error)
      console.log("[handlePostFormConfigSubmit] Something went wrong")
    }
  }

  //get config by id
  const [config, setConfig] = useState([]);
  const [configId, setConfigId] = useState("");
  
  const handleConfigIdFilter = (event) => {
    console.log("[handleConfigIdFilter] ",event.target.value)
    event.target.value ? setConfigId(event.target.value) : setConfigId("");
  }
  
  const fetchConfigDetails = async (configId) => {
    if (!configId) return;
    try{
      const response = await getConfigDetails(configId);
      console.log(response.data)
      setConfig(response.data)
    } catch (error) {
      setConfig({"Response":"None"})
    }
    
  }

  //start config by id
  const [configStartId, setConfigStartId] = useState("");
  
  const handleConfigStartIdInputChange = (event) => {
    console.log("[handleConfigStartId] ",event.target.value)
    event.target.value ? setConfigStartId(event.target.value) : setConfigStartId("");
  }
  const handleConfigStartIdSubmit = async e => {
    // alert(JSON.stringify(postFormConfig,null,2));
    e.preventDefault();
    try {
      const response = await startConfig(configStartId);
      // alert("Config ID: " + response.data["id"]);
      console.log(response);
      // window.location.reload();
    } catch (error) {
      console.log(error)
      console.log("[handleConfigStartIdSubmit] Something went wrong")
    }
  }
  
  //get all configuration sets
  const [allConfig, setAllConfig] = useState([]);
  const fetchAllConfigDetails = async () => {
    try{
      const response = await getAllConfigDetails();
      console.log(response.data)
      setAllConfig(response.data)
    } catch (error) {
      setAllConfig({"Response":"None"})
    }
  }


  //refresh page with new data
  useEffect(() => {
    async function fetchData() {
      await fetchConfigDetails(configId);
      await fetchAllConfigDetails();
    }
    fetchData();

  }, [configId,postFormConfig]);

  return (
    <>
      <div>
        <h1>Test Configuration</h1>
        <h3>Get config by id</h3>
          <div>
            <div className="form-outline mb-3">
              <label className="form-label">
                 ID:
              </label>
                <input className="form-control" placeholder="Config ID" type="text" name="id" value={configId}
                      onChange={handleConfigIdFilter}/>
            </div>
            <h6>getConfigDetails</h6>
            <ConfigDetails config={config} />

          </div>
        <hr />
        <h3>Post Config</h3>
          <div className="mb-10">
            <form>
              <div className="form-group">
                <label htmlFor="postConfigName">Name</label>
                <input type="text" className="form-control" id="postConfigName" name="name" placeholder="Configuration Name" onChange={handlePostFormConfigInputChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="postConfigDescription">Description</label>
                <textarea className="form-control" id="postConfigDescription" name="description" placeholder="Configuration Description" rows="4" onChange={handlePostFormConfigInputChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="postConfigModules">Modules</label>
                <input type="text" className="form-control" id="postConfigModules" name="modules" placeholder='JSON Array Form [{"id":"moduleID"(str),"level":int}]' onChange={handlePostFormConfigInputChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="postConfigConnections">Connections</label>
                <input type="text" className="form-control" id="postConfigConnections" name="connections" placeholder='JSON Array Form [{"out":"moduleID"(str),"in":"moduleID"(str)}]' onChange={handlePostFormConfigInputChange}/>
              </div>
              <button type="submit" className="btn btn-primary" onClick={handlePostFormConfigSubmit}>Submit</button>

            </form>
          </div>
        <hr />
        <h3>Start config by id</h3>
          <div className="mb-10">
            <form>
              <div className="form-group">
                <label htmlFor="startConfigID">ID</label>
                <input type="text" className="form-control" id="startConfigID" name="id" placeholder="Configuration ID" onChange={handleConfigStartIdInputChange}/>
              </div>
              <button type="submit" className="btn btn-primary" onClick={handleConfigStartIdSubmit}>Submit</button>

            </form>
          </div>
        <hr />
        <h3>Get all configs</h3>
          <div>
            {allConfig.map((config) => (
              <ConfigDetails key={config.id} config={config} />
            ))}            
          </div>

      </div>
    </>
  )
}