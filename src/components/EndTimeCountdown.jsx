import moment from "moment";
import Countdown from "react-countdown";

export default function EndTimeCountdown({ endTime, endAction, ...props }) {
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span>{moment(endTime).fromNow()}</span>
        } else {
            // Render a countdown
            return (
                <span>
                    {days !== 0 ? `${days}d` : ""} {hours}h {minutes}m {seconds}s
                </span>
            );
        }
    };
    return (
        <Countdown date={endTime} renderer={renderer} onComplete={() => endAction()} />
    )
}
