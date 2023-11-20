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

export const addInputToModule = async(moduleData) => {
   console.log(moduleData.data)
   const url = `${process.env.NEXT_PUBLIC_ENDPOINT}module/${moduleData.id}/input/${moduleData.data}`;
   const response = await axios.post(url, moduleData, {
      headers: {
         'Content-type': 'application/json'
      }
   });
   if(log) {
      const prefix = '[modules/addInputModule]';
      console.log(prefix);
      console.log('url: ',url);
      console.log('Module Data: ', moduleData)
      console.log('response:',response)
   }
   return response;
}

export const updateModule = async(id,moduleData) => {
   const url = `${process.env.NEXT_PUBLIC_ENDPOINT}module/${id}/update`;
   const response = await axios.put(url, moduleData, {
      headers: {
         'Content-type': 'application/json'
      }
   });
   if(log) {
      const prefix = '[modules/updateModule]';
      console.log(prefix);
      console.log('url: ',url);
      console.log('id:', id)
      console.log('Module Data: ', moduleData)
      console.log('response:',response)
   }
   return response;
}

export const deleteModule = async(id) => {
   const url = `${process.env.NEXT_PUBLIC_ENDPOINT}module/${id}`;
   const response = await axios.delete(url);
   if(log) {
      const prefix = '[modules/deleteModule]';
      console.log(prefix);
      console.log('url: ',url);
      console.log('response:',response)
   }
   return response;
}



export const getWorkingModules = async () => {

   const url = `${process.env.NEXT_PUBLIC_ENDPOINT}worker`;
   const response = await axios.get(url,config);
   if(log){
      const prefix = '[modules/getAllModuleDetails]';
      console.log(prefix);
      console.log('url: ', url);
      console.log('response: ',response)
   }
   return response;

}
