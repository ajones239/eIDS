import { getAllLogs } from "@/api/logs";
import RootLayout from "@/app/layout" 
import LogDetailsModal from "@/components/logdetailsmodal";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

export default function LogsMain() {

  const fetchLogs = async () => {
    try {
      const data = await getAllLogs();
      console.log(data)
      setLogData(data.data)
    } catch (error) {
      setLogData([])
    }
  }


  const [logData, setLogData] = useState([])

  // const buttonClick = (event) => {
  //   fetchLogs()
  // }
  useEffect(() => {
    async function fetchdata(){
      await fetchLogs()
    }

    fetchdata();
  },[])


  const logTable = (logTable) => {
    return (
      <>
         <Table>
            <thead>
               <tr>
                  <th>Module</th>
                  <th>ID</th>
                  <th>Log</th>
               </tr>
            </thead>
            <tbody>
               {
                  logTable && logTable.map((log) => (
                    <tr key={log.id}>

                        <td>{log.name ? log.name: "Unknown Name"}</td>
                        <td>{log.moduleId? log.moduleId: "Unknown ID"}</td>

                        <td>{<LogDetailsModal logdata={log.log}/>}</td>

                    </tr> 
                  ))
               }
            </tbody>
         </Table>

      </>
   )

  }



  return (
    <div className="container">

      <h3>Logs</h3>
      {/* <button>Refresh</button> */}
      {logTable(logData)}
    </div>
  )
}
