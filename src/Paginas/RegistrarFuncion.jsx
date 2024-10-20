import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Conponentes/header';
import './../assets/css/RegistrarFuncion.css';
import ConfirmacionDeFuncion from '../Conponentes/CreacionDeFunciones/ConfirmacionDeFuncion';
import MiniMenuRegistrarFunciones from '../Conponentes/MiniMenuRegistrarFunciones';
import { Link } from 'react-router-dom';

const RegistrarFuncion = () => {

    const [confirmacionMostrarFunciones, setConfirmacionMostrarFunciones] = useState(false);
    const [nombreFuncion, setNombreFuncion] = useState('');
    const [horario, setHorario] = useState('');
    const [fecha, setFecha] = useState('');
    const [boleto, setBoleto] = useState('');
    const [duracion, setDuracion] = useState('');
    const [mostrarFunciones, setMostrarFunciones] = useState(false);
    const [peliculas, setPeliculas] = useState([]);
    const [peliculaId, setPeliculaId] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8080/api/peliculas/todas-peliculas')
            .then(response => {
                setPeliculas(response.data);
                console.log(response.data);
            })
            .catch(err => {
                console.error("Error al obtener las películas: ", err);Ñ
            });
    }, []);

    const confirmarFunciones = (e) => {
        e.preventDefault();
        // Validar campos antes de mostrar la confirmación
        if (!nombreFuncion || !horario || !boleto || !fecha || (!peliculaId && !duracion)) {
            alert("Por favor, complete todos los campos");
            return;
        }
        setConfirmacionMostrarFunciones(!confirmacionMostrarFunciones);
    };

    const handleChangeFecha = (e) => {
        setFecha(e.target.value);
    };

    const handleClickHorario = (e) => {
        setHorario(e.target.innerText);
    };

    const handleClickFuncion = (pelicula) => {
        setNombreFuncion(pelicula.titulo);
        setDuracion(pelicula.duracion);
        setPeliculaId(pelicula.id);
    };

    const handleClickCancelar = (e) => {
        e.preventDefault();
        setConfirmacionMostrarFunciones(!confirmacionMostrarFunciones);
    };

    const handleMostrarFunciones = (e) => {
        e.preventDefault();
        setMostrarFunciones(!mostrarFunciones);
    };

    const FuncionesRegistradas = () => {
        return (
            <div className='lista-funciones'>
                {peliculas.length > 0 ? (
                    peliculas.map((pelicula, index) => (
                        <button
                            key={index}
                            value={pelicula.titulo}
                            className='input-funciones'
                            onClick={() => handleClickFuncion(pelicula)}
                        >
                            {pelicula.titulo}
                        </button>
                    ))
                ) : (
                    <p>No hay películas registradas</p>
                )}
            </div>
        );
    };

    const handleClickConfirmacion = (e) => {
        e.preventDefault();

        if (!nombreFuncion || !horario || !boleto || !fecha || (!peliculaId && !duracion)) {
            alert("Por favor, complete todos los campos");
            return;
        }

        const hourInt = parseInt(horario.split(':')[0]);
        const nuevaFuncion = {
            hora: hourInt,
            precioBoleto: parseFloat(boleto),
            fecha: fecha,
            estado: 'Programada',
        };

        if (peliculaId) {
            // Se ha seleccionado una película existente
            axios.post(`http://127.0.0.1:8080/api/funciones/registrar_funcion_pelicula?idPelicula=${peliculaId}`, nuevaFuncion)
                .then(response => {
                    console.log("Función registrada exitosamente:", response.data);
                    alert("¡Función registrada exitosamente!");
                    setConfirmacionMostrarFunciones(false);
                    resetForm();
                })
                .catch(error => {
                    if (error.response && error.response.status === 409) {
                        alert(error.response.data); //mesnaje del servidor
                    } else {
                        console.error("Error al registrar la función:", error);
                        alert("Hubo un error al registrar la función.");
                    }
                });
        } else {
            // No se ha seleccionado una película, se crea una nueva
            const nuevaPelicula = {
                titulo: nombreFuncion,
                duracion: duracion,
                // Agrega otros campos necesarios para la película
            };

            const funcionConPelicula = {
                funcion: nuevaFuncion,
                pelicula: nuevaPelicula,
            };

            axios.post('http://127.0.0.1:8080/api/funciones/registrar_funcion', funcionConPelicula)
                .then(response => {
                    console.log("Función y película registradas exitosamente:", response.data);
                    setConfirmacionMostrarFunciones(false);
                    resetForm();
                })
                .catch(error => {
                    console.error("Error al registrar la función y película:", error);
                    alert("Hubo un error al registrar la función y película.");
                });
        }
    };

    const resetForm = () => {
        setNombreFuncion('');
        setHorario('');
        setFecha('');
        setBoleto('');
        setDuracion('');
        setPeliculaId(null);
    };

    return (
        <>
            <MiniMenuRegistrarFunciones />
            <Header nombreTitulo={'Registrar Función'} />
            <section className='registro-funcion'>
                <form className='registro-funcion-form'>
                    <fieldset className='registro-funcion-form-nombre'>
                        <label htmlFor="nombreFuncion">Nombre de la película</label>
                        <input
                            onChange={(e) => {
                                setNombreFuncion(e.target.value);
                                setPeliculaId(null);
                            }}
                            value={nombreFuncion}
                            className='input-text input-text-nombre'
                            id="nombreFuncion"
                            type="text"
                            placeholder="Nombre de la película"
                        />
                    </fieldset>

                    <fieldset className='registro-funcion-form-fecha'>
                        <label htmlFor="fecha">Fecha</label>
                        <div className='container-mostrar-funciones'>
                            <input onChange={handleChangeFecha} type="date" className='input-fecha' />
                            <div className='funciones-registradas'>
                                <input value="Mostrar Películas" onClick={handleMostrarFunciones} type='button' className='input-funciones-registradas' />
                                {mostrarFunciones && <FuncionesRegistradas />}
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className='registro-funcion-form-horario'>
                        <label>Horario</label>
                        <button className='button-horario' onClick={handleClickHorario} type="button">10:00</button>
                        <button className='button-horario' onClick={handleClickHorario} type="button">12:00</button>
                        <button className='button-horario' onClick={handleClickHorario} type="button">14:00</button>
                        <button className='button-horario' onClick={handleClickHorario} type="button">16:00</button>
                    </fieldset>

                    <fieldset className='registro-funcion-form-boleto'>
                        <label htmlFor="costoBoleto">Costo Del Boleto</label>
                        <input
                            onChange={(e) => setBoleto(e.target.value)}
                            value={boleto}
                            id="costoBoleto"
                            type="text"
                            className='input-text'
                        />
                    </fieldset>

                    
                    {!peliculaId && (
                        <>
                            <fieldset className='registro-funcion-form-duracion'>
                                <label htmlFor="duracion">Duración</label>
                                <input
                                    onChange={(e) => setDuracion(e.target.value)}
                                    value={duracion}
                                    id="duracion"
                                    type="text"
                                    className='input-text'
                                />
                                <span>Min</span>
                            </fieldset>
                            
                        </>
                    )}

                    <fieldset className='registro-funcion-form-submit'>
                        <Link to="/"><button>Cancelar</button></Link>
                        <input type="submit" value="Siguiente" onClick={confirmarFunciones} />
                    </fieldset>
                </form>
            </section>

            {confirmacionMostrarFunciones && (
                <ConfirmacionDeFuncion
                    nombreFuncion={nombreFuncion}
                    costoBoleto={boleto}
                    Horario={horario}
                    DuracionF={duracion}
                    FechaF={fecha}
                    handleClickConfirmacion={handleClickConfirmacion}
                    handleClickCancelar={handleClickCancelar}
                />
            )}
        </>
    );
};

export default RegistrarFuncion;
