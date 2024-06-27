// src/components/Mygrid.js
import { Grid, GridItem } from '@chakra-ui/react';
import {MyTree} from './MyTree'; // Ensure the correct path to your component
import {TheirTree} from './TheirTree'; // Ensure the correct path to your component
import {Visualization} from './Visualization'; // Ensure the correct path to your component
import {TXT} from './TXT'; // Ensure the correct path to your component

export const Mygrid = ({Rectangles}) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(2, 1fr)" gap={4} p={4}>
      <GridItem
        w="100%"
        h="100%"
        border="2px"
        borderColor="black"
        borderRadius="md"
      >
        <MyTree Rectangles={Rectangles} />
      </GridItem>
      <GridItem
        w="100%"
        h="100%"
        border="2px"
        borderColor="black"
        borderRadius="md"
      >
        <TheirTree Rectangles={Rectangles} />
      </GridItem>
      <GridItem
        w="100%"
        h="100%"
        border="2px"
        borderColor="black"
        borderRadius="md"
      >
        <Visualization Rectangles={Rectangles} />
      </GridItem>
      <GridItem
        w="100%"
        h="100%"
        border="2px"
        borderColor="black"
        borderRadius="md"
      >
        <TXT Rectangles={Rectangles} />
      </GridItem>
    </Grid>
  );
};