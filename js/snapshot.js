import {
    get,
    $
} from "./storage.js";


function getProfile(){

    return get(
        "profile",
        {}
    );

}


function getArray(
    key
){

    const data =
        get(
            key,
            []
        );


    return Array.isArray(data)
        ? data
        : [];

}


function getStudyMinutes(){

    const sessions =
        getArray(
            "sessions"
        );


    return sessions.reduce(
        (
            total,
            item
        ) =>
            total +
            Number(
                item.minutes ||
                item.duration ||
                item.studyMinutes ||
                0
            ),
        0
    );

}


function getCompletedTasks(){

    return getArray(
        "tasks"
    )
    .filter(
        task =>
            task.completed === true ||
            task.done === true
    )
    .length;

}


function getXP(){

    const direct =
        Number(
            get(
                "xp",
                0
            )
        );


    if(Number.isFinite(direct))
        return direct;


    const data =
        get(
            "rewards",
            {}
        );


    return Number(
        data.xp || 0
    ) || 0;

}


function getStreak(){

    const value =
        Number(
            get(
                "streak",
                0
            )
        );


    return Number.isFinite(value)
        ? value
        : 0;

}


function getReadiness(){

    const questionCount =
        getArray(
            "questions"
        ).length;


    const taskCount =
        getArray(
            "tasks"
        ).length;


    const examCount =
        getArray(
            "exams"
        ).length;


    const study =
        getStudyMinutes();


    const streak =
        getStreak();


    let score = 0;


    if(questionCount > 0)
        score += 25;


    if(taskCount > 0)
        score += 20;


    if(examCount > 0)
        score += 20;


    if(study >= 60)
        score += 20;


    if(streak >= 3)
        score += 15;


    return Math.min(
        100,
        score
    );

}


function snapshotData(){

    const profile =
        getProfile();


    const tasks =
        getArray(
            "tasks"
        );


    return {

        name:
            profile.name ||
            "Student",

        type:
            profile.type ||
            "Learner",

        target:
            profile.targetExam ||
            "Not set",

        study:
            getStudyMinutes(),

        questions:
            getArray(
                "questions"
            ).length,

        tasks:
            tasks.length,

        completed:
            getCompletedTasks(),

        streak:
            getStreak(),

        xp:
            getXP(),

        readiness:
            getReadiness()

    };

}


/* =====================================================
   BUILD PAGE
   ===================================================== */

function buildPage(){

    const page =
        $("snapshotPage");


    if(!page)
        return;


    page.innerHTML = `

        <div class="page-head">

            <div>

                <small>
                    PROGRESS SNAPSHOT
                </small>

                <h1>
                    Study Snapshot
                </h1>

                <p>
                    A quick visual summary of your
                    current Synaptiq progress.
                </p>

            </div>


            <div
                class="snapshot-actions"
            >

                <button
                    id="refreshSnapshot"
                    class="outline"
                    type="button"
                >
                    ↻ Refresh
                </button>


                <button
                    id="downloadSnapshot"
                    class="primary"
                    type="button"
                >
                    ↓ Download Snapshot
                </button>

            </div>

        </div>


        <div
            id="snapshotCard"
            class="snapshot-card"
        ></div>


        <div
            class="snapshot-explanation panel"
        >

            <small>
                WHAT IS SNAPSHOT?
            </small>

            <h2>
                Your study progress at a glance
            </h2>

            <p>
                Snapshot combines your current study time,
                question-bank activity, task completion,
                streak, XP and readiness into one simple
                progress card. It is useful for checking
                your overall progress without opening
                every dashboard section separately.
            </p>

        </div>

    `;

}


/* =====================================================
   RENDER
   ===================================================== */

