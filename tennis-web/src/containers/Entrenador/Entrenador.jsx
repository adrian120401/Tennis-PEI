import React, { useEffect, useState } from 'react';
import Typography from '../../components/Typography/Typography';
import { Button } from 'react-bootstrap';
import TableEntrenador from '../../components/Tables/TableEntrenador';
import EntrenadorModal from '../../components/Modals/EntrenadorModal';
import httpClient from '../../lib/httpClient';

const entrenadorInit = {
  id: 0,
  nombre: '',
};

const Entrenador = (props) => {
  const [entrenadorList, setEntrenadorList] = useState([]);
  const [entrenadorData, setEntrenadorData] = useState(entrenadorInit);
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [hasErrorInForm, setHasErrorInForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(async () => {
    await getEntrenador();
  }, []);

  //METODOS
  const getEntrenador = async () => {
    try {
      const data = await httpClient.get('/entrenadores');
      setEntrenadorList(data);
    } catch (error) {
      console.log(error);
    }
  };

  //Post
  const agregarEntrenador = async () => {
    try {
      await httpClient.post(`/entrenadores`, { data: entrenadorData });
      await getEntrenador();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal();
  };

  //Put
  const editarEntrenador = async (id) => {
    try {
      await httpClient.put(`/entrenadores/${id}`, { data: entrenadorData });
      await getEntrenador();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal();
  };
  //Delete
  const borrarEntrenador = async (id) => {
    try {
      await httpClient.delete(`/entrenadores/${id}`);
      await getEntrenador();
    } catch (error) {
      console.log(error);
    }
  };

  //Botones
  const handleEdit = (editData, event) => {
    event.preventDefault();
    handleOpenModal(true, editData);
  };

  const handleDelete = (id, event) => {
    event.preventDefault();
    if (window.confirm('Estas seguro?')) {
      borrarEntrenador(id);
    }
  };

  //Modal
  const handleOpenModal = (editarEntrenador = false, entrenadorToEdit = null) => {
    setIsEdit(editarEntrenador);

    if (editarEntrenador) {
      setEntrenadorData(entrenadorToEdit);
    }

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEdit(false);
    setHasErrorInForm(false);
    setEntrenadorData(entrenadorInit);
    setErrorMsg('');
  };

  //Formulrio
  const handleChangeInputForm = (property, value) => {
    value === '' ? setHasErrorInForm(true) : setHasErrorInForm(false);

    setEntrenadorData({ ...entrenadorData, [property]: value });
  };

  const handleSubmitForm = (e, form, isEdit) => {
    e.preventDefault();
    setHasErrorInForm(true);

    if (form.checkValidity()) isEdit ? editarEntrenador(entrenadorData.id) : agregarEntrenador();
  };
  return (
    <>
      <Typography id={'title-id'}>Entrenador</Typography>
      <div className="mb-2">
        <Button variant="success" onClick={() => handleOpenModal()}>
          Agregar entrenador
        </Button>
      </div>

      <TableEntrenador
        dataForTable={entrenadorList}
        edit={handleEdit}
        delete={(id, event) => handleDelete(id, event)}
      />
      <EntrenadorModal
        show={openModal}
        onHide={handleCloseModal}
        isEdit={isEdit}
        handleChange={handleChangeInputForm}
        entrenador={entrenadorData}
        validated={hasErrorInForm}
        handleSubmit={handleSubmitForm}
        errorMsg={errorMsg}
      />
    </>
  );
};

export default Entrenador;
