import React, { useState } from "react";
import styles from "./PowerUsageForm.module.css";
import Papa from "papaparse";
import Link from "next/link";


export function PowerUsageForm() {
    
    const changeHandler = (event) => {
        var url = "api/form";
        let id = giveId()
       
        // console.log(id)
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        Papa.parse(event.target.files[0], {
            delimiter: ",",
            header: true,
            skipEmptyLines: true,
            transformHeader: function(h) {
                return h.replace(/\s/g, '');
              },
            complete: function (results) {
                let data = results.data
                 let test = fetch(url, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'myid': id,
                    },
                    body: JSON.stringify(data),
                  }).then((response) => {
                    console.log(response)
                    if(response.status == 200){
                        IsUploaded(1)
                    }
                }).catch((error) => {
                    console.error('Error:', error);
                  });
            },
        });    
    };



    return (
        <div className={styles.container} >
            <h2>Nå Får du to valg for sammenligning</h2>
            <p>Første mulighet er å bare trykke på knappen merket med Gå videre til sammenligning.</p>
            <p>Du vil da få test datapresentert for deg.</p>
            <br />
            <p>Andre mulighet er å laste opp egen data som du henter fra <a href="https://elhub.no/">elhub.no</a> </p>
            <p>Hvis du ønsker å hente egen data gjør følgende:</p>
            <ol>
                <li>Logg inn på min side på <a href="www.elhub.no">elhub.no</a></li>
                <li>Gå inn på måleren du ønsker å hente data fra.</li>
                <li>Last ned brukerdata for perioden 01.01.2023 til 31.01.2023 som CSV fil.</li>
                <li>Last opp CSV filen i boksen under og trykk på kanppen som sier Gå videre til sammenlinging.</li>
                <br />
                <br />

            </ol>
                <input
                    type="file"
                    name="file"
                    accept=".csv"
                    onChange={changeHandler}
                    style={{ display: "block", margin: "10px auto" }}
                />
                <IsUploaded />
                <Link href="/consumption">
                    <button id="btn"> Gå videre til sammenligning </button>
                </Link>
        </div>
    );
}

function giveId() {
    let id =localStorage.getItem('id');
    const d = new Date();
    let ms = d.getMilliseconds();
    console.log(id)
    if(!id){
        localStorage.setItem('id', ms);
        id=ms;
        console.log('Satt ny id:' +  ms)
    }
    return id;
}

function IsUploaded(props){

    let message;

    if(!props) {
        message = "Filen er ferdig opplastet og du kan gå videre."
    } else {
        message = "Filen er ikke lastet opp, men du kan gå videre hvis du ønsker å benytte test data. (vent litt hvis du har forsøkt å laste opp)"
    }


    return(
        <p>{message}</p>
    )


}
