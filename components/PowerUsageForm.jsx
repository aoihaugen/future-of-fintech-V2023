import React, { useState } from "react";
import styles from "./PowerUsageForm.module.css";
import Papa from "papaparse";
import Link from "next/link";



//This is the main function for this component.
//This component gives the user information about how to proceed and 
export function PowerUsageForm() { 
    const [isuploaded, setIsuploaded] = useState("Filen er ikke lastet opp, men du kan gå videre hvis du ønsker å benytte test data. (vent litt hvis du har forsøkt å laste opp)");  
    const changeHandler = (event) => {
        var url = "api/form";
        let id =  giveId()     

        // Passing file data (event.target.files[0]) to parse using Papa.parse
        Papa.parse(event.target.files[0], {
            delimiter: ",",
            header: true,
            skipEmptyLines: true,
            transformHeader: function (h) {
                return h.replace(/\s/g, '');
            },
            complete: function (results) {
                let data = results.data
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'myid': id,
                    },
                    body: JSON.stringify(data),
                }).then((response) => {
                    console.log(response)
                    if (response.status == 200) {
                        setIsuploaded("Filen er ferdig opplastet og du kan gå videre.")
                    }
                }).catch((error) => {
                    console.error('Error:', error);
                });
            },
        });
    };

    const changeHandler2 = () => {
        let id =  giveId()    
        
    }
    return (
        <div className={styles.container} >
            <input
                type="file"
                name="file"
                accept=".csv"
                onChange={changeHandler}
                style={{ display: "block", margin: "10px auto" }}
            />
            <p>{isuploaded}</p>
            <Link href={"/consumption"}>
                <button onClick={changeHandler2} id="btn"> Gå videre til sammenligning </button>
            </Link>
        </div>
    );
}

// Gives the user an id.
// this is not a good id, and can in some cases give collision.
function giveId() {
    let id = document.cookie
        .split('; ')
        .find((row) => row.startsWith('id='))
        ?.split('=')[1];
    const d = new Date();
    let ms = d.getMilliseconds();
    if (!id) {
        let idText = "id="+ms;
        document.cookie = idText;
        console.log('Satt ny id:' + idText)
        id = ms;
    }
    return id;
}