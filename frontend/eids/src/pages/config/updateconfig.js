import React, {useState,useEffect} from "react"
import { getConfigDetails, updateConfig } from "@/api/configuration";
import ConfigDetails from "@/components/configdetails";


export default function UpdateConfig() {

  const [configId, setConfigId] = useState("")
  const [validConfig,setValidConfig] = useState(false)
  const [postFormConfig, setPostFormConfig] = useState({});


  const handleConfigIdFilter = (event) => {
    console.log("[handleConfigIdFilter] ",event.target.value)
    event.target.value ? setConfigId(event.target.value) : setConfigId("");
  }
  
    
  const fetchConfigDetails = async (configId) => {
    if (!configId) return;
    try{
      const response = await getConfigDetails(configId);
      console.log(response.data)
      // setConfig(response.data)
      setValidConfig(true)
      setPostFormConfig(response.data)
    } catch (error) {
      // setConfig({"Response":"None"})
      setValidConfig(false)
      setPostFormConfig({})
    }
    
  }
  //post module using  form

  const handlePostFormConfigInputChange = (event) => {
    const name = event.target.name;
    let value = null;
    if (name === "modules" || name === "connections" || name === "actionConditions") {
      try {
        value = JSON.parse(event.target.value);
        
      } catch (error) {
        // console.log(error)
        value = event.target.value
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
      const response = await updateConfig(configId,postFormConfig);
      alert(response.status);
      window.location.reload();
    } catch (error) {
      console.log(error)
      console.log("[handlePostFormConfigSubmit] Something went wrong")
    }
  }



  //refresh page with new data
  useEffect(() => {
   async function fetchData() {
      await fetchConfigDetails(configId);
   }
   fetchData();
  }, [configId]);

  useEffect(() =>{
   console.log("Got to here")
   console.log("Postform")
   console.log(postFormConfig)
  },[postFormConfig,validConfig])

  return (
    <div className="container">
      <h1>Update Config</h1>
      <div className="form-outline mb-3">
          <label className="form-label">
            Enter valid ID to enable form:
          </label>
            <input className="form-control" placeholder="Config ID" type="text" name="id" value={configId}
                  onChange={handleConfigIdFilter}/>
        </div>
      <div className="mb-10">
        <form >
         <fieldset disabled={!validConfig}>
              <div className="form-group">
                <label htmlFor="postConfigName">Name</label>
                <input type="text" className="form-control" id="postConfigName" name="name" placeholder="Configuration Name" onChange={handlePostFormConfigInputChange} value={postFormConfig.name ? postFormConfig.name : ""}/>
              </div>
              <div className="form-group">
                <label htmlFor="postConfigDescription">Description</label>
                <textarea className="form-control" id="postConfigDescription" name="description" placeholder="Configuration Description" rows="4" onChange={handlePostFormConfigInputChange} value={postFormConfig.description ? postFormConfig.description : ""}/>
              </div>
              <div className="form-group">
                <label htmlFor="postConfigModules">Modules</label>
                <input type="text" className="form-control" id="postConfigModules" name="modules" placeholder='JSON Array Form [{"id":"moduleID"(str),"level":int}]' onChange={handlePostFormConfigInputChange} value={postFormConfig.modules ? typeof(postFormConfig.modules) === 'string' ?  postFormConfig.modules : JSON.stringify(postFormConfig.modules): ""}/>
              </div>
              <div className="form-group">
                <label htmlFor="postConfigConnections">Connections</label>
                <input type="text" className="form-control" id="postConfigConnections" name="connections" placeholder='JSON Array Form [{"out":"moduleID"(str),"in":"moduleID"(str)}]' onChange={handlePostFormConfigInputChange} value={postFormConfig.connections ? typeof(postFormConfig.connections) === 'string' ? postFormConfig.connections : JSON.stringify(postFormConfig.connections) : ""}/>
              </div>
              <div className="form-group">
                <label htmlFor="postConfigActionConditions">ActionConditions</label>
                <input type="text" className="form-control" id="postConfigActionConditions" name="actionConditions" placeholder='JSON Array Form [{"actionModule":"moduleId"(str),"operator":str,"value":str}]' onChange={handlePostFormConfigInputChange} value={postFormConfig.actionConditions ? typeof(postFormConfig.actionConditions) === 'string' ? postFormConfig.actionConditions : JSON.stringify(postFormConfig.actionConditions) : ""}/>
              </div>
              <button type="submit" className="btn btn-primary" onClick={handlePostFormConfigSubmit}>Submit</button>

         </fieldset>

        </form>
      </div>
      <h6>Update Config Form Info</h6>
      <ConfigDetails config={postFormConfig}/>

    </div>
  )
}
