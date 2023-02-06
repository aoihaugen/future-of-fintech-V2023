import styles from "./Chart.module.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Label } from "recharts";
import React from "react";


//Main function for creating chart specifically for showing user data with spot price.
export default function ChartDataFromFile(props) {
      let data = calculatePriceSpot(props.props.spotData, props.props.userData, props.customChart);
      

  return (
    <div className={styles.container}>
      <LineChart id="123" width={1000} height={400} data={data}>
        <XAxis dataKey="period">
          <Label value="Dag" offset={-4} position="insideBottom" />
        </XAxis>
        <YAxis
          label={{
            value: "Pris",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}

// Function to get a json file with the following information in each object:
//         period
//         price
//         pricenUnit
//
//  This information is used in the cration of the graph with only spot price and consumption as parameters.
 function calculatePriceSpot(spotData, userData, customChart) {
    let priceHour =[];
    let priceDay = [];
    let monthPrice = 0.0;
    let monthConsumption = 0.0;
    let spotAddon = customChart.spotAddon;
    let monthlyFee = customChart.monthlyFee;

    for(let i in spotData){
        monthConsumption += parseFloat(userData[i].consumption)
        priceHour[i] =parseFloat(userData[i].consumption) * parseFloat(spotData[i].no5); 
        priceHour[i] += spotAddon + (monthlyFee/31);
        monthPrice += priceHour[i]; 
    }
    let counter = 0;
    

    for(let i = 0;i<priceHour.length;i+=24){
        let t = 0.0;
        for(let j =0; j<24 ;j++){
             t += priceHour[i+j];
        }
        priceDay[counter] = t
        counter++;
    }
    const convertedData = priceDay.map((item, index) => {
      return {
        period: index+1,
        price: item,
        pricenUnit: "nok",
      };
    });
    return convertedData;
}