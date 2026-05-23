// "use client";

// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export const getSocket = (): Socket => {
//   if (!socket) {
//     socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
//       withCredentials: true,
//       transports: ["websocket"], // 🔥 best practice
//     });
//   }
//   return socket;
// };

// "use client";

// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export const getSocket = (): Socket => {
//   if (!socket) {
//     socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
//       withCredentials: true,
//         transports: ["polling", "websocket"],
//     });
//   }
//   return socket;
// };

"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {

  if (!socket) {

    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      "http://localhost:8000";

    console.log(
      "SOCKET URL:",
      SOCKET_URL
    );

    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log(
        "🔌 Socket connected:",
        socket?.id
      );
    });

    socket.on("connect_error", (err) => {
      console.log(
        "❌ Socket error:",
        err.message
      );
    });

  }

  return socket;
};