import React, {useState,useEffect} from "react"
import ModuleDetails from "@/components/moduledetails"
import { getAllModuleDetails, getModuleDetails, addModule, addInputToModule } from "@/api/module";


export default function AddModule() {
  //display either base64 or regular text when getting module details
  const [display64, setDisplay64] = useState(false);
  const handleDisplay64Check = (event) => {
    console.log(event.target.checked);
    setDisplay64(event.target.checked)
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

   //parse file
   const parseFile = (event) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
      // The file's text will be printed here
      const json = JSON.parse(event.target.result)
      console.log(json)
      setPostForm(json)

    };
  
    reader.readAsText(file);
    console.log(postForm)
  }
  //refresh page with new data
  useEffect(() => {
  }, [postForm,display64]);

  return (
    <div className="container">
      <h1>Add Module</h1>
      <div className="form-check">
        <label className="form-check-label" htmlFor="display64Check">
          Display 64?
        </label>
        <input className="form-check-input" type="checkbox" value="" id="display64Check" onChange={handleDisplay64Check}/>
      </div>
      <div>
        <p>Fill Form or upload JSON file here</p>
        <input type="file" onChange={parseFile}/>
      </div>
      <div className="mb-10">
        <form>
          <div className="form-group">
            <label htmlFor="postModuleName">Name</label>
            <input type="text" className="form-control" id="postModuleName" name="name" placeholder="Module Name" onChange={handlePostFormInputChange} value={postForm.name}/>
          </div>
          <div className="form-group">
            <label htmlFor="postModuleDescription">Description</label>
            <textarea className="form-control" id="postModuleDescription" name="description" placeholder="Module Description" rows="4" onChange={handlePostFormInputChange}  value={postForm.description}/>
          </div>
          <div className="form-group">
            <label htmlFor="postModuleName">type</label>
            <input type="number" className="form-control" id="postModuleType" name="type" onChange={handlePostFormInputChange} value={postForm.type}/>
          </div>
          <div className="form-group">
            <label htmlFor="postModuleDependencies">Dependencies</label>
            <input type="text" className="form-control" id="postModuleDependencies" name="dependencies" placeholder="Comma Delimitted Dependencies" onChange={handlePostFormInputChange} value={postForm.dependencies}/>
          </div>
          <div className="form-group">
            <label htmlFor="postModuleImplementation">Implementation</label>
            <textarea className="form-control" id="postModuleImplementation" name="implementation" placeholder="Module Implementation" rows="10" onChange={handlePostFormInputChange} value={postForm.implementation ? Buffer.from(postForm.implementation,'base64').toString() : ""}  />
          </div>
          <button type="submit" className="btn btn-primary" onClick={handlePostFormSubmit}>Submit</button>

        </form>
      </div>
      <h6>Post Module Form Info</h6>
      <ModuleDetails module={postForm} display64={display64}  />

    </div>
  )
}
