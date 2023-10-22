import axios from "axios";
const config = {
   headers: {
      "Content-Type" : "application/json"
   },
   withCredentials: false
}
const log = true;


export const getAllModuleDetails = async () => {

   const url = `${process.env.NEXT_PUBLIC_ENDPOINT}module`;
   const response = await axios.get(url,config);
   if(log){
      const prefix = '[modules/getAllModuleDetails]';
      console.log(prefix);
      console.log('url: ', url);
      console.log('response: ',response)
   }
   return response;

}


export const getModuleDetails = async (moduleId) => {

   const url = `${process.env.NEXT_PUBLIC_ENDPOINT}module/${moduleId}`;
   const response = await axios.get(url,config);
   if(log){
      const prefix = '[modules/getModuleDetails]';
      console.log(prefix);
      console.log('url: ', url);
      console.log('response: ',response)
   }
   return response;

}

export const addModule = async(moduleData) => {
   const url = `${process.env.NEXT_PUBLIC_ENDPOINT}module`;
   const response = await axios.post(url, moduleData, {
      headers: {
         'Content-type': 'application/json'
      }
   });
   if(log) {
      const prefix = '[modules/addModule]';
      console.log(prefix);
      console.log('url: ',url);
      console.log('Module Data: ', moduleData)
      console.log('response:',response)
   }
   return response;
}