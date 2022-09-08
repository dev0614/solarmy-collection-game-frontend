import { SoliderFilter, SoliderSideItem } from "../Battalion/BattalionWidget";
import { AttributeFilterTypes, SoldierItem } from "../../solana/types";

export const BattalionView = (props: {
  attributes: AttributeFilterTypes;
  selectedId: string;
  onSelect: Function;
  currentTab: string;
  soldiers: SoldierItem[];
  setTab: Function;
}) => {
  const { attributes, selectedId, onSelect, setTab, soldiers } = props;
  return (
    <div className="battalion-view">
      <h1>Battalion</h1>
      <div className="solider-tabs">
        <div
          className={`tab ${props.currentTab === "all" ? "active" : ""}`}
          onClick={() => setTab("all")}
        >
          all
        </div>
        <div
          className={`tab ${props.currentTab === "2d" ? "active" : ""}`}
          onClick={() => setTab("2d")}
        >
          2d
        </div>
        <div
          className={`tab ${props.currentTab === "3d" ? "active" : ""}`}
          onClick={() => setTab("3d")}
        >
          3d
        </div>
      </div>
      <div className="user-soldiers">
        {soldiers &&
          soldiers.length !== 0 &&
          soldiers.map(
            (item, key) =>
              (item.collection.toLowerCase() === props.currentTab ||
                props.currentTab === "all") && (
                <SoliderSideItem
                  key={key}
                  mint={item.mint}
                  id={item.id}
                  uri={item.uri}
                  image={item.image}
                  selected={item.selected}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  collection={item.collection}
                />
              )
          )}
      </div>
    </div>
  );
};
