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
  HStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Switch,
} from '@chakra-ui/react'
import { PackingService } from '../services'

const DEFAULT_INTERVAL_MS = 80

export const CheckModal = ({
  isOpen,
  onClose,
  step,
  setStep,
  setAns,
  appendSolution,
  setCurrentIndex,
  setIsSolving,
  setSolutionCount,
  onSolveStart,
  abortRef,
}) => {
  const [numRectangles, setNumRectangles] = React.useState('')
  const [rectanglesData, setRectanglesData] = React.useState([])
  const [intervalMs, setIntervalMs] = React.useState(DEFAULT_INTERVAL_MS)
  const [livePreview, setLivePreview] = React.useState(true)

  const handleNumRectanglesChange = (event) => {
    setNumRectangles(event.target.value)
  }

  const handleNextStep = () => {
    const n = parseInt(numRectangles, 10)
    if (!n || n < 1) return
    const initialData = Array.from({ length: n }, (_, index) => ({
      name: String.fromCharCode(65 + index),
      width: '',
      length: '',
    }))
    setRectanglesData(initialData)
    setStep(step + 1)
  }

  const handleRectangleDataChange = (index, field, value) => {
    const newData = [...rectanglesData]
    newData[index] = { ...newData[index], [field]: Number(value) }
    setRectanglesData(newData)
  }

  const resetAndClose = () => {
    onClose()
  }

  const handleSubmit = () => {
    if (!rectanglesData.every((rect) => rect.width && rect.length)) {
      alert('Please fill all the textboxes.')
      return
    }

    const controller = new AbortController()
    if (abortRef) abortRef.current = controller

    setIsSolving?.(true)
    setSolutionCount?.(0)
    setCurrentIndex(0)
    setAns([])
    onSolveStart?.()

    // Close immediately so the packing view can stream results
    onClose()
    setStep(1)

    const collected = []
    const shouldLive = livePreview

    ;(async () => {
      try {
        const result = await PackingService.solveSubsets(rectanglesData, {
          intervalMs: shouldLive ? Number(intervalMs) || 0 : 0,
          signal: controller.signal,
          onProgress: async ({ latest, Answers }) => {
            collected.length = 0
            collected.push(...Answers)
            if (shouldLive && typeof appendSolution === 'function') {
              appendSolution(latest, [...Answers])
            }
          },
        })

        setAns(result.Answers)
        setSolutionCount?.(result.Answers.length)
        if (result.Answers.length && !shouldLive && typeof appendSolution === 'function') {
          setCurrentIndex(0)
          appendSolution(result.Answers[0], result.Answers)
        }
      } catch (err) {
        if (err?.name !== 'AbortError') {
          console.error(err)
          alert('Solve failed. Check the console for details.')
        } else if (collected.length) {
          setAns([...collected])
          setSolutionCount?.(collected.length)
        }
      } finally {
        setIsSolving?.(false)
        if (abortRef) abortRef.current = null
      }
    })()
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} size="lg" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader fontFamily="heading" letterSpacing="-0.02em">
          Check rectangles
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {step === 1 ? (
            <VStack align="stretch" spacing={4}>
              <Text color="app.muted">
                How many rectangles do you want to pack?
              </Text>
              <Input
                type="number"
                value={numRectangles}
                onChange={handleNumRectanglesChange}
                min="1"
                placeholder="e.g. 4"
                borderRadius="lg"
              />
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel htmlFor="live-preview" mb="0" fontSize="sm">
                  Live preview while solving
                </FormLabel>
                <Switch
                  id="live-preview"
                  isChecked={livePreview}
                  onChange={(e) => setLivePreview(e.target.checked)}
                  colorScheme="green"
                />
              </FormControl>
              {livePreview && (
                <FormControl>
                  <FormLabel fontSize="sm">Interval between solutions (ms)</FormLabel>
                  <NumberInput
                    value={intervalMs}
                    min={0}
                    max={2000}
                    step={20}
                    onChange={(_, v) => setIntervalMs(Number.isFinite(v) ? v : 0)}
                  >
                    <NumberInputField borderRadius="lg" />
                  </NumberInput>
                  <Text fontSize="xs" color="app.muted" mt={1}>
                    Modal closes on Solve so you can watch packings appear on the canvas.
                  </Text>
                </FormControl>
              )}
            </VStack>
          ) : (
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" color="app.muted">
                Enter width and length for each rectangle.
              </Text>
              {rectanglesData.map((rect, index) => (
                <Flex key={rect.name} direction="row" align="center" gap={2}>
                  <Text
                    fontFamily="mono"
                    fontWeight="600"
                    minW="28px"
                    color="app.text"
                  >
                    {rect.name}
                  </Text>
                  <Input
                    placeholder="Width"
                    value={rect.width}
                    onChange={(e) =>
                      handleRectangleDataChange(index, 'width', e.target.value)
                    }
                    borderRadius="lg"
                  />
                  <Input
                    placeholder="Length"
                    value={rect.length}
                    onChange={(e) =>
                      handleRectangleDataChange(index, 'length', e.target.value)
                    }
                    borderRadius="lg"
                  />
                </Flex>
              ))}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2} w="100%" justify="flex-end">
            {step === 1 ? (
              <>
                <Button variant="ghost" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button onClick={handleNextStep} isDisabled={!numRectangles}>
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  Solve
                </Button>
              </>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

CheckModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setAns: PropTypes.func.isRequired,
  appendSolution: PropTypes.func,
  setCurrentIndex: PropTypes.func.isRequired,
  setIsSolving: PropTypes.func,
  setSolutionCount: PropTypes.func,
  onSolveStart: PropTypes.func,
  abortRef: PropTypes.shape({ current: PropTypes.any }),
}
