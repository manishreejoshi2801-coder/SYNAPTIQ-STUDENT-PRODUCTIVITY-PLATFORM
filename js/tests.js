import {
    get,
    set,
    uid,
    $
} from "./storage.js";


const TESTS_KEY = "synaptiqTests";

let activeTest = null;


/* =========================================================
   DATA
========================================================= */

function getQuestions() {

    const questions = get(
        "questions",
        []
    );

    return Array.isArray(questions)
        ? questions
        : [];
}


function getTests() {

    const tests = get(
        TESTS_KEY,
        []
    );

    return Array.isArray(tests)
        ? tests
        : [];
}


/* =========================================================
   GET QUESTION TEXT
========================================================= */

function getQuestionText(question) {

    if (!question)
        return "Question text unavailable.";


    const possibleText = [

        question.text,

        question.question,

        question.questionText,

        question.title,

        question.prompt

    ];


    const text =
        possibleText.find(
            value =>
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ""
        );


    return text
        ? String(text)
        : "Question text unavailable.";
}


/* =========================================================
   BUILD TEST UI
========================================================= */

function buildTestPanel() {

    const page = $("testsPage");

    if (!page)
        return;


    if (
        page.querySelector(
            ".custom-test-workspace"
        )
    ) {

        return;
    }


    page.innerHTML = `

        <div class="page-head">

            <div>

                <small>
                    PRACTICE LAB
                </small>

                <h1>
                    Custom Tests
                </h1>

                <p>
                    Build a test from your saved questions
                    and track your performance.
                </p>

            </div>


            <button
                id="createTest"
                class="primary"
                type="button"
            >
                + Create Test
            </button>

        </div>


        <div
            class="custom-test-workspace"
        >

            <div class="panel">

                <small>
                    TEST BUILDER
                </small>

                <h2>
                    Create a practice test
                </h2>

                <p>
                    Choose the subjects, difficulty,
                    question count and time limit.
                </p>


                <form
                    id="customTestForm"
                    class="test-builder-form"
                >

                    <label>
                        Test Name
                    </label>

                    <input
                        id="testName"
                        placeholder="Example: GATE DBMS Practice"
                        required
                    >


                    <label>
                        Subject
                    </label>

                    <select
                        id="testSubject"
                    >

                        <option value="all">
                            All Subjects
                        </option>

                    </select>


                    <label>
                        Number of Questions
                    </label>

                    <input
                        id="testQuestionCount"
                        type="number"
                        min="1"
                        max="100"
                        value="10"
                    >


                    <label>
                        Difficulty
                    </label>

                    <select
                        id="testDifficulty"
                    >

                        <option value="all">
                            Mixed
                        </option>

                        <option value="Easy">
                            Easy
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="Hard">
                            Hard
                        </option>

                    </select>


                    <label>
                        Duration
                    </label>

                    <select
                        id="testDuration"
                    >

                        <option value="15">
                            15 minutes
                        </option>

                        <option
                            value="30"
                            selected
                        >
                            30 minutes
                        </option>

                        <option value="45">
                            45 minutes
                        </option>

                        <option value="60">
                            60 minutes
                        </option>

                        <option value="90">
                            90 minutes
                        </option>

                        <option value="custom">
                            Custom Time
                        </option>

                    </select>


                    <div
                        id="customDurationBox"
                        style="
                            display:none;
                            margin-top:10px;
                        "
                    >

                        <label>
                            Custom Time (minutes)
                        </label>

                        <input
                            id="testCustomDuration"
                            type="number"
                            min="1"
                            max="300"
                            value="30"
                            placeholder="Example: 25"
                        >

                        <small
                            style="
                                display:block;
                                margin-top:6px;
                                opacity:.7;
                            "
                        >
                            Enter any duration from
                            1 to 300 minutes.
                        </small>

                    </div>


                    <button
                        class="primary full"
                        type="submit"
                    >
                        Generate Test
                    </button>

                </form>


                <div
                    id="testBuilderMessage"
                    class="test-message"
                ></div>

            </div>


            <div class="panel">

                <small>
                    TEST SUMMARY
                </small>

                <div
                    id="testStats"
                    class="test-stat-grid"
                ></div>

            </div>

        </div>


        <div class="panel">

            <div class="page-head">

                <div>

                    <small>
                        TEST HISTORY
                    </small>

                    <h2>
                        Previous Tests
                    </h2>

                </div>

            </div>


            <div
                id="testHistory"
                class="test-history"
            ></div>

        </div>


        <div
            id="testRunner"
            class="test-runner hidden"
        ></div>

    `;


    $("testDuration")
        ?.addEventListener(
            "change",
            updateCustomDurationVisibility
        );


    updateCustomDurationVisibility();

}


