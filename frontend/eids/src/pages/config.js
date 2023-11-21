import React, {useState,useEffect} from "react"
import ConfigTableActive from "@/components/configtableactive";
import { getAllActiveConfigDetails, getConfigDetails, getAllConfigDetails } from "@/api/configuration";
import ConfigDetails from "@/components/configdetails";
import ConfigTable from "@/components/configtable";
import ModuleDetailsNameLinkModal from "@/components/moduledetailsnamelinkmodal";
export default function Config() {

  //get config by id
  const [config, setConfig] = useState([]);
  const [configId, setConfigId] = useState("");

  const handleConfigIdFilter = (event) => {
    console.log("[handleConfigIdFilter] ", event.target.value)
    event.target.value ? setConfigId(event.target.value) : setConfigId("");
  }

  const fetchConfigDetails = async (configId) => {
    if (!configId) return;
    try {
      const response = await getConfigDetails(configId);
      console.log(response.data)
      setConfig(response.data)
    } catch (error) {
      setConfig({ "Response": "None" })
    }

  }


  //get all active config
  const [allActiveConfig, setAllActiveConfig] = useState([]);

  const fetchAllActiveConfigDetails = async () => {
    try {
      const response = await getAllActiveConfigDetails();
      console.log(response.data)
      setAllActiveConfig(response.data)
    } catch (error) {
      setAllActiveConfig(null)
    }
  }

  //get all configuration sets
  const [allConfig, setAllConfig] = useState([]);
  const fetchAllConfigDetails = async () => {
    try {
      const response = await getAllConfigDetails();
      console.log(response.data)
      setAllConfig(response.data)
    } catch (error) {
      setAllConfig({ "Response": "None" })
    }
  }

  //refresh page with new data
  useEffect(() => {
    async function fetchData() {
      await fetchConfigDetails(configId);
      await fetchAllConfigDetails();
      await fetchAllActiveConfigDetails();
    }
   fetchData();

  }, [configId]);

  return (
    <div className="container">
     
      <h1>Active Configs</h1>
      <div>
        <ConfigTableActive configs={allActiveConfig}/>
      </div>
      <hr/>
      <div>
        <div className="form-outline mb-3">
          <label className="form-label">
              Filter Config by id:
          </label>
            <input className="form-control" placeholder="Config ID" type="text" name="id" value={configId}
                  onChange={handleConfigIdFilter}/>
        </div>
        <h6>getConfigDetails</h6>
        <ConfigDetails config={config} />

      </div>
      <h3>Get all configs</h3>
      <div>

          <ConfigTable configs={allConfig} />
         
      </div>
      <ModuleDetailsNameLinkModal moduleId={"655c311197b2a99167f5482b"}/>
    </div>
  )
}
