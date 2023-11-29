import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    transports: ['websocket'],
    cors: {
        origin: "http://localhost:3000/",
    }
})
export default function TestWebSocket() {


    const [data, setData] = useState("")
    useEffect(() => {
        // no-op if the socket is already connected
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        function onGraphData(data) {
            setData(data);
        }

        socket.on('graphdata', onGraphData);

        return () => {
            socket.off('graphdata', onGraphData);
        };
    }, [data]);

    useEffect(() => {
        const interval = setInterval(() => socket.emit("needattackdatadate","test"), 5000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div>{JSON.stringify(data)}</div>
    )
}