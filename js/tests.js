import {
    get,
    set,
    uid,
    $,
    esc,
    dateText
} from "./storage.js";


const TESTS_KEY =
    "synaptiqTests";


let activeTest = null;

let editingTestId = null;


/* =========================================================
   DATA
========================================================= */

function getQuestions() {

    const questions =
        get(
            "questions",
            []
        );


    return Array.isArray(
        questions
    )
        ? questions
        : [];

}


function getTests() {

    const tests =
        get(
            TESTS_KEY,
            []
        );


    return Array.isArray(
        tests
    )
        ? tests
        : [];

}


/* =========================================================
   QUESTION TEXT
========================================================= */

function getQuestionText(
    question
) {

    if (!question)
        return "Question text unavailable.";


    const values = [

        question.text,

        question.question,

        question.questionText,

        question.title,

        question.prompt

    ];


    const value =
        values.find(
            item =>
                item !== undefined &&
                item !== null &&
                String(item)
                    .trim() !== ""
        );


    return value
        ?
        String(value)
        :
        "Question text unavailable.";

}


/* =========================================================
   BUILD UI
========================================================= */

function buildTestPanel() {

    const page =
        $("testsPage");


    if (!page)
        return;


    if (
        page.querySelector(
            ".custom-test-workspace"
        )
    )
        return;


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

                <h2
                    id="testBuilderTitle"
                >
                    Create a practice test
                </h2>

                <p>
                    Choose mixed subjects or one specific
                    subject, difficulty, question count
                    and time limit.
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
                        Subject Selection
                    </label>

                    <select
                        id="testSubject"
                    >

                        <option value="all">
                            Mixed Subjects
                        </option>

                    </select>


                    <small
                        style="
                            display:block;
                            margin-top:-4px;
                            margin-bottom:8px;
                            opacity:.7;
                        "
                    >
                        Choose "Mixed Subjects" for questions
                        from all subjects, or select one
                        particular subject.
                    </small>


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
                            Mixed Difficulty
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


                    <div
                        style="
                            display:flex;
                            gap:10px;
                            flex-wrap:wrap;
                        "
                    >

                        <button
                            id="generateTestButton"
                            class="primary full"
                            type="submit"
                        >
                            Generate Test
                        </button>

                    </div>

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
   CUSTOM TIME
========================================================= */

function updateCustomDurationVisibility() {

    const select =
        $("testDuration");


    const box =
        $("customDurationBox");


    if (
        !select ||
        !box
    )
        return;


    box.style.display =
        select.value === "custom"
            ?
            "block"
            :
            "none";

}


function getSelectedDuration() {

    const select =
        $("testDuration");


    if (!select)
        return 30;


    if (
        select.value !==
        "custom"
    ) {

        const minutes =
            Number(
                select.value
            );


        return (
            Number.isFinite(
                minutes
            ) &&
            minutes > 0
        )
            ?
            minutes
            :
            30;

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


    return Math.floor(
        custom
    );

}


/* =========================================================
   SUBJECTS
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
            Mixed Subjects
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
                    Number.isFinite(
                        score
                    )
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
                                    test.name ||
                                    "Untitled Test"
                                )}
                            </strong>

                            <small>

                                ${escapeHtml(
                                    test.subject ||
                                    "Mixed Subjects"
                                )}

                                •
                                ${test.questionCount || 0}
                                questions

                                •
                                ${test.duration || 0}
                                min

                                ${
                                    test.difficulty !==
                                    "all"
                                        ?
                                        ` • ${escapeHtml(
                                            test.difficulty
                                        )}`
                                        :
                                        " • Mixed Difficulty"
                                }

                            </small>

                        </div>


                        <div
                            style="
                                display:flex;
                                gap:8px;
                                align-items:center;
                                flex-wrap:wrap;
                            "
                        >

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


                            <button
                                type="button"
                                class="small-btn"
                                data-edit-test="${test.id}"
                            >
                                Edit / Retake
                            </button>


                            <button
                                type="button"
                                class="small-btn"
                                data-delete-test="${test.id}"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   LOAD TEST INTO BUILDER
========================================================= */

function loadTestForEdit(
    id
) {

    const tests =
        getTests();


    const test =
        tests.find(
            item =>
                item.id === id
        );


    if (!test)
        return;


    editingTestId =
        id;


    $("testName").value =
        test.name || "";


    $("testSubject").value =
        findSubjectValue(
            test.subject
        );


    if (
        $("testSubject").value === ""
    ) {

        $("testSubject").value =
            "all";

    }


    $("testQuestionCount").value =
        test.questionCount ||
        10;


    $("testDifficulty").value =
        test.difficulty ||
        "all";


    const duration =
        Number(
            test.duration
        );


    const durationSelect =
        $("testDuration");


    const presetValues = [
        "15",
        "30",
        "45",
        "60",
        "90"
    ];


    if (
        presetValues.includes(
            String(duration)
        )
    ) {

        durationSelect.value =
            String(duration);


        updateCustomDurationVisibility();

    }
    else {

        durationSelect.value =
            "custom";


        $("testCustomDuration")
            .value =
            duration || 30;


        updateCustomDurationVisibility();

    }


    const title =
        $("testBuilderTitle");


    if (title)
        title.textContent =
            "Edit Test Settings";


    const button =
        $("generateTestButton");


    if (button)
        button.textContent =
            "Generate Edited Test";


    window.scrollTo(
        {
            top:0,
            behavior:"smooth"
        }
    );

}


function findSubjectValue(
    savedSubject
) {

    if (
        !savedSubject ||
        savedSubject ===
        "All Subjects" ||
        savedSubject ===
        "Mixed Subjects"
    ) {

        return "all";

    }


    const select =
        $("testSubject");


    if (!select)
        return "all";


    const matchingOption =
        Array.from(
            select.options
        )
        .find(
            option =>
                option.value
                    .toLowerCase()
                ===
                String(
                    savedSubject
                )
                    .toLowerCase()
        );


    return matchingOption
        ?
        matchingOption.value
        :
        "all";

}


/* =========================================================
   RESET BUILDER
========================================================= */

function resetTestBuilder() {

    editingTestId =
        null;


    $("testName").value =
        "";


    $("testSubject").value =
        "all";


    $("testQuestionCount").value =
        10;


    $("testDifficulty").value =
        "all";


    $("testDuration").value =
        "30";


    $("testCustomDuration").value =
        30;


    updateCustomDurationVisibility();


    const title =
        $("testBuilderTitle");


    if (title)
        title.textContent =
            "Create a practice test";


    const button =
        $("generateTestButton");


    if (button)
        button.textContent =
            "Generate Test";

}


/* =========================================================
   DELETE TEST HISTORY
========================================================= */

function deleteTest(
    id
) {

    const tests =
        getTests();


    const test =
        tests.find(
            item =>
                item.id === id
        );


    if (!test)
        return;


    const confirmed =
        confirm(
            `Delete test "${test.name}" from history?`
        );


    if (!confirmed)
        return;


    set(
        TESTS_KEY,
        tests.filter(
            item =>
                item.id !== id
        )
    );


    renderStats();

    renderHistory();

}


/* =========================================================
   GENERATE TEST
========================================================= */

function generateTest(
    event
) {

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


    const message =
        $("testBuilderMessage");


    if (!duration) {

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

        if (message) {

            message.textContent =
                subject === "all"
                    ?
                    "No saved questions are available. Add questions to your Question Bank first."
                    :
                    `No saved questions found for ${subject} with the selected difficulty.`;

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


    /* NEW ACTIVE TEST */

    activeTest = {

        id:
            uid(),

        name:
            name ||
            "Custom Test",

        subject:
            subject === "all"
                ?
                "Mixed Subjects"
                :
                subject,

        difficulty,

        duration,

        durationSeconds:
            duration * 60,

        remainingSeconds:
            duration * 60,

        questionCount:
            pool.length,

        questions:
            pool,

        startedAt:
            Date.now(),

        answers: {},

        timerId:
            null

    };


    /* If editing, keep the old test out
       of the way only when its new version
       is successfully generated. */

    const oldEditingId =
        editingTestId;


    editingTestId =
        null;


    resetTestBuilder();


    if (
        oldEditingId
    ) {

        const tests =
            getTests();


        set(
            TESTS_KEY,
            tests.filter(
                item =>
                    item.id !==
                    oldEditingId
            )
        );

    }


    showTestRunner();

}


/* =========================================================
   TIMER FORMAT
========================================================= */

function formatTime(
    seconds
) {

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


    const secondsLeft =
        seconds % 60;


    if (
        hours > 0
    ) {

        return (

            String(hours)
                .padStart(2, "0")

            +

            ":" +

            String(minutes)
                .padStart(2, "0")

            +

            ":" +

            String(secondsLeft)
                .padStart(2, "0")

        );

    }


    return (

        String(minutes)
            .padStart(2, "0")

        +

        ":" +

        String(secondsLeft)
            .padStart(2, "0")

    );

}


/* =========================================================
   TIMER DISPLAY
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
                        ${escapeHtml(
                            activeTest.subject
                        )}
                    </small>

                </div>


                <div
                    style="
                        text-align:right;
                        min-width:120px;
                    "
                >

                    <small>
                        TIME REMAINING
                    </small>

                    <div
                        id="customTestTimer"
                        aria-live="polite"
                        style="
                            font-size:30px;
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

                                const text =
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
                                                    text
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


    /* ANSWERS */

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


                        activeTest.answers[
                            index
                        ] =
                            button.dataset
                                .answer;


                        button
                            .parentElement
                            .querySelectorAll(
                                "button"
                            )
                            .forEach(
                                item =>
                                    item.classList
                                        .remove(
                                            "selected"
                                        )
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
                finishTest(
                    false
                )
        );


    /* EXIT */

    $("cancelCustomTest")
        ?.addEventListener(
            "click",
            () => {

                stopTestTimer();


                activeTest =
                    null;


                runner.classList.add(
                    "hidden"
                );

            }
        );


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


    activeTest.questions
        .forEach(
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

function escapeHtml(
    text
) {

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


    $("createTest")
        ?.addEventListener(
            "click",
            () => {

                resetTestBuilder();


                window.scrollTo(
                    {
                        top:0,
                        behavior:"smooth"
                    }
                );

            }
        );


    /* =================================================
       HISTORY ACTIONS
    ================================================= */

    document.addEventListener(
        "click",
        event => {

            const editId =
                event.target
                    ?.dataset
                    ?.editTest;


            if (editId) {

                loadTestForEdit(
                    editId
                );

                return;

            }


            const deleteId =
                event.target
                    ?.dataset
                    ?.deleteTest;


            if (deleteId) {

                deleteTest(
                    deleteId
                );

            }

        }
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