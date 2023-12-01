import axios from "axios";
const config = {
   headers: {
      "Content-Type" : "application/json"
   },
   withCredentials: false
}
const log = false;


export const getAllLogs = async () => {

   const url = `${process.env.NEXT_PUBLIC_ENDPOINT}logs`;
   const response = await axios.get(url,config);
   if(log){
      const prefix = '[modules/getAllLogs]';
      console.log(prefix);
      console.log('url: ', url);
      console.log('response: ',response)
   }
   return response;

}