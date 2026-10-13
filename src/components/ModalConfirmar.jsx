import { Modal, Button, ModalHeader } from "react-bootstrap";

export default function ModalConfirmar({
    show,
    titulo,
    mensaje,
    textoConfirmar = 'Eliminar',
    onConfirmar,
    onCancelar,
}) {
    return (
        <Modal show={show} onHide={onCancelar} centered>
            <Modal.Header closeButton>
                <Modal.Title>{titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{mensaje}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancelar}>Cancelar</Button>
                <Button variant="danger" onClick={onConfirmar}>{textoConfirmar}</Button>
            </Modal.Footer>
        </Modal>
    );
}