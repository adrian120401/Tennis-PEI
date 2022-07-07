import React, {useRef} from 'react'
import {Modal,Form, Button} from "react-bootstrap"
import FormRowInput from '../FormRow/FormRowInput';

const EntrenadorModal = props => {
    const formRef = useRef(null);
    const { show, onHide, isEdit, handleChange, entrenador, validated, handleSubmit, errorMsg } = props;
    return(
        <Modal show={show} onHide={onHide} centered={true} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>{isEdit ? 'Editar entrenador':'Agregar entrenador'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className={"form"} noValidate validated={validated} ref={formRef}>
                    <FormRowInput 
                    handleChange={handleChange}
                    value={entrenador.nombre}
                    label="Nombre"
                    type="text" 
                    required={true}
                    property="nombre"
                    placeholder="Nombre del entrenador"
                    />
                    {errorMsg !== '' &&
                        <Form.Group className="alert-danger">
                            {errorMsg}
                        </Form.Group>
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={onHide} variant="danger">Cancelar</Button>
                <Button onClick={(e)=> handleSubmit(e,formRef.current, isEdit)} variant="success">{ isEdit ? 'Editar': 'Agregar' }</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EntrenadorModal