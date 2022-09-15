import { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserProvider";
import { ArrowBackIosTwoTone, DiscordIcon } from "../svgIcons";
import Link from "next/link";
import { useRouter } from "next/router";

export default function MeHeader(props: {
  back?: {
    backUrl: string | null;
    title: string;
  };
}) {
  const userData = useUserContext();
  const [userName, setName] = useState(userData.userName);
  const router = useRouter();
  useEffect(() => {
    setName(userData.userName);
  }, [userData]);

  return (
    <div className="me-header">
      <div
        className="head-front"
        onClick={() =>
          router.push(props.back?.backUrl ? props.back?.backUrl : "/")
        }
      >
        <ArrowBackIosTwoTone />
      </div>
      <div className="head-center">
        <div className="username-box">
          <p className="head-name">{userName === "" ? "Player" : userName}</p>
          <label className="head-discord">
            <DiscordIcon />
            <span>Username</span>
          </label>
        </div>
      </div>
      <div className="head-end">
        <Link href="/">
          <a>
            {/* eslint-disable-next-line */}
            <img
              src="/img/logo-wordmark.svg"
              className="menu-logo"
              alt="logo"
            />
          </a>
        </Link>
      </div>
    </div>
  );
}
