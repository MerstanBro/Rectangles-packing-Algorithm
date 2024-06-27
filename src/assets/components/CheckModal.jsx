//fix the checkModal

import React from 'react'
import PropTypes from 'prop-types'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Text,
    Flex,
    VStack,
    Step,
} from '@chakra-ui/react';
import {CheckForRecs} from './Functions';

export const CheckModal = ({ isOpen, onClose, step,setStep,setAns,setCurrentIndex}) => {
    const [numRectangles, setNumRectangles] = React.useState(null);
    const [rectanglesData, setRectanglesData] = React.useState([]);

    const handleNumRectanglesChange = (event) => {
        setNumRectangles(event.target.value)
    }
    const handleNextStep = () => {
        const initialData = Array.from({ length: numRectangles }, (_, index) => ({
            name: String.fromCharCode(65 + index),
            width: '',
            length: '',
        }));
        setRectanglesData(initialData);
        setStep(Step + 1)
    }
    const handleRectangleDataChange = (index, field, value) => {
        const newData = [...rectanglesData];
        newData[index] = { ...newData[index], [field]: Number(value) };
        setRectanglesData(newData);
    };
    const handleSubmit = () => {
        if (rectanglesData.every(rect => rect.width && rect.length)) {
          //console.log('Submitted rectangle data:', rectanglesData);
          setCurrentIndex(0)
          setAns(CheckForRecs(rectanglesData).Answers)
          onClose();
        } else {
          alert('Please fill all the textboxes.');
        }
      };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Check Rectangles</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {step === 1 ? (
                        <>
                            <Text mb="4">How many rectangles do you want to add?</Text>
                            <Input
                                type="number"
                                value={numRectangles}
                                onChange={handleNumRectanglesChange}
                                min="1"
                                mb="4"
                            />
                            <Button colorScheme="blue" onClick={handleNextStep} isDisabled={!numRectangles}>
                                Next
                            </Button>
                        </>
                    ) : (
                        <>
                        <VStack spacing="4">
                            {rectanglesData.map((rect, index) => (
                                 <Flex key={index} direction="row" align="center" mb="1">
                                    <Text mb="2">{rect.name}:</Text>
                                    <Input
                                        placeholder="Width"
                                        value={rect.width}
                                        onChange={(e) => handleRectangleDataChange(index, 'width', e.target.value)}
                                        mr="1"
                                    />
                                    <Input
                                        placeholder="Length"
                                        value={rect.length}
                                        onChange={(e) => handleRectangleDataChange(index, 'length', e.target.value)}
                                        mr="1"
                                    />
                                </Flex>
                            ))}
                        </VStack>
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            Submit
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        </>
                    )}
                </ModalBody>
                {step === 2 && (
                    <ModalFooter>
                        
                    </ModalFooter>
                )}
            </ModalContent>
        </Modal>
    );
};

CheckModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    setRectangles: PropTypes.func.isRequired,
    step:PropTypes.number.isRequired,
    setStep:PropTypes.func.isRequired,
};