import {
    get,
    set,
    $
} from "./storage.js";


/* =========================================================
   DASHBOARD STATE
   ========================================================= */

let lastDashboardUpdate = 0;


/* =========================================================
   CALENDAR STATE
   ========================================================= */

let dashboardCalendarDate = new Date();
let dashboardCalendarSelected = new Date();


/* =========================================================
   SAFE NUMBER
   ========================================================= */

function num(value, fallback = 0){

    const n = Number(value);

    return Number.isFinite(n)
        ? n
        : fallback;
}


/* =========================================================
   SAFE ARRAY
   ========================================================= */

function arr(key){

    const value = get(key, []);

    return Array.isArray(value)
        ? value
        : [];
}


/* =========================================================
   TODAY KEY
   ========================================================= */

function todayKey(date = new Date()){

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");
}


/* =========================================================
   DATE FROM VALUE
   ========================================================= */

function dateValue(value){

    if(!value)
        return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? null
        : date;
}


/* =========================================================
   FIND SESSION DATE
   ========================================================= */

function sessionDate(session){

    return (
        session.date ||
        session.day ||
        session.createdAt ||
        session.completedAt ||
        session.startedAt ||
        null
    );
}


/* =========================================================
   FIND SESSION MINUTES
   ========================================================= */

function sessionMinutes(session){

    return num(
        session.minutes ??
        session.durationMinutes ??
        session.duration ??
        session.studyMinutes ??
        session.time ??
        0
    );
}


/* =========================================================
   STUDY SESSIONS
   ========================================================= */

function getStudySessions(){

    const possibleKeys = [
        "studySessions",
        "sessions",
        "focusSessions",
        "studyLog"
    ];

    for(const key of possibleKeys){

        const data = arr(key);

        if(data.length)
            return data;

    }

    return [];
}


/* =========================================================
   TOTAL STUDY MINUTES
   ========================================================= */

function totalStudyMinutes(){

    return getStudySessions().reduce(
        (total, session) =>
            total + sessionMinutes(session),
        0
    );
}


/* =========================================================
   TODAY STUDY MINUTES
   ========================================================= */

function todayStudyMinutes(){

    const today = todayKey();

    return getStudySessions().reduce(
        (total, session) => {

            const date =
                dateValue(
                    sessionDate(session)
                );

            if(
                !date ||
                todayKey(date) !== today
            ){

                return total;

            }

            return total + sessionMinutes(session);

        },
        0
    );
}


/* =========================================================
   WEEKLY STUDY DATA
   ========================================================= */

function getWeeklyStudy(){

    const result = [
        { label:"M", minutes:0 },
        { label:"T", minutes:0 },
        { label:"W", minutes:0 },
        { label:"T", minutes:0 },
        { label:"F", minutes:0 },
        { label:"S", minutes:0 },
        { label:"S", minutes:0 }
    ];

    const today = new Date();

    const currentDay = today.getDay();

    const mondayOffset =
        currentDay === 0
            ? -6
            : 1 - currentDay;

    const monday = new Date(today);

    monday.setHours(
        0,
        0,
        0,
        0
    );

    monday.setDate(
        today.getDate() + mondayOffset
    );

    getStudySessions().forEach(
        session => {

            const date =
                dateValue(
                    sessionDate(session)
                );

            if(!date)
                return;

            date.setHours(
                0,
                0,
                0,
                0
            );

            const diff =
                Math.round(
                    (date - monday) /
                    86400000
                );

            if(
                diff < 0 ||
                diff > 6
            ){

                return;

            }

            result[diff].minutes +=
                sessionMinutes(session);

        }
    );

    return result;
}


/* =========================================================
   FORMAT MINUTES
   ========================================================= */

function formatMinutes(minutes){

    minutes =
        Math.max(
            0,
            Math.round(
                num(minutes)
            )
        );

    if(minutes < 60){

        return `${minutes} min`;

    }

    const hours =
        Math.floor(
            minutes / 60
        );

    const mins =
        minutes % 60;

    return mins
        ? `${hours}h ${mins}m`
        : `${hours}h`;
}


/* =========================================================
   TASKS
   ========================================================= */

function getTasks(){

    return arr("tasks");

}


function taskStats(){

    const tasks =
        getTasks();

    if(!tasks.length){

        return {
            total:0,
            completed:0,
            percent:0
        };

    }

    const completed =
        tasks.filter(
            task =>
                task.done === true ||
                task.completed === true ||
                task.status === "done"
        ).length;

    return {

        total:
            tasks.length,

        completed,

        percent:
            Math.round(
                (
                    completed /
                    tasks.length
                ) * 100
            )

    };
}


/* =========================================================
   QUESTIONS
   ========================================================= */

function questionCount(){

    return arr(
        "questions"
    ).length;

}


/* =========================================================
   SUBJECTS
   ========================================================= */

function getSubjects(){

    return arr(
        "subjects"
    );

}


/* =========================================================
   XP
   ========================================================= */

function getXP(){

    const direct =
        get(
            "xp",
            null
        );

    if(
        typeof direct ===
        "number"
    ){

        return direct;

    }

    const stats =
        get(
            "stats",
            {}
        );

    if(
        typeof stats?.xp ===
        "number"
    ){

        return stats.xp;

    }

    const profile =
        get(
            "profile",
            {}
        );

    if(
        typeof profile?.xp ===
        "number"
    ){

        return profile.xp;

    }

    return 0;
}


/* =========================================================
   STREAK
   ========================================================= */

