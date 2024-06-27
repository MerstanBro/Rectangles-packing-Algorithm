//done
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { fillDataFromTheirFormat } from './Functions';
import PropTypes from 'prop-types';
export const StringImportModal = ({isOpen,onClose,setRectangles}) => {
  const [importString,setImportString] = React.useState(null)
  const handleInputChange = (e) =>{
    setImportString(e.target.value)
  }
  const handleSubmit = () => {
        //console.log('afasfs')
        setRectangles(fillDataFromTheirFormat(importString));
        onClose();
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Import String</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text mb="4">Please enter the string you want to import:</Text>
        <Textarea
          value={importString}
          onChange={handleInputChange}
          placeholder="Enter your string here"
          size="sm"
        />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>)
}
StringImportModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    setRectangles: PropTypes.func.isRequired,
};
  