function render(){

    const card =
        $("snapshotCard");


    if(!card)
        return;


    const data =
        snapshotData();


    const taskPercent =
        data.tasks
            ? Math.round(
                data.completed /
                data.tasks *
                100
            )
            : 0;


    const now =
        new Date()
            .toLocaleString(
                "en-IN",
                {
                    day:"numeric",
                    month:"long",
                    year:"numeric",
                    hour:"2-digit",
                    minute:"2-digit"
                }
            );


    card.innerHTML = `

        <div class="snapshot-header">

            <div
                class="snapshot-user"
            >

                <span
                    class="snapshot-logo"
                >
                    S
                </span>


                <div>

                    <small>
                        SYNAPTIQ
                    </small>

                    <h2>
                        ${escapeHtml(
                            data.name
                        )}
                    </h2>

                </div>

            </div>


            <span
                class="snapshot-date"
            >
                ${now}
            </span>

        </div>


        <div
            class="snapshot-profile"
        >

            <span>
                ${escapeHtml(
                    data.type
                )}
            </span>


            <span>
                Target:
                ${escapeHtml(
                    data.target
                )}
            </span>

        </div>


        <div
            class="snapshot-stats"
        >

            <div class="snapshot-stat">

                <span>📚</span>

                <strong>
                    ${data.study}
                </strong>

                <small>
                    Study Minutes
                </small>

            </div>


            <div class="snapshot-stat">

                <span>📝</span>

                <strong>
                    ${data.questions}
                </strong>

                <small>
                    Questions
                </small>

            </div>


            <div class="snapshot-stat">

                <span>✅</span>

                <strong>
                    ${data.completed}/${data.tasks}
                </strong>

                <small>
                    Tasks
                </small>

            </div>


            <div class="snapshot-stat">

                <span>🔥</span>

                <strong>
                    ${data.streak}
                </strong>

                <small>
                    Day Streak
                </small>

            </div>


            <div class="snapshot-stat">

                <span>⭐</span>

                <strong>
                    ${data.xp}
                </strong>

                <small>
                    XP
                </small>

            </div>


            <div class="snapshot-stat">

                <span>🎯</span>

                <strong>
                    ${data.readiness}%
                </strong>

                <small>
                    Readiness
                </small>

            </div>

        </div>


        <div
            class="snapshot-progress"
        >

            <div
                class="snapshot-progress-head"
            >

                <span>
                    Task Completion
                </span>

                <strong>
                    ${taskPercent}%
                </strong>

            </div>


            <div
                class="snapshot-progress-bar"
            >

                <div
                    style="width:${taskPercent}%"
                ></div>

            </div>

        </div>


        <div
            class="snapshot-footer"
        >

            <span>
                Study. Focus. Perform.
            </span>

            <span>
                Synaptiq Progress Snapshot
            </span>

        </div>

    `;

}


/* =====================================================
   DOWNLOAD
   ===================================================== */

function download(){

    const data =
        snapshotData();


    const text = `

SYNAPTIQ STUDY SNAPSHOT

Student: ${data.name}
Student Type: ${data.type}
Target Exam: ${data.target}

Study Minutes: ${data.study}
Questions: ${data.questions}
Tasks Completed: ${data.completed}/${data.tasks}
Streak: ${data.streak} days
XP: ${data.xp}
Readiness: ${data.readiness}%

Generated:
${new Date().toLocaleString()}

Study. Focus. Perform.

    `.trim();


    const blob =
        new Blob(
            [text],
            {
                type:
                    "text/plain;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "synaptiq-study-snapshot.txt";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =====================================================
   ESCAPE
   ===================================================== */

function escapeHtml(
    value
){

    return String(
        value || ""
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


/* =====================================================
   INIT
   ===================================================== */

export function initSnapshot(){

    buildPage();

    render();


    $("refreshSnapshot")
        ?.addEventListener(
            "click",
            render
        );


    $("downloadSnapshot")
        ?.addEventListener(
            "click",
            download
        );


    $("qaSnapshot")
        ?.addEventListener(
            "click",
            () => {

                document
                    .querySelector(
                        '[data-page="snapshotPage"]'
                    )
                    ?.click();

            }
        );


    window.addEventListener(
        "synaptiqProfileUpdated",
        render
    );

}


/* =====================================================
   REFRESH
   ===================================================== */

export function renderSnapshot(){

    render();

}