import { useState } from 'react'
import './App.css'
import { Navbar } from './assets/components/Navbar'
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  IconButton,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { Visualization } from './assets/components/Visualization'
import { TXT } from './assets/components/TXT'
import { MyTree } from './assets/components/MyTree'
import { TheirTree } from './assets/components/TheirTree'
import Tree1Icon from './assets/icons/tree1.svg'
import Tree2Icon from './assets/icons/tree2.svg'
import VisIcon from './assets/icons/vis.svg'
import TxtIcon from './assets/icons/txt.svg'

function App() {
  const [Rectangles, setRectangles] = useState(null)
  const [selected, setSelected] = useState('Visualisation')
  const [isSolving, setIsSolving] = useState(false)
  const [solutionCount, setSolutionCount] = useState(0)
  const { colorMode, toggleColorMode } = useColorMode()

  const surface = useColorModeValue('app.surface', 'app.surface')
  const border = useColorModeValue('app.border', 'app.border')
  const emptyBg = useColorModeValue('rgba(255,255,255,0.55)', 'rgba(26,36,33,0.55)')
  const badgeBg = useColorModeValue('white', 'ink.800')
  const iconFilterInactive = colorMode === 'dark' ? 'invert(0.85)' : 'invert(0.85)'

  const options = [
    { name: 'Visualisation', icon: VisIcon, label: 'Pack', component: <Visualization Rectangles={Rectangles} /> },
    { name: 'TheirTree', icon: Tree1Icon, label: 'Their tree', component: <TheirTree Rectangles={Rectangles} /> },
    { name: 'MyTree', icon: Tree2Icon, label: 'My tree', component: <MyTree Rectangles={Rectangles} /> },
    { name: 'TXT', icon: TxtIcon, label: 'Text', component: <TXT Rectangles={Rectangles} /> },
  ]

  const active = options.find((option) => option.name === selected)

  return (
    <Box minH="100vh" w="100%" px={{ base: 3, md: 6 }} py={4} color="app.text">
      <VStack spacing={5} align="stretch" maxW="1200px" mx="auto">
        <Flex
          as="header"
          align={{ base: 'flex-start', md: 'center' }}
          justify="space-between"
          direction={{ base: 'column', md: 'row' }}
          gap={3}
          pt={2}
        >
          <Box>
            <Text
              fontFamily="mono"
              fontSize="xs"
              letterSpacing="0.16em"
              textTransform="uppercase"
              color="app.muted"
              mb={1}
            >
              Rectangle packing
            </Text>
            <Heading
              as="h1"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="800"
              letterSpacing="-0.03em"
              lineHeight="1.1"
            >
              Pack lab
            </Heading>
          </Box>

          <HStack spacing={3}>
            {isSolving && (
              <HStack
                spacing={3}
                bg={badgeBg}
                border="1px solid"
                borderColor={border}
                px={4}
                py={2}
                borderRadius="full"
                boxShadow="sm"
              >
                <Spinner size="sm" color="citrus.500" thickness="2px" className="solving-dot" />
                <Text fontSize="sm" fontWeight="600" color="app.text">
                  Solving… {solutionCount} found
                </Text>
              </HStack>
            )}
            <IconButton
              aria-label={colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleColorMode}
              variant="outline"
              borderRadius="full"
              size="sm"
              icon={
                <Text as="span" fontSize="md" lineHeight="1">
                  {colorMode === 'dark' ? '☀' : '☾'}
                </Text>
              }
            />
          </HStack>
        </Flex>

        <Navbar
          Rectangles={Rectangles}
          setRectangles={setRectangles}
          isSolving={isSolving}
          setIsSolving={setIsSolving}
          solutionCount={solutionCount}
          setSolutionCount={setSolutionCount}
          onSolveStart={() => setSelected('Visualisation')}
        />

        {!Rectangles ? (
          <Box
            mt={6}
            border="1px dashed"
            borderColor="app.borderStrong"
            borderRadius="2xl"
            bg={emptyBg}
            backdropFilter="blur(8px)"
            px={{ base: 6, md: 10 }}
            py={{ base: 12, md: 16 }}
            textAlign="center"
          >
            <Heading as="h2" size="md" mb={2} fontWeight="700">
              Import a layout to begin
            </Heading>
            <Text color="app.muted" maxW="420px" mx="auto">
              Load a string or text grid, or run Check to enumerate packings and watch solutions appear as they are found.
            </Text>
          </Box>
        ) : (
          <>
            <Box
              borderRadius="2xl"
              bg={surface}
              border="1px solid"
              borderColor={border}
              boxShadow="0 18px 40px rgba(26, 36, 33, 0.06)"
              overflow="auto"
              p={{ base: 3, md: 5 }}
              minH="420px"
              display="flex"
              justifyContent="center"
              alignItems="flex-start"
            >
              {active?.component}
            </Box>

            <Box
              position="sticky"
              bottom={3}
              zIndex={10}
              mx="auto"
              w="fit-content"
              maxW="100%"
            >
              <Flex
                bg="app.nav"
                color="app.navText"
                borderRadius="full"
                px={2}
                py={2}
                gap={1}
                boxShadow="0 12px 32px rgba(14, 21, 19, 0.35)"
              >
                {options.map((option) => {
                  const isActive = selected === option.name
                  return (
                    <Box
                      key={option.name}
                      as="button"
                      onClick={() => setSelected(option.name)}
                      display="flex"
                      alignItems="center"
                      gap={2}
                      px={3}
                      py={2}
                      borderRadius="full"
                      bg={isActive ? 'app.accent' : 'transparent'}
                      color={isActive ? 'ink.950' : 'ink.200'}
                      fontSize="sm"
                      fontWeight="600"
                      transition="background 0.2s, color 0.2s, transform 0.15s"
                      _hover={{
                        bg: isActive ? 'citrus.300' : 'ink.800',
                        transform: 'translateY(-1px)',
                      }}
                    >
                      <img
                        src={option.icon}
                        alt=""
                        width={18}
                        height={18}
                        style={{ filter: isActive ? 'none' : iconFilterInactive }}
                      />
                      <Text as="span" display={{ base: 'none', sm: 'inline' }}>
                        {option.label}
                      </Text>
                    </Box>
                  )
                })}
              </Flex>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  )
}

export default App
