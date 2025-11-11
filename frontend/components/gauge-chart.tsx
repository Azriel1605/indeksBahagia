import GaugeChart from "react-gauge-chart"

const HappinessGauge = () => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2 text-primary">Indeks Kebahagiaan</h2>

      <GaugeChart
        id="happiness-gauge"
        nrOfLevels={20}          // jumlah gradasi warna
        colors={["#FF6B6B", "#FFD166", "#06D6A0"]} // dari merah ke hijau
        arcWidth={0.3}           // ketebalan gauge
        percent={0.72}           // nilai (0.0–1.0)
        textColor="#333333"
        needleColor="#222222"
        needleBaseColor="#222222"
      />

      <p className="mt-3 text-lg font-medium text-secondary">Skor: 72%</p>
    </div>
  )
}

export default HappinessGauge