function getStreak(){

    const direct =
        get(
            "streak",
            null
        );

    if(
        typeof direct ===
        "number"
    ){

        return direct;

    }

    const stats =
        get(
            "stats",
            {}
        );

    return num(
        stats?.streak,
        0
    );
}


/* =========================================================
   DAILY GOAL
   ========================================================= */

function getDailyGoal(){

    const direct =
        get(
            "dailyGoal",
            null
        );

    if(
        typeof direct ===
        "number"
    ){

        return direct;

    }

    const goal =
        get(
            "goal",
            null
        );

    if(
        typeof goal ===
        "number"
    ){

        return goal;

    }

    if(
        goal &&
        typeof goal.minutes ===
        "number"
    ){

        return goal.minutes;

    }

    const stats =
        get(
            "stats",
            {}
        );

    return num(
        stats?.dailyGoal,
        120
    ) || 120;
}


/* =========================================================
   TEST STATS
   ========================================================= */

function getTestStats(){

    const tests =
        arr("tests");

    if(!tests.length){

        return {
            total:0,
            accuracy:0
        };

    }

    let correct = 0;
    let attempts = 0;

    tests.forEach(
        test => {

            if(
                Array.isArray(
                    test.answers
                )
            ){

                test.answers.forEach(
                    answer => {

                        attempts++;

                        if(
                            answer.correct === true ||
                            answer.isCorrect === true
                        ){

                            correct++;

                        }

                    }
                );

            }

            if(
                typeof test.correct ===
                "number"
            ){

                correct +=
                    test.correct;

            }

            if(
                typeof test.total ===
                "number"
            ){

                attempts +=
                    test.total;

            }

        }
    );

    return {

        total:
            tests.length,

        accuracy:
            attempts
                ? Math.round(
                    (
                        correct /
                        attempts
                    ) * 100
                )
                : 0

    };
}


/* =========================================================
   READINESS
   ========================================================= */

function calculateReadiness(){

    const questions =
        questionCount();

    const subjects =
        getSubjects().length;

    const tasks =
        taskStats();

    const tests =
        getTestStats();

    let score = 0;

    if(subjects > 0)
        score += 25;

    if(questions > 0)
        score += 25;

    if(tasks.total > 0)
        score +=
            Math.round(
                tasks.percent * .20
            );

    if(tests.total > 0)
        score +=
            Math.round(
                tests.accuracy * .30
            );

    return Math.min(
        100,
        Math.max(
            0,
            score
        )
    );
}


/* =========================================================
   PRODUCTIVITY
   ========================================================= */

function calculateProductivity(){

    const goal =
        getDailyGoal();

    const today =
        todayStudyMinutes();

    const tasks =
        taskStats();

    const studyScore =
        goal
            ? Math.min(
                70,
                Math.round(
                    (
                        today /
                        goal
                    ) * 70
                )
            )
            : 0;

    const taskScore =
        Math.round(
            tasks.percent * .30
        );

    return Math.min(
        100,
        studyScore +
        taskScore
    );
}


/* =========================================================
   SET TEXT
   ========================================================= */

function text(
    selector,
    value
){

    const element =
        $(selector);

    if(element){

        element.textContent =
            value;

    }
}


/* =========================================================
   SET WIDTH
   ========================================================= */

function width(
    selector,
    percent
){

    const element =
        $(selector);

    if(element){

        element.style.width =
            `${Math.max(
                0,
                Math.min(
                    100,
                    percent
                )
            )}%`;

    }
}


/* =========================================================
   LEVEL
   ========================================================= */

function renderLevel(){

    const xp =
        getXP();

    const level =
        Math.floor(
            xp / 100
        ) + 1;

    const currentXP =
        xp % 100;

    text(
        "levelName",
        `Level ${level} • ${
            level <= 1
                ? "Beginner"
                : level <= 3
                    ? "Focused Learner"
                    : level <= 5
                        ? "Consistent Learner"
                        : "Study Master"
        }`
    );

    text(
        "levelXP",
        `${currentXP} / 100 XP`
    );

    width(
        "xpBar",
        currentXP
    );

    text(
        "dashXP",
        xp
    );

    text(
        "rewardXP",
        xp
    );
}


/* =========================================================
   GOAL
   ========================================================= */

function renderGoal(){

    const goal =
        getDailyGoal();

    const today =
        todayStudyMinutes();

    const percent =
        goal
            ? Math.min(
                100,
                Math.round(
                    (
                        today /
                        goal
                    ) * 100
                )
            )
            : 0;

    text(
        "goalText",
        `${Math.round(today)} / ${Math.round(goal)} minutes`
    );

    text(
        "goalPercent",
        `${percent}%`
    );

    const circle =
        $("goalCircle");

    if(circle){

        circle.style.background =
            `conic-gradient(
                var(--primary) ${percent}%,
                #dce7f4 ${percent}%
            )`;

    }
}


/* =========================================================
   STREAK
   ========================================================= */

function renderStreak(){

    const streak =
        getStreak();

    text(
        "streak",
        streak
    );

    text(
        "rewardStreak",
        streak
    );
}


/* =========================================================
   BASIC STATS
   ========================================================= */

function renderBasicStats(){

    const study =
        totalStudyMinutes();

    const today =
        todayStudyMinutes();

    const questions =
        questionCount();

    const readiness =
        calculateReadiness();

    const productivity =
        calculateProductivity();

    text(
        "dashStudy",
        formatMinutes(study)
    );

    text(
        "dashQuestions",
        questions
    );

    text(
        "dashReady",
        `${readiness}%`
    );

    text(
        "productivity",
        productivity
    );

    text(
        "analyticsReadiness",
        `${readiness}%`
    );

    text(
        "analyticsQuestions",
        questions
    );

    return {
        study,
        today,
        questions,
        readiness,
        productivity
    };
}


