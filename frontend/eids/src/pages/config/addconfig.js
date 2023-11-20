import React, {useState,useEffect} from "react"
import { addConfig} from "@/api/configuration";
import ConfigDetails from "@/components/configdetails";


export default function AddConfig() {
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
      const response = await addConfig(postFormConfig);
      alert("Config ID: " + response.data["id"]);
      window.location.reload();
    } catch (error) {
      console.log(error)
      console.log("[handlePostFormConfigSubmit] Something went wrong")
    }
  }


   //parse file
   const parseFile = (event) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
      // The file's text will be printed here
      const json = JSON.parse(event.target.result)
      console.log(json)
      setPostFormConfig(json)

    };
  
    reader.readAsText(file);
    console.log(postFormConfig)
  }
  //refresh page with new data
  useEffect(() => {
  }, [postFormConfig]);

  return (
    <div className="container">
      <h1>Add Module</h1>
      <div>
        <p>Fill Form or upload JSON file here</p>
        <input type="file" onChange={parseFile}/>
      </div>
      <h3>Post Config</h3>
          <div className="mb-10">
            <form>
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
              <button type="submit" className="btn btn-primary" onClick={handlePostFormConfigSubmit}>Submit</button>

            </form>
          </div>
      <h6>Config Form Info</h6>
      <ConfigDetails config={postFormConfig}  />

    </div>
  )
}
