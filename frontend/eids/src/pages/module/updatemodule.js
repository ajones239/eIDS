import React, {useState,useEffect} from "react"
import ModuleDetails from "@/components/moduledetails"
import { getAllModuleDetails, getModuleDetails, updateModule } from "@/api/module";


export default function UpdateModule() {
  //display either base64 or regular text when getting module details
  const [display64, setDisplay64] = useState(false);
  const [module, setModule] = useState([])
  const [moduleId, setModuleId] = useState("");
  const [validModule, setValidModule] = useState(false);
  const [postForm, setPostForm] = useState({});

  const handleDisplay64Check = (event) => {
    console.log(event.target.checked);
    setDisplay64(event.target.checked)
  }

   //get modules using id
   
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
         setValidModule(true)
         setPostForm(response.data)
      
      } catch (error) {
         setModule({"Response":"None"})
         setValidModule(false)

         setPostForm({})
      }
      
   }
  //post module using  form
  
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
      console.log("Submitting postform:")
      // console.log(postForm)
      const response = await updateModule(moduleId,postForm);
      alert(response.status);
      window.location.reload();
    } catch (error) {
      console.log(error)
      console.log("[handlePostFormSubmit] Something went wrong")
    }
  }



  //refresh page with new data
  useEffect(() => {
   async function fetchData() {
      await fetchModuleDetails(moduleId);
   }
   fetchData();
  }, [display64,moduleId]);

  useEffect(() =>{
   console.log("Got to here")
   console.log("Postform")
   console.log(postForm)
  },[postForm,validModule])

  return (
    <div className="container">
      <h1>Update Module</h1>
      <div className="form-check">
        <label className="form-check-label" htmlFor="display64Check">
          Display 64?
        </label>
        <input className="form-check-input" type="checkbox" value="" id="display64Check" onChange={handleDisplay64Check}/>
      </div>
      <div className="form-outline mb-3">
          <label className="form-label">
            Enter valid ID to enable form:
          </label>
            <input className="form-control" placeholder="Module ID" type="text" name="id" value={moduleId}
                  onChange={handleModuleIdFilter}/>
        </div>
      <div className="mb-10">
        <form >
         <fieldset disabled={!validModule}>

            <div className="form-group">
               <label htmlFor="postModuleName">Name</label>
               <input type="text" className="form-control" id="postModuleName" name="name" placeholder="Module Name" onChange={handlePostFormInputChange} value={postForm.name ? postForm.name : ""} />
            </div>
            <div className="form-group">
               <label htmlFor="postModuleDescription">Description</label>
               <textarea className="form-control" id="postModuleDescription" name="description" placeholder="Module Description" rows="4" onChange={handlePostFormInputChange} value={postForm.description ? postForm.description : ""} />
            </div>
            <div className="form-group">
               <label htmlFor="postModuleName">type</label>
               <input type="number" className="form-control" id="postModuleType" name="type" onChange={handlePostFormInputChange} value={postForm.type ? postForm.type : ""} />
            </div>
            <div className="form-group">
               <label htmlFor="postModuleDependencies">Dependencies</label>
               <input type="text" className="form-control" id="postModuleDependencies" name="dependencies" placeholder="Comma Delimitted Dependencies" onChange={handlePostFormInputChange} value={postForm.dependencies ? postForm.dependencies : "" } />
            </div>
            <div className="form-group">
               <label htmlFor="postModuleImplementation">Implementation</label>
               <textarea className="form-control" id="postModuleImplementation" name="implementation" placeholder="Module Implementation" rows="10" onChange={handlePostFormInputChange} value={postForm.implementation ? Buffer.from(postForm.implementation, 'base64').toString() : ""} />
            </div>
            <button type="submit" className="btn btn-primary" onClick={handlePostFormSubmit}>Submit</button>
         </fieldset>

        </form>
      </div>
      <h6>Update Module Form Info</h6>
      <ModuleDetails module={postForm} display64={display64}  />

    </div>
  )
}
