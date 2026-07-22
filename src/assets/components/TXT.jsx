import { useEffect, useMemo } from 'react'
import React from 'react'
import {
  FormatService,
  ModelService,
} from '../services'
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Code,
  useColorModeValue,
} from '@chakra-ui/react'

const CELL = 14 // fixed cell size — forces column alignment without <pre>

export const TXT = ({ Rectangles }) => {
  const [grid, setGrid] = React.useState([])
  const [details, setDetails] = React.useState(null)
  const [dim, setDim] = React.useState(null)
  const [Myformat, setMyFormat] = React.useState('')
  const [TheirFormat, setTheirFormat] = React.useState('')

  const gridBg = useColorModeValue('ink.950', 'black')
  const gridFg = useColorModeValue('citrus.200', 'citrus.200')
  const cardBg = useColorModeValue('ink.50', 'ink.800')
  const cardBorder = useColorModeValue('ink.100', 'ink.700')

  useEffect(() => {
    if (Rectangles !== null) {
      const root = ModelService.getRoot(Rectangles)
      const myF = FormatService.toMyFormat(root, Rectangles)
      const raw = FormatService.toGrid(Rectangles)
      setGrid(Array.isArray(raw) ? raw : [])
      setDetails(ModelService.details(Rectangles))
      setDim(ModelService.getDimensions(root, Rectangles))
      setMyFormat(myF)
      setTheirFormat(FormatService.toTheirFormat(myF))
    }
  }, [Rectangles])

  const cols = useMemo(() => (grid[0]?.length ?? 0), [grid])
  const rows = grid.length

  if (!Rectangles) return null

  return (
    <VStack align="stretch" spacing={5} w="100%" maxW="900px" px={2}>
      <Box
        bg={gridBg}
        color={gridFg}
        borderRadius="xl"
        p={4}
        overflowX="auto"
      >
        <Text
          fontSize="xs"
          letterSpacing="0.12em"
          textTransform="uppercase"
          mb={3}
          color="ink.300"
        >
          Grid
        </Text>

        {cols > 0 && rows > 0 ? (
          <Box
            display="grid"
            gridTemplateColumns={`repeat(${cols}, ${CELL}px)`}
            gridAutoRows={`${CELL}px`}
            width={`${cols * CELL}px`}
            lineHeight={`${CELL}px`}
            fontFamily="'IBM Plex Mono', Consolas, 'Courier New', monospace"
            fontSize={`${CELL - 2}px`}
            letterSpacing="0"
            userSelect="text"
          >
            {grid.map((row, ri) =>
              row.map((ch, ci) => (
                <Box
                  key={`${ri}-${ci}`}
                  w={`${CELL}px`}
                  h={`${CELL}px`}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  m={0}
                  p={0}
                  // keep empty cells taking space
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </Box>
              )),
            )}
          </Box>
        ) : (
          <Text fontSize="sm" color="ink.400">
            No grid
          </Text>
        )}
      </Box>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
        {[
          { label: 'Width', value: dim?.width },
          { label: 'Length', value: dim?.length },
          { label: 'W scale', value: details?.widthScale },
          { label: 'L scale', value: details?.lengthScale },
        ].map((stat) => (
          <Box
            key={stat.label}
            bg={cardBg}
            border="1px solid"
            borderColor={cardBorder}
            borderRadius="lg"
            px={3}
            py={2}
          >
            <Text fontSize="xs" color="app.muted" fontFamily="mono">
              {stat.label}
            </Text>
            <Text fontWeight="700" fontSize="lg">
              {stat.value ?? '—'}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Box>
        <Heading as="h3" size="sm" mb={2}>
          Rectangles
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
          {Rectangles.map((obj) => (
            <Box
              key={obj.name}
              border="1px solid"
              borderColor={cardBorder}
              borderRadius="lg"
              px={3}
              py={2}
            >
              <Text fontFamily="mono" fontWeight="700">
                {obj.name}
              </Text>
              <Text fontSize="sm" color="app.muted">
                {obj.width} × {obj.length}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <VStack align="stretch" spacing={2}>
        <Text fontSize="sm">
          <Text as="span" fontWeight="700">My format: </Text>
          <Code fontSize="xs" whiteSpace="pre-wrap" fontFamily="mono">{Myformat}</Code>
        </Text>
        <Text fontSize="sm">
          <Text as="span" fontWeight="700">Their format: </Text>
          <Code fontSize="xs" whiteSpace="pre-wrap" fontFamily="mono">{TheirFormat}</Code>
        </Text>
      </VStack>
    </VStack>
  )
}
