/* TIMER LOGIC */

/* GLOBAL VARIABLES */
let myTimer = null;
let minutes, seconds;
let f_minutes = 25, f_seconds = 0;
let s_minutes = 5, s_seconds = 0;
let l_minutes = 10, l_seconds = 0;
let currentPhase = "work";
let session = 1;
let longBreakInterval = 2;
let currentSettings = "timer";
let phaseTimes = { work: [f_minutes, f_seconds], shortBreak: [s_minutes, s_seconds], longBreak: [l_minutes, l_seconds] };
let autoStartBreaks = false, autoStartPomodoro = false;
setTimeFromPhase();
showTime();

/* --------------------TIMER LOGIC FUNCTIONS------------------- */

/** Comienzo del temporizador */
function startTimer() {
    showTime();
    if(myTimer === null) {
        toggleVisibility("pause-btn", "start-btn");
        timer();
        myTimer = setInterval(timer, 1000);
    }
}

// Maneja el temporizador en marcha: 
// Resta segundos, minutos, y maneja lo que pasa cuando termina.
function timer() {
    showTime();
    if(seconds > 0) {
        seconds--;
    } else if(minutes > 0) {
        minutes--;
        seconds = 59;
    } else {
        clearInterval(myTimer);
        toggleVisibility("start-btn", "pause-btn");
        changePhase();
    }
}

function checkTime(i) {
    if(i < 10) {
        i = "0" + i;
    }
    return i;
}

function pauseTimer() {
    toggleVisibility("start-btn", "pause-btn");
    if(myTimer !== null) {
        clearInterval(myTimer);
        myTimer = null;
    }   
}

function restartTimer() {
    pauseTimer();
    setTimeFromPhase();
    showTime();
}

function changePhase() {
    if(currentPhase === "work") {
        if(session < longBreakInterval) {
            session++;
            currentPhase = "shortBreak";
        } else {
            session = 0;
            currentPhase = "longBreak";
        }
    } else if(currentPhase === "shortBreak") {
        currentPhase = "work";
    } else {
        currentPhase = "work";
    }
    // Paramos ejecución de setInterval
    clearInterval(myTimer);
    myTimer = null;
    // Establecemos el tiempo de la fase.
    setTimeFromPhase();
    updatePhaseStyle();
    showTime();
    checkAutoStart();
}

// Muestra el tiempo
function showTime() {
    document.getElementById("time-display").innerHTML = checkTime(minutes) + ":" + checkTime(seconds);
}

// Cambia la visibilidad de los botones (pausa/inicio) del temporizador
function toggleVisibility(idToShow, idToHide) {
    document.getElementById(idToShow).style.display="inline";
    document.getElementById(idToHide).style.display="none";
}

// Establece el tiempo del temporizador según la fase en la que estemos 
function setTimeFromPhase() {
    [minutes, seconds] = phaseTimes[currentPhase];
}

/** Cambio visual de fase */
function updatePhaseStyle() {
    const buttons = ["focus-btn", "short-break-btn", "long-break-btn"];
    buttons.forEach(id => {
        document.getElementById(id).classList.remove("active-phase");
        document.getElementById(id).classList.add("inactive-phase");
    });

    // Activar solo el que corresponde según currentPhase
    if (currentPhase === "work") {
        document.getElementById("focus-btn").classList.remove("inactive-phase");
        document.getElementById("focus-btn").classList.add("active-phase");
    } else if (currentPhase === "shortBreak") {
        document.getElementById("short-break-btn").classList.remove("inactive-phase");
        document.getElementById("short-break-btn").classList.add("active-phase");
    } else if (currentPhase === "longBreak") {
        document.getElementById("long-break-btn").classList.remove("inactive-phase");
        document.getElementById("long-break-btn").classList.add("active-phase");
    }
}



function focusMode(id) {
    switch(id) {
        case "focus-btn":
            currentPhase = "work";
            break;
        case "short-break-btn":
            currentPhase = "shortBreak";
            break;
        case "long-break-btn":
            currentPhase = "longBreak";
            break;
    }
    setTimeFromPhase();
    updatePhaseStyle();
    showTime();
}




function updatePhaseTimes(unit, value) {
    if (unit === "minutes") {
        phaseTimes[currentPhase][0] = parseInt(value);
        minutes = parseInt(value);
    } else if (unit === "seconds") {
        phaseTimes[currentPhase][1] = parseInt(value);
        seconds = parseInt(value);
    }
}

