const INITIAL_STATE = {
    platos: [],
    idpedido:{inseertedId:null},
    pedido: {},
    total:0,
    colegio:[],
    archivo:null,
    as3:null,
    ss3:null,
    alumnos:[],
    grados:[],
    gradofijo:null,
    Grado: [
        { value: 1, label: "Maternal", key:"A11-0" },
        { value: 2, label: "Sala de 3", key:"A11-1" },
        { value: 3, label: "Sala de 4", key:"A11-2" },
        { value: 4, label: "Sala de 5", key:"A11-3" },
        { value: 5, label: "1er grado", key:"B11-1" },
        { value: 6, label: "2do grado", key:"B11-2" },
        { value: 7, label: "3er grado", key:"B11-3" },
        { value: 8, label: "4to grado", key:"B11-4" },
        { value: 9, label: "5to grado", key:"B11-5" },
        { value: 10, label: "6to grado", key:"B11-6" },
        { value: 11, label: "1er año", key:"B11-7" },
        { value: 12, label: "2do año", key:"B11-8" },
        { value: 13, label: "3er año", key:"B11-9" },
        { value: 14, label: "4to año", key:"D18-1" },
        { value: 15, label: "5to año", key:"D18-2" },
        { value: 16, label: "Inicial", key:"A11" },
        { value: 17, label: "Primaria", key:"B11" },
        { value: 18, label: "Secundaria", key:"D18" },
        { value: 19, label: "Todos", key:"*" },
        
      ],
    Seccion: [
        { value: "A", label:"A" },
        { value: "B", label:"B" },
        { value: "C", label:"C" },
        { value: "D", label:"D" },
        { value: "E", label:"E" },
        { value: "F", label:"F" },
        { value: "U", label:"U" },
        { value: "*", label:"*" },
      ],
    Primaria: [
        { value: "1", label:"Lengua y Literatura", key:"B11-1" },
        { value: "2", label:"Matemática" },
        { value: "3", label:"Ciencias Naturales" },
        { value: "4", label:"Ciencias Sociales" },
        { value: "5", label:"Educación Estética" },
        { value: "6", label:"Educación Física y Deportes" },
      ],
    Secundaria: [
        { value: "1", label:"Castellano", key:"100000" },
        { value: "2", label:"Inglés y otras Lenguas", key:"0" },
        { value: "3", label:"Matemáticas", key:"200000"  },
        { value: "4", label:"Educación Física", key:"0"  },
        { value: "5", label:"Arte y Patrimonio", key:"300000"  },
        { value: "6", label:"Ciencias Naturales", key:"400000"  },
        { value: "7", label:"Geog-Hist y Ciudadanía", key:"500000"  },
        { value: "8", label:"Orientación y Convivencia", key:"0"  },
        { value: "9", label:"Participación en Grupos CRP", key:"0"  },
        { value: "10", label:"Física", key:"0"  },
        { value: "11", label:"Química", key:"0"  },
        { value: "12", label:"Biología", key:"0"  },
        { value: "13", label:"Form. Soberanía Nacional", key:"0"  },
        { value: "14", label:"Ciencias de la Tierra", key:"0"  },
      ],
}

export default (state = INITIAL_STATE, action) => {
    let total = 0;

    switch (action.type) {
        
        case 'agregar_plato':
            action.payload[0].carrito.map(subtotal => {
                total=total+(parseInt(subtotal.cantidad)*parseInt(subtotal.precio));
            });
            return { 
                ...state, 
                pedido: action.payload[0].carrito,
                total:total
            };
       
        case 'ver_credenciales':
            return { 
                ...state, 
                as3:action.payload[0],
                ss3:action.payload[1]
            };
        case 'ver_colegio':
            return { 
                ...state, 
            };
        case 'set_colegio':
            return { 
                ...state, 
                colegio:action.payload[0],
                gradofijo:action.payload[1]
            };
        case 'cerrar_pedido':
            return { 
                ...state, 
                idpedido:null,
                pedido: {},
                total:0
            }; 
        case 'ver_alumnos':
            return { 
                ...state, 
                alumnos:action.payload[0],
                grados:action.payload[1],
            }; 
        case 'detalle_plato':
            console.log(action.payload, state.platos.filter(plato => plato.id==action.payload));
            const plato = state.platos.filter(plato => plato.id==action.payload);
            console.log(plato);
            return { 
                ...state,
                plato: plato
            };
        default: return state;
    };
}