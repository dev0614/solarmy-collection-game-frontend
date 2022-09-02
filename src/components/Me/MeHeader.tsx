import { useEffect, useState } from "react"
import { useUserContext } from "../../context/UserProvider";
import { ArrowBackIosTwoTone, DiscordIcon } from "../svgIcons";
import Link from "next/link";

export default function MeHeader() {
  const userData = useUserContext();
  const [userName, setName] = useState(userData.userName);

  useEffect(() => {
      setName(userData.userName);
  }, [userData])

  return (
    <div className="me-header">
      <div className="head-front">
        <ArrowBackIosTwoTone />
      </div>
      <div className="head-center">
        <div className="username-box">
          <p className="head-name">{userName === "" ? "Player" : userName}</p>
          <label className="head-discord"><DiscordIcon /><span>Username</span></label>
        </div>
      </div>
      <div className="head-end">
        <Link href="/">
          <a>
              {/* eslint-disable-next-line */}
              <img
                  src="/img/favicon-32x32.png"
                  className="menu-logo"
                  alt="logo"
              />
              <p>SOLANA</p>
          </a>
        </Link>
      </div>
    </div>
  )
}
