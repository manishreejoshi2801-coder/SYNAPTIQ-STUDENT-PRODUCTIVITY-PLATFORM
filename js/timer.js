import {
    $,
    set,
    today
} from "./storage.js";


/* =====================================================
   TIMER STATE
   ===================================================== */

let focusSeconds = 25 * 60;

let breakSeconds = 5 * 60;

let remaining = focusSeconds;

let mode = "focus";

let running = false;

let interval = null;


/* =====================================================
   FORMAT
   ===================================================== */

function formatTime(total){

    total =
        Math.max(
            0,
            total
        );


    const hours =
        String(
            Math.floor(
                total / 3600
            )
        ).padStart(
            2,
            "0"
        );


    const minutes =
        String(
            Math.floor(
                (total % 3600) / 60
            )
        ).padStart(
            2,
            "0"
        );


    const seconds =
        String(
            total % 60
        ).padStart(
            2,
            "0"
        );


    return `${hours}:${minutes}:${seconds}`;
}


/* =====================================================
   RENDER
   ===================================================== */

function renderTimer(){

    const value =
        formatTime(
            remaining
        );


    if(
        $("dashboardTimer")
    ){

        $("dashboardTimer")
            .textContent =
            value;

    }


    if(
        $("focusTimer")
    ){

        $("focusTimer")
            .textContent =
            value;

    }


    if(
        $("modeText")
    ){

        $("modeText")
            .textContent =
            mode === "focus"
                ? "FOCUS MODE"
                : "BREAK MODE";

    }


    if(
        $("focusStatus")
    ){

        $("focusStatus")
            .textContent =
            mode === "focus"
                ? "Ready for your next sprint."
                : "Take a proper break.";

    }
}


/* =====================================================
   BUTTON TEXT
   ===================================================== */

function updateButtons(text){

    if(
        $("dashTimerStart")
    ){

        $("dashTimerStart")
            .textContent =
            text;

    }


    if(
        $("focusStart")
    ){

        $("focusStart")
            .textContent =
            text;

    }
}


/* =====================================================
   STOP
   ===================================================== */

function stopTimer(){

    if(interval){

        clearInterval(
            interval
        );

        interval = null;

    }


    running = false;
}


/* =====================================================
   SET FOCUS TIME
   ===================================================== */

function setFocusTime(
    hours,
    minutes
){

    hours =
        Number(hours) || 0;


    minutes =
        Number(minutes) || 0;


    hours =
        Math.max(
            0,
            Math.min(
                99,
                hours
            )
        );


    minutes =
        Math.max(
            0,
            Math.min(
                59,
                minutes
            )
        );


    const total =
        hours * 3600 +
        minutes * 60;


    if(
        total <= 0
    ){

        alert(
            "Please enter a valid time."
        );

        return false;
    }


    focusSeconds =
        total;


    remaining =
        total;


    mode =
        "focus";


    stopTimer();


    updateButtons(
        "Start"
    );


    renderTimer();


    localStorage.customFocusMinutes =
        Math.round(
            total / 60
        );


    return true;
}


/* =====================================================
   SET BREAK
   ===================================================== */

function setBreakTime(
    minutes
){

    minutes =
        Number(minutes) || 0;


    minutes =
        Math.max(
            0,
            Math.min(
                180,
                minutes
            )
        );


    breakSeconds =
        minutes * 60;


    alert(
        `Break time set to ${minutes} minute(s).`
    );
}


/* =====================================================
   SAVE SESSION
   ===================================================== */

function saveFocusSession(){

    const minutes =
        Math.ceil(
            focusSeconds / 60
        );


    localStorage.studyMinutes =
        +(
            localStorage.studyMinutes ||
            0
        ) +
        minutes;


    localStorage.todayMinutes =
        +(
            localStorage.todayMinutes ||
            0
        ) +
        minutes;


    localStorage.sprints =
        +(
            localStorage.sprints ||
            0
        ) +
        1;


    localStorage.xp =
        +(
            localStorage.xp ||
            0
        ) +
        25;


    const weekly =
        JSON.parse(
            localStorage.getItem(
                "weekly"
            ) || "{}"
        );


    weekly[today()] =
        (
            weekly[today()] ||
            0
        ) +
        minutes;


    set(
        "weekly",
        weekly
    );


    const previous =
        localStorage.lastStudy ||
        "";


    if(
        previous !== today()
    ){

        const yesterday =
            new Date();


        yesterday.setDate(
            yesterday.getDate() - 1
        );


        const yesterdayKey =
            yesterday
                .toISOString()
                .slice(
                    0,
                    10
                );


        localStorage.streak =
            previous === yesterdayKey
                ? +(
                    localStorage.streak ||
                    0
                ) + 1
                : 1;


        localStorage.lastStudy =
            today();
    }
}


/* =====================================================
   START / PAUSE
   ===================================================== */

