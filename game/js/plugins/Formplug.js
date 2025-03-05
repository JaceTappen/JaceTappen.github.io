/*:
 * @target MZ
 * @plugindesc Allows users to give a thumbs up, down or wiggle to Formbar and interact with Formbar API via socket.io-client.
 * @author Bryce Lynd
 * 
 * @command thumbsUp
 * @text Thumbs Up
 * @desc Sends a ThumbsUp
 * 
 * @command thumbsDown
 * @text Thumbs Down
 * @desc Sends a ThumbsDown
 * 
 * @command wiggle
 * @text Wiggle
 * @desc Sends a Wiggle
 * 
 * @command opps
 * @text Opps
 * @desc Removes the user's vote
 * 
 * @help
 * This plugin allows users to give a thumbs up, down or wiggle to Formbar.
 * 
 * Plugin Commands:
 *  Formplug thumbsUp
 *  Formplug thumbsDown
 *  Formplug wiggle
 *  Formplug opps
 * 
 */

(() => {
    const FORMBAR_URL = 'https://formbeta.yorktechapps.com/';
    const API_KEY = 'e2664096cc4d0f75aab760c307de32bf349a0e31d611705c7cf90b7853fc7a2197b0c4c4c3072b67b4cc0495f5fdab0e7531f660ff57c1f24a3d4292989a76c9'
    if (typeof io === "undefined") {
        let script = document.createElement("script");
        script.src = "https://cdn.socket.io/4.7.2/socket.io.min.js";
        script.onload = function () {
            console.log("Socket.IO loaded!");
            startSocketConnection(); // Call function to initialize socket after loading
        };
        document.head.appendChild(script);
    } else {
        startSocketConnection();
    }

    function startSocketConnection() {
        const socket = io(FORMBAR_URL, {
            extraHeaders: {
                api: API_KEY
            }
        }); // Replace with your server URL

        socket.on('connect', () => {
            console.log('Connected');
            socket.emit('getActiveClass');
        });

        socket.on('setClass', (classId) => {
            console.log(`The user is currently in the class with id ${classId}`);
        });

        socket.on('connect_error', (error) => {
            if (error.message == 'xhr poll error') {
                console.log('no connection');
            } else {
                console.log(error.message);
            }

            setTimeout(() => {
                socket.connect();
            }, 5000);
        });

        let classId = 0;
        socket.on('setClass', (userClass) => {
            classId = userClass;
        });

        socket.on('classEnded', () => {
            socket.emit('leave', classId);
            classId = '';
            socket.emit('getUserClass', { api: API_KEY });
        });

        socket.on('joinRoom', (classCode) => {
            if (classCode) {
                socket.emit('vbUpdate');
            }
        });

        socket.on('vbUpdate', (data) => {
            console.log(data);
        });

        PluginManager.registerCommand("Formplug", "thumbsUp", () => {
            console.log("ur mum");
            
            socket.emit("pollResp", "Up")
        });
        PluginManager.registerCommand("Formplug", "thumbsDown", () => {
            console.log("stink = you");
            

            socket.emit('pollResp', "Down");
        });
        PluginManager.registerCommand("Formplug", "wiggle", () => {
            console.log("not sure");
            
            socket.emit('pollResp', 'Wiggle');
        });
        PluginManager.registerCommand("Formplug", "opps", () => {
            console.log("made mistake");
            
            socket.emit('help','I gotta go potty');
        });
    }

})();