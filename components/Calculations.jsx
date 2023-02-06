import { React } from "react";
import dynamic from "next/dynamic";


//Import of chart that is used to show cost of each provider
const ChartCheapestFromProp = dynamic(
    () => import("../components/ChartCheapestFromProp"),
    {
      ssr: false,
    }
  );

  //Main function that exports html and coposes the html from the functions within.
  //Gives a chart for every provider in the database and some accompanying info.
  //Gets input from the calculateCheapestProvider function.
export function Calculations(props) {
    const data = calculateCheapestProvider(props);
    let cheapestName = data[0].company;
    let productName = data[0].product;
    let cheapestMonthly = data[0].monthlyFee;
    let cheapestAdd = data[0].monthlyFee;
    return(
        <div>
            <h2>Den billigste tilbyderen for deg i januar ville vært {cheapestName} med produktet {productName}  </h2>
            <p>De har månedspris på {cheapestMonthly} og spot påslag på {cheapestAdd} </p>

            <h3>Under vil du du se litt informasjon om tilbyderne som var med i sammenligningen. Tilbyderene er sortert i stigende rekkefølge.</h3>
            {data.map(i => {
               return (
                <div key={i.company+i.product}>
                    <ChartCheapestFromProp  data={i} />
                    <p>Månedsprisen for {i.product} fra {i.company}  er {i.monthlyFee}kr og spot påslaget er {i.spotAddon}kr.</p>
                </div>
               )
            })
            }
            
        </div>
            
    )
}


//Uses the json input to compose a new json with a combination of the given input that can be used to get user spesific data.
function calculateCheapestProvider(props) {
    let userData = props.props.userData;
    let productData = props.props.productData;
    let spotData = props.props.spotData;
    let companyPrices = [];

    
    for(let i in productData) {
        let hourlyOfMontly = productData[i].monthlyFee / userData.length;
        let hourCalculations = [];
        let dayCalculations = [];
        let totalSum = 0.0;
        for(let j in userData){

                let price = (spotData[j].no5 + productData[i].spotAddon) * userData[j].consumption;
                hourCalculations[j] =  {
                        datetime: spotData[j].datetime,
                        priceHourly: price,        
                };
                totalSum +=price+hourlyOfMontly;

        }
        let counter = 0;
        for(let i = 0;i<hourCalculations.length;i+=24){
            let t = 0.0;
            for(let j =0; j<24 ;j++){
                 t += hourCalculations[i+j].priceHourly;
            }
            dayCalculations[counter] = {
                day: counter+1,
                price: t,
            } 
            counter++;
        }

        
        companyPrices[i] ={
            company: productData[i].company,
            product: productData[i].product,
            monthlyFee: productData[i].monthlyFee,
            spotAddon: productData[i].spotAddon,
            totalCostMonth: totalSum,
            hourCalculations,
            dayCalculations,
            
        }

    }
    companyPrices.sort(function (a, b) {
        return a.totalCostMonth-b.totalCostMonth
    }) 
    return companyPrices
}