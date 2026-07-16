import {Box, Typography} from "@mui/material";
import {ActivityChartProps, SingleActivityDotProps} from "../interfaces/Player";

const ActivityChart = ({player_id}: ActivityChartProps) => {
    const cols = 12;
    const rows = 7;
    const total = cols * rows;

    const today = new Date()

    return (
        <>
            <Typography sx={{fontSize: 14}}>Recent activity:</Typography>

            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'start'}}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${cols}, 12px)`,
                        columnGap: '6px',
                        rowGap: '3px',
                        marginTop: 1,
                    }}
                >
                    {Array.from({length: total}).map((_, idx) => (
                        <SingleActivityDot key={idx.toString()}></SingleActivityDot>
                    ))}
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    rowGap: '3px',
                    marginLeft: '6px',
                    marginTop: 1
                }}>
                    {
                        Array.from({length: today.getDay() + 1}).map((_, idx) => (
                            <SingleActivityDot key={idx.toString()}></SingleActivityDot>))
                    }
                </Box>
            </Box>

            <hr style={{marginTop: 10}}/>
        </>
    );
};

const SingleActivityDot = ({key}: SingleActivityDotProps) => {
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
        <Box
            key={key}
            sx={{
                bgcolor: TIERS[Math.floor(Math.random() * TIERS.length)].color,
                width: '10px',
                height: '10px',
                borderRadius: '2px',
            }}
        />
    );
};


export default ActivityChart;
