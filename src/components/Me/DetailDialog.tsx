import { Dialog } from "@mui/material"
import Soldier2DAttributeTable from "../Battalion/Soldier2DAttributeTable"
import Soldier3DAttributeTable from "../Battalion/Soldier3DAttributeTable"

export default function DetailDialog(props: {
  opened:  boolean,
  close: Function,
  id: String
  collection: String
  score: Number
  totalPoints: Number
  rank: Number
  rarity3d: Number
  tableData2D: any
  tableData3D: any
}) {
  const { opened, close, id, collection, score, totalPoints, rank, rarity3d, tableData2D, tableData3D } = props;
  return (
    <Dialog open={opened}>
      <div className="me-dialog">
        <div className="list-head">
          <div className="id-line">
            <h3>#{id}</h3>
            <p>{collection}</p>
          </div>
          <div className="score-line">
            <h3>{collection === "2D" ? "Score" : "Points"}</h3>
            <p>{collection === "2D" ? score : totalPoints}</p>
          </div>
          <div className="rank-line">
            <h3>{collection === "2D" ? "Rank" : "Rarity"}</h3>
            <p>{collection === "2D" ? rank : (rarity3d ? rarity3d : "")}</p>
          </div>
        </div>
        {collection.toLowerCase() === "2d" &&
          <Soldier2DAttributeTable
            hat={tableData2D.hat}
            head={tableData2D.head}
            torso={tableData2D.torso}
            torso_accessories={tableData2D.torso_accessories}
            legs={tableData2D.legs}
            l_arm={tableData2D.l_arm}
            r_arm={tableData2D.r_arm}
            companion={tableData2D.companion}
            shoes={tableData2D.shoes}
            background={tableData2D.background}
          />
        }
        {collection.toLowerCase() === "3d" &&
          <Soldier3DAttributeTable
            head={tableData3D.head}
            torso={tableData3D.torso}
            head_accessories={tableData3D.head_accessories}
            legs={tableData3D.legs}
            l_arm={tableData3D.l_arm}
            r_arm={tableData3D.r_arm}
            background={tableData3D.background}
          />
        }
        <button onClick={() => close()} className="modal-close">CLOSE</button>
      </div>
    </Dialog>
  )
}
