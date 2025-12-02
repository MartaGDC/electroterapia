import { ApexOptions } from "apexcharts";

const commonOptions = {
  tooltip: { enabled: true },
  xaxis: {
    type: "numeric" as const,
    title: {text: "Tiempo"},
    decimalsInFloat: 2,
    forceNiceScale: true,
    tickAmount: 2,
    labels: {
      formatter: function (value: any, timestamp: any, chartContext: any) {
        if (!chartContext) return "";
  
        const range = chartContext.w.globals.maxX - chartContext.w.globals.minX;
        if (range >= 3600) {
          return (
            (Math.trunc(value / 3600)).toString() + 
            ":" +
            (value % 3600 / 60 < 10 ? "0" : "") + (Math.trunc(value % 3600 / 60)).toString() + 
            ":" + 
            (value % 60 < 10 ? "0" : "") + (Math.trunc(value % 60)).toString() + 
            " h"
          )
        } else if (chartContext.w.globals.maxX - chartContext.w.globals.minX >= 60) {
          return (
            (Math.trunc(value / 60)).toString() + 
            ":" + 
            (value % 60 < 10 ? "0" : "") + (Math.trunc(value % 60)).toString() + 
            " min"
          )
        } else if (chartContext.w.globals.maxX - chartContext.w.globals.minX <= 0.01) {
          return Number(value * 1000).toFixed(2).toString() + " ms";
        } else {
          return Number(value).toFixed(2).toString() + " s";
        }
      }
    }
  },
}

export const galvanicaOptions: ApexOptions = {
  ...commonOptions,
  chart: {
    toolbar: { show: true }, // Oculta el menú de herramientas
    zoom: { enabled: true }, // Deshabilita zoom con el cursor
    background: "#ffffff",
    animations: {
      enabled: true,
      dynamicAnimation: { speed: 100 }
    }
  },
  yaxis: {
    min: 0,
    decimalsInFloat: 2,
    title: { text: "Intensidad (mA)" }
  },
  stroke: {
    curve: 'straight',
    dashArray: [0, 5]
  },
  markers: { colors: ['#F44336', '#FF0000', '#9C27B0'] },
  colors: ["#1E88E5", "#F44336"], // Colores de las líneas
  legend: { show: true }  
}

export const bifasicaOptions: ApexOptions = {
  ...commonOptions,
  chart: {
    toolbar: { show: true },
    zoom: {
      enabled: true,
      type: 'x',
      autoScaleYaxis: true
    },
      background: "#ffffff",
    animations: {
      enabled: true,
      dynamicAnimation: { speed: 100 }
    }
  },
  yaxis: {
    decimalsInFloat: 2,
    title: { text: "Intensidad (mA)" }
  },
  stroke: {
    curve: 'straight',
    dashArray: [0, 5]
  },
  markers: { colors: ['#F44336', '#FF0000', '#9C27B0'] },
  colors: ["#1E88E5", "#F44336"], // Colores de las líneas
  legend: { show: true }  
}

export const monofasicaSinusoidalOptions: ApexOptions = {
  ...commonOptions,
  chart: {
    toolbar: { show: true },
    zoom: {
      enabled: true,
      type: 'x',
      autoScaleYaxis: true
    },  
    background: "#ffffff",
    animations: {
      enabled: true,
      dynamicAnimation: { speed: 100 }
    }
  },
  yaxis: {
    decimalsInFloat: 2,
    title: { text: "Intensidad (mA)" }
  },
  stroke: {
    curve: 'smooth',
    dashArray: [0, 5]
  },
  markers: { colors: ['#F44336', '#FF0000', '#9C27B0'] },
  colors: ["#1E88E5", "#F44336"], // Colores de las líneas
  legend: { show: true }  
}
