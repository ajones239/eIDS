import React, {useState,useEffect} from "react"
import { deleteModule } from "@/api/module";


export default function DeleteConfig() {

  const [moduleId, setModuleId] = useState("");

  const handleModuleIdChange = (event) => {
    event.target.value ? setModuleId(event.target.value) : setModuleId("")
  }
  const handlePostFormSubmit = async e => {
    e.preventDefault();
    try {
      console.log("Deleting:")
      const response = await deleteModule(moduleId);
      alert(response.status);
      window.location.reload();
    } catch (error) {
      console.log(error)
      console.log("[handlePostFormSubmit] Something went wrong")
      alert("Either invalid ID or failed deletion");
      window.location.reload();

    }
  }



  //refresh page with new data
  useEffect(() => {

  }, [moduleId]);


  return (
    <div className="container">
      <h1>Delete Module</h1>
 
      <div className="form-outline mb-3">
          <label className="form-label">
            Enter ID to delete:
          </label>
            <input className="form-control" placeholder="Module ID" type="text" name="id" value={moduleId}
                  onChange={handleModuleIdChange}/>
        </div>
          <fieldset>
            <button type="submit" className="btn btn-primary" onClick={handlePostFormSubmit}>Submit</button>
         </fieldset>

    </div>
  )
}
