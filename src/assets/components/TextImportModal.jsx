import React from 'react'
import PropTypes from 'prop-types'
import { readDataFromGrid } from './Functions';
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
  Input,
  Textarea,
} from '@chakra-ui/react';

export const TextImportModal = ({isOpen,onClose,setRectangles}) => {
  const [fileContent, setFileContent] = React.useState('');
  const [error, setError] = React.useState('');
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        //possible error here
        setFileContent(event.target.result.split('\n').map(line => line.split('')));
        setError('');
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
      reader.readAsText(file);
    } else {
      setError('Please upload a valid .txt file');
    }
  };
  const handleSubmit = () => {
    console.log(`Submitted file content:`);
    console.table(fileContent) 
    setRectangles(readDataFromGrid(fileContent,fileContent.length,fileContent[0].length))
    onClose();   
  };
  return ( 
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay/>
    <ModalContent>
      <ModalHeader>Import Text File</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text mb="4">Please upload a .txt file:</Text>
        <Input type="file" accept=".txt" onChange={handleFileChange} mb="4" />
        {error && <Text color="red.500">{error}</Text>}
        <Textarea
          value={fileContent}
          placeholder="File content will appear here"
          readOnly
          size="sm"
          mb="4"
        />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={handleSubmit} isDisabled={!fileContent}>
          Submit
        </Button>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>)
}
TextImportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setRectangles: PropTypes.func.isRequired,
};