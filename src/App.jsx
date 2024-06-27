import { useState } from 'react'
import './App.css'
import { Navbar } from './assets/components/Navbar'
import { Box, Flex, HStack, Icon, useColorModeValue, VStack } from '@chakra-ui/react';
import { Visualization } from './assets/components/Visualization';
import { TXT } from './assets/components/TXT';
import { MyTree } from './assets/components/MyTree';
import { TheirTree } from './assets/components/TheirTree';
import Tree1Icon  from './assets/icons/tree1.svg';
import Tree2Icon  from './assets/icons/tree2.svg';
import VisIcon  from './assets/icons/vis.svg';
import TxtIcon  from './assets/icons/txt.svg';

function App() {
  const [Rectangles, setRectangles] = useState(null)
  const [selected, setSelected] = useState('TXT');
  const options = [
    { name: 'Visualisation',icon:VisIcon, component: <Visualization Rectangles={Rectangles} /> },
    { name: 'TheirTree',icon:Tree1Icon,  component: <TheirTree Rectangles={Rectangles} /> },
    { name: 'MyTree',icon:Tree2Icon, component: <MyTree Rectangles={Rectangles} /> },
    { name: 'TXT',icon:TxtIcon, component: <TXT Rectangles={Rectangles} /> },
  ];
  const bgColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.300', 'gray.600');
  return (
    <div style={{minHeight:"100vh"}}>
    <VStack >
      <Navbar Rectangles={Rectangles} setRectangles={setRectangles} />
      {Rectangles&&(<>
        <Box mt="6px">
        {options.find((option) => option.name === selected).component}
      </Box>
      <Box position = 'sticky' bottom="0" width="65vh" bg={bgColor} boxShadow="md" >
        <Flex justify="space-around" align="center" py={2}>
          {options.map((option) => (
            <Box
              key={option.name}
              as="button"
              onClick={() => setSelected(option.name)}
              p={3}
              borderRadius="md"
              bg={selected === option.name ? 'blue.500' : 'transparent'}
              _hover={{ bg: hoverBgColor }}
              color={selected === option.name ? 'white' : 'inherit'}
              transition="background-color 0.2s"
            >
               <img src={option.icon} alt="Your SVG" width={30}/>
            </Box>
          ))}
        </Flex>
      </Box>
      </>
    )
}
      </VStack>
    </div>
  )
}

export default App

// {
// <Navbar Rectangles = {Rectangles} setRectangles = {setRectangles}/>
// <Mygrid Rectangles = {Rectangles}/>}