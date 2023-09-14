const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let countdown = 0; // 倒數計時器初始時間（秒）
let intervalId;
let penaltyTime = 0; // 懲罰加時時間（秒）

let penaltySeconds;
app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.emit('timerState', countdown);

    socket.on('startTimer', (initialTime) => { // 接受客戶端傳來的初始時間
        if (!intervalId) {
            countdown = initialTime; // 設定計時器初始時間
            intervalId = setInterval(() => {
                if (countdown > 0) {
                    countdown--;
                }
                if (countdown <= 0) {
                    clearInterval(intervalId);
                    intervalId = null;
                    countdown = 0;
                }
                // 考慮懲罰加時
                if (penaltyTime > 0) {
                    countdown += penaltyTime;
                    penaltyTime = 0; // 清除懲罰加時
                }
                // 傳送計時器狀態給所有連接的客戶端，包括剩餘時間
                io.emit('timerState', countdown);
            }, 1000);
        }
    });

    socket.on('resetTimer', () => {
        countdown = 0;
        // 傳送計時器狀態給所有連接的客戶端，包括剩餘時間
        io.emit('timerState', countdown);
    });

    
    socket.on('setPenalty', (penaltyMinutes) => {
        penaltySeconds = penaltyMinutes * 60;
    });

    socket.on('viewRemainingTime', () => {

        countdown += penaltySeconds; // 累積懲罰加時
    });

    
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
