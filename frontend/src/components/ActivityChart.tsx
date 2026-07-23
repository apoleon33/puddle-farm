import {Box, Tooltip, Typography} from "@mui/material";
import {ActivityChartProps} from "../interfaces/Player";
import {useEffect, useState} from "react";
import {API_ENDPOINT} from "../utils/playerApi";
import {Utils} from "../utils/Utils";

interface Last100GamesProps {
    result_win: boolean;
    timestamp: Date;
}

interface SingleActivityDotProps {
    key: string;
    visible?: boolean;
    date: Date;
    games: Last100GamesProps[];
}


// Greatly inspired by https://codepen.io/ire/pen/Legmwo/

const ActivityChart = ({player_id, char_short}: ActivityChartProps) => {
    const [history, setHistory] = useState<Last100GamesProps[]>([]);
    const gap = 3;

    const today = new Date();

    const displayedPreviousWeeks = 14;
    const allFullColumns = 7 * displayedPreviousWeeks;

    const isSameDate = (date1: Date, date2: Date) => date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
    ;

    useEffect(() => {
        // /player/{player_id}/{char_id}/history
        const fetchLast100Games = async () => {
            let hiistory: Last100GamesProps[] = history;
            for (let i = 100; i < 1500; i+= 100) {
                const last100GamesResponse = await fetch(
                    API_ENDPOINT +
                    "/player/" +
                    player_id +
                    "/" +
                    char_short +
                    "/history?count=" +
                    i +
                    `&offset=${i - 100}`
                )

                console.log(await fetch(
                    API_ENDPOINT +
                    "/player/" +
                    player_id +
                    "/" +
                    char_short +
                    "/history?count=" +
                    100 +
                    `&offset=${i-100}`
                ))


                if (last100GamesResponse.status === 200) {
                    const last100GamesResult = await last100GamesResponse.json();
                    // console.log(last100GamesResult);
                    hiistory = hiistory.concat(last100GamesResult.history.map((game: any) => ({
                        result_win: game.result_win,
                        timestamp: new Date(game.timestamp),
                    })));
                }
            }
            setHistory(hiistory);
        }

        fetchLast100Games();
        console.log(history);
    }, [player_id, char_short, API_ENDPOINT]);

    return (
        <>
            <Typography sx={{fontSize: 14}}>Recent activity:</Typography>
            {/*{history.map((game => (<Typography sx={{fontSize: 14}}>{game.timestamp.toDateString()}</Typography>)))}*/}
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
                                           date={new Date(new Date().setDate(today.getDate() - (today.getDay() - (idx - allFullColumns))))}
                                           games={history.filter(game => isSameDate(new Date(new Date().setDate(today.getDate() - (today.getDay() - (idx - allFullColumns)))), game.timestamp))}
                        ></SingleActivityDot>
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
                                               date={new Date(new Date().setDate(today.getDate() - (today.getDay() - idx)))}
                                               games={history.filter(game => isSameDate(new Date(new Date().setDate(today.getDate() - (today.getDay() - idx))), game.timestamp))}
                            ></SingleActivityDot>))
                    }
                    {
                        Array.from({length: 6 - today.getDay()}).map((_, idx) => (
                            <SingleActivityDot key={`future-${idx}`} visible={false} date={today}
                                               games={[]}
                            ></SingleActivityDot>))
                    }
                </Box>
            </Box>

            <hr style={{marginTop: 10}}/>
        </>
    );
};

const SingleActivityDot = ({key, visible, date, games}: SingleActivityDotProps) => {
    const [winrate, setWinrate] = useState<number>(-1);
    const TIERS = [
        {label: "S", color: "#087F23", minWR: 65},
        {label: "A", color: "#A8E6A3", minWR: 55},
        {label: "C", color: "#A0BFF0", minWR: 45},
        {label: "C", color: "#FF8A80", minWR: 35},
        {label: "D", color: "#D32F2F", minWR: 0},
        {label: "E", color: "#3d4345", minWR: -0.5},
    ];

    useEffect(() => {
        if (games.length > 0) {
            setWinrate(games.filter(game => game.result_win).length / games.length * 100);
        } else {
            setWinrate(-14);
        }
    }, [visible, date, games]);

    return (
        <Tooltip title={`${date.toDateString()} - ${games.length} games, ${winrate.toFixed(2)}% WR`}>
            <Box
                key={key}
                sx={{
                    bgcolor: TIERS.find((tier)=> tier.minWR<= winrate)?.color || "#3d4345",
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