/* =========================================================
   CUSTOM TIME VISIBILITY
========================================================= */

function updateCustomDurationVisibility() {

    const select =
        $("testDuration");

    const box =
        $("customDurationBox");


    if (
        !select ||
        !box
    ) {

        return;

    }


    box.style.display =
        select.value === "custom"
            ? "block"
            : "none";
}


/* =========================================================
   GET SELECTED DURATION
========================================================= */

function getSelectedDuration() {

    const select =
        $("testDuration");


    if (!select)
        return 30;


    if (
        select.value !== "custom"
    ) {

        const minutes =
            Number(select.value);


        return (
            Number.isFinite(minutes) &&
            minutes > 0
        )
            ? minutes
            : 30;
    }


    const custom =
        Number(
            $("testCustomDuration")
                ?.value
        );


    if (
        !Number.isFinite(custom) ||
        custom < 1 ||
        custom > 300
    ) {

        return null;
    }


    return Math.floor(custom);
}


/* =========================================================
   SUBJECT OPTIONS
========================================================= */

function populateSubjects() {

    const select =
        $("testSubject");


    if (!select)
        return;


    const questions =
        getQuestions();


    const subjects = [
        ...new Set(
            questions
                .map(
                    question =>
                        question.subject
                )
                .filter(Boolean)
        )
    ];


    select.innerHTML = `

        <option value="all">
            All Subjects
        </option>

    `;


    subjects.forEach(
        subject => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                subject;


            option.textContent =
                subject;


            select.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   STATS
========================================================= */

function renderStats() {

    const box =
        $("testStats");


    if (!box)
        return;


    const tests =
        getTests();


    const scores =
        tests
            .map(
                test =>
                    Number(
                        test.score
                    )
            )
            .filter(
                score =>
                    Number.isFinite(score)
            );


    const average =
        scores.length
            ?
            Math.round(
                scores.reduce(
                    (a, b) =>
                        a + b,
                    0
                ) /
                scores.length
            )
            :
            0;


    box.innerHTML = `

        <div class="test-stat">

            <strong>
                ${tests.length}
            </strong>

            <span>
                Tests Created
            </span>

        </div>


        <div class="test-stat">

            <strong>
                ${average}%
            </strong>

            <span>
                Average Score
            </span>

        </div>


        <div class="test-stat">

            <strong>
                ${scores.length}
            </strong>

            <span>
                Tests Completed
            </span>

        </div>

    `;
}


/* =========================================================
   HISTORY
========================================================= */

function renderHistory() {

    const box =
        $("testHistory");


    if (!box)
        return;


    const tests =
        getTests();


    if (!tests.length) {

        box.innerHTML = `

            <div
                class="empty-dashboard-message"
            >
                No tests created yet.
                Create your first custom test above.
            </div>

        `;

        return;
    }


    box.innerHTML =
        tests
            .slice()
            .reverse()
            .map(
                test => `

                    <div
                        class="test-history-item"
                    >

                        <div>

                            <strong>
                                ${escapeHtml(
                                    test.name
                                )}
                            </strong>

                            <small>

                                ${escapeHtml(
                                    test.subject ||
                                    "All Subjects"
                                )}

                                •
                                ${test.questionCount}
                                questions

                                •
                                ${test.duration}
                                min

                            </small>

                        </div>


                        <div
                            class="test-score"
                        >

                            ${
                                test.completed
                                    ?
                                    `${test.score}%`
                                    :
                                    "Not attempted"
                            }

                        </div>

                    </div>

                `
            )
            .join("");
}


/* =========================================================
   GENERATE TEST
========================================================= */

function generateTest(event) {

    event.preventDefault();


    const name =
        $("testName")
            ?.value
            ?.trim();


    const subject =
        $("testSubject")
            ?.value ||
        "all";


    const count =
        Number(
            $("testQuestionCount")
                ?.value
        ) || 10;


    const difficulty =
        $("testDifficulty")
            ?.value ||
        "all";


    const duration =
        getSelectedDuration();


    if (!duration) {

        const message =
            $("testBuilderMessage");


        if (message) {

            message.textContent =
                "Please enter a valid custom time between 1 and 300 minutes.";

        }


        return;
    }


    const allQuestions =
        getQuestions();


    let pool =
        allQuestions.slice();


    /* SUBJECT */

    if (
        subject !==
        "all"
    ) {

        pool =
            pool.filter(
                question =>
                    String(
                        question.subject ||
                        ""
                    )
                        .toLowerCase()
                    ===
                    subject
                        .toLowerCase()
            );

    }


    /* DIFFICULTY */

    if (
        difficulty !==
        "all"
    ) {

        pool =
            pool.filter(
                question =>
                    String(
                        question.difficulty ||
                        ""
                    )
                        .toLowerCase()
                    ===
                    difficulty
                        .toLowerCase()
            );

    }


    if (!pool.length) {

        const message =
            $("testBuilderMessage");


        if (message) {

            message.textContent =
                "No matching saved questions found. Add questions to your Question Bank first.";

        }


        return;
    }


    /* RANDOMIZE */

    pool =
        pool
            .sort(
                () =>
                    Math.random() -
                    0.5
            )
            .slice(
                0,
                Math.min(
                    count,
                    pool.length
                )
            );


    /* ACTIVE TEST */

    activeTest = {

        id:
            uid(),

        name,

        subject:
            subject === "all"
                ?
                "All Subjects"
                :
                subject,

        difficulty,

        duration,

        durationSeconds:
            duration * 60,

        remainingSeconds:
            duration * 60,

        questions:
            pool,

        startedAt:
            Date.now(),

        answers: {},

        timerId:
            null

    };


    showTestRunner();
}


/* =========================================================
   FORMAT TIMER
========================================================= */

function formatTime(seconds) {

    seconds =
        Math.max(
            0,
            Math.floor(
                Number(seconds) || 0
            )
        );


    const hours =
        Math.floor(
            seconds / 3600
        );


    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );


    const remainingSeconds =
        seconds % 60;


    if (hours > 0) {

        return (
            String(hours)
                .padStart(2, "0")
            +
            ":" +
            String(minutes)
                .padStart(2, "0")
            +
            ":" +
            String(
                remainingSeconds
            )
                .padStart(2, "0")
        );

    }


    return (
        String(minutes)
            .padStart(2, "0")
        +
        ":" +
        String(
            remainingSeconds
        )
            .padStart(2, "0")
    );
}


/* =========================================================
   UPDATE TIMER
========================================================= */

function updateTimerDisplay() {

    if (!activeTest)
        return;


    const timer =
        $("customTestTimer");


    if (!timer)
        return;


    timer.textContent =
        formatTime(
            activeTest.remainingSeconds
        );


    if (
        activeTest.remainingSeconds <=
        60
    ) {

        timer.style.color =
            "#ef4444";

        timer.style.fontWeight =
            "900";

    }
    else {

        timer.style.color =
            "";

        timer.style.fontWeight =
            "800";

    }
}


/* =========================================================
   START TIMER
========================================================= */

function startTestTimer() {

    if (!activeTest)
        return;


    stopTestTimer();


    updateTimerDisplay();


    activeTest.timerId =
        setInterval(
            () => {

                if (!activeTest)
                    return;


                activeTest.remainingSeconds--;


                updateTimerDisplay();


                if (
                    activeTest
                        .remainingSeconds <=
                    0
                ) {

                    stopTestTimer();


                    finishTest(
                        true
                    );

                }

            },
            1000
        );
}


/* =========================================================
   STOP TIMER
========================================================= */

function stopTestTimer() {

    if (
        activeTest &&
        activeTest.timerId
    ) {

        clearInterval(
            activeTest.timerId
        );


        activeTest.timerId =
            null;
    }
}


/* =========================================================
   RUNNER
========================================================= */

function showTestRunner() {

    const runner =
        $("testRunner");


    if (
        !runner ||
        !activeTest
    )
        return;


    runner.classList.remove(
        "hidden"
    );


    runner.innerHTML = `

        <div
            class="panel test-runner-panel"
        >

            <div
                class="test-runner-head"
            >

                <div>

                    <small>
                        ACTIVE TEST
                    </small>

                    <h2>
                        ${escapeHtml(
                            activeTest.name
                        )}
                    </h2>

                    <small>
                        ${
                            activeTest.questions.length
                        }
                        questions
                        •
                        ${
                            activeTest.duration
                        }
                        minute test
                    </small>

                </div>


                <div
                    style="
                        text-align:right;
                        min-width:110px;
                    "
                >

                    <small
                        style="
                            display:block;
                            font-size:11px;
                            opacity:.7;
                        "
                    >
                        TIME REMAINING
                    </small>

                    <div
                        id="customTestTimer"
                        aria-live="polite"
                        style="
                            font-size:30px;
                            line-height:1.1;
                            font-weight:800;
                            margin-top:5px;
                            letter-spacing:1px;
                        "
                    >
                        ${formatTime(
                            activeTest.remainingSeconds
                        )}
                    </div>

                </div>

            </div>


            <div
                style="
                    margin:12px 0 18px;
                    padding:10px 12px;
                    border-radius:10px;
                    background:rgba(255,255,255,.06);
                    border:1px solid rgba(255,255,255,.1);
                    text-align:center;
                "
            >

                <strong>
                    ${
                        activeTest.questions.length
                    }
                    Questions
                </strong>

                <span
                    style="
                        opacity:.7;
                        margin-left:8px;
                    "
                >
                    Answer each question below
                </span>

            </div>


            <div
                id="testQuestions"
                class="test-question-list"
            >

                ${
                    activeTest.questions
                        .map(
                            (
                                question,
                                index
                            ) => {

                                const questionText =
                                    getQuestionText(
                                        question
                                    );


                                return `

                                    <div
                                        class="test-question"
                                        data-question="${index}"
                                    >

                                        <div
                                            style="
                                                display:flex;
                                                gap:8px;
                                                align-items:flex-start;
                                            "
                                        >

                                            <strong>
                                                Q${index + 1}.
                                            </strong>

                                            <p
                                                style="
                                                    margin:0;
                                                    line-height:1.6;
                                                "
                                            >
                                                ${escapeHtml(
                                                    questionText
                                                )}
                                            </p>

                                        </div>


                                        <div
                                            class="test-answer-row"
                                            style="
                                                margin-top:14px;
                                            "
                                        >

                                            <button
                                                type="button"
                                                data-answer="correct"
                                                data-index="${index}"
                                            >
                                                ✓ I know this
                                            </button>


                                            <button
                                                type="button"
                                                data-answer="wrong"
                                                data-index="${index}"
                                            >
                                                ✗ I need revision
                                            </button>

                                        </div>

                                    </div>

                                `;

                            }
                        )
                        .join("")
                }

            </div>


            <div
                style="
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                    margin-top:18px;
                "
            >

                <button
                    id="submitCustomTest"
                    class="primary"
                    type="button"
                >
                    Submit Test
                </button>


                <button
                    id="cancelCustomTest"
                    class="outline"
                    type="button"
                >
                    Exit Test
                </button>

            </div>

        </div>

    `;


    /* ANSWER BUTTONS */

    runner
        .querySelectorAll(
            "[data-answer]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset
                                    .index
                            );


                        const answer =
                            button.dataset
                                .answer;


                        activeTest.answers[
                            index
                        ] =
                            answer;


                        const row =
                            button.parentElement;


                        row
                            .querySelectorAll(
                                "button"
                            )
                            .forEach(
                                item => {

                                    item.classList
                                        .remove(
                                            "selected"
                                        );

                                }
                            );


                        button.classList.add(
                            "selected"
                        );

                    }
                );

            }
        );


    /* SUBMIT */

    $("submitCustomTest")
        ?.addEventListener(
            "click",
            () =>
                finishTest(false)
        );


    /* EXIT */

    $("cancelCustomTest")
        ?.addEventListener(
            "click",
            () => {

                stopTestTimer();


                activeTest =
                    null;


                runner
                    .classList
                    .add(
                        "hidden"
                    );

            }
        );


    /* START REAL TIMER */

    startTestTimer();
}


