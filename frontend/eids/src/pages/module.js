import React, {useState,useEffect} from "react"
import ModuleDetails from "@/components/moduledetails"
import { getAllModuleDetails, getModuleDetails, addModule, addInputToModule } from "@/api/module";


export default function Module() {
  //display either base64 or regular text when getting module details
  const [display64, setDisplay64] = useState(false);
  const handleDisplay64Check = (event) => {
    console.log(event.target.checked);
    setDisplay64(event.target.checked)
  }

  
  //get modules using id
  const [module, setModule] = useState([]);
  const [moduleId, setModuleId] = useState("");
  
  const handleModuleIdFilter = (event) => {
    console.log("[handleModuleIdFilter] ",event.target.value)
    event.target.value ? setModuleId(event.target.value) : setModuleId("");
  }
  
  const fetchModuleDetails = async (moduleId) => {
    if (!moduleId) return;
    try{
      const response = await getModuleDetails(moduleId);
      console.log(response.data)
      setModule(response.data)
    } catch (error) {
      setModule({"Response":"None"})
    }
    
  }
  
  //post module using  form
  const [postForm, setPostForm] = useState({});
  
  const handlePostFormInputChange = (event) => {
    const name  = event.target.name;
    let value = null;
    if (name === "dependencies") {
      value = event.target.value.split(',');
    }
    else if (name === "implementation"){
      value = Buffer.from(event.target.value).toString('base64');
    }
    else if (name == "type"){
      value = Number(event.target.value)
    }
    else {
      value = event.target.value;
    }
    
    setPostForm({
      ...postForm,
      [name]: value
    })
    // console.log(postForm)
  }
  
  const handlePostFormSubmit = async e => {
    // alert(JSON.stringify(postForm,null,2));
    e.preventDefault();
    try {
      const response = await addModule(postForm);
      alert("Module ID: " + response.data["id"]);
      window.location.reload();
    } catch (error) {
      console.log(error)
      console.log("[handlePostFormSubmit] Something went wrong")
    }
  }

  //post update module input using form
  const [postModuleAddInputForm, setPostModuleAddInputForm] = useState({});

  const handlePostModuleAddInputFormSubmit = async e => {
    // alert(JSON.stringify(postForm,null,2));
    e.preventDefault();
    try {

      const response = await addInputToModule(postModuleAddInputForm);
      console.log(response)
      window.location.reload();
    } catch (error) {
      console.log(error)
      console.log("[handlePostModuleAddInputFormSubmit] Something went wrong")
    }
  }


  //get all modules
  const [allModule, setAllModule] = useState([]);

  const fetchAllModuleDetails = async () => {
    try{
      const response = await getAllModuleDetails();
      console.log(response.data)
      setAllModule(response.data)
    } catch (error) {
      setModule({"Response":"None"})
    }
  }

  //refresh page with new data
  useEffect(() => {
    async function fetchData() {
      await fetchModuleDetails(moduleId);
      await fetchAllModuleDetails();
    }
   fetchData();

  }, [moduleId,postForm,display64]);

  return (
    <>
     
      <h1>TestModule</h1>
      <div className="form-check">
        <label className="form-check-label" htmlFor="display64Check">
          Display 64?
        </label>
        <input className="form-check-input" type="checkbox" value="" id="display64Check" onChange={handleDisplay64Check}/>
      </div>
      <hr/>
      <h3>Get Module Detail</h3>
      <div>
        <div className="form-outline mb-3">
          <label className="form-label">
            Filter module by id:
          </label>
            <input className="form-control" placeholder="Module ID" type="text" name="id" value={moduleId}
                  onChange={handleModuleIdFilter}/>
        </div>
        <h6>getModuleDetails</h6>
        <ModuleDetails module={module} display64={display64} />

      </div>
      <hr/>
      <h3>Post Module</h3>
      <div className="mb-10">
        <form>
          <div className="form-group">
            <label htmlFor="postModuleName">Name</label>
            <input type="text" className="form-control" id="postModuleName" name="name" placeholder="Module Name" onChange={handlePostFormInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="postModuleDescription">Description</label>
            <textarea className="form-control" id="postModuleDescription" name="description" placeholder="Module Description" rows="4" onChange={handlePostFormInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="postModuleName">type</label>
            <input type="number" className="form-control" id="postModuleType" name="type" onChange={handlePostFormInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="postModuleDependencies">Dependencies</label>
            <input type="text" className="form-control" id="postModuleDependencies" name="dependencies" placeholder="Comma Delimitted Dependencies" onChange={handlePostFormInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="postModuleImplementation">Implementation</label>
            <textarea className="form-control" id="postModuleImplementation" name="implementation" placeholder="Module Implementation" rows="10" onChange={handlePostFormInputChange}/>
          </div>
          <button type="submit" className="btn btn-primary" onClick={handlePostFormSubmit}>Submit</button>

        </form>
      </div>
      <h6>Post Module Form Info</h6>
      <ModuleDetails module={postForm} display64={display64}  />
      <hr/>

      <h3>Update Input of Module</h3>
      <div className="mb-10">
        <form>
          <div className="form-group">
            <label htmlFor="postModuleAddInputID">ID</label>
            <input type="text" className="form-control" id="postModuleAddInputID" name="id" placeholder="Module ID" onChange={(e) => setPostModuleAddInputForm({
                                                                                                                                    ...postModuleAddInputForm,
                                                                                                                                    "id": e.target.value
                                                                                                                                  })}/>
          </div>
          <div className="form-group">
            <label htmlFor="postModuleAddInputData">Data</label>
            <input type="text" className="form-control" id="postModuleAddInputData" name="data" placeholder="Data"onChange={(e) => setPostModuleAddInputForm({
                                                                                                                                    ...postModuleAddInputForm,
                                                                                                                                    "data": e.target.value
                                                                                                                                  })}/>
          </div>
          <button type="submit" className="btn btn-primary" onClick={handlePostModuleAddInputFormSubmit}>Submit</button>
        </form>
      </div>
      <div>

      </div>
      <hr/>
      <h3>Get all Modules</h3>
      <div>
        {allModule.map((module) => (
          <ModuleDetails key={module.id} module={module} display64={display64}/>
        ))}
      </div>
    </>
  )
}
