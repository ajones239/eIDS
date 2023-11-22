import axios from "axios";
const config = {
   headers: {
      "Content-Type" : "application/json"
   },
   withCredentials: false
}
const log = false;

export const getGraphData = async (graphId) => {

   const url = `${process.env.NEXT_PUBLIC_ENDPOINT}graphdata/${graphId}`;
   const response = await axios.get(url,config);
   if(log){
      const prefix = '[modules/getGraphData]';
      console.log(prefix);
      console.log('url: ', url);
      console.log('response: ',response)
   }
   return response;

}