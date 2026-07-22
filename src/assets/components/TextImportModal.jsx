import React from 'react'
import PropTypes from 'prop-types'
import { readDataFromGrid } from '../services'
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
} from '@chakra-ui/react'

export const TextImportModal = ({ isOpen, onClose, setRectangles }) => {
  const [fileContent, setFileContent] = React.useState(null)
  const [preview, setPreview] = React.useState('')
  const [error, setError] = React.useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (event) => {
        const raw = event.target.result
        setFileContent(raw.split('\n').map((line) => line.split('')))
        setPreview(raw)
        setError('')
      }
      reader.onerror = () => setError('Failed to read file')
      reader.readAsText(file)
    } else {
      setError('Please upload a valid .txt file')
    }
  }

  const handleSubmit = () => {
    if (!fileContent?.length) return
    setRectangles(
      readDataFromGrid(fileContent, fileContent.length, fileContent[0].length),
    )
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader fontFamily="heading">Import text grid</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={3} color="ink.600" fontSize="sm">
            Upload a .txt file that encodes the packing as a character grid.
          </Text>
          <Input type="file" accept=".txt" onChange={handleFileChange} mb={3} />
          {error && (
            <Text color="red.500" mb={2} fontSize="sm">
              {error}
            </Text>
          )}
          <Textarea
            value={preview}
            placeholder="File content will appear here"
            readOnly
            size="sm"
            minH="140px"
            borderRadius="lg"
            fontFamily="mono"
          />
        </ModalBody>
        <ModalFooter gap={2}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isDisabled={!fileContent}>
            Import
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

TextImportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setRectangles: PropTypes.func.isRequired,
}