function toggleTimer(){

    if(running){

        stopTimer();

        updateButtons(
            "Resume"
        );

        return;
    }


    running = true;


    updateButtons(
        "Pause"
    );


    interval =
        setInterval(
            () => {

                remaining--;


                renderTimer();


                if(
                    remaining <= 0
                ){

                    stopTimer();


                    if(
                        mode === "focus"
                    ){

                        saveFocusSession();


                        alert(
                            "🎉 Focus session completed!"
                        );


                        mode =
                            "break";


                        remaining =
                            breakSeconds;


                        updateButtons(
                            "Start Break"
                        );


                    }else{

                        alert(
                            "☕ Break completed!"
                        );


                        mode =
                            "focus";


                        remaining =
                            focusSeconds;


                        updateButtons(
                            "Start"
                        );

                    }


                    renderTimer();
                }

            },
            1000
        );
}


/* =====================================================
   RESET
   ===================================================== */

function resetTimer(){

    stopTimer();


    mode =
        "focus";


    remaining =
        focusSeconds;


    updateButtons(
        "Start"
    );


    renderTimer();
}


/* =====================================================
   DASHBOARD CUSTOM TIME
   ===================================================== */

function connectDashboardCustom(){

    const button =
        $("dashSetCustom");


    if(!button)
        return;


    button.onclick =
        event => {

            event.preventDefault();


            event.stopPropagation();


            const hours =
                $("dashCustomHours")
                    ?.value || 0;


            const minutes =
                $("dashCustomMinutes")
                    ?.value || 0;


            if(
                setFocusTime(
                    hours,
                    minutes
                )
            ){

                document
                    .querySelectorAll(
                        ".preset"
                    )
                    .forEach(
                        x =>
                            x.classList
                                .remove(
                                    "active"
                                )
                    );


                button.classList.add(
                    "active"
                );

            }

        };
}


/* =====================================================
   PRESETS
   ===================================================== */

function connectPresets(){

    document
        .querySelectorAll(
            ".preset[data-preset]"
        )
        .forEach(
            button => {

                button.onclick =
                    event => {

                        event.preventDefault();


                        const minutes =
                            Number(
                                button.dataset.preset
                            );


                        document
                            .querySelectorAll(
                                ".preset"
                            )
                            .forEach(
                                x =>
                                    x.classList
                                        .remove(
                                            "active"
                                        )
                            );


                        button.classList.add(
                            "active"
                        );


                        setFocusTime(
                            0,
                            minutes
                        );


                        if(
                            $("dashCustomHours")
                        ){

                            $("dashCustomHours")
                                .value =
                                0;


                            $("dashCustomMinutes")
                                .value =
                                minutes;

                        }

                    };

            }
        );
}


/* =====================================================
   FULL TIMER PAGE
   ===================================================== */

function connectFullTimer(){

    if(
        $("setFocusTime")
    ){

        $("setFocusTime").onclick =
            () => {

                setFocusTime(
                    $("focusHours")
                        .value,

                    $("focusMinutes")
                        .value
                );

            };

    }


    if(
        $("setBreakTime")
    ){

        $("setBreakTime").onclick =
            () => {

                setBreakTime(
                    $("breakLength")
                        .value
                );

            };

    }


    if(
        $("focusStart")
    ){

        $("focusStart").onclick =
            toggleTimer;

    }


    if(
        $("focusReset")
    ){

        $("focusReset").onclick =
            resetTimer;

    }
}


/* =====================================================
   DASHBOARD TIMER
   ===================================================== */

function connectDashboard(){

    if(
        $("dashTimerStart")
    ){

        $("dashTimerStart").onclick =
            toggleTimer;

    }


    if(
        $("dashTimerReset")
    ){

        $("dashTimerReset").onclick =
            resetTimer;

    }


    connectDashboardCustom();

    connectPresets();
}


/* =====================================================
   CUSTOM MODAL
   ===================================================== */

function connectCustomModal(){

    const form =
        $("timerForm");


    if(!form)
        return;


    form.onsubmit =
        event => {

            event.preventDefault();


            if(
                setFocusTime(
                    $("customHours")
                        .value,

                    $("customMinutes")
                        .value
                )
            ){

                $("timerModal")
                    .classList
                    .add(
                        "hidden"
                    );

            }

        };
}


/* =====================================================
   INIT
   ===================================================== */

export function initTimer(
    refresh = () => {}
){

    renderTimer();


    connectDashboard();


    connectFullTimer();


    connectCustomModal();


    const saved =
        Number(
            localStorage.customFocusMinutes
        );


    if(
        saved &&
        saved > 0
    ){

        focusSeconds =
            saved * 60;


        remaining =
            focusSeconds;


        if(
            $("dashCustomHours")
        ){

            $("dashCustomHours")
                .value =
                Math.floor(
                    saved / 60
                );


            $("dashCustomMinutes")
                .value =
                saved % 60;

        }


        renderTimer();

    }


    window.synaptiqTimerRefresh =
        refresh;

}