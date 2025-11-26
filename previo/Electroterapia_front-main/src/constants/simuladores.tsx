const simuladores = [
  {
    group: "Corriente continua",
    simuladores: [
      { 
        name: "Corriente galvánica",
        subname: "Galvánica",
        aprendizaje: "/app/aprendizaje/galvanica",
        simulacion: "/app/simulacion/galvanica",
        evaluacion: "/app/evaluacion/galvanica"
      }    
    ]
  },
  {
    group: "Baja frecuencia",
    simuladores: [
      { 
        name: "Corriente Monofásica",
        subname: "Baja frecuencia",
        aprendizaje: "/app/aprendizaje/monofasica",
        simulacion: "/app/simulacion/monofasica",
        evaluacion: "/app/evaluacion/monofasica",
      },
      { 
        name: "Corriente Bifásica",
        subname: "Baja frecuencia",
        aprendizaje: "/app/aprendizaje/bifasica" ,
        simulacion: "/app/simulacion/bifasica",
        evaluacion: "/app/evaluacion/bifasica",
      },    
    ]
  },
  {
    group: "Media frecuencia",
    simuladores: [
      { 
        name: "Media frecuencia", 
        subname: "Media frecuencia",
        aprendizaje: "/app/aprendizaje/mediafrecuencia",
        simulacion: "/app/simulacion/mediafrecuencia",
        evaluacion: "/app/evaluacion/mediafrecuencia",
      },  
    ]  
  },
  {
    group: "Alta frecuencia",
    simuladores: [
      { 
        name: "Diatermia", 
        subname: "Alta frecuencia",
        aprendizaje: "/app/aprendizaje/diatermia",
        simulacion: "/app/simulacion/diatermia",
        evaluacion: "/app/evaluacion/diatermia",
      },
      { 
        name: "Onda corta", 
        subname: "Alta frecuencia",
        aprendizaje: "/app/aprendizaje/ondacorta",
        simulacion: "/app/simulacion/ondacorta",
        evaluacion: "/app/evaluacion/ondacorta",
      },
      { 
        name: "Microondas", 
        subname: "Alta frecuencia",
        aprendizaje: "/app/aprendizaje/microondas",
        simulacion: "/app/simulacion/microondas",
        evaluacion: "/app/evaluacion/microondas",
      },    
    ]
  },
  {
    group: "Fototerapia",
    simuladores: [
      { 
        name: "Infrarrojos", 
        subname: "Fototerapia",
        aprendizaje: "/app/aprendizaje/infrarrojos",
        simulacion: "/app/simulacion/infrarrojos",
        evaluacion: "/app/evaluacion/infrarrojos",
      },
      { 
        name: "Láser", 
        subname: "Fototerapia",
        aprendizaje: "/app/aprendizaje/laser",
        simulacion: "/app/simulacion/laser",
        evaluacion: "/app/evaluacion/laser",
      },
      { 
        name: "Ultravioletas", 
        subname: "Fototerapia",
        aprendizaje: "/app/aprendizaje/ultravioletas",
        simulacion: "/app/simulacion/ultravioletas",
        evaluacion: "/app/evaluacion/ultravioletas",
      },    
    ]
  },
  {
    group: "Magnetoterapia",
    simuladores: [
      { 
        name: "Magnetoterapia", 
        subname: "Magnetoterapia",
        aprendizaje: "/app/aprendizaje/magnetoterapia",
        simulacion: "/app/simulacion/magnetoterapia",
        evaluacion: "/app/evaluacion/magnetoterapia",
      },    
    ]
  },
  {
    group: "Otras técnicas",
    simuladores: [
      { 
        name: "Ultrasonidos", 
        subname: "Ultrasonidos",
        aprendizaje: "/app/aprendizaje/ultrasonidos",
        simulacion: "/app/simulacion/ultrasonidos",
        evaluacion: "/app/evaluacion/ultrasonidos",
      },
      { 
        name: "Ondas de choque", 
        subname: "Ondas de choque",
        aprendizaje: "/app/aprendizaje/ondaschoque",
        simulacion: "/app/simulacion/ondaschoque",
        evaluacion: "/app/evaluacion/ondaschoque",
      },    
    ]
  }
];

export default simuladores