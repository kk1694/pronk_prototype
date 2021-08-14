import { Container } from '@material-ui/core';
import React from 'react'
import TappyButton from './TappyButton'

function TappyList(props) {

    const buttonList = ['Bookmark', 'Positive', 'Negative', 'Insight', 'Action Item'];

    return buttonList.map((buttonName, index) => (
        <Container key={index}>
          <TappyButton onButtonClick = {props.handleTap} name={buttonName}/>
          </Container>
      ));

}

export default TappyList
