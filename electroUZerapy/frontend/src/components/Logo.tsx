import "./Logo.css";
import logo_blanco from "../assets/LogoBlanco.webp";
import logo_azul from "../assets/LogoAzul.webp";

import { useState } from "react";

const Logo: React.FC<{
  type: "home" | "login" | "register"
}> = ({
  type
}) => {
  return (
    <>
      {type == "login" && 
        <div className="logo-login-box" >
          <img src={logo_blanco} />
        </div>
      }
      {type == "home" &&
        <div className="logo-home-box">
          <img src={logo_azul} />
        </div>
      }
      {type == "register" &&
        <div className="logo-register-box">
          <img src={logo_azul} />
        </div>
      }
    </>
  );
}

export default Logo;