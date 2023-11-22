import React from "react";
import {
   Chart as ChartJS,
   TimeScale,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
 } from 'chart.js';

 import 'chartjs-adapter-date-fns';
 import { Bar } from "react-chartjs-2";
 ChartJS.register(TimeScale,BarElement,LinearScale,Title, Tooltip)



 
 
 export default function GraphDateTime({graphData}){
    const mongdoDatesToGraphData = (graphdata) => {
       console.log("MongotoData")
       console.log(graphdata)
       const data = graphdata.map((gp) => ({
          x: Date.parse(gp.x_value),
          y: gp.y_value
       }))
       return data
    }
    const options = {
       responsive: true,
       plugins: {
         title: {
            display: true,
            text: "Test Graph from MongoDB"
         }
      },
      scales: {
         x: {
            type: 'time',
            stacked: true,
            time: {
               // displayFormats:{'month':'MM/yy'},
               unit: 'day'
            }
            // min: '2023-01-01 00:00:00'
         },
         y:{
            type: 'linear',
            stacked: true,
         }

      }
   }

   // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
   console.log("graphdata")
   console.log(graphData)
   const data = {
   
      
      datasets: [{
         backgroundColor: 'rgba(54, 162, 235, 0.2)',

        data: mongdoDatesToGraphData(graphData)
      }
     ]
   };

   // const labels = ['2021-11-06','2021-11-07','2021-11-07'];
   // const data = {
   //    // labels,
   //    datasets: [{
   //       backgroundColor: 'rgba(54, 162, 235, 0.2)',
   //       data: [{
   //       x: '2023-11-01 23:39:30',
   //       y: 50
   //    }, {
   //       x: '2023-11-07 01:00:28',
   //       y: 60
   //    }, {
   //       x: '2023-11-14 09:00:28',
   //       y: 20
   //    }, {
   //       x: Date.parse('Mon, 06 Nov 2023 00:00:00 GMT'),
   //       y: 20
   //    }
   //    ]}]
   // }


   return (
      <div className="container">
         <Bar options={options}
            data={data}
         />
            

      </div>
   )
}