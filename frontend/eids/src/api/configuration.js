import axios from "axios";
const config = {
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: false
}
const log = false;


export const getAllConfigDetails = async () => {

  const url = `${process.env.NEXT_PUBLIC_ENDPOINT}configuration`;
  const response = await axios.get(url,config);
  if(log){
     const prefix = '[configuration/getAllConfigeDetails]';
     console.log(prefix);
     console.log('url: ', url);
     console.log('response: ',response)
  }
  return response;

}

export const getAllActiveConfigDetails = async () => {
   const url = `${process.env.NEXT_PUBLIC_ENDPOINT}configuration/active`;
   const response = await axios.get(url,config);
   if(log){
      const prefix = '[configuration/getAllActiveConfigeDetails]';
      console.log(prefix);
      console.log('url: ', url);
      console.log('response: ',response)
   }
   return response;
}

export const getConfigDetails = async (configId) => {

  const url = `${process.env.NEXT_PUBLIC_ENDPOINT}configuration/${configId}`;
  const response = await axios.get(url,config);
  if(log){
     const prefix = '[configuration/getConfigDetails]';
     console.log(prefix);
     console.log('url: ', url);
     console.log('response: ',response)
  }
  return response;

}

export const startConfig = async(configurationId) => {
  const url = `${process.env.NEXT_PUBLIC_ENDPOINT}configuration/${configurationId}`;
  console.log(configurationId);
  const response = await axios.post(url, config);
  if(log) {
     const prefix = '[configuration/startConfig]';
     console.log(prefix);
     console.log('url: ',url);
     console.log('Configuration Id: ', configurationId)
     console.log('response:',response)
  }
  return response;
}

export const stopConfig = async(configurationId) => {
   const url = `${process.env.NEXT_PUBLIC_ENDPOINT}configuration/${configurationId}/stop`;
   console.log(configurationId);
   const response = await axios.post(url, config);
   if(log) {
      const prefix = '[configuration/stopConfig]';
      console.log(prefix);
      console.log('url: ',url);
      console.log('Configuration Id: ', configurationId)
      console.log('response:',response)
   }
   return response;
 }
 
 

export const addConfig = async(configurationData) => {
  const url = `${process.env.NEXT_PUBLIC_ENDPOINT}configuration`;
  const response = await axios.post(url, configurationData, {
     headers: {
        'Content-type': 'application/json'
     }
  });
  if(log) {
     const prefix = '[configuration/addConfig]';
     console.log(prefix);
     console.log('url: ',url);
     console.log('Configuration Data: ', configurationData)
     console.log('response:',response)
  }
  return response;
}

export const updateConfig= async(id,configData) => {
  const url = `${process.env.NEXT_PUBLIC_ENDPOINT}configuration/${id}/update`;
  const response = await axios.put(url, configData, {
     headers: {
        'Content-type': 'application/json'
     }
  });
  if(log) {
     const prefix = '[configuration/updateConfiguration]';
     console.log(prefix);
     console.log('url: ',url);
     console.log('id:', id)
     console.log('Config Data: ', configData)
     console.log('response:',response)
  }
  return response;
}

export const deleteConfig = async(id) => {
   const url = `${process.env.NEXT_PUBLIC_ENDPOINT}configuration/${id}`;
   const response = await axios.delete(url);
   if(log) {
      const prefix = '[configuration/deleteConfig]';
      console.log(prefix);
      console.log('url: ',url);
      console.log('response:',response)
   }
   return response;
}
