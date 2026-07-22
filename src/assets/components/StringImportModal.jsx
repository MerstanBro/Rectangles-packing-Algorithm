import React from 'react'
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
} from '@chakra-ui/react'
import { fillDataFromTheirFormat } from '../services'
import PropTypes from 'prop-types'

export const StringImportModal = ({ isOpen, onClose, setRectangles }) => {
  const [importString, setImportString] = React.useState('')

  const handleSubmit = () => {
    if (!importString?.trim()) return
    setRectangles(fillDataFromTheirFormat(importString))
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader fontFamily="heading">Import string</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={3} color="ink.600" fontSize="sm">
            Paste a packing string in their format (e.g. with | and - joins).
          </Text>
          <Textarea
            value={importString}
            onChange={(e) => setImportString(e.target.value)}
            placeholder="Enter your string here"
            size="sm"
            borderRadius="lg"
            minH="140px"
            fontFamily="mono"
          />
        </ModalBody>
        <ModalFooter gap={2}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isDisabled={!importString?.trim()}>
            Import
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

StringImportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setRectangles: PropTypes.func.isRequired,
}
