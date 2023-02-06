import { Header } from "../components/Header";
import { Calculations } from "../components/Calculations";
import prisma from '../lib/prisma';
import dynamic from "next/dynamic";
import React, { useState } from "react";

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
    const [customChart, setCustomChart] = useState({ "monthlyFee": 0, "spotAddon": 0 });
    let totalSpotUserEntry1 = Math.round(totalSpotUserEntry(props.userData, props.spotData, customChart));
    return (
        <main>
            <Header />
            <h2>Du betalte {totalOnlySpot1}kr til kraftselskapene forrige måned.</h2>
            <h3>Sammen skal vi finne ut hva strømselskapet dit kostet deg forrige måned,</h3>
            <h3>så skal vi finne ut hvilket selskap som ville vært billigst.</h3>
            <h3>Grafen under viser hva du hadde betalt uten strømselskapene.</h3>
            <ChartSpotFromProp props={props} customChart={customChart} />
            <br />
            <CalculatedAfterAddon totalSpotUserEntry = {totalSpotUserEntry1} />
            <br />
            <InputSpotAndMonth customChart={customChart} setCustomChart={setCustomChart} />
            <br />

            <br />
            <br />
            <Calculations props={props} />
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
    let spotDataTemp = await prisma.spottPrices.findMany({
        orderBy: [
            {
                datetime: 'asc',
            },
        ],
    }
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
    for (let i in userData) {
        totalOnlySpot += userData[i].consumption * spotData[i].no5;
    }
    return totalOnlySpot
}

function totalSpotUserEntry(userData, spotData, customChart) {
    let totalSpotUserEntry = 0.0;
    for (let i in userData) {
        totalSpotUserEntry += userData[i].consumption * (spotData[i].no5 + customChart.spotAddon);
        totalSpotUserEntry += customChart.monthlyFee / userData.length
    }
    return totalSpotUserEntry
}

//Creates HMTL to give user input to change chart with input felds for monthlyFee and spotAddon
//Is given a stage as prop and updates the stage with assigned stage update function.
function InputSpotAndMonth(customChart) {
    let localCustomChart = Object.assign({}, customChart.customChart);
    const monthlyFee = (event) => {
        if (event.target.value) {
            localCustomChart = { ...localCustomChart, monthlyFee: parseInt(event.target.value) };
            customChart.setCustomChart(localCustomChart)
        }

    }
    const spotAddon = (event) => {
        if (event.target.value) {
            localCustomChart.spotAddon = parseFloat(event.target.value)
            customChart.setCustomChart(localCustomChart)
        }


    }

    return (
        <div>
            <h4>Sett inn egne verdier for å se grafen endre seg over.</h4>
            <label for="monthlyFee">Månedspris:</label>
            <input onInput={monthlyFee} type="number" id="monthlyFee" name="monthlyFee"
                min="0" max="100" defaultValue="0" >

            </input>
            <label for="spotAddon">Spot pris påslag i kroner. 1 øre = 0.01kr:</label>
            <input onInput={spotAddon} type="number" id="spotAddon" name="spotAddon"
                min="0" max="100" defaultValue="0" >

            </input>
        </div>
    )
}

function CalculatedAfterAddon(props) {
    console.log(props)

    return(
    <div>
        <h2>Med parameterene du legger inn under ville du betalt {props.totalSpotUserEntry}kr til strømselskapet i Januar.</h2>
    </div>
    )
}