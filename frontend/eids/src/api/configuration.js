import axios from "axios";
const config = {
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: false
}
const log = true;


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