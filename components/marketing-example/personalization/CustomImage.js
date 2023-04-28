import React from 'react';

import ModalImage from "react-modal-image";  // https://www.npmjs.com/package/react-modal-image
import styles from './CustomImage.module.css';

export function CustomImage(props) {
  const link = props.data.html.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "")
  
  const largeImage = `${link}?`;
  const smallImage = `${largeImage}&width=500`;

  return <ModalImage
    className={styles.image}
    small={smallImage}
    large={largeImage}
    showRotate={true}
    alt="Hello World!"
  /> 
}