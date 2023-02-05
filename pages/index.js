import dynamic from "next/dynamic";
import { Header } from "../components/Header";
import { PowerUsageForm } from "../components/PowerUsageForm";


// This is the page that will be rendered at the root of your site.
export default function Home() {
  return (
    <main>
      <Header />
      <IndexInfo />
      <PowerUsageForm />
    </main>
  );
}


//Creates some info as HTML.
function IndexInfo() {
  return (
    <div>
      <h2>Nå Får du to valg for sammenligning</h2>
      <p>Første mulighet er å bare trykke på knappen merket med Gå videre til sammenligning.</p>
      <p>Du vil da få testdata presentert for deg.</p>
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

    </div>
  )
}