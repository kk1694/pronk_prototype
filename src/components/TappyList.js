import { Container } from '@material-ui/core';
import React from 'react'
import TappyButton from './TappyButton'

function TappyList() {

    const buttonList = ['Bookmark', 'Positive', 'Negative', 'Insight', 'Action Item'];

    const handleTap = (name, time) => {
        console.log(name, time)
      }

    return buttonList.map((buttonName, index) => (
        <Container>
          <TappyButton onButtonClick = {handleTap} name={buttonName} />
          </Container>
      ));

}

export default TappyList
