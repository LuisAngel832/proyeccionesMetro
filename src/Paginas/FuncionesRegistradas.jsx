import React, { useState, useEffect } from 'react';
import './../assets/css/FuncionesRegistradas.css';
import axios from 'axios';
import Header from '../Conponentes/header';
import Icon from '../Conponentes/icon';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import MiniMenuRegistrarFunciones from '../Conponentes/MiniMenuRegistrarFunciones';
import RegistrarFuncionDetalles from '../Conponentes/CreacionDeFunciones/FuncionesRegistradasDetalles';

const FuncionesRegistradas = () => {
  const [funciones, setFunciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [funcionSeleccionada, setFuncionSeleccionada] = useState(null); 

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8080/api/funciones/todas')
      .then(response => {
        setFunciones(response.data);
        console.log(response.data);
      })
      .catch(err => {
        console.error('Error al obtener las funciones: ', err);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const mostrarDetallesFuncion = (funcion) => {
    setFuncionSeleccionada(funcion); 
  };

  const cancelarMostrarDetalles = () => {
    setFuncionSeleccionada(null); 
  };

  const funcionesFiltradas = funciones.filter((funcion) =>
    funcion.pelicula.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const RenglonFuncion = ({ funcion }) => (
    <tr>
      <td>
        <div className='tabla-detalles-id'>
          <button
            onClick={() => mostrarDetallesFuncion(funcion)}
            className='btn'
          >
            DETALLES
          </button>
          {funcion.pelicula.titulo} <br /> {funcion.id}
        </div>
      </td>
      <td>{funcion.boletosVendidos}</td>
      <td>{funcion.dineroRecuadado}</td>
      <td>{funcion.porcentajeOcupacion}</td>
      <td>{funcion.estado}</td>
    </tr>
  );

  return (
    <>
      <MiniMenuRegistrarFunciones />
      <Header nombreTitulo={'Funciones Registradas'} />
      <section className='busqueda'>
        <div>
          <span className='icon'>
            <Icon icon={faMagnifyingGlass} />
          </span>
          <input
            className='titulo'
            type='text'
            placeholder='TITULO'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
      </section>

      <div className='table-container'>
        <h1>FUNCIONES REGISTRADAS</h1>
        <table>
          <thead>
            <tr className='tabla-cabecera'>
              <th>TÍTULO Y ID</th>
              <th>BOLETOS VENDIDOS</th>
              <th>DINERO RECAUDADO</th>
              <th>PORCENTAJE DE OCUPACIÓN</th>
              <th>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {funcionesFiltradas.map((funcion) => (
              <RenglonFuncion key={funcion.id} funcion={funcion} />
            ))}
          </tbody>
        </table>
      </div>

      {funcionSeleccionada && (
        <RegistrarFuncionDetalles
          nombreFuncion={funcionSeleccionada.pelicula.titulo}
          costoBoleto={funcionSeleccionada.precioBoleto}
          Horario={funcionSeleccionada.hora}
          DuracionF={funcionSeleccionada.pelicula.duracion}
          FechaF={funcionSeleccionada.fecha}
          codigoFuncion={funcionSeleccionada.id}
          handleClickConfirmacion={cancelarMostrarDetalles}
          handleClickCancelar={cancelarMostrarDetalles}
        />
      )}
    </>
  );
};

export default FuncionesRegistradas;
