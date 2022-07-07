import React, { useEffect, useState } from 'react';
import Typography from '../../components/Typography/Typography';
import { Button } from 'react-bootstrap';
import TableJugadores from '../../components/Tables/TableJugadores';
import JugadorModal from '../../components/Modals/JugadorModal';
import httpClient from '../../lib/httpClient';

let jugadorInit = {
  nombre: '',
  puntos: 0,
  entrenador: {
    id: 0,
  },
};

const Jugador = (props) => {
  const [jugadoresList, setJugadoresList] = useState([]);
  const [entrenadorList,setEntrenadorList] = useState([]);
  const [partidoList,setPartidosList] = useState([]);
  const [jugadorData, setJugadorData] = useState(jugadorInit);
  const [isEdit, setIsEdit] = useState(false);
  const [hasErrorInForm, setHasErrorInForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(async () => {
    await getJugadores();
    await getEntrenadores();
    await getPartidos();
  }, []);

  //Verbos
  const getJugadores = async () => {
    try {
      const data = await httpClient.get('/jugadores');
      setJugadoresList(data);
    } catch (error) {
      console.log(error);
    }
  };
  //entrenadores
  const getEntrenadores = async () => {
    try {
      const data = await httpClient.get('/entrenadores');
      setEntrenadorList(data);
    } catch (error) {
      console.log(error);
    }
  }
  //partidos

  const getPartidos = async () => {
    try {
      const data = await httpClient.get('/partidos');
      setPartidosList(data);
    } catch (error) {
      console.log(error);
    }
  }

  const agregarJugador = async () => {
    try {
      const data = await httpClient.post(`/jugadores`, { data: jugadorData });
      setJugadoresList([...jugadoresList, data]);
    } catch (error) {
      console.log(error);
    }
    handleCloseModal();
  };

  const editarJugador = async (id) => {
    try {
      const data = await httpClient.put(`/jugadores/${id}`, { data: jugadorData });
      setJugadoresList(jugadoresList.map((item) => (item.id === id ? data : item)));
    } catch (error) {
      console.log(error);
    }
    handleCloseModal();
  };

  const borrarJugador = async (id) => {
    try {
      await httpClient.delete(`/jugadores/${id}`);
      setJugadoresList(jugadoresList.filter((jugador) => jugador.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // Buttons
  const handleDetail = (data, event) => {
    event.preventDefault();
    props.history.push(`/jugador/detalle/${data.id}`, { data });
  };

  const handleEdit = (editData, event) => {
    event.preventDefault();
    handleOpenModal(true, editData);
  };
  const handleDelete = async (id, event) => {
    event.preventDefault();
    if (window.confirm('Estas seguro?')) {
      await borrarJugador(id);
    }
  };

  const handleRecalculateRanking = async (id, event) => {
    event.preventDefault();
    await httpClient.put(`/jugadores/${id}/actions/recalculateRanking`);
    const data = await httpClient.get(`/jugadores/${id}`);
    setJugadoresList(jugadoresList.map((item) => (item.id === id ? data : item)));
  };

  // Modal
  const handleOpenModal = (editarJugador = false, jugadorToEdit = null) => {
    setIsEdit(editarJugador);

    if (editarJugador) {
      setJugadorData(jugadorToEdit);
    }

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEdit(false);
    setHasErrorInForm(false);
    setJugadorData(jugadorInit);
    setErrorMsg('');
  };

  // Form
const handleChangeInputForm = (property, value) => {
  value === '' ? setHasErrorInForm(true) : setHasErrorInForm(false);

  const newData = { ...jugadorData };

  switch (property) {
    case 'entrenador':
      newData.entrenador = entrenadorList.filter((x) => x.id === parseInt(value))[0];
      break;
    case 'nombre':
      newData.nombre = value;
      break;
    case 'puntos':
      newData.puntos = value;
      break;
    default:
      break;
  }

  setJugadorData(newData);
};

  const handleSubmitForm = (e, form, isEdit) => {
    e.preventDefault();
    setHasErrorInForm(true);

    if (form.checkValidity()) isEdit ? editarJugador(jugadorData.id) : agregarJugador();
  };

  // API

  const gananciasGanadas = (id) =>{
    const partidos = [... partidoList]
    let ganancias = 0
    partidos.map(partido => partido.estado == "FINALIZADO")
    partidos.forEach(p => {
      //para el visitante y sus partidos ganados
      if(p.jugadorVisitante.id == id && p.cantidadGamesVisitante == 6){
        let diferencia =p.cantidadGamesVisitante - p.cantidadGamesLocal ;
        if(diferencia >=3){
            ganancias += 300;
        }
        if(diferencia <3){
            ganancias += 200;
        }
      }
      //para el local y sus partidos ganados
      if(p.jugadorLocal.id == id && p.cantidadGamesLocal == 6){
        let diferencia =p.cantidadGamesLocal - p.cantidadGamesVisitante;
        if(diferencia >=3){
            ganancias += 300;
        }
        if(diferencia <3){
            ganancias += 200;
        }
      }
      console.log(ganancias)
     
    });
     return ganancias
  }
  console.log(partidoList)


  return (
    <>
      <Typography id={'title-id'}>Jugador</Typography>
      <div className="mb-2">
        <Button variant="success" onClick={() => handleOpenModal()}>Agregar jugador</Button>
      </div>

      <TableJugadores
        dataForTable={jugadoresList}
        detail={handleDetail}
        edit={handleEdit}
        delete={(id, event) => handleDelete(id, event)}
        recalcularRanking={handleRecalculateRanking}
        ganancias = {gananciasGanadas}
      />
      <JugadorModal
        show={openModal}
        onHide={handleCloseModal}
        isEdit={isEdit}
        handleChange={handleChangeInputForm}
        jugador={jugadorData}
        validated={hasErrorInForm}
        handleSubmit={handleSubmitForm}
        errorMsg={errorMsg}
        entrenadorList={entrenadorList}
      />
    </>
  );
};

export default Jugador;
