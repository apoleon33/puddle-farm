import {Box, Tooltip, Typography} from "@mui/material";
import {ActivityChartProps, SingleActivityDotProps} from "../interfaces/Player";

// Greatly inspired by https://codepen.io/ire/pen/Legmwo/

const ActivityChart = ({}: ActivityChartProps) => {
    const cols = 12;
    const rows = 7;
    const total = cols * rows;
    const gap = 3;

    const today = new Date();

    const displayedPreviousWeeks = 14;
    const allFullColumns = 7 * displayedPreviousWeeks; // 14 weeks exactly

    // today.getDate()-(today.getDay() - (allFullColumns - idx))

    return (
        <>
            <Typography sx={{fontSize: 14}}>Recent activity:</Typography>

            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start'}}>
                <Box sx={{
                    fontSize: 10,
                    display: 'grid',
                    gridTemplateRows: `repeat(7, 10px)`,
                    rowGap: `${gap}px`,
                    paddingRight: `10px`,
                }}>
                    <Typography sx={{fontSize: 10, visibility: 'hidden'}}>Sun</Typography>
                    <Typography sx={{fontSize: 10}}>Mon</Typography>
                    <Typography sx={{fontSize: 10, visibility: 'hidden'}}>Tue</Typography>
                    <Typography sx={{fontSize: 10}}>Wed</Typography>
                    <Typography sx={{fontSize: 10, visibility: 'hidden'}}>Thu</Typography>
                    <Typography sx={{fontSize: 10}}>Fri</Typography>
                    <Typography sx={{fontSize: 10, visibility: 'hidden'}}>Sat</Typography>
                </Box>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateRows: `repeat(7, 10px)`,
                        columnGap: `${gap}px`,
                        rowGap: `${gap}px`,
                        marginTop: 1,
                        gridAutoFlow: 'column',
                    }}
                >

                    {Array.from({length: allFullColumns}).map((_, idx) => (
                        <SingleActivityDot key={`past-${idx}`} visible={true}
                                           date={new Date(new Date().setDate(today.getDate() - (today.getDay() - (idx - allFullColumns))))}></SingleActivityDot>
                    ))}
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: `${gap}px`,
                    marginLeft: `${gap}px`,
                    marginTop: 1,
                }}>
                    {
                        Array.from({length: today.getDay() + 1}).map((_, idx) => (
                            <SingleActivityDot key={`current-${idx}`} visible={true}
                                               date={new Date(new Date().setDate(today.getDate() - (today.getDay() - idx)))}></SingleActivityDot>))
                    }
                    {
                        Array.from({length: 6 - today.getDay()}).map((_, idx) => (
                            <SingleActivityDot key={`future-${idx}`} visible={false} date={today}></SingleActivityDot>))
                    }
                </Box>
            </Box>

            <hr style={{marginTop: 10}}/>
        </>
    );
};

const SingleActivityDot = ({key, visible, date}: SingleActivityDotProps) => {
    const TIERS = [
        {color: "#3d4345"},
        {color: "#3d4345"},
        {color: "#3d4345"}, {color: "#3d4345"}, {color: "#3d4345"}, {color: "#3d4345"},
        {color: "#3d4345"},
        {label: "S", color: "#FFD700", minWR: 65},
        {label: "A", color: "#4CAF50", minWR: 55},
        {label: "C", color: "#FF9800", minWR: 35},
        {label: "D", color: "#f44336", minWR: 0},
    ];


    return (
        <Tooltip title={date.toDateString()}>
            <Box
                key={key}
                sx={{
                    bgcolor: TIERS[Math.floor(Math.random() * TIERS.length)].color,
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    visibility: visible ? 'visible' : 'hidden',
                }}
            />
        </Tooltip>

    );
};


export default ActivityChart;