/* =========================================================
   FINISH TEST
========================================================= */

function finishTest(
    timedOut = false
) {

    if (!activeTest)
        return;


    stopTestTimer();


    let correct = 0;


    activeTest.questions.forEach(
        (
            _,
            index
        ) => {

            if (
                activeTest.answers[index] ===
                "correct"
            ) {

                correct++;

            }

        }
    );


    const score =
        Math.round(
            correct /
            activeTest.questions.length *
            100
        );


    const tests =
        getTests();


    tests.push({

        id:
            activeTest.id,

        name:
            activeTest.name,

        subject:
            activeTest.subject,

        difficulty:
            activeTest.difficulty,

        duration:
            activeTest.duration,

        questionCount:
            activeTest.questions.length,

        completed:
            true,

        score,

        timedOut,

        completedAt:
            new Date()
                .toISOString()

    });


    set(
        TESTS_KEY,
        tests
    );


    activeTest =
        null;


    $("testRunner")
        ?.classList
        .add(
            "hidden"
        );


    renderStats();

    renderHistory();


    const message =
        $("testBuilderMessage");


    if (message) {

        message.textContent =
            timedOut
                ?
                `Time is up. Your score is ${score}%.`
                :
                `Test completed. Your score is ${score}%.`;

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(text) {

    return String(
        text || ""
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
   INIT
========================================================= */

export function initTests() {

    buildTestPanel();

    populateSubjects();

    renderStats();

    renderHistory();


    $("customTestForm")
        ?.addEventListener(
            "submit",
            generateTest
        );


    window.addEventListener(
        "synaptiqQuestionUpdated",
        () => {

            populateSubjects();

        }
    );

}


/* =========================================================
   REFRESH
========================================================= */

export function renderTests() {

    populateSubjects();

    renderStats();

    renderHistory();

}