function configTimer() {
    // Mostramos el módulo de configuración
    document.getElementById("config-overlay").classList.remove("hidden");
    document.getElementById("config-display").classList.remove("hidden");
    document.getElementById("timer-settings-btn").classList.add("selected");
    document.querySelector(".config-overlay").addEventListener("click", () => {
        document.getElementById("config-display").classList.add("hidden");
        document.getElementById("config-overlay").classList.add("hidden");
    })
    
    // Salimos del modo de configuración si pulsamos 'ESC'
    document.addEventListener("keydown", escClose);
    
    // Damos los valores a los inputs del timer
    document.getElementById("input-pomodoro").value = checkTime(f_minutes);
    document.getElementById("input-short-break").value = checkTime(s_minutes);
    document.getElementById("input-long-break").value = checkTime(l_minutes);
    
    // Manejamos la lógica de los switches de: "Auto Start Breaks" y "Auto Start Pomodoro"
    const switchBreaks = document.getElementById("auto-breaks");
    switchBreaks.checked = autoStartBreaks;
    switchBreaks.addEventListener("change", () => {
        autoStartBreaks = switchBreaks.checked;
    });

    const switchPomodoro = document.getElementById("auto-pomodoro");
    switchPomodoro.checked = autoStartPomodoro;
    switchPomodoro.addEventListener("change", () => {
        autoStartPomodoro = switchPomodoro.checked;
    })

    // Manejamos la lógica del input "Long Break Interval"
    const longIntervalInput = document.getElementById("long-interval");
    longIntervalInput.value = longBreakInterval;
    longIntervalInput.addEventListener("keydown", (event) => {
        if(event.key === "Enter") {
            const newLongBreakInterval = parseInt(longIntervalInput.value);
            if(newLongBreakInterval > 0) {
                longBreakInterval = newLongBreakInterval;
            }
        }
    });
}


function escClose(event) {
    if (event.key === "Escape") {
        document.getElementById("config-display").classList.add("hidden");
        document.getElementById("config-overlay").classList.add("hidden");

        // 💡 Muy importante: quita el listener después de cerrar
        document.removeEventListener("keydown", escClose);
    }
}

function selectedSettings(button) {
    // Seleccionamos la configuración que deseamos ver
    document.getElementById(button).classList.add("selected"); // Ahora el botón destaca
    document.getElementById(currentSettings + "-settings-btn").classList.remove("selected"); // Le quitamos la selección al que estaba destacado
    document.getElementById(currentSettings + "-settings").classList.add("hidden");

    switch(button) {
        case "timer-settings-btn":
            document.getElementById("timer-settings").classList.remove("hidden");
            currentSettings = "timer";
            break;
        case "sounds-settings-btn":
            document.getElementById("sounds-settings").classList.remove("hidden");
            currentSettings = "sounds";
            break;
        case "background-settings-btn":
            document.getElementById("background-settings").classList.remove("hidden");
            currentSettings = "background";
            break;
    }
}

function changeTime() {
    let newFocusMinutes = parseInt(document.getElementById("input-pomodoro").value);
    let newShortBreakMinutes = parseInt(document.getElementById("input-short-break").value);
    let newLongBreakMinutes = parseInt(document.getElementById("input-long-break").value);

    if(newFocusMinutes !== f_minutes && newFocusMinutes > 0) {
        f_minutes = newFocusMinutes;
    }
    if(newShortBreakMinutes !== s_minutes && newShortBreakMinutes > 0) {
        s_minutes = newShortBreakMinutes;
    }
    
    if(newLongBreakMinutes !== l_minutes && newLongBreakMinutes > 0) {
        l_minutes = newLongBreakMinutes;
    }

    phaseTimes = { work: [f_minutes, f_seconds], shortBreak: [s_minutes, s_seconds], longBreak: [l_minutes, l_seconds] };
    setTimeFromPhase();
    showTime();
}


function checkAutoStart() {
    // Si estamos en fase Pomodoro
    if(currentPhase === "focus") {
        if(session > 1 && autoStartPomodoro === true) {
            startTimer();
        }
    }
    else if(autoStartBreaks === true) {
        startTimer();
    }
}

document.getElementById("start-btn").addEventListener("click", startTimer);
document.getElementById("pause-btn").addEventListener("click", pauseTimer);
document.getElementById("restart-btn").addEventListener("click", restartTimer);

document.getElementById("focus-btn").addEventListener("click", () => focusMode("focus-btn"));
document.getElementById("short-break-btn").addEventListener("click", () => focusMode("short-break-btn"));
document.getElementById("long-break-btn").addEventListener("click", () => focusMode("long-break-btn"));


document.getElementById("config-timer-btn").addEventListener("click", configTimer);
document.getElementById("timer-settings-btn").addEventListener("click", () => selectedSettings("timer-settings-btn"));
document.getElementById("sounds-settings-btn").addEventListener("click", () => selectedSettings("sounds-settings-btn"));
document.getElementById("background-settings-btn").addEventListener("click", () => selectedSettings("background-settings-btn"));

document.getElementById("save-timer-settings").addEventListener("click", changeTime);




/* Anotaciones para entender el temporizador
    - setInterval(function, 1000 milisegundos) --> ejecuta la función cada 1 segundo
    - clearInterval --> detiene la ejecución de setInterval (si no, sería infinito)
*/