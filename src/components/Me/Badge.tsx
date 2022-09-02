import { InfoTwoTone } from '@material-ui/icons';

export default function Badge() {
  return (
    <>
        <div className='badge-me'>
            <div className='badge-header'>
                <div className='badge-title'>
                    <p className='badge-text'>Badge</p>
                    <InfoTwoTone style={{'color': 'rgba(255, 255, 255, 0.6)'}} className="badge-icon" />
                </div>
                {/* eslint-disable-next-line */}
                <img
                    src="/img/badge/special-forces-sm.png"
                    alt=""
                    className="slider-img"
                />
            </div>
            <div className='leaderboard-me'>
                <div className='rank'>
                    <div className='rank-img'></div>
                    <div className='rank-text'>Top 2D Soldier</div>
                </div>
                <div className='rank'>
                    <div className='rank-img'></div>
                    <div className='rank-text'>Top 3D Soldier</div>
                </div>
            </div>
        </div>
    </>
  )
}
