declare module 'react-gauge-chart' {
  import React from 'react'

  interface GaugeChartProps {
    id?: string
    className?: string
    nrOfLevels?: number
    arcsLength?: number[]
    colors?: string[]
    percent?: number
    arcPadding?: number
    cornerRadius?: number
    needleColor?: string
    needleBaseColor?: string
    textColor?: string
    formatTextValue?: (value: number) => string
    animate?: boolean
    animDelay?: number
    style?: React.CSSProperties
  }

  const GaugeChart: React.FC<GaugeChartProps>
  export default GaugeChart
}
