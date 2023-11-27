import { getModuleDetails } from "@/api/module";

export const fetchModuleDetails = async (moduleId) => {
   if (!moduleId) return;
   try {
      console.log("trying to fetch")
      const response = await getModuleDetails(moduleId);
      //   console.log(response.data)
      let test = {}
      if (response.data && response.data.implementation) {

         test = { ...response.data, "implementation": Buffer.from(response.data.implementation, 'base64').toString('utf-8') }
      }
      else {
         test = ""
      }
      return test
   } catch (error) {
      console.log("addModuleDataToConfig/fetchModuleDetails/error")
      return ("")
   }
}
export const addAllConfigModuleDetails = async (configin) => {
   let configinput = configin;
   if (configinput.modules) {
      for(const [index,element] of configin.modules.entries()){
         const data = await fetchModuleDetails(element.id);
         configinput.modules[index] = { name: data.name, id: data.id, level: configinput.modules[index].level };
            console.log(configin.modules[index]);
      }
      // configin.modules.forEach((element, index) => {
      //    //get details
      //    const data = await fetchModuleDetails(element.id);

      //    configinput.modules[index] = { name: data.name, id: data.id, level: configinput.modules[index].level };
      //    })

      //    //attach data to modules
      //    // console.log(config.modules[index])
      //    // console.log(config.modules[index])

      };
      console.log("configinput");
      console.log(configinput);
      return configinput;
   
}
export const addModuleDataToConfig = async (config = exconfig) => {
   config = JSON.parse(config)
   let returnconfig = {}




   returnconfig = await addAllConfigModuleDetails(config);
   console.log("returning config");
   console.log(returnconfig)
   return returnconfig;
}