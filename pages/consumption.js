import { Header } from "../components/Header";
import { Calculations } from "../components/Calculations";
import prisma from '../lib/prisma';
import dynamic from "next/dynamic";

//Import of chart that is used to show how much you spent only on spot last month.
const ChartSpotFromProp = dynamic(
    () => import("../components/ChartSpotFromProp"),
    {
      ssr: false,
    }
  );


  //Main function of this page.
  //Returns HTML for the /consumption page.
  //gets chart from ChartSpotFromProp and gets the Calculation child.
  //Takes input as JSON object from the getServerSideProps function
export default function Page(props) {
    let totalOnlySpot1 = Math.round(totalOnlySpot(props.userData, props.spotData));

    return (
        <main>
            <Header />
            <h2>Du betalte {totalOnlySpot1}kr i spotpris forrige måned.</h2>
            <h3>Se grafen under for visuell fremsitlling av hvilken dager som var dyrest.</h3>
            <ChartSpotFromProp props = {props} />
            <Calculations props = {props}  />
        </main>
    );
}


//Gets data from database and converts to JSON object.
export async function getServerSideProps(context) {
    const id = context.req.cookies.id;
    let userDataTemp
    if (await prisma.electricUserData.count({
        where: {
            usersession: parseInt(id),
        }
    }) == 744) {
        // console.log("eksisterer data")
        userDataTemp = await prisma.electricUserData.findMany({
            orderBy: [
                {
                    from: 'asc',
                },
            ],
            where: {
                usersession: parseInt(id),
            },
        })
    } else {
        // console.log("eksisterer ikke data")
        userDataTemp = await prisma.electricUserData.findMany({
            orderBy: [
                {
                    from: 'asc',
                },
            ],
            where: {
                usersession: 0,
            },
        })
    }

    let productDataTemp = await prisma.electricalDeals.findMany();
    let spotDataTemp = await prisma.spottPrices.findMany({orderBy: [
        {
            datetime: 'asc',
        },
    ],}
    );
    const userData = userDataTemp.map((item) => {
        item.consumption = parseFloat(item.consumption);
        return {
          id: item.id,
          usersession: item.usersession,
          from: item.from,
          to: item.to,
          consumption: item.consumption,
        };
    });
    // console.log(productDataTemp[0])

    const productData = productDataTemp.map((item) => {
        item.spotAddon = parseFloat(item.spotAddon);
        item.monthlyFee = parseFloat(item.monthlyFee);
        return {
          id: item.id,
          company: item.company,
          product: item.product,
          monthlyFee: item.monthlyFee,
          spotAddon: item.spotAddon,
        };
    });
    const spotData = spotDataTemp.map((item) => {
        item.no1 = parseFloat(item.no1);
        item.no2 = parseFloat(item.no2);
        item.no3 = parseFloat(item.no3);
        item.no4 = parseFloat(item.no4);
        item.no5 = parseFloat(item.no5);
        return {
          datetime: item.datetime,
          no1: item.no1,
          no2: item.no2,
          no3: item.no3,
          no4: item.no4,
          no5: item.no5,
        };
    });

// console.log(userData[0])
// console.log(spotData[0])
// console.log(productData [0])



    return {
      props: {
        userData,
        spotData,
        productData,
      },
    }
  }


  //Calculates the total price of the month with only spot price and consumption.
  function totalOnlySpot(userData, spotData) {
    let totalOnlySpot = 0.0;
    for(let i in userData){
        totalOnlySpot += userData[i].consumption * spotData[i].no5;
    }
    return totalOnlySpot
  }