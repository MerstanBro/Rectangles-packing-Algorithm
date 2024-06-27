import React from 'react';
import { Box, Flex, Button, Menu, MenuButton, MenuList, MenuItem, Input} from '@chakra-ui/react';
import { StringImportModal } from './StringImportModal';
import { TextImportModal } from './TextImportModal';
import { CheckModal } from './CheckModal';
import PropTypes from 'prop-types';
import { Rotate } from './Functions';

export const Navbar = ({ Rectangles, setRectangles }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [ans, setAns] = React.useState(null)
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isTextModalOpen, setTextModalOpen] = React.useState(false);
  const [isStringModalOpen, setStringModalOpen] = React.useState(false);
  const [isCheckModalOpen, setIsCheckModalOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const updateAns = (v) => {
    setAns(v)
    setRectangles(v[0])
  }
  const onImportClick = (type) => {
    if (type === 'Text') {
      setTextModalOpen(true);
    } else if (type === 'String') {
      setStringModalOpen(true);
    }
  };

  const onCloseTextModal = () => setTextModalOpen(false);
  const onCloseStringModal = () => setStringModalOpen(false);
  const onCheckClick = () => setIsCheckModalOpen(true);
  const onCloseCheckModal = () => {
    setIsCheckModalOpen(false);
    setStep(1);
  };

  const onRotateClick = () => {
    setRectangles(Rotate(Rectangles));
  };

  const handleRightClick = () => {
    if (currentIndex < ans.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setRectangles(ans[currentIndex + 1]);
    }
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleButtonClick = () => {
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      setCurrentIndex(value-1);
      setRectangles(ans[value-1])
    } else {
      alert('Please enter a valid number');
    }
  };
  const handleLeftClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setRectangles(ans[currentIndex - 1]);
    }
  };
  return (
      <Box position='sticky' top='5vh' width={460} bg="white" >
        <Flex justify="space-around" bg="red.400" borderWidth="3px" borderRadius="lg">
          <Menu>
            <MenuButton as={Button} colorScheme="" variant="ghost" mr="4">
              Import
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => onImportClick('Text')}>Text</MenuItem>
              <MenuItem onClick={() => onImportClick('String')}>String</MenuItem>
            </MenuList>
          </Menu>
          <Button onClick={onCheckClick} colorScheme="" variant="ghost" mr="4">Check</Button>
          <Button onClick={onRotateClick} colorScheme="" variant="ghost">Rotate</Button>
        </Flex>
        <StringImportModal isOpen={isStringModalOpen} onClose={onCloseStringModal} setRectangles={setRectangles} />
        <TextImportModal isOpen={isTextModalOpen} onClose={onCloseTextModal} setRectangles={setRectangles} />
        <CheckModal isOpen={isCheckModalOpen} onClose={onCloseCheckModal} setRectangles={setRectangles} step={step} setStep={setStep} setAns={updateAns} setCurrentIndex = {setCurrentIndex} />
        {ans && (
        <Flex top='20vh' justify="space-around" mt="3" mb='0'>
          <Button onClick={handleLeftClick} disabled={currentIndex === 0} mr="4">
            ←
          </Button>
          <Box mt = '2' mr = '2'>{currentIndex + 1} / {ans.length}  </Box>
          <Button onClick={handleRightClick} disabled={currentIndex === ans.length - 1}>
            →
          </Button>
            <Input
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter index"
              textAlign="center"
              width="25%"
            />
            <Button onClick={handleButtonClick} ml = {2}>Go to</Button>
          
        </Flex>
      )}
      </Box>
  );
};

Navbar.propTypes = {
  Rectangles: PropTypes.arrayOf(
    PropTypes.shape({
      length: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setRectangles: PropTypes.func.isRequired,
};

export default Navbar;
