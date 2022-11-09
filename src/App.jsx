import React, { useEffect, useState, useRef } from "react";
import * as config from './config';
import { Icon } from "@iconify/react";
import playCircleFill from "@iconify-icons/bi/play-circle-fill";
import pauseOutlineFilled from "@iconify-icons/carbon/pause-outline-filled";
import caretLeftSquareFill from "@iconify-icons/bi/caret-left-square-fill";

const App = () => {
    const [songs, setSongs] = useState([]);
    const [currentsong, setCurrentsong] = useState(1);
    const [playbtn, setPlaybtn] = useState("on");
    const track = useRef();

    useEffect(() => {
        getSongs(config.URL_SONGS)
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
            .then((response) => {
                console.log(response);
                setSongs(response);
            }).catch(e => {
                console.log(e);
            });
    }

    function select(id) {
        setCurrentsong(id);
        iniciarAudio(id);
        setPlaybtn("off");
    }

    function moverSeleccion(direccion) {
        let id = currentsong + direccion;
        switch (id) {
            case 0:
                id = 20;
                break;
            case 21:
                id = 1;
                break;
        }
        setCurrentsong(id);
        track.current.src = obtenerUrl(id);
        if (playbtn == "off") {
            iniciarAudio(id);
        }
    }

    function iniciarAudio(id) {
        let result = songs.filter(song => song.id == id);
        track.current.src = obtenerUrl(id);
        track.current.play();
    }

    function obtenerUrl(id) {
        let result = songs.filter(song => song.id == id);
        return "https://assets.breatheco.de/apis/sound/" + result[0].url;
    }

    function play() {
        track.current.play();
        setPlaybtn("off");
    }

    function pause() {
        track.current.pause();
        setPlaybtn("on");
    }

    return (
        <div className="playlist">
            <audio src="https://assets.breatheco.de/apis/sound/files/mario/songs/castle.mp3" ref={track} />
            <ol className="list-group list-group-numbered" >
                {songs.map((element, index) => {
                    return (
                        <li className={"list-group-item d-flex justify-content-between align-items-start" + (currentsong == element.id ? "bg-secondary" : "bg-dark")} key={index} onClick={() => select(element.id)}>
                            <div className="ms-3 me-auto">
                                <div className="fw-bold">{element.name}</div>
                                {element.category}
                            </div>
                        </li>
                    );
                })}
            </ol>
            <div className="footer col-12 m-0 d-flex justify-content-center fixed-bottom">
                <div className="col-6 d-flex">
                    <div className="col-4 m-0 p-0 d-flex justify-content-center align-items-center" onClick={() => { moverSeleccion(-1); }}>
                        <Icon icon={caretLeftSquareFill} color="white" height="40" />
                    </div>
                    <div className="col-4 m-0 p-0 d-flex justify-content-center align-items-center">
                        <div className={playbtn == "on" ? "d-block" : "d-none"} onClick={play}>
                            <Icon icon={playCircleFill} color="white" height="48" />
                        </div>
                        <div className={playbtn == "off" ? "d-block" : "d-none"} onClick={pause}>
                            <Icon icon={pauseOutlineFilled} color="white" height="55" />
                        </div>
                    </div>
                    <div className="col-4 m-0 p-0 d-flex justify-content-center align-items-center" onClick={() => { moverSeleccion(1); }}>
                        <Icon icon={caretLeftSquareFill} color="white" height="40" flip="horizontal" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;