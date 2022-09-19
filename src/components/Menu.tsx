import Link from "next/link";
import { useRouter } from "next/router";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  BattalionIcon,
  DashboardIcon,
  DeployIcon,
  FusionIcon,
  LeaderboardIcon,
  MarketplaceIcon,
  StoreIcon,
} from "./svgIcons";

export default function Menu() {
  const router = useRouter();
  return (
    <div className="menu">
      <div className="menu-content">
        <div className="header-logo">
          <Link href="/">
            <a>
              {/* eslint-disable-next-line */}
              <img src="/img/logo.svg" className="menu-logo" alt="logo" />
            </a>
          </Link>
        </div>
        <div className="menu-nav">
          <ul>
            {menus.map((item, key) => (
              <li key={key}>
                <Link href={item.link}>
                  <a
                    style={{
                      pointerEvents: "all",
                    }}
                  >
                    <div
                      className={`menu-item ${
                        router.pathname.split("/")[1] ===
                        item.title.toLowerCase()
                          ? "active"
                          : ""
                      }`}
                    >
                      <span>{item.icon}</span>
                      <p>{item.title}</p>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="wallet-status">
          {/* <button className="btn-wallet">
                        <DeveloperIcon />
                        <span>connected</span>
                    </button> */}

          <WalletModalProvider>
            <WalletMultiButton />
          </WalletModalProvider>
        </div>
      </div>
    </div>
  );
}

const menus = [
  {
    link: "/dashboard",
    icon: <DashboardIcon />,
    title: "Dashboard",
  },
  {
    link: "/leaderboard",
    icon: <LeaderboardIcon />,
    title: "Leaderboard",
  },
  {
    link: "/deploy",
    icon: <DeployIcon />,
    title: "Deploy",
  },
  {
    link: "/fusion",
    icon: <FusionIcon />,
    title: "Fusion",
  },
  {
    link: "/battalion",
    icon: <BattalionIcon />,
    title: "Battalion",
  },
  {
    link: "/store",
    icon: <StoreIcon />,
    title: "Store",
  },
  {
    link: "/marketplace",
    icon: <MarketplaceIcon />,
    title: "Marketplace",
  },
];
