import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {DieFace,DieFaceSelected,StyledDiceGroup} from '../src/Dice';

//import { Button, Welcome } from '@storybook/react/demo';
storiesOf('DieFace',module)
  .add("1",()=>{return <DieFace player={1} face={1}/>})
  .add("2",()=>{return <DieFace player={1} face={2}/>})
  .add("3",()=>{return <DieFace player={1} face={3}/>})
  .add("4",()=>{return <DieFace player={2} face={4}/>})
  .add("5",()=>{return <DieFace player={2} face={5}/>})
  .add("6",()=>{return <DieFace player={2} face={6}/>})

storiesOf('DieFaceSelected',module)
.add("1",()=>{return <DieFaceSelected player={1} face={1}/>})
.add("2",()=>{return <DieFaceSelected player={1} face={2}/>})
.add("3",()=>{return <DieFaceSelected player={1} face={3}/>})
.add("4",()=>{return <DieFaceSelected player={2} face={4}/>})
.add("5",()=>{return <DieFaceSelected player={2} face={5}/>})
.add("6",()=>{return <DieFaceSelected player={2} face={6}/>})

storiesOf('DiceGroup',module)
.add("Player 1 - 6 Selected",()=>{return <StyledDiceGroup selected={true} player={1} value={6} amount={3}/>})
.add("Player 2 - 6",()=>{return <StyledDiceGroup selected={false} player={2} value={6} amount={3}/>})