/* =========================================================
   WEEKLY CHART
   ========================================================= */

function renderWeeklyChart(){

    const container =
        $("weeklyChart");

    if(!container)
        return;

    const data =
        getWeeklyStudy();

    const max =
        Math.max(
            30,
            ...data.map(
                item =>
                    item.minutes
            )
        );

    container.innerHTML =
        data
            .map(
                item => {

                    const percent =
                        item.minutes > 0
                            ? Math.max(
                                5,
                                Math.round(
                                    (
                                        item.minutes /
                                        max
                                    ) * 100
                                )
                            )
                            : 3;

                    return `

                        <div
                            class="bar-day"
                            title="${item.minutes} minutes"
                        >

                            <div class="bar-wrap">

                                <div
                                    class="bar"
                                    style="
                                        height:${percent}%;
                                    "
                                ></div>

                            </div>

                            <strong>
                                ${item.minutes}
                            </strong>

                            <small>
                                ${item.label}
                            </small>

                        </div>

                    `;

                }
            )
            .join("");

    if(
        !data.some(
            item =>
                item.minutes > 0
        )
    ){

        const message =
            document.createElement(
                "div"
            );

        message.className =
            "chart-empty-message";

        message.textContent =
            "Start a focus session to build your study rhythm.";

        container.appendChild(
            message
        );

    }
}


/* =========================================================
   TASK PROGRESS
   ========================================================= */

function renderTaskProgress(){

    const stats =
        taskStats();

    text(
        "taskPercent",
        `${stats.percent}%`
    );

    text(
        "taskText",
        `${stats.completed} / ${stats.total} completed`
    );

    text(
        "analyticsTaskPercent",
        `${stats.percent}%`
    );

    text(
        "analyticsTaskText",
        `${stats.completed} / ${stats.total}`
    );

    const donut =
        $("taskDonut");

    if(donut){

        donut.style.background =
            `conic-gradient(
                var(--cyan) ${stats.percent}%,
                #dce7f4 ${stats.percent}%
            )`;

    }

    const analyticsDonut =
        $("analyticsDonut");

    if(analyticsDonut){

        analyticsDonut.style.background =
            `conic-gradient(
                var(--cyan) ${stats.percent}%,
                #dce7f4 ${stats.percent}%
            )`;

    }
}


/* =========================================================
   CHALLENGE
   ========================================================= */

function renderChallenge(){

    const sessions =
        getStudySessions();

    const today =
        todayKey();

    const count =
        sessions.filter(
            session => {

                const date =
                    dateValue(
                        sessionDate(
                            session
                        )
                    );

                return (
                    date &&
                    todayKey(date) === today
                );

            }
        ).length;

    const completed =
        Math.min(
            2,
            count
        );

    const percent =
        Math.round(
            (
                completed /
                2
            ) * 100
        );

    text(
        "challengeText",
        `${completed} / 2 completed`
    );

    width(
        "challengeBar",
        percent
    );
}


/* =========================================================
   SUBJECT PROGRESS
   ========================================================= */

