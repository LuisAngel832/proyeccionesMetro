import '../assets/css/RegistrarFuncion.css';
import Header from '../Conponentes/header';
import MiniMenuRegistrarFunciones from '../Conponentes/MiniMenuRegistrarFunciones';
import axios from 'axios';
import { useState } from 'react';

const CancelarFuncion = () => {
  const [codigoFuncion, setCodigoFuncion] = useState(''); // Estado para el ID ingresado
  const [mensaje, setMensaje] = useState(''); // Estado para mensajes de éxito o error

  // Maneja el cambio en el input de código de función
  const handleInputChange = (e) => {
    setCodigoFuncion(e.target.value);
  };

  // Función para eliminar la función por su ID
  const eliminarFuncion = async () => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8080/api/borrar_funcion/${codigoFuncion}`);
      if (response.status === 200) {
        setMensaje(`La función con código ${codigoFuncion} ha sido eliminada con éxito.`);
      }
    } catch (error) {
      setMensaje(`Error al eliminar la función: ${error.response?.data?.mensaje || 'Ocurrió un error.'}`);
    }
  };

  return (
    <>
      <MiniMenuRegistrarFunciones />
      <Header nombreTitulo={'Cancelar Función'} />
      <section className='cancelar-funcion-box box-contenido'>
        <form className='cancelar-funcion-contenido main-contenido' onSubmit={(e) => e.preventDefault()}>
          <fieldset className='registro-funcion-form-nombre'>
            <label htmlFor="codigoFuncion">Código de función</label>
            <input
              id="codigoFuncion"
              type="text"
              className='input-text cancelar-funcion-codigo'
              placeholder='Ingresa el codigo de la funcion '
              value={codigoFuncion}
              onChange={handleInputChange}
            />
          </fieldset>
        </form>

        <div className='cancelar-funcion-botones'>
          <button className='button-cancelar cancelar-funcion-cancelar' onClick={() => setCodigoFuncion('')}>
            Limpiar
          </button>
          <button className='button-confirmar' onClick={eliminarFuncion}>
            Eliminar
          </button>
        </div>

        {mensaje && <p className='mensaje'>{mensaje}</p>}
      </section>
    </>
  );
};

export default CancelarFuncion;
