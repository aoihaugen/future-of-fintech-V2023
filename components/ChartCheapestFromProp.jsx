import styles from "./Chart.module.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Label, Legend, LabelList } from "recharts";

//Main function for creating chart specifically for showing the data from the providers combined with user data.
export default function ChartDataFromFile(props) {
    // console.log(props.data);
    let data = props.data.dayCalculations;
    let name = props.data.company;
    let productName = props.data.product;
    let pris = Math.round(props.data.totalCostMonth);

  return (
    <div className={styles.container}>
      <h3>Totalprisen med {productName} fra {name} i januar var avrundet {pris}kr.</h3>
      <LineChart id="123" width={1000} height={400} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="day" >
          <Label value="Time for time" offset={-4} position="insideBottom" />
        </XAxis>
        <YAxis
          label={{
            value: "Pris (nok)",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />

        <Line type="monotone" dataKey="price" stroke="#8884d8" >
        </Line>
      </LineChart>
    </div>
  );
}

