import React from 'react';
import { Modal } from 'react-bootstrap';
import CameraSettingsForm from '../forms/CameraSettingsForm';
import { CameraStructure } from '@/app/cameras/structure/CameraStructure';
import { useLabels } from '@/hooks/useLabels';

interface CameraModalProps {
  show: boolean;
  onHide: () => void;
  camera: CameraStructure | null;
  setSelectedCamera: React.Dispatch<React.SetStateAction<CameraStructure | null>>;
}

const CameraModal: React.FC<CameraModalProps> = ({ show, onHide, camera, setSelectedCamera }) => (
  <Modal 
    show={show} 
    onHide={onHide} 
    size="lg" 
    aria-labelledby="contained-modal-title-vcenter" 
    // centered
  >
    <Modal.Header closeButton>
      <Modal.Title>{useLabels().EditCamera}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <CameraSettingsForm />
    </Modal.Body>
  </Modal>

);

export default CameraModal;
