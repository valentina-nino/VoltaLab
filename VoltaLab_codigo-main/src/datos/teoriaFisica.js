// Teoría completa de cada lección de Calor y Ondas (mismos bloques que teoria.js).
export const TEORIA_FIS = {
  calor_l1: [
    { tipo: "texto", titulo: "Calor y temperatura: dos ideas distintas", parrafos: [
      "La temperatura mide qué tan agitadas están, en promedio, las partículas de un cuerpo. Un cuerpo caliente tiene partículas que se mueven rápido; uno frío, partículas más lentas. Se mide en grados Celsius (°C) o en kelvin (K).",
      "El calor, en cambio, es la energía que pasa de un cuerpo a otro por la diferencia de temperatura. Siempre fluye del más caliente al más frío, y se mide en julios (J). Un cuerpo no «tiene» calor: tiene energía interna, y el calor es la parte de esa energía que viaja." ] },
    { tipo: "clave", texto: "El calor es energía en tránsito; la temperatura es una medida del estado del cuerpo. Dos cuerpos a la misma temperatura no intercambian calor." },
    { tipo: "formula", formula: "Q = m · c · ΔT", simbolos: [["Q", "calor (J)"], ["m", "masa (kg)"], ["c", "calor específico (J/kg·K)"], ["ΔT", "T final − T inicial (K)"]] },
    { tipo: "texto", titulo: "El calor específico", parrafos: [
      "El calor específico c dice cuánta energía hay que darle a 1 kg de una sustancia para subir su temperatura 1 K. Es una propiedad del material.",
      "• Agua: 4186 J/(kg·K)\n• Aceite: 2000\n• Aluminio: 900\n• Hierro: 449\n• Cobre: 385\n• Plomo: 129",
      "Si Q es positivo, el cuerpo absorbe calor y se calienta. Si es negativo (T final menor que la inicial), el cuerpo cede calor y se enfría." ] },
    { tipo: "analogia", titulo: "Imagínalo así", texto: "Piensa en llenar recipientes con agua. El calor es el agua que echas; la masa es el tamaño del recipiente; el calor específico es lo ancho que es su fondo: en uno muy ancho hace falta mucha agua para subir un centímetro." },
    { tipo: "ejemplo", titulo: "Ejemplo resuelto", enunciado: "¿Cuánta energía necesitan 2 kg de agua para pasar de 20 °C a 50 °C?", pasos: ["ΔT = 50 − 20 = 30 K.", "Q = m · c · ΔT = 2 × 4186 × 30.", "Q = 251 160 J ≈ 251 kJ."] },
    { tipo: "ojo", titulo: "Ojo con esto", texto: "ΔT en °C y en K es el mismo número: una variación de 1 °C equivale a una de 1 K. Solo debes convertir si usas temperaturas absolutas." },
    { tipo: "vida", titulo: "En la vida real", texto: "Por el alto calor específico del agua, la costa tiene temperaturas más suaves que el interior: el mar tarda mucho en calentarse y mucho en enfriarse. Y por eso la arena de la playa quema al mediodía mientras el agua sigue fresca." },
  ],
  calor_l2: [
    { tipo: "texto", titulo: "¿Qué pasa cuando juntas dos cuerpos?", parrafos: [
      "Si pones en contacto un cuerpo caliente con uno frío, el caliente cede calor y el frío lo absorbe. Esto continúa hasta que los dos tienen la misma temperatura: el equilibrio térmico.",
      "Si no hay pérdidas hacia el ambiente (un calorímetro ideal), toda la energía que sale de uno entra al otro." ] },
    { tipo: "clave", texto: "Q cedido + Q absorbido = 0. La energía no se crea ni se pierde: solo pasa de un cuerpo al otro." },
    { tipo: "formula", formula: "Tf = (m₁c₁T₁ + m₂c₂T₂) / (m₁c₁ + m₂c₂)", simbolos: [["m₁c₁", "capacidad térmica del cuerpo 1 (J/K)"], ["T₁, T₂", "temperaturas iniciales"], ["Tf", "temperatura de equilibrio"]] },
    { tipo: "texto", titulo: "¿Por qué se llama promedio ponderado?", parrafos: [
      "La temperatura final es un promedio de T₁ y T₂, pero cada una pesa según su m·c. El cuerpo con más capacidad térmica manda: cambia poco su temperatura y arrastra al otro hacia la suya.",
      "Por eso una pieza de metal caliente que cae en agua casi no calienta el agua: el agua tiene una capacidad térmica enorme comparada con la del metal." ] },
    { tipo: "ejemplo", titulo: "Ejemplo resuelto", enunciado: "0,2 kg de cobre a 100 °C caen en 0,5 kg de agua a 20 °C. ¿Temperatura final?", pasos: ["m·c del cobre: 0,2 × 385 = 77 J/K. Del agua: 0,5 × 4186 = 2093 J/K.", "Tf = (77 × 100 + 2093 × 20) / (77 + 2093).", "Tf = 49 560 / 2170 ≈ 22,8 °C."] },
    { tipo: "ojo", titulo: "Ojo con esto", texto: "Esta fórmula solo vale si ningún cuerpo cambia de fase y no se pierde calor. Si hay hielo que se funde o agua que hierve, hay que sumar los calores latentes." },
    { tipo: "vida", titulo: "En la vida real", texto: "Cuando mezclas agua caliente con fría en la ducha estás resolviendo este problema. Y un termo es un intento de acercarse al calorímetro ideal: aísla para que casi no entre ni salga calor." },
  ],
  calor_l3: [
    { tipo: "texto", titulo: "Cuando el calor no sube la temperatura", parrafos: [
      "Si calientas hielo, su temperatura sube hasta 0 °C. Ahí empieza a fundirse y, aunque sigas dando calor, la temperatura se queda quieta en 0 °C hasta que todo el hielo es agua. Con la ebullición pasa lo mismo en 100 °C.",
      "Durante un cambio de fase la energía se usa para romper los enlaces que mantienen unidas las moléculas, no para agitarlas más." ] },
    { tipo: "formula", formula: "Q = m · L", simbolos: [["Q", "calor del cambio de fase (J)"], ["m", "masa (kg)"], ["L", "calor latente (J/kg)"]] },
    { tipo: "texto", titulo: "Los dos calores latentes del agua", parrafos: [
      "• Fusión (hielo ↔ agua): Lf = 334 kJ/kg.\n• Vaporización (agua ↔ vapor): Lv = 2256 kJ/kg.",
      "Vaporizar 1 kg de agua cuesta casi siete veces más energía que fundir 1 kg de hielo. Las moléculas deben separarse del todo, no solo soltarse." ] },
    { tipo: "analogia", titulo: "Imagínalo así", texto: "Es como subir una escalera con rellanos: en los tramos inclinados subes (la temperatura aumenta); en los rellanos caminas sin subir, pero gastas energía igualmente (el cambio de fase)." },
    { tipo: "ejemplo", titulo: "Ejemplo resuelto", enunciado: "¿Cuánta energía hace falta para llevar 0,5 kg de hielo a −20 °C hasta agua a 0 °C?", pasos: ["Calentar el hielo: 0,5 × 2100 × 20 = 21 000 J.", "Fundirlo: 0,5 × 334 000 = 167 000 J.", "Total = 188 000 J = 188 kJ."] },
    { tipo: "ojo", titulo: "Ojo con esto", texto: "Si la temperatura cambia, usa Q = m·c·ΔT; si cambia de fase, usa Q = m·L. En un problema con varias etapas se calcula cada tramo y se suman." },
    { tipo: "vida", titulo: "En la vida real", texto: "El sudor refresca porque evaporarse requiere mucha energía, que sale de tu piel. Y por eso una quemadura de vapor es peor que una de agua hirviendo: el vapor cede además su calor latente al condensarse." },
  ],
  calor_l4: [
    { tipo: "texto", titulo: "La electricidad que se vuelve calor", parrafos: [
      "Cuando una corriente atraviesa una resistencia, las cargas chocan con los átomos del material y les ceden energía: la resistencia se calienta. Es el efecto Joule, el principio de las estufas, los hervidores y los secadores de pelo.",
      "También es la razón por la que los bombillos y las resistencias de tus circuitos se queman si reciben más potencia de la que soportan." ] },
    { tipo: "formula", formula: "P = V² / R      Q = P · t", simbolos: [["P", "potencia (W)"], ["V", "voltaje (V)"], ["R", "resistencia (Ω)"], ["t", "tiempo (s)"], ["Q", "energía convertida en calor (J)"]] },
    { tipo: "clave", texto: "Si el calor llega todo al agua: P · t = m · c · ΔT. Así conectas la electricidad con la calorimetría." },
    { tipo: "analogia", titulo: "Imagínalo así", texto: "La potencia es la «rapidez» con que se entrega energía: 600 W son 600 julios cada segundo. En dos minutos son 72 000 J, como llenar un tanque a un caudal constante." },
    { tipo: "ejemplo", titulo: "Ejemplo resuelto", enunciado: "Un calentador de 24 Ω conectado a 120 V calienta 0,5 kg de agua a 20 °C durante 2 minutos. ¿Cuánto sube la temperatura?", pasos: ["P = V²/R = 120² / 24 = 600 W.", "Q = P · t = 600 × 120 = 72 000 J.", "ΔT = Q / (m·c) = 72 000 / (0,5 × 4186) ≈ 34,4 K → queda a 54,4 °C."] },
    { tipo: "ojo", titulo: "Ojo con esto", texto: "En la realidad parte del calor se pierde hacia el ambiente. La eficiencia η indica qué fracción de P·t llega al agua: Q útil = η · P · t." },
    { tipo: "vida", titulo: "En la vida real", texto: "Una plancha, una tostadora o un hervidor son resistencias diseñadas para calentarse. El fusible que viste en electricidad funciona igual, pero al revés: se calienta tanto que se funde y abre el circuito." },
  ],
  ondas_l1: [
    { tipo: "texto", titulo: "¿Qué es una onda?", parrafos: [
      "Una onda es una perturbación que viaja transportando energía sin transportar materia. Cuando una ola cruza el mar, el agua sube y baja pero no avanza con la ola.",
      "Para describir una onda periódica usamos tres cantidades: la amplitud, el periodo y la frecuencia." ] },
    { tipo: "formula", formula: "T = 1 / f", simbolos: [["A", "amplitud: máximo desplazamiento desde el equilibrio"], ["T", "periodo: tiempo de una oscilación (s)"], ["f", "frecuencia: oscilaciones por segundo (Hz)"]] },
    { tipo: "clave", texto: "La amplitud dice cuánta energía lleva la onda; la frecuencia dice qué tan rápido oscila. Son independientes entre sí." },
    { tipo: "analogia", titulo: "Imagínalo así", texto: "Piensa en alguien que mece una cuerda. Cuánto sube y baja la mano es la amplitud; cuántas veces la mece por segundo es la frecuencia; y el tiempo que tarda en cada vaivén es el periodo." },
    { tipo: "ejemplo", titulo: "Ejemplo resuelto", enunciado: "Una onda oscila 4 veces cada segundo. ¿Cuál es su periodo?", pasos: ["f = 4 Hz.", "T = 1 / f = 1 / 4.", "T = 0,25 s."] },
    { tipo: "vida", titulo: "En la vida real", texto: "El sonido agudo tiene mayor frecuencia que el grave. La nota «la» de un diapasón oscila 440 veces por segundo (440 Hz), así que su periodo es de apenas 2,3 milisegundos." },
  ],
  ondas_l2: [
    { tipo: "texto", titulo: "Longitud de onda y velocidad", parrafos: [
      "La longitud de onda λ es la distancia entre dos crestas consecutivas (o dos valles). Se mide en metros.",
      "En una oscilación completa, la onda avanza justo una longitud de onda. Como una oscilación dura un periodo T, la velocidad es λ / T, es decir, λ · f." ] },
    { tipo: "formula", formula: "v = λ · f", simbolos: [["v", "velocidad de la onda (m/s)"], ["λ", "longitud de onda (m)"], ["f", "frecuencia (Hz)"]] },
    { tipo: "clave", texto: "La velocidad depende del medio (cuerda, agua, aire). Si el medio no cambia, v es fija: más frecuencia implica menos longitud de onda." },
    { tipo: "analogia", titulo: "Imagínalo así", texto: "Es como una fila de personas que caminan a velocidad fija. Si dan más pasos por segundo, cada paso debe ser más corto: la frecuencia sube y la longitud baja, pero la velocidad es la misma." },
    { tipo: "ejemplo", titulo: "Ejemplo resuelto", enunciado: "Una onda tiene λ = 0,5 m y f = 6 Hz. ¿Con qué velocidad viaja?", pasos: ["v = λ · f.", "v = 0,5 × 6.", "v = 3 m/s."] },
    { tipo: "vida", titulo: "En la vida real", texto: "El sonido viaja en el aire a unos 343 m/s. Una nota de 343 Hz tiene entonces una longitud de onda de 1 m; una de 3430 Hz, solo 10 cm. Por eso los agudos se bloquean con obstáculos pequeños y los graves rodean las paredes." },
  ],
  ondas_l3: [
    { tipo: "texto", titulo: "Cuando dos ondas se encuentran", parrafos: [
      "Dos ondas pueden cruzarse sin dañarse. Mientras coinciden en el mismo punto, el desplazamiento resultante es la suma de los desplazamientos de cada una: es el principio de superposición.",
      "El resultado depende del desfase Δφ, que indica cuánto va una onda adelantada respecto de la otra." ] },
    { tipo: "texto", titulo: "Interferencia constructiva y destructiva", parrafos: [
      "• Δφ = 0°: las crestas coinciden; las ondas se refuerzan y la amplitud es A₁ + A₂ (constructiva).\n• Δφ = 180°: una cresta cae sobre un valle; se restan y la amplitud es |A₁ − A₂| (destructiva). Si A₁ = A₂ se cancelan por completo.",
      "Para desfases intermedios la amplitud queda entre esos dos extremos." ] },
    { tipo: "formula", formula: "A = √(A₁² + A₂² + 2·A₁·A₂·cos Δφ)", simbolos: [["A₁, A₂", "amplitudes de cada onda"], ["Δφ", "desfase entre ellas"], ["A", "amplitud de la onda resultante"]] },
    { tipo: "ejemplo", titulo: "Ejemplo resuelto", enunciado: "Dos ondas de amplitud 2 cm y 3 cm llegan en oposición de fase (Δφ = 180°). ¿Qué amplitud resulta?", pasos: ["cos 180° = −1.", "A = √(2² + 3² − 2·2·3) = √(4 + 9 − 12).", "A = √1 = 1 cm."] },
    { tipo: "vida", titulo: "En la vida real", texto: "Los audífonos con cancelación de ruido generan una onda de igual amplitud y en oposición de fase al ruido del ambiente: la interferencia destructiva «apaga» el sonido que no quieres oír." },
  ],
  ondas_l4: [
    { tipo: "texto", titulo: "La red eléctrica es una onda", parrafos: [
      "En un enchufe de casa el voltaje no es constante: oscila como una onda seno, v(t) = Vmax·sen(2πft). En Colombia y en casi toda América la frecuencia es de 60 Hz: 60 oscilaciones cada segundo.",
      "Esto es la corriente alterna (CA). Las baterías de tus circuitos, en cambio, daban corriente continua (CC)." ] },
    { tipo: "formula", formula: "Vrms = Vmax / √2", simbolos: [["Vmax", "voltaje máximo o de pico (V)"], ["Vrms", "voltaje eficaz (V)"], ["P media", "Vrms² / R = Vmax² / (2R)"]] },
    { tipo: "clave", texto: "El voltaje eficaz es el valor de una batería que calentaría la resistencia exactamente igual. Cuando dicen «120 V» en un enchufe, hablan de Vrms." },
    { tipo: "texto", titulo: "Potencia media", parrafos: [
      "La potencia instantánea P = v²/R oscila entre 0 y Pmax = Vmax²/R, siempre positiva. Su promedio es justo la mitad: P media = Pmax / 2 = Vrms²/R.",
      "Por eso, para calcular cuánto calienta una resistencia en corriente alterna, usamos Vrms: es la unión entre ondas y calor." ] },
    { tipo: "ejemplo", titulo: "Ejemplo resuelto", enunciado: "Una red tiene Vmax = 170 V. ¿Cuál es su Vrms? Si alimenta una resistencia de 100 Ω, ¿qué potencia media disipa?", pasos: ["Vrms = 170 / 1,414 ≈ 120 V.", "P media = Vrms² / R = 120² / 100.", "P media ≈ 144 W."] },
    { tipo: "vida", titulo: "En la vida real", texto: "Un secador de pelo es una resistencia conectada a corriente alterna: convierte esa potencia media en calor que seca. Todo lo que aprendiste de calor y de ondas se junta en un aparato de tu baño." },
  ],
};
export const teoriaFis = (clave) => TEORIA_FIS[clave] || null;
