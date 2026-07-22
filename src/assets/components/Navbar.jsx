import React from 'react'
import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Text,
  HStack,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react'
import { StringImportModal } from './StringImportModal'
import { TextImportModal } from './TextImportModal'
import { CheckModal } from './CheckModal'
import PropTypes from 'prop-types'
import { FormatService } from '../services'

export const Navbar = ({
  Rectangles,
  setRectangles,
  isSolving,
  setIsSolving,
  solutionCount,
  setSolutionCount,
  onSolveStart,
}) => {
  const [inputValue, setInputValue] = React.useState('')
  const [ans, setAns] = React.useState(null)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isTextModalOpen, setTextModalOpen] = React.useState(false)
  const [isStringModalOpen, setStringModalOpen] = React.useState(false)
  const [isCheckModalOpen, setIsCheckModalOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const abortRef = React.useRef(null)

  const surface = useColorModeValue('white', 'ink.900')
  const border = useColorModeValue('ink.100', 'ink.700')
  const menuColor = useColorModeValue('ink.900', 'ink.50')

  const updateAns = (v) => {
    setAns(v)
    setSolutionCount(v?.length ?? 0)
  }

  const appendSolution = (latest, all) => {
    setAns(all)
    setSolutionCount(all.length)
    setRectangles(latest)
    setCurrentIndex(all.length - 1)
  }

  const onImportClick = (type) => {
    if (type === 'Text') setTextModalOpen(true)
    else if (type === 'String') setStringModalOpen(true)
  }

  const onCloseTextModal = () => setTextModalOpen(false)
  const onCloseStringModal = () => setStringModalOpen(false)
  const onCheckClick = () => setIsCheckModalOpen(true)
  const onCloseCheckModal = () => {
    setIsCheckModalOpen(false)
    setStep(1)
  }

  const onRotateClick = () => {
    if (!Rectangles) return
    setRectangles(FormatService.rotate(Rectangles))
  }

  const handleStop = () => {
    abortRef.current?.abort()
  }

  const handleRightClick = () => {
    if (ans && currentIndex < ans.length - 1) {
      const next = currentIndex + 1
      setCurrentIndex(next)
      setRectangles(ans[next])
    }
  }

  const handleLeftClick = () => {
    if (ans && currentIndex > 0) {
      const prev = currentIndex - 1
      setCurrentIndex(prev)
      setRectangles(ans[prev])
    }
  }

  const handleInputChange = (event) => setInputValue(event.target.value)

  const handleButtonClick = () => {
    if (!ans) return
    const value = parseInt(inputValue, 10)
    if (!isNaN(value) && value >= 1 && value <= ans.length) {
      setCurrentIndex(value - 1)
      setRectangles(ans[value - 1])
    } else {
      alert('Please enter a valid number')
    }
  }

  return (
    <Box
      bg={surface}
      border="1px solid"
      borderColor={border}
      borderRadius="2xl"
      boxShadow="0 10px 28px rgba(26, 36, 33, 0.05)"
      overflow="hidden"
    >
      <Flex
        justify="space-between"
        align="center"
        px={3}
        py={2}
        bg="app.nav"
        color="app.navText"
        gap={2}
        flexWrap="wrap"
      >
        <Menu>
          <MenuButton as={Button} variant="ghost" color="ink.100" _hover={{ bg: 'ink.800' }} size="sm">
            Import
          </MenuButton>
          <MenuList color={menuColor}>
            <MenuItem onClick={() => onImportClick('Text')}>Text grid</MenuItem>
            <MenuItem onClick={() => onImportClick('String')}>String format</MenuItem>
          </MenuList>
        </Menu>
        <HStack spacing={1}>
          <Button
            onClick={onCheckClick}
            variant="ghost"
            color="citrus.200"
            _hover={{ bg: 'ink.800' }}
            size="sm"
            isDisabled={isSolving}
          >
            Check
          </Button>
          <Button
            onClick={onRotateClick}
            variant="ghost"
            color="ink.100"
            _hover={{ bg: 'ink.800' }}
            size="sm"
            isDisabled={!Rectangles || isSolving}
          >
            Rotate
          </Button>
          {isSolving && (
            <Button
              onClick={handleStop}
              variant="ghost"
              color="red.200"
              _hover={{ bg: 'ink.800' }}
              size="sm"
            >
              Stop
            </Button>
          )}
        </HStack>
      </Flex>

      {isSolving && (
        <Box px={4} pt={3} pb={1}>
          <Text fontSize="xs" fontFamily="mono" color="app.muted" mb={1}>
            Live solve · {solutionCount} packing{solutionCount === 1 ? '' : 's'}
          </Text>
          <Progress
            size="xs"
            isIndeterminate
            colorScheme="green"
            borderRadius="full"
            bg="app.surfaceMuted"
          />
        </Box>
      )}

      <StringImportModal
        isOpen={isStringModalOpen}
        onClose={onCloseStringModal}
        setRectangles={setRectangles}
      />
      <TextImportModal
        isOpen={isTextModalOpen}
        onClose={onCloseTextModal}
        setRectangles={setRectangles}
      />
      <CheckModal
        isOpen={isCheckModalOpen}
        onClose={onCloseCheckModal}
        step={step}
        setStep={setStep}
        setAns={updateAns}
        appendSolution={appendSolution}
        setCurrentIndex={setCurrentIndex}
        setIsSolving={setIsSolving}
        setSolutionCount={setSolutionCount}
        onSolveStart={onSolveStart}
        abortRef={abortRef}
      />

      {ans && ans.length > 0 && (
        <Flex
          align="center"
          justify="center"
          gap={2}
          px={3}
          py={3}
          flexWrap="wrap"
        >
          <Button
            onClick={handleLeftClick}
            isDisabled={currentIndex === 0}
            size="sm"
            variant="outline"
          >
            ←
          </Button>
          <Text fontFamily="mono" fontSize="sm" minW="72px" textAlign="center">
            {currentIndex + 1} / {ans.length}
          </Text>
          <Button
            onClick={handleRightClick}
            isDisabled={currentIndex === ans.length - 1}
            size="sm"
            variant="outline"
          >
            →
          </Button>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Index"
            textAlign="center"
            width="88px"
            size="sm"
            borderRadius="lg"
          />
          <Button onClick={handleButtonClick} size="sm">
            Go
          </Button>
        </Flex>
      )}
    </Box>
  )
}

Navbar.propTypes = {
  Rectangles: PropTypes.array,
  setRectangles: PropTypes.func.isRequired,
  isSolving: PropTypes.bool,
  setIsSolving: PropTypes.func,
  solutionCount: PropTypes.number,
  setSolutionCount: PropTypes.func,
  onSolveStart: PropTypes.func,
}

export default Navbar
