import { useState } from "react";
import { ClickAwayListener } from "@mui/material";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { CloseCircleIcon, DownIcon, FiltersIcon, SearchIcon } from "./svgIcons";

const options = [
    {
        label: "Recently Added",
        value: "recently"
    },
    {
        label: "Older Added",
        value: "older"
    },
    {
        label: "Price: Low to high",
        value: "price-l-h"
    },
    {
        label: "Price: High to low",
        value: "price-h-l"
    },
];

export default function Header({ onKeyword, headTab, onHeadTab, onSort, ...props }) {
    const [searchIndex, setSearchIndex] = useState("");
    const [stateList, setStateList] = useState(false);
    const [searchShow, setSearchShow] = useState(false);
    const handleSearch = (e) => {
        setSearchIndex(e.target.value);
        onKeyword(e.target.value);
    }
    const handleSort = (e) => {
        onSort(e.value)
    }
    const handleTab = (tab) => {
        onHeadTab(tab);
        setStateList(false);
    }
    return (
        <div className="header">
            <div className="header-content">
                <div className="header-left">
                    <button className={`btn-circle ${headTab === "all" ? "btn-dark" : "btn-light"}`} onClick={() => onHeadTab("all")}>all raffles</button>
                    <button className={`btn-circle  ${headTab === "past" ? "btn-dark" : "btn-light"}`} onClick={() => onHeadTab("past")}>past raffles</button>
                </div>
                <div className="header-center">
                    <Dropdown
                        options={options}
                        onChange={handleSort}
                        value={options[0]}
                        placeholder="Select an option"
                    />
                </div>
                <div className="header-right">
                    <input
                        value={searchIndex}
                        onChange={handleSearch}
                        placeholder="Search"
                        className="search-index"
                    />
                    <button className="btn-search">
                        <SearchIcon />
                    </button>
                </div>
            </div>
            <div className="header-content mobile">
                {/* <div className="header-left">
                    <button className={`btn-circle ${headTab === "all" ? "btn-dark" : "btn-light"}`} onClick={() => onHeadTab("all")}>all raffles</button>
                    <button className={`btn-circle  ${headTab === "past" ? "btn-dark" : "btn-light"}`} onClick={() => onHeadTab("past")}>past raffles</button>
                </div> */}
                {!searchShow &&
                    <ClickAwayListener onClickAway={() => setStateList(false)}>
                        <div className="state-dropdown">
                            <div className="title" onClick={() => setStateList(true)}><span>{headTab === "all" ? "All Raffles" : "Past Raffles"}</span> <DownIcon /></div>
                            {stateList &&
                                <div className="state-dropdown-content">
                                    <button onClick={() => handleTab("all")}>All raffles</button>
                                    <button onClick={() => handleTab("past")}>Past Raffles</button>
                                </div>
                            }
                        </div>
                    </ClickAwayListener>
                }
                <div className={`mobile-header-action ${searchShow && "showed"}`}>
                    <button className="btn" style={{ marginRight: 4 }}>
                        <FiltersIcon />
                    </button>
                    {searchShow &&
                        <div className="search-box">
                            <input
                                value={searchIndex}
                                onChange={handleSearch}
                                placeholder="Search"
                                className="search-index"
                            />
                            <button className="circle-close" onClick={() => setSearchShow(false)}>
                                <CloseCircleIcon />
                            </button>
                        </div>
                    }

                    {!searchShow &&
                        <button className="btn" onClick={() => setSearchShow(true)}>
                            <SearchIcon />
                        </button>
                    }
                </div>
            </div>
        </div >
    )
}
