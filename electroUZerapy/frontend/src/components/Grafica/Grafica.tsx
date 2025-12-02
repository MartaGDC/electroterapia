import React, { useEffect, useState, useRef } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import './Grafica.css';
import {
  bifasicaOptions,
  galvanicaOptions,
  monofasicaSinusoidalOptions
} from './Options';

const Grafica: React.FC<{
  series: { name: string, data: any[] }[],
  doAnimation?: boolean,
  tiempoSim?: number,
  type: string
}> = ({ series, doAnimation = false, tiempoSim = 0, type }) => {

  const chartRendered = useRef(false); // Para saber si el gráfico ya está listo

  const getBaseOptions = () => {
    const base =
      type === "galvanica" ? galvanicaOptions :
      type === "bifasica" ? bifasicaOptions :
      type === "monofasica" ? bifasicaOptions :
      type === "monofasicaSinusoidal" ? monofasicaSinusoidalOptions :
      bifasicaOptions;

    return {
      ...base,
      chart: {
        ...base.chart,
        id: "grafica"
      }
    };
  };

  const [state, setState] = useState({
    series,
    options: getBaseOptions()
  });

  // Actualiza opciones cuando cambia el tipo
  useEffect(() => {
    setState(prev => ({
      ...prev,
      options: getBaseOptions()
    }));
  }, [type]);

  // Actualiza series cuando cambia
  useEffect(() => {
    setState(prev => ({
      ...prev,
      series
    }));
  }, [series]);

  // Marca el gráfico como listo una vez montado
  useEffect(() => {
    const timer = setTimeout(() => {
      chartRendered.current = true;
    }, 300); // Espera un poco para asegurar que se ha montado

    return () => clearTimeout(timer);
  }, []);

  // Añadir o quitar anotación
  useEffect(() => {
    if (!chartRendered.current) return;

    const run = async () => {
      try {
        if (!doAnimation) {
          await ApexCharts.exec("grafica", "clearAnnotations");
        } else {
          await ApexCharts.exec("grafica", "clearAnnotations");
          await ApexCharts.exec("grafica", "addXaxisAnnotation", {
            x: tiempoSim,
            borderColor: '#FF4560',
            label: {
              style: {
                color: '#fff',
                background: '#FF4560'
              },
              text: 'Simulación'
            }
          });
        }
      } catch (err) {
        console.warn("ApexCharts.exec falló: ", err);
      }
    };

    run();
  }, [doAnimation, tiempoSim]);

  return (
    <Chart
      options={state.options}
      series={state.series}
      type="line"
      height={200}
    />
  );
};

export default Grafica;
