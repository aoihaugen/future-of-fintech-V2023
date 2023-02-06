
import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient({
    //To log all events in Prisma uncomment the code below.
    // log: ['query', 'info', 'warn', 'error'],
});
export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }
    // Get data submitted in request's body.
    let data = req.body
    let myId = parseInt(req.cookies.id);
    // console.log(myId)
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    // console.log('data: ', data)
    // JSON.stringify(data);

    // Guard clause checks for valid data points,
    // and returns early if they are not found
    if (!data[0].Fra || !data[0].Til) {
        // Sends a HTTP bad request error code
        return res.status(400).json({ data: 'valid data not found' })
    }

    //Puts the user collected data in a database.
    //collects any error.
    dataTilSky(myId, data)
        .then(async () => {
            await prisma.$disconnect()
            console.log('Sucsessfully disconnected')
            res.status(200).json({ data: 'Data received' });
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            console.log('Disconnected with error')
            res.status(400).json({ data: 'Data not receiced successfully' });
            process.exit(1)
        });
    //
    // Sends a HTTP success code with comfirmation message.
    // res.status(200).json({ message: 'Mottatt data fra bruker.' })
    // res.status(200).json({ data: 'Data received' });
}

async function dataTilSky(browserid, data) {
    let numberOfEnties = await prisma.electricUserData.count({
        where: {
            usersession: browserid,
        }
    }); 
    if (numberOfEnties > 0) {
        console.log("Bruker har allerede data i databasen")
    } else {
        for (let d in data) {
            let from = fixDateToISO(data[d].Fra);
            let to = fixDateToISO(data[d].Til);
            let consumption = data[d].KWH60Forbruk.replace(",", ".");

            // let from = data[d].Fra.split(".").reverse().join(".").replace(".","-");
            //let to =  data[d].Til.split(".").reverse().join(".").replace(".","-");
            await prisma.electricUserData.create({
                data: {
                    usersession: browserid,
                    from: from,
                    to: to,
                    consumption: consumption,
                },
            });
        }
    }



}

function fixDateToISO(date) {
    let year = date.substring(6, 10);
    let month = date.substring(3, 5);
    let day = date.substring(0, 2);
    let time = date.substring(11, 16);
    let dateISO = new Date(year + "-" + month + "-" + day + "T" + time);
    return dateISO.toISOString();

}
