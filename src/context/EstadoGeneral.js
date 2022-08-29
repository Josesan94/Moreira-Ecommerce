import React, {useReducer, useEffect, createContext, useState} from 'react'
import {signOut} from 'firebase/auth'
import {auth, db} from '../db/firebase'
import {onSnapshot, doc} from '.firebase/firestore'

const estadoInicial = {
    usuario: {}
};


//Si existe el idtoken del usuario seteo los datos del usuario del localStorage. De lo contrario, seteo el estado inicial
if(localStorage.getItem("IdToken")) {
    const usuarioData = {
        Metodo: localStorage.getItem("Metodo"),
        IdCliente: localStorage.getItem("IdCliente"),
        IdToken: localStorage.getItem("IdToken"),
        Correo: localStorage.getItem("Correo"),
        Nombres: localStorage.getItem("Nombres"),
        Apellidos: localStorage.getItem("Apellidos"),
        Genero: localStorage.getItem("Genero"),
        FechaNacimiento: localStorage.getItem("FechaNacimiento"),
        Celular: localStorage.getItem("Celular"),
        fotoUrl: localStorage.getItem("fotoUrl"),
        Rol: localStorage.getItem("Rol"),
    }
    estadoInicial.usuario = usuarioData;

} else {
    estadoInicial.usuario = {}
}

const EstadoContexto = createContext({
    usuario: {},
    cerrarSesion: ()=> {},
    iniciarSesion: (usuarioData) => {}
})


function estadoReductor(state, action) {
    switch(action.type) {
        case "NUEVA_SESION":
            return {
                ...state,
                usuario: Object.assign(state.usuario, action.payload)
            };
        case "CERRAR_SESION": 
            return {...state, usuario: {} };
        default:
            return state;    
    }
};

function EstadoProveedor(props) {
    const [state, dispatch] = useReducer(estadoReductor, estadoInicial)

    //asigno los datos del usuario en el provider cuando se monta el componente
    useEffect(()=> {
        if(localStorage.getItem("IdToken")) {
            const rolUsuario = localStorage.getItem("Rol");
            const clienteRef = doc(
                db,
                `${rolUsuario === "administrador " ? "Personales" : "Clientes"}`,
                localStorage.getItem("IdCliente")
            );
            onSnapshot( clienteRef, (doc) => {
                if(localStorage.getItem("Rol") === doc.data().IdToken) {
                    const userData = {
                        Nombres: doc.data().Nombres,
                        Apellidos: doc.data().Apellidos,
                        Genero: doc.data().Genero,
                        FechaNacimiento: doc.data().FechaNacimiento,
                        Celular: doc.data().Celular,
                        FotoUrl: doc.data().FotoUrl,
                    };
                    dispatch({
                        type:"NUEVA_SESION",
                        payload: userData,
                    })
                    localStorage.setItem("Nombres", doc.data().Nombres)
                    localStorage.setItem("Apellidos", doc.data().Apellidos)
                    localStorage.setItem("Genero", doc.data().Genero)
                    localStorage.setItem("FechaNacimiento", doc.data().FechaNacimiento)
                    localStorage.setItem("Celular", doc.data().Celular)
                    localStorage.setItem("FotoUrl", doc.data().FotoUrl)
                } else {
                    console.log("NO HAY USUARIO");
                    cerrarSesion()
                }
            })
        }
    }, [state.user])

    function iniciarSesion(usuarioData) {
        localStorage.setItem("Metodo", usuarioData.Metodo);
        localStorage.setItem("IdCliente", usuarioData.IdCliente);
        localStorage.setItem("IdToken", usuarioData.IdToken);
        localStorage.setItem("Correo", usuarioData.Correo);
        localStorage.setItem("Nombres", usuarioData.Nombres);localStorage.setItem("Apellidos", usuarioData.Apellidos);
        localStorage.setItem("Genero", usuarioData.Genero);
        localStorage.setItem("FechaNacimiento", usuarioData.FechaNacimiento);
        localStorage.setItem("Celular", usuarioData.Celular);
        localStorage.setItem("FotoUrl", usuarioData.FotoUrl);
        localStorage.setItem("Rol", usuarioData.Rol);
    
        dispatch({
            type:"NUEVA_SESION",
            payload: usuarioData
        })
    };
    //removemos todos los datos del usuario del localStorage y despachamos la accion de cerrar sesion con firebae
    function cerrarSesion(){
        localStorage.removeItem("Metodo");
        localStorage.removeItem("IdCliente");
        localStorage.removeItem("IdToken");
        localStorage.removeItem("Correo");
        localStorage.removeItem("Nombres");
        localStorage.removeItem("Apellidos");
        localStorage.removeItem("Genero");
        localStorage.removeItem("FechaNacimiento");
        localStorage.removeItem("Celular");
        localStorage.removeItem("FotoUrl");
        localStorage.removeItem("Rol");

        signOut(auth)
        .then(()=> {
            dispatch({
                type:"CERRAR_SESION",
                user: {},
            })
        })
        .catch((e) => {
            console.log("error al cerrar sesion", e)
        });
    }


    return (
        <EstadoContexto.Provider
        value={{
            usuario: state.usuario,
            cerrarSesion,
            iniciarSesion
        }}
        {...props}
        />
    )
};


export {EstadoContexto, EstadoProveedor}

