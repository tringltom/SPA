import React from 'react'

const placeholderImageStyle = {
    display: "block",
    marginleft: "auto",
    marginright: "auto",
    width: "100%",
  };
const ArenaMainPage = () => {

    return (
        <div>
          <img
            src={"/assets/uS.jpeg"}
            alt="noPicture"
            style={placeholderImageStyle}
          />
        </div>
    )
}

export default ArenaMainPage;
