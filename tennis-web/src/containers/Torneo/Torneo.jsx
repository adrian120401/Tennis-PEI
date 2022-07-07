import React, { useEffect, useState } from 'react';
import Typography from '../../components/Typography/Typography';
import TableTorneo from '../../components/Tables/TableTorneo';
import TorneoModal from '../../components/Modals/TorneoModal';
import { Button } from 'react-bootstrap';
import httpClient from '../../lib/httpClient';


  const partidoInit = {
    fechaComienzo: '',
    estado: 'NO_INICIADO',
    jugadorLocal: {
      id: -1,
    },
    jugadorVisitante: {
      id: -1,
    },
    cancha: {
      id: -1,
    },
  };
  

const dateOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
};

const Torneo = () => {
  const [partidosList, setPartidosList] = useState([]);
  const [listaJugadores, setListaJugadores] = useState([]);
  const [listaCanchas, setListaCanchas] = useState([]);
  //const [torneoData, setTorneoData] = useState(torneoInit);
  const [torneoList, setTorneoList] = useState([]);
  const [partidoData,setPartidoData] = useState(partidoInit)
  const [isEdit, setIsEdit] = useState(false);
  const [hasErrorInForm, setHasErrorInForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(async () => {
    await getPartidos();
    await getJugadores();
    await getCanchas();
  }, []);

  //Metodos
  const getPartidos = async () => {
    try {
      const data = await httpClient.get('/partidos');
      data.map((partido) => {
        partido.fechaComienzo = new Date(partido.fechaComienzo).toLocaleDateString(
          'es-AR',
          dateOptions,
        );
        return partido;
      });
      //setPartidosList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getJugadores = async () => {
    try {
      const data = await httpClient.get('/jugadores');
      setListaJugadores(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCanchas = async () => {
    try {
      const data = await httpClient.get('/canchas');
      setListaCanchas(data);
    } catch (error) {
      console.log(error);
    }
  };

  const agregarPartido = async () => {
    try {
      const dataSend = { ...partidoData };
      dataSend.fechaComienzo = stringToDate(dataSend.fechaComienzo);
      const data = await httpClient.post('/partidos', { data: dataSend });
      data.fechaComienzo = new Date(data.fechaComienzo).toLocaleDateString('es-AR', dateOptions);
      setPartidosList([...partidosList, data]);
    } catch (error) {
      console.log(error);
    }
    handleCloseModal();
  };

const editarPartido = async (id) => {
    try {
      const dataSend = {...partidoData};
      dataSend.fechaComienzo = stringToDate(dataSend.fechaComienzo);
      const data = await httpClient.put(`/partidos/${id}`, { data: dataSend });
      data.fechaComienzo = new Date (data.fechaComienzo).toLocaleDateString('es-AR', dateOptions);
      setPartidosList(partidosList.map((item) => (item.id === id ? data : item)));
    } catch (error) {
      console.log(error);
    }
    handleCloseModal();
  };

  const borrarPartido = async (id) => {
    try {
      await httpClient.delete(`/partidos/${id}`, { data: partidoData });
      setPartidosList(partidosList.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const iniciarPartido = async(id) => {
    const partido = partidosList.filter(element => element.id === id);
    if(partido[0].estado === 'NO_INICIADO'){
      try{
        await httpClient.put(`/partidos/${id}/actions/init`);
      }
      catch(error){
        console.log(error);
      }
    }
  }

  //Usar esta funcion para convertir el string 'fechaComienzo' a Date
  const stringToDate = (dateString) => {
    try {
      const [fecha, hora] = dateString.split(' ');
      const [dd, mm, yyyy] = fecha.split('/');
      if (hora !== undefined) {
        if (hora.includes(':')) {
          const [hh, mins] = hora.split(':');
          return new Date(yyyy, mm - 1, dd, hh, mins);
        }
      }
      return new Date(yyyy, mm - 1, dd);
    } catch (err) {
      console.log(`stringToDate error formateando la fecha: ${err}`);
      return null;
    }
  };

  // Buttons
  const handleEditPartido = (editData, event) => {
    event.preventDefault();
    handleOpenModal(true, editData);
  };

  const handleDeletePartido = async (id, event) => {
    event.preventDefault();
    if (window.confirm('Estas seguro?')) {
      await borrarPartido(id);
    }
  };

   // Modal
   const handleOpenModal = (editarTorneo = false, torneoToEdit = null) => {
    setIsEdit(editarTorneo);

    if (editarTorneo) {
      setTorneoEdit(torneoToEdit);
    }

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEdit(false);
    setHasErrorInForm(false);
    setPartidoData(partidoInit);
    setErrorMsg('');
  };

  //FORM
  const handleChangeInputForm = (property, value) => {
    value === '' ? setHasErrorInForm(true) : setHasErrorInForm(false);

    const newData = { ...partidoData};

    switch (property) {
      case 'jugadorLocalPartidoUno':
        newData.jugadorLocal = listaJugadores.filter((x) => x.id === parseInt(value))[0];
        break;
      case 'jugadorVisitantePartidoUno':
        newData.jugadorVisitante = listaJugadores.filter((x) => x.id === parseInt(value))[0];
        break;
      case 'canchaPartidoUno':
        newData.cancha = listaCanchas.filter((x) => x.id === parseInt(value))[0];
        break;
        case 'jugadorLocalPartidoDos':
            newData.jugadorLocal = listaJugadores.filter((x) => x.id === parseInt(value))[0];
            break;
          case 'jugadorVisitantePartidoDos':
            newData.jugadorVisitante = listaJugadores.filter((x) => x.id === parseInt(value))[0];
            break;
          case 'canchaPartidoDos':
            newData.cancha = listaCanchas.filter((x) => x.id === parseInt(value))[0];
            break;
      case 'fechaComienzo':
        newData.fechaComienzo = value;
        break;
      default:
        break;
    }
    setPartidoData(newData);
  };
  const handleSubmitForm = (e, form, isEdit) => {
    e.preventDefault();
    setHasErrorInForm(true);

    //if (!validatePartido()) return;

    if (form.checkValidity()) isEdit ? editarPartido(partidoData.id) : agregarPartido();
  };

//   console.log(listaJugadores)
//   console.log(listaCanchas)



  return (
    <>
      <Typography id={'title-id'}>Torneo</Typography>
      <div className='mb-2'>
        <Button variant='success' onClick={() => handleOpenModal()}>Agregar partidos</Button>
      </div>
      <TableTorneo
        dataForTable={partidosList}
        editPartido={handleEditPartido}
        deletePartido={(id, event) => handleDeletePartido(id, event)}
        iniciarPartido={iniciarPartido}
      />
      <TorneoModal
        show={openModal}
        onHide={handleCloseModal}
        isEdit={isEdit}
        handleChange={handleChangeInputForm}
        validated={hasErrorInForm}
        handleSubmit={handleSubmitForm}
        errorMsg={errorMsg}
        torneo={partidoData}
        listaJugadores={listaJugadores}
        listaCanchas={listaCanchas}
      />
    </>
  );
  }
export default Torneo;
