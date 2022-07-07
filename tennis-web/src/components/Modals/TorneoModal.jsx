import React, { useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import FormRowInput from '../FormRow/FormRowInput';
import FormRowSelect from '../FormRow/FormRowSelect';

const TorneoModal = (props) => {
  const formRef = useRef(null);
  const {
    show,
    onHide,
    isEdit,
    handleChange,
    torneo,
    listaJugadores,
    listaCanchas,
    validated,
    handleSubmit,
    errorMsg,
  } = props;

  const jugadores = listaJugadores.map((jugador) => {
    return (
      <option key={jugador.id} value={parseInt(jugador.id)}>
        {jugador.nombre}
      </option>
    );
  });
//   console.log(jugadores)

  const canchas = listaCanchas.map((cancha) => {
    return (
      <option key={cancha.id} value={parseInt(cancha.id)}>
        {cancha.nombre}
      </option>
    );
  });
//   console.log(canchas)

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered={true} //Centra el modal verticalmente en la pantalla
      backdrop="static" //Si se hace click fuera del modal este no se cerrara
      keyboard={false} //Si se presiona la tecla ESC tampoco se cierra
    >
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? 'Editar' : 'Agregar'} Partidos</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form className={'form'} noValidate validated={validated} ref={formRef}>
          <FormRowInput
            label={'Fecha / Hora de inicio'}
            type={'text'}
            required={true}
            placeholder={'DD/MM/YYYY hh:mm'}
            value={torneo.fechaComienzo}
            handleChange={handleChange}
            property={'fechaComienzo'}
          />

          <FormRowSelect
            label={'Jugador Local partido uno'}
            required={true}
            placeholder={'Elige un jugador'}
            value={torneo.jugadorLocal.id}
            handleChange={handleChange}
            property={'jugadorLocalPartidoUno'}
            options={jugadores}
          />

          <FormRowSelect
            label={'Jugador Visitante Partido Uno'}
            required={true}
            placeholder={'Elige un jugador para el partido uno'}
            value={torneo.jugadorVisitante.id}
            handleChange={handleChange}
            property={'jugadorVisitantePartidoUno'}
            options={jugadores}
          />

          <FormRowSelect
            label={'Cancha'}
            required={true}
            placeholder={'Elige una cancha partido uno'}
            value={torneo.cancha.id}
            handleChange={handleChange}
            property={'canchaPartidoUno'}
            options={canchas}
          />

<FormRowSelect
            label={'Jugador Local partido dos'}
            required={true}
            placeholder={'Elige un jugador para el partido dos'}
            value={torneo.jugadorLocal.id}
            handleChange={handleChange}
            property={'jugadorLocalPartidoDos'}
            options={jugadores}
          />

          <FormRowSelect
            label={'Jugador Visitante Partido dos'}
            required={true}
            placeholder={'Elige un jugador para el partido dos'}
            value={torneo.jugadorVisitante.id}
            handleChange={handleChange}
            property={'jugadorVisitantePartidoDos'}
            options={jugadores}
          />

          <FormRowSelect
            label={'Cancha'}
            required={true}
            placeholder={'Elige una cancha para partido dos'}
            value={torneo.cancha.id}
            handleChange={handleChange}
            property={'canchaPartidoDos'}
            options={canchas}
          />

          {errorMsg !== '' && <Form.Group className="alert-danger">{errorMsg}</Form.Group>}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onHide} variant="danger">
          Cancelar
        </Button>
        <Button onClick={(e) => handleSubmit(e, formRef.current, isEdit)} variant="success">
          {isEdit ? 'Editar' : 'Agregar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TorneoModal;