import React, {useState,useEffect} from "react"
import { startConfig } from "@/api/configuration";


export default function StartConfig() {

  const [configId, setConfigId] = useState("");

  const handleConfigIdChange = (event) => {
    event.target.value ? setConfigId(event.target.value) : setConfigId("")
  }
  const handlePostFormSubmit = async e => {
    e.preventDefault();
    try {
      console.log("Starting:")
      const response = await startConfig(configId);
      alert(response.status);
      window.location.reload();
    } catch (error) {
      console.log(error)
      console.log("[handlePostFormSubmit] Something went wrong")
      alert("Either invalid ID or failed start");
      window.location.reload();

    }
  }



  //refresh page with new data
  useEffect(() => {

  }, [configId]);


  return (
    <div className="container">
      <h1>Start Config</h1>
 
      <div className="form-outline mb-3">
          <label className="form-label">
            Enter ID to start:
          </label>
            <input className="form-control" placeholder="Config ID" type="text" name="id" value={configId}
                  onChange={handleConfigIdChange}/>
        </div>
          <fieldset>
            <button type="submit" className="btn btn-primary" onClick={handlePostFormSubmit}>Submit</button>
         </fieldset>

    </div>
  )
}
