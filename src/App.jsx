import React, { useEffect, useState, useRef } from "react";
import Loading from "./components/Loading"
import { Icon } from "@iconify/react";
import playCircleFill from "@iconify-icons/bi/play-circle-fill";
import pauseOutlineFilled from "@iconify-icons/carbon/pause-outline-filled";
import caretLeftSquareFill from "@iconify-icons/bi/caret-left-square-fill";
import volumeDownFilledAlt from '@iconify/icons-carbon/volume-down-filled-alt';
import volumeUpFilledAlt from '@iconify/icons-carbon/volume-up-filled-alt';

const App = () => {
    const [songs, setSongs] = useState([]);
    const [currentsong, setCurrentsong] = useState(null);
    const [playbtn, setPlaybtn] = useState("on");
    const track = useRef();
    const URL_API = "https://assets.breatheco.de/apis/sound/"
    const URL_SONGS = URL_API + "songs"

    useEffect(() => {
        getSongs(URL_SONGS)
        return () => { }
    }, []);

    const getSongs = (url, options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }) => {

        fetch(url, options)
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setSongs(data);
            }).catch(e => {
                console.log(e);
            });
    }

    function play() {
        track.current.play();
        setPlaybtn("off");
    }

    function pause() {
        track.current.pause();
        setPlaybtn("on");
    }

    const next = () => {
        if (currentsong !== songs.length - 1) {
            track.current.src = URL_API + songs[currentsong + 1].url
            setCurrentsong(currentsong + 1);
            play();
        } else if (currentsong === songs.length - 1) {
            setCurrentsong(0)
            track.current.src = URL_API + songs[0].url
            play();
        }
    };
    const prev = () => {
        if (currentsong !== 0) {
            track.current.src = URL_API + songs[currentsong - 1].url
            setCurrentsong(currentsong - 1);
            play();
        } else if (currentsong === 0) {
            track.current.src = URL_API + songs[songs.length - 1].url
            setCurrentsong(songs.length - 1);
            play();
        }
    };

    const volUp = () => {
        track.current.volume += 0.1;
    };
    const volDown = () => {
        track.current.volume -= 0.1;
    };

    const select = (url, index) => {
        setCurrentsong(index);
        track.current.src = URL_API + url;
        play()
    }

    console.log("Current song index:", currentsong);

    const listItems = songs.map((playlist, index) =>
        <li className="list-group-item list-group-item-action action d-flex justify-content-between align-items-start" key={index} onClick={() => select(playlist.url, index)}>
            <div className="ms-3 me-auto">
                <div className="fw-bold">{playlist.name}</div>
                {playlist.category ? playlist.category : "unknown"}
            </div>
        </li>);

    return (
        <div className="playlist">
            <audio src="https://assets.breatheco.de/apis/sound/files/mario/songs/castle.mp3" ref={track} />
            <ol className="list-group list-group-numbered" >
                {!!songs && songs.length > 0 ? listItems : (
                    <div className="col-md-12 text-center list-group-item list-group-item-action">
                        <Loading />
                    </div>
                )}
            </ol>
            <div className="footer col-12 m-0 d-flex justify-content-center fixed-bottom">
                <div className="col-2 m-0 p-0 d-flex justify-content-center align-items-center" onClick={volDown}>
                    <Icon icon={volumeDownFilledAlt} color="white" height="40"/>
                </div>
                <div className="col-8 d-flex justify-content-center align-items-center">
                    <div className="col-2 m-0 p-0 d-flex justify-content-center align-items-center" onClick={prev}>
                        <Icon icon={caretLeftSquareFill} color="white" height="40" />
                    </div>
                    <div className="col-2 m-0 p-0 d-flex justify-content-center align-items-center">
                        <div className={playbtn == "on" ? "d-block" : "d-none"} onClick={play}>
                            <Icon icon={playCircleFill} color="white" height="48" />
                        </div>
                        <div className={playbtn == "off" ? "d-block" : "d-none"} onClick={pause}>
                            <Icon icon={pauseOutlineFilled} color="white" height="55" />
                        </div>
                    </div>
                    <div className="col-2 m-0 p-0 d-flex justify-content-center align-items-center" onClick={next}>
                        <Icon icon={caretLeftSquareFill} color="white" height="40" flip="horizontal" />
                    </div>
                </div>
                <div className="col-2 m-0 p-0 d-flex justify-content-center align-items-center" onClick={volUp}>
                    <Icon icon={volumeUpFilledAlt} color="white" height="40"/>
                </div>
            </div>
        </div>
    )
}

export default App;