function renderSubjectProgress(){

    const container =
        $("subjectProgress");

    const analyticsContainer =
        $("analyticsSubjects");

    const subjects =
        getSubjects();

    const targets = [];

    if(container)
        targets.push(container);

    if(
        analyticsContainer &&
        analyticsContainer !== container
    ){

        targets.push(
            analyticsContainer
        );

    }

    if(!targets.length)
        return;

    if(!subjects.length){

        const emptyHTML = `

            <div
                class="empty-dashboard-message"
            >

                Add your first subject to start
                tracking subject progress.

            </div>

        `;

        targets.forEach(
            target =>
                target.innerHTML =
                    emptyHTML
        );

        return;
    }

    const html =
        subjects
            .map(
                subject => {

                    const progress =
                        Math.max(
                            0,
                            Math.min(
                                100,
                                num(
                                    subject.progress,
                                    num(
                                        subject.percent,
                                        0
                                    )
                                )
                            )
                        );

                    return `

                        <div
                            class="subject-progress-row"
                        >

                            <div
                                class="subject-progress-head"
                            >

                                <span>
                                    ${
                                        subject.name ||
                                        "Subject"
                                    }
                                </span>

                                <b>
                                    ${progress}%
                                </b>

                            </div>

                            <div
                                class="subject-progress-track"
                            >

                                <div
                                    class="subject-progress-fill"
                                    style="width:${progress}%"
                                ></div>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

    targets.forEach(
        target =>
            target.innerHTML =
                html
    );
}


/* =========================================================
   TEST ANALYTICS
   ========================================================= */

function renderTestStats(){

    const tests =
        getTestStats();

    text(
        "analyticsTests",
        tests.total
    );

    text(
        "analyticsAccuracy",
        `${tests.accuracy}%`
    );
}


/* =========================================================
   ANALYTICS CHART
   ========================================================= */

function renderAnalyticsChart(){

    const source =
        getWeeklyStudy();

    const container =
        $("analyticsChart");

    if(!container)
        return;

    const max =
        Math.max(
            30,
            ...source.map(
                item =>
                    item.minutes
            )
        );

    container.innerHTML =
        source
            .map(
                item => {

                    const percent =
                        item.minutes > 0
                            ? Math.max(
                                5,
                                Math.round(
                                    (
                                        item.minutes /
                                        max
                                    ) * 100
                                )
                            )
                            : 3;

                    return `

                        <div
                            class="bar-day"
                            title="${item.minutes} minutes"
                        >

                            <div class="bar-wrap">

                                <div
                                    class="bar"
                                    style="
                                        height:${percent}%;
                                    "
                                ></div>

                            </div>

                            <strong>
                                ${item.minutes}
                            </strong>

                            <small>
                                ${item.label}
                            </small>

                        </div>

                    `;

                }
            )
            .join("");
}


/* =========================================================
   RECOMMENDATION
   ========================================================= */

function renderRecommendation(){

    const subjects =
        getSubjects();

    const questions =
        questionCount();

    const tasks =
        taskStats();

    let title =
        "Build your study space.";

    let message =
        "Add subjects and questions to personalize Synaptiq.";

    if(!subjects.length){

        title =
            "Start with your subjects.";

        message =
            "Add your subjects and chapters so Synaptiq can personalize your study recommendations.";

    }
    else if(!questions){

        title =
            "Build your Question Bank.";

        message =
            "Save important questions, doubts and PYQs for revision.";

    }
    else if(
        tasks.total === 0
    ){

        title =
            "Create your first task.";

        message =
            "Turn your study plan into manageable daily actions.";

    }
    else{

        title =
            "Keep your momentum going.";

        message =
            "Use a focus session and keep improving your weekly rhythm.";

    }

    text(
        "recommendTitle",
        title
    );

    text(
        "recommendText",
        message
    );
}


/* =========================================================
   PREMIUM CALENDAR HELPERS
   ========================================================= */

function calendarDateKey(date){

    return [
        date.getFullYear(),
        String(
            date.getMonth() + 1
        ).padStart(2, "0"),
        String(
            date.getDate()
        ).padStart(2, "0")
    ].join("-");
}


function calendarSameDay(
    first,
    second
){

    return (
        first.getFullYear() ===
        second.getFullYear() &&

        first.getMonth() ===
        second.getMonth() &&

        first.getDate() ===
        second.getDate()
    );
}


function escapeCalendarText(value){

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );
}


/* =========================================================
   FINAL CALENDAR STYLING
   ========================================================= */
function injectCalendarStyles(){

    /*
       IMPORTANT:
       Do NOT remove the existing calendar stylesheet.

       renderDashboard() refreshes the dashboard repeatedly.
       The old version removed and recreated this stylesheet,
       which caused the calendar styling to flicker and the
       dates to appear/disappear.

       This version creates the stylesheet only once.
    */

    if(
        document.getElementById(
            "synaptiqPremiumCalendarStyles"
        )
    ){

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "synaptiqPremiumCalendarStyles";


    style.textContent = `

        /* =================================================
           CALENDAR PANEL
           ================================================= */

        #dashboardCalendar{

            position:relative !important;

            isolation:isolate !important;

            overflow:hidden !important;

            margin-top:18px !important;

            padding:28px !important;

            border-radius:24px !important;

            border:
                1px solid
                #a8cfe7 !important;

            background:
                linear-gradient(
                    145deg,
                    #dff3ff 0%,
                    #cce9f8 52%,
                    #b9dcf0 100%
                ) !important;

            box-shadow:

                0 22px 45px
                rgba(46,100,137,.18),

                inset 0 1px 0
                rgba(255,255,255,.95),

                inset 0 -2px 0
                rgba(63,119,158,.12) !important;

            color:#12385a !important;

        }


        /* =================================================
           DECORATIVE LIGHT
           ================================================= */

        #dashboardCalendar::before{

            content:"";

            position:absolute;

            width:300px;

            height:300px;

            right:-125px;

            top:-155px;

            border-radius:50%;

            background:
                radial-gradient(
                    circle,
                    rgba(102,139,255,.18),
                    rgba(102,139,255,0) 70%
                );

            pointer-events:none;

        }


        #dashboardCalendar::after{

            content:"";

            position:absolute;

            width:230px;

            height:230px;

            left:-100px;

            bottom:-135px;

            border-radius:50%;

            background:
                radial-gradient(
                    circle,
                    rgba(53,208,217,.14),
                    rgba(53,208,217,0) 72%
                );

            pointer-events:none;

        }


        /* =================================================
           HEADER
           ================================================= */

        #dashboardCalendar
        .dashboard-calendar-head{

            position:relative !important;

            z-index:2 !important;

            display:flex !important;

            align-items:center !important;

            justify-content:space-between !important;

            gap:20px !important;

            margin-bottom:22px !important;

        }


        #dashboardCalendar
        .dashboard-calendar-head small{

            color:#3875bc !important;

            font-size:10px !important;

            font-weight:800 !important;

            letter-spacing:2px !important;

        }


        #dashboardCalendar
        .dashboard-calendar-head h2{

            margin:6px 0 0 !important;

            color:#12385a !important;

            font:
                700 28px
                "Manrope",
                sans-serif !important;

            text-shadow:
                0 2px 5px
                rgba(255,255,255,.75) !important;

        }


        /* =================================================
           NAVIGATION BUTTONS
           ================================================= */

        #dashboardCalendar
        .dashboard-calendar-controls{

            display:flex !important;

            gap:7px !important;

        }


        #dashboardCalendar
        .dashboard-calendar-controls button{

            min-width:42px !important;

            height:42px !important;

            padding:0 12px !important;

            border-radius:11px !important;

            border:
                1px solid
                #9dc9e4 !important;

            background:
                linear-gradient(
                    145deg,
                    #f7fdff,
                    #cceafa
                ) !important;

            color:#15476d !important;

            font-weight:700 !important;

            box-shadow:

                0 7px 15px
                rgba(48,104,143,.14),

                inset 0 1px 0
                rgba(255,255,255,.95) !important;

            cursor:pointer !important;

            transition:
                .18s ease !important;

        }


        #dashboardCalendar
        .dashboard-calendar-controls button:hover{

            transform:
                translateY(-2px) !important;

            border-color:
                #6da8da !important;

            background:
                linear-gradient(
                    145deg,
                    #ffffff,
                    #d5f0ff
                ) !important;

            box-shadow:

                0 12px 22px
                rgba(47,101,140,.20) !important;

        }


        /* =================================================
           GRID
           ================================================= */

        #dashboardCalendar
        .dashboard-calendar-grid{

            position:relative !important;

            z-index:2 !important;

            display:grid !important;

            grid-template-columns:
                repeat(
                    7,
                    minmax(0,1fr)
                ) !important;

            gap:9px !important;

            width:100% !important;

        }


        /* =================================================
           WEEKDAY NAMES
           ================================================= */

        #dashboardCalendar
        .dashboard-calendar-weekday{

            padding:
                8px 4px 10px !important;

            text-align:center !important;

            color:#4b728f !important;

            font-size:8px !important;

            font-weight:800 !important;

            letter-spacing:1.2px !important;

        }


        /* =================================================
           DATE CARDS
           ================================================= */

        #dashboardCalendar
        .dashboard-calendar-cell{

            position:relative !important;

            min-width:0 !important;

            min-height:82px !important;

            padding:10px !important;

            display:flex !important;

            flex-direction:column !important;

            align-items:flex-start !important;

            justify-content:flex-start !important;

            border:
                1px solid
                #a8cee4 !important;

            border-radius:14px !important;

            background:
                linear-gradient(
                    145deg,
                    #f8fdff 0%,
                    #dff2fc 55%,
                    #cfe9f7 100%
                ) !important;

            color:#194a70 !important;

            box-shadow:

                0 8px 17px
                rgba(49,105,143,.13),

                inset 0 1px 0
                rgba(255,255,255,.98),

                inset 0 -2px 0
                rgba(77,127,161,.10) !important;

            cursor:pointer !important;

            transition:
                transform .18s ease,
                border-color .18s ease,
                box-shadow .18s ease !important;

        }


        /* =================================================
           HOVER
           ================================================= */

        #dashboardCalendar
        .dashboard-calendar-cell:not(.empty):hover{

            transform:
                translateY(-4px)
                scale(1.01) !important;

            border-color:
                #6ba5d7 !important;

            background:
                linear-gradient(
                    145deg,
                    #ffffff,
                    #d4efff
                ) !important;

            box-shadow:

                0 16px 28px
                rgba(45,101,139,.18),

                0 0 18px
                rgba(94,175,231,.12),

                inset 0 1px 0
                rgba(255,255,255,.98) !important;

        }


        /* =================================================
           DATE NUMBER
           ================================================= */

        #dashboardCalendar
        .dashboard-calendar-number{

            width:30px !important;

            height:30px !important;

            display:flex !important;

            align-items:center !important;

            justify-content:center !important;

            visibility:visible !important;

            opacity:1 !important;

            border-radius:9px !important;

            background:
                linear-gradient(
                    145deg,
                    #ffffff,
                    #d8eefb
                ) !important;

            color:#17466c !important;

            font:
                800 13px
                "Manrope",
                sans-serif !important;

            text-shadow:none !important;

            box-shadow:

                inset 0 1px 0
                rgba(255,255,255,.98),

                0 4px 8px
                rgba(48,104,143,.12) !important;

        }


        /* =================================================
           TODAY
           ================================================= */

        #dashboardCalendar
        .dashboard-calendar-cell.today{

            border:
                2px solid
                #438bd8 !important;

            background:
                linear-gradient(
                    145deg,
                    #8bc9ff,
                    #5da4ec
                ) !important;

            box-shadow:

                0 0 0 4px
                rgba(67,139,216,.10),

                0 17px 31px
                rgba(49,108,190,.24),

                inset 0 2px 0
                rgba(255,255,255,.50) !important;

        }


        #dashboardCalendar
        .dashboard-calendar-cell.today
        .dashboard-calendar-number{

            color:#165184 !important;

            background:
                linear-gradient(
                    145deg,
                    #ffffff,
                    #cceafd
                ) !important;

        }


        /* =================================================
           SELECTED DATE
           ================================================= */

        #dashboardCalendar
        .dashboard-calendar-cell.selected{

            border:
                2px solid
                #21aebc !important;

            background:
                linear-gradient(
                    145deg,
                    #7be0e7,
                    #4cc5d3
                ) !important;

            box-shadow:

                0 0 0 4px
                rgba(33,174,188,.10),

                0 17px 31px
                rgba(29,143,160,.22),

                inset 0 2px 0
                rgba(255,255,255,.42) !important;

        }


        #dashboardCalendar
        .dashboard-calendar-cell.selected
        .dashboard-calendar-number{

            color:#075a67 !important;

        }


        /* =================================================
           EMPTY CELLS
           ================================================= */

        #dashboardCalendar
        .dashboard-calendar-cell.empty{

            background:
                rgba(222,242,252,.40) !important;

            border-color:
                rgba(157,199,223,.32) !important;

            box-shadow:none !important;

            cursor:default !important;

        }


        /* =================================================
           ACTIVITY DOTS
           ================================================= */

        #dashboardCalendar
        .dashboard-calendar-dot{

            display:inline-block !important;

            width:8px !important;

            height:8px !important;

            margin-top:11px !important;

            border-radius:50% !important;

        }


        #dashboardCalendar
        .dashboard-calendar-dot.task-dot{

            background:#18b8ca !important;

            box-shadow:

                0 0 5px
                #18b8ca,

                0 0 12px
                rgba(24,184,202,.55) !important;

        }


        #dashboardCalendar
        .dashboard-calendar-dot.exam-dot{

            background:#ef73a5 !important;

            box-shadow:

                0 0 5px
                #ef73a5,

                0 0 12px
                rgba(239,115,165,.50) !important;

        }


        #dashboardCalendar
        .dashboard-calendar-cell.has-exam{

            border-color:
                rgba(239,115,165,.50) !important;

        }


        /* =================================================
           SELECTED DAY PANEL
           ================================================= */

        #dashboardCalendar
        .dashboard-calendar-selected{

            margin-top:15px !important;

            padding:16px !important;

            min-height:58px !important;

            border-radius:15px !important;

            border:
                1px solid
                #a7cfe5 !important;

            background:
                linear-gradient(
                    145deg,
                    #eefaff,
                    #d8effb
                ) !important;

            box-shadow:

                0 10px 22px
                rgba(48,104,143,.12),

                inset 0 1px 0
                rgba(255,255,255,.95) !important;

        }


        #dashboardCalendar
        .dashboard-calendar-selected-head h3{

            margin:0 !important;

            color:#123b5d !important;

            font:
                700 16px
                "Manrope",
                sans-serif !important;

        }


        /* =================================================
           ACTIVITY ITEMS
           ================================================= */

        #dashboardCalendar
        .dashboard-calendar-items{

            display:grid !important;

            grid-template-columns:
                repeat(
                    2,
                    minmax(0,1fr)
                ) !important;

            gap:8px !important;

            margin-top:10px !important;

        }


        #dashboardCalendar
        .dashboard-calendar-item{

            display:flex !important;

            align-items:center !important;

            gap:10px !important;

            padding:10px !important;

            border:
                1px solid
                #b2d5e8 !important;

            border-radius:10px !important;

            background:
                linear-gradient(
                    145deg,
                    #ffffff,
                    #e5f5fc
                ) !important;

            box-shadow:

                0 6px 13px
                rgba(48,104,143,.10),

                inset 0 1px 0
                rgba(255,255,255,.98) !important;

        }


        #dashboardCalendar
        .dashboard-calendar-item b{

            display:block !important;

            color:#163f60 !important;

            font-size:9px !important;

        }


        #dashboardCalendar
        .dashboard-calendar-item small{

            display:block !important;

            margin-top:2px !important;

            color:#69849a !important;

            font-size:7px !important;

        }


        #dashboardCalendar
        .dashboard-calendar-empty{

            margin-top:8px !important;

            color:#678398 !important;

            font-size:8px !important;

        }


        /* =================================================
           RESPONSIVE
           ================================================= */

        @media(max-width:760px){

            #dashboardCalendar{

                padding:20px !important;

            }


            #dashboardCalendar
            .dashboard-calendar-grid{

                gap:6px !important;

            }


            #dashboardCalendar
            .dashboard-calendar-cell{

                min-height:66px !important;

            }


            #dashboardCalendar
            .dashboard-calendar-items{

                grid-template-columns:1fr !important;

            }

        }


        @media(max-width:520px){

            #dashboardCalendar{

                padding:16px !important;

                border-radius:18px !important;

            }


            #dashboardCalendar
            .dashboard-calendar-head{

                flex-direction:column !important;

                align-items:flex-start !important;

            }


            #dashboardCalendar
            .dashboard-calendar-controls{

                width:100% !important;

                justify-content:flex-end !important;

            }


            #dashboardCalendar
            .dashboard-calendar-cell{

                min-height:52px !important;

            }


            #dashboardCalendar
            .dashboard-calendar-number{

                width:25px !important;

                height:25px !important;

                font-size:10px !important;

            }


            #dashboardCalendar
            .dashboard-calendar-weekday{

                font-size:7px !important;

            }

        }

    `;


    document.head.appendChild(style);

}

/* =========================================================
   CALENDAR RENDER
   ========================================================= */

function renderDashboardCalendar(){

    const grid =
        $("dashboardCalendarGrid");

    const title =
        $("dashboardCalendarTitle");

    if(!grid)
        return;


    const year =
        dashboardCalendarDate.getFullYear();

    const month =
        dashboardCalendarDate.getMonth();


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const startDay =
        firstDay.getDay();


    const tasks =
        getTasks();


    const exams =
        arr("exams");


    /* -----------------------------------------------------
       UPDATE MONTH TITLE
       ----------------------------------------------------- */

    if(title){

        title.textContent =
            dashboardCalendarDate.toLocaleDateString(
                "en-US",
                {
                    month:"long",
                    year:"numeric"
                }
            );

    }


    let html = "";


    /* -----------------------------------------------------
       WEEKDAYS
       ----------------------------------------------------- */

    [

        "SUN",
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT"

    ]
    .forEach(
        day => {

            html += `

                <div
                    class="dashboard-calendar-weekday"
                >

                    ${day}

                </div>

            `;

        }
    );


    /* -----------------------------------------------------
       EMPTY CELLS BEFORE FIRST DATE
       ----------------------------------------------------- */

    for(
        let index = 0;
        index < startDay;
        index++
    ){

        html += `

            <div
                class="
                    dashboard-calendar-cell
                    empty
                "
            ></div>

        `;

    }


    /* -----------------------------------------------------
       DATES
       ----------------------------------------------------- */

    for(
        let day = 1;
        day <= daysInMonth;
        day++
    ){

        const date =
            new Date(
                year,
                month,
                day
            );


        const key =
            calendarDateKey(
                date
            );


        const dayTasks =
            tasks.filter(
                task =>
                    task.deadline === key ||
                    task.date === key
            );


        const dayExams =
            exams.filter(
                exam =>
                    exam.date === key
            );


        const isToday =
            calendarSameDay(
                date,
                new Date()
            );


        const isSelected =
            calendarSameDay(
                date,
                dashboardCalendarSelected
            );


        /* -------------------------------------------------
           INLINE COLOURS

           These are intentionally placed directly on the
           generated date elements so other CSS cannot make
           the numbers disappear.
           ------------------------------------------------- */


        let cellBackground =
            `
                linear-gradient(
                    145deg,
                    #f8fdff,
                    #dff2fc
                )
            `;


        let cellBorder =
            "#a8cee4";


        let numberColor =
            "#17466c";


        let numberBackground =
            `
                linear-gradient(
                    145deg,
                    #ffffff,
                    #d8eefb
                )
            `;


        let cellShadow =
            `
                0 8px 17px
                rgba(49,105,143,.13),
                inset 0 1px 0
                rgba(255,255,255,.98),
                inset 0 -2px 0
                rgba(77,127,161,.10)
            `;


        /* TODAY */

        if(isToday){

            cellBackground =
                `
                    linear-gradient(
                        145deg,
                        #8bc9ff,
                        #5da4ec
                    )
                `;


            cellBorder =
                "#438bd8";


            numberColor =
                "#165184";


            numberBackground =
                `
                    linear-gradient(
                        145deg,
                        #ffffff,
                        #cceafd
                    )
                `;


            cellShadow =
                `
                    0 0 0 4px
                    rgba(67,139,216,.10),
                    0 17px 31px
                    rgba(49,108,190,.24),
                    inset 0 2px 0
                    rgba(255,255,255,.50)
                `;

        }


        /* SELECTED */

        if(isSelected){

            cellBackground =
                `
                    linear-gradient(
                        145deg,
                        #7be0e7,
                        #4cc5d3
                    )
                `;


            cellBorder =
                "#21aebc";


            numberColor =
                "#075a67";


            numberBackground =
                `
                    linear-gradient(
                        145deg,
                        #ffffff,
                        #d5f5f6
                    )
                `;


            cellShadow =
                `
                    0 0 0 4px
                    rgba(33,174,188,.10),
                    0 17px 31px
                    rgba(29,143,160,.22),
                    inset 0 2px 0
                    rgba(255,255,255,.42)
                `;

        }


        html += `

            <button

                type="button"

                class="
                    dashboard-calendar-cell
                    ${isToday ? "today" : ""}
                    ${isSelected ? "selected" : ""}
                    ${dayTasks.length ? "has-task" : ""}
                    ${dayExams.length ? "has-exam" : ""}
                "

                data-calendar-day="${key}"

                style="

                    position:relative !important;

                    min-width:0 !important;

                    min-height:82px !important;

                    width:100% !important;

                    padding:10px !important;

                    display:flex !important;

                    flex-direction:column !important;

                    align-items:flex-start !important;

                    justify-content:flex-start !important;

                    border:
                        1px solid
                        ${cellBorder} !important;

                    border-radius:14px !important;

                    background:
                        ${cellBackground} !important;

                    color:#194a70 !important;

                    box-shadow:
                        ${cellShadow} !important;

                    cursor:pointer !important;

                    opacity:1 !important;

                    visibility:visible !important;

                "
            >

                <span

                    class="dashboard-calendar-number"

                    style="

                        display:flex !important;

                        align-items:center !important;

                        justify-content:center !important;

                        width:30px !important;

                        height:30px !important;

                        min-width:30px !important;

                        min-height:30px !important;

                        visibility:visible !important;

                        opacity:1 !important;

                        color:${numberColor} !important;

                        background:
                            ${numberBackground} !important;

                        border-radius:9px !important;

                        font:
                            800 13px
                            'Manrope',
                            sans-serif !important;

                        text-shadow:none !important;

                        box-shadow:

                            inset 0 1px 0
                            rgba(255,255,255,.98),

                            0 4px 8px
                            rgba(48,104,143,.12) !important;

                    "
                >

                    ${day}

                </span>


                <div

                    style="

                        display:flex !important;

                        align-items:center !important;

                        gap:5px !important;

                        min-height:8px !important;

                        margin-top:11px !important;

                        visibility:visible !important;

                        opacity:1 !important;

                    "
                >

                    ${
                        dayTasks.length

                        ?

                        `

                            <span

                                class="
                                    dashboard-calendar-dot
                                    task-dot
                                "

                                title="${dayTasks.length} task(s)"

                                style="

                                    display:inline-block !important;

                                    width:8px !important;

                                    height:8px !important;

                                    border-radius:50% !important;

                                    background:
                                        #18b8ca !important;

                                    box-shadow:

                                        0 0 5px
                                        #18b8ca,

                                        0 0 12px
                                        rgba(24,184,202,.55) !important;

                                "
                            ></span>

                        `

                        :

                        ""

                    }


                    ${
                        dayExams.length

                        ?

                        `

                            <span

                                class="
                                    dashboard-calendar-dot
                                    exam-dot
                                "

                                title="${dayExams.length} exam(s)"

                                style="

                                    display:inline-block !important;

                                    width:8px !important;

                                    height:8px !important;

                                    border-radius:50% !important;

                                    background:
                                        #ef73a5 !important;

                                    box-shadow:

                                        0 0 5px
                                        #ef73a5,

                                        0 0 12px
                                        rgba(239,115,165,.50) !important;

                                "
                            ></span>

                        `

                        :

                        ""

                    }

                </div>

            </button>

        `;

    }


    /* -----------------------------------------------------
       PUT CALENDAR INTO PAGE
       ----------------------------------------------------- */

    grid.innerHTML =
        html;


    /* -----------------------------------------------------
       CLICK / HOVER
       ----------------------------------------------------- */

    grid
        .querySelectorAll(
            "[data-calendar-day]"
        )
        .forEach(
            cell => {

                const originalBorder =
                    cell.style.borderColor;


                cell.addEventListener(
                    "mouseenter",
                    () => {

                        cell.style.transform =
                            "translateY(-4px) scale(1.01)";


                        cell.style.borderColor =
                            "#6ba5d7";


                        cell.style.boxShadow =
                            `
                                0 16px 28px
                                rgba(45,101,139,.18),

                                0 0 18px
                                rgba(94,175,231,.12),

                                inset 0 1px 0
                                rgba(255,255,255,.98)
                            `;

                    }
                );


                cell.addEventListener(
                    "mouseleave",
                    () => {

                        cell.style.transform =
                            "";


                        cell.style.borderColor =
                            originalBorder;


                    }
                );


                cell.addEventListener(
                    "click",
                    () => {

                        dashboardCalendarSelected =
                            new Date(
                                `${cell.dataset.calendarDay}T00:00:00`
                            );


                        renderDashboardCalendar();

                    }
                );

            }
        );


    /* -----------------------------------------------------
       SELECTED DAY DETAILS
       ----------------------------------------------------- */

    renderCalendarSelected();

}


/* =========================================================
   CREATE CALENDAR
   ========================================================= */

function initDashboardCalendar(){

    injectCalendarStyles();


    const dashboard =
        $("dashboardPage");

    if(!dashboard)
        return;


    let calendar =
        $("dashboardCalendar");


    if(!calendar){

        calendar =
            document.createElement(
                "div"
            );

        calendar.id =
            "dashboardCalendar";

        calendar.className =
            "panel dashboard-calendar";


        const weeklyChart =
            $("weeklyChart");

        const chartPanel =
            weeklyChart?.closest(
                ".panel"
            );

        const chartGrid =
            chartPanel?.parentElement;


        if(chartGrid){

            chartGrid.insertAdjacentElement(
                "afterend",
                calendar
            );

        }
        else{

            dashboard.appendChild(
                calendar
            );

        }


        calendar.innerHTML = `

            <div
                class="
                    dashboard-calendar-head
                "
            >

                <div>

                    <small>
                        STUDY CALENDAR
                    </small>

                    <h2
                        id="dashboardCalendarTitle"
                    ></h2>

                </div>


                <div
                    class="
                        dashboard-calendar-controls
                    "
                >

                    <button
                        type="button"
                        id="dashboardCalendarPrev"
                    >
                        ←
                    </button>


                    <button
                        type="button"
                        id="dashboardCalendarToday"
                    >
                        Today
                    </button>


                    <button
                        type="button"
                        id="dashboardCalendarNext"
                    >
                        →
                    </button>

                </div>

            </div>


            <div
                id="dashboardCalendarGrid"
                class="
                    dashboard-calendar-grid
                "
            ></div>


            <div
                id="dashboardCalendarSelected"
                class="
                    dashboard-calendar-selected
                "
            ></div>

        `;


        $("dashboardCalendarPrev")
            ?.addEventListener(
                "click",
                () => {

                    dashboardCalendarDate =
                        new Date(
                            dashboardCalendarDate.getFullYear(),
                            dashboardCalendarDate.getMonth() - 1,
                            1
                        );

                    renderDashboardCalendar();

                }
            );


        $("dashboardCalendarNext")
            ?.addEventListener(
                "click",
                () => {

                    dashboardCalendarDate =
                        new Date(
                            dashboardCalendarDate.getFullYear(),
                            dashboardCalendarDate.getMonth() + 1,
                            1
                        );

                    renderDashboardCalendar();

                }
            );


        $("dashboardCalendarToday")
            ?.addEventListener(
                "click",
                () => {

                    dashboardCalendarDate =
                        new Date();

                    dashboardCalendarSelected =
                        new Date();

                    renderDashboardCalendar();

                }
            );

    }


    renderDashboardCalendar();

}


/* =========================================================
   DASHBOARD REFRESH
   ========================================================= */

export function renderDashboard(){

    const now =
        Date.now();


    if(
        now -
        lastDashboardUpdate <
        50
    ){

        return;

    }


    lastDashboardUpdate =
        now;


    renderBasicStats();

    renderLevel();

    renderGoal();

    renderStreak();

    renderWeeklyChart();

    renderTaskProgress();

    renderChallenge();

    renderSubjectProgress();

    renderTestStats();

    renderAnalyticsChart();

    renderRecommendation();

    initDashboardCalendar();

}


/* =========================================================
   INIT
   ========================================================= */

export function initDashboard(){

    renderDashboard();


    document
        .querySelectorAll(
            '[data-page="dashboardPage"]'
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        setTimeout(
                            renderDashboard,
                            50
                        );

                    }
                );

            }
        );


    setInterval(
        () => {

            const page =
                $("dashboardPage");


            if(
                page &&
                !page.classList.contains(
                    "hidden"
                )
            ){

                renderDashboard();

            }

        },
        5000
    );

}


/* =========================================================
   OPTIONAL REFRESH
   ========================================================= */

export function updateDashboard(){

    renderDashboard();

}