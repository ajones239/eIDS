import React, {useState,useEffect} from "react"
import ModuleDetails from "@/components/moduledetails"
import { getAllModuleDetails, getModuleDetails, addModule, addInputToModule, getWorkingModules } from "@/api/module";
import ModuleTable from "@/components/moduletable";
import ModuleTableActive from "@/components/moduletableactive";
import ConfigTableActive from "@/components/configtableactive";
import { getAllActiveConfigDetails } from "@/api/configuration";

export default function Config() {
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

    //get all active config
    const [allActiveConfig, setAllActiveConfig] = useState([]);

    const fetchAllActiveConfigDetails = async () => {
      try{
        const response = await getAllActiveConfigDetails();
        console.log(response.data)
        setAllActiveConfig(response.data)
      } catch (error) {
        setAllActiveConfig(null)
      }
    }
  

  //refresh page with new data
  useEffect(() => {
    async function fetchData() {
      // await fetchModuleDetails(moduleId);
      // await fetchAllModuleDetails();
      await fetchAllActiveConfigDetails();
    }
   fetchData();

  }, [moduleId,display64]);

  return (
    <div className="container">
     
      <h1>Active Configs</h1>
      <div>
        <ConfigTableActive configs={allActiveConfig}/>
      </div>
      <hr/>
      {/* <div className="form-check">
        <label className="form-check-label" htmlFor="display64Check">
          Display 64?
        </label>
        <input className="form-check-input" type="checkbox" value="" id="display64Check" onChange={handleDisplay64Check}/>
      </div>
      <div>
        <div className="form-outline mb-3">
          <label className="form-label">
            Filter module by id:
          </label>
            <input className="form-control" placeholder="Module ID" type="text" name="id" value={moduleId}
                  onChange={handleModuleIdFilter}/>
        </div>
        <h6>Results</h6>
        <ModuleDetails module={module} display64={display64} />

      </div>
    

      <h3>All Modules</h3>
      <div>
        <ModuleTable modules={allModule} display64={false}/>
      </div> */}
    </div>
  )
}
