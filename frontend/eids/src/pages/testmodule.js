import React, {useState,useEffect} from "react"
import ModuleDetails from "@/components/moduledetails"
import { getModuleDetails, addModule } from "@/api/module";


export default function TestModule() {
  const [module, setModule] = useState([]);
  const [moduleId, setModuleId] = useState("");
  const [postForm, setPostForm] = useState({});
  const [display64, setDisplay64] = useState(true);

  const handleDisplay64Check = (event) => {
    console.log(event.target.checked);
    setDisplay64(event.target.checked)
  }

  const handleModuleIdFilter = (event) => {
    console.log("[handleModuleIdFilter] ",event.target.value)
    event.target.value ? setModuleId(event.target.value) : setModuleId("");
  }


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
      alert(response);
    } catch (error) {
      console.log(error)
      console.log("[handlePostFormSubmit] Something went wrong")
    }
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

  useEffect(() => {
   async function fetchData() {
      await fetchModuleDetails(moduleId);
   }
   fetchData();
  }, [moduleId,postForm,display64]);

  return (
    <>
      <div>
        <h1>TestModule</h1>
        <div class="form-check">
          <label className="form-check-label" for="display64Check">
            Display 64?
          </label>
          <input className="form-check-input" type="checkbox" value="" id="display64Check" onChange={handleDisplay64Check}/>
        </div>
        <h3>Get Module Detail</h3>
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
      <div className="mb-10">
        <h3>Post Module</h3>
        <form>
          <div className="form-group">
            <label for="postModuleName">Name</label>
            <input type="text" class="form-control" id="postModuleName" name="name" placeholder="Module Name" onChange={handlePostFormInputChange}/>
          </div>
          <div className="form-group">
            <label for="postModuleDescription">Description</label>
            <textarea class="form-control" id="postModuleDescription" name="description" placeholder="Module Description" rows="4" onChange={handlePostFormInputChange}/>
          </div>
          <div className="form-group">
            <label for="postModuleName">type</label>
            <input type="number" class="form-control" id="postModuleType" name="type" onChange={handlePostFormInputChange}/>
          </div>
          <div className="form-group">
            <label for="postModuleDependencies">Dependencies</label>
            <input type="text" class="form-control" id="postModuleDependencies" name="dependencies" placeholder="Comma Delimitted Dependencies" onChange={handlePostFormInputChange}/>
          </div>
          <div className="form-group">
            <label for="postModuleImplementation">Implementation</label>
            <textarea class="form-control" id="postModuleImplementation" name="implementation" placeholder="Module Implementation" rows="10" onChange={handlePostFormInputChange}/>
          </div>
          <button type="submit" class="btn btn-primary" onClick={handlePostFormSubmit}>Submit</button>

        </form>
      </div>
      <h6>Post Module Form Info</h6>
      <ModuleDetails module={postForm} display64={display64}  />
    </>
  )
}
