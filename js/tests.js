import {
    get,
    set,
    uid,
    $
} from "./storage.js";


const TESTS_KEY =
    "synaptiqTests";


let activeTest = null;


/* =========================================================
   DATA
   ========================================================= */

function getQuestions(){

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


function getTests(){

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
   BUILD TEST UI
   ========================================================= */

function buildTestPanel(){

    const page =
        $("testsPage");


    if(!page)
        return;


    if(
        page.querySelector(
            ".custom-test-workspace"
        )
    ){

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

                        <option>
                            Easy
                        </option>

                        <option>
                            Medium
                        </option>

                        <option>
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

                        <option value="30" selected>
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

                    </select>


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

}


/* =========================================================
   SUBJECT OPTIONS
   ========================================================= */

function populateSubjects(){

    const select =
        $("testSubject");


    if(!select)
        return;


    const questions =
        getQuestions();


    const subjects =
        [
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
   RENDER STATS
   ========================================================= */

function renderStats(){

    const box =
        $("testStats");


    if(!box)
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
            ? Math.round(
                scores.reduce(
                    (a,b) =>
                        a + b,
                    0
                ) /
                scores.length
            )
            : 0;


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
   RENDER HISTORY
   ========================================================= */

function renderHistory(){

    const box =
        $("testHistory");


    if(!box)
        return;


    const tests =
        getTests();


    if(!tests.length){

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
                                    ? `${test.score}%`
                                    : "Not attempted"
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

function generateTest(
    event
){

    event.preventDefault();


    const name =
        $("testName")
            ?.value
            .trim();


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
        Number(
            $("testDuration")
                ?.value
        ) || 30;


    const allQuestions =
        getQuestions();


    let pool =
        allQuestions.slice();


    if(
        subject !==
        "all"
    ){

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


    if(
        difficulty !==
        "all"
    ){

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


    if(!pool.length){

        const message =
            $("testBuilderMessage");


        if(message){

            message.textContent =
                "No matching saved questions found. Add questions to your Question Bank first.";

        }


        return;

    }


    pool =
        pool
            .sort(
                () =>
                    Math.random() -
                    .5
            )
            .slice(
                0,
                Math.min(
                    count,
                    pool.length
                )
            );


    activeTest = {

        id:
            uid(),

        name,

        subject:

            subject === "all"
                ? "All Subjects"
                : subject,

        difficulty,

        duration,

        questions:
            pool,

        startedAt:
            Date.now(),

        answers:{}

    };


    showTestRunner();

}


/* =========================================================
   RUNNER
   ========================================================= */

function showTestRunner(){

    const runner =
        $("testRunner");


    if(!runner ||
       !activeTest)
        return;


    runner.classList.remove(
        "hidden"
    );


    runner.innerHTML = `

        <div class="panel test-runner-panel">

            <div class="test-runner-head">

                <div>

                    <small>
                        ACTIVE TEST
                    </small>

                    <h2>
                        ${escapeHtml(
                            activeTest.name
                        )}
                    </h2>

                </div>

                <strong>
                    ${activeTest.duration} min
                </strong>

            </div>


            <div
                id="testQuestions"
                class="test-question-list"
            >

                ${activeTest.questions
                    .map(
                        (
                            question,
                            index
                        ) => `

                            <div
                                class="test-question"
                            >

                                <strong>
                                    Q${index + 1}.
                                </strong>

                                <p>
                                    ${escapeHtml(
                                        question.text ||
                                        question.question ||
                                        "Question"
                                    )}
                                </p>


                                <div
                                    class="test-answer-row"
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

                        `
                    )
                    .join("")}

            </div>


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

    `;


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
                                button.dataset.index
                            );


                        const answer =
                            button.dataset.answer;


                        activeTest.answers[
                            index
                        ] =
                            answer;


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


    $("submitCustomTest")
        ?.addEventListener(
            "click",
            finishTest
        );


    $("cancelCustomTest")
        ?.addEventListener(
            "click",
            () => {

                activeTest =
                    null;


                runner.classList.add(
                    "hidden"
                );

            }
        );

}


/* =========================================================
   FINISH
   ========================================================= */

function finishTest(){

    if(!activeTest)
        return;


    let correct = 0;


    activeTest.questions.forEach(
        (_,index) => {

            if(
                activeTest.answers[index] ===
                "correct"
            ){

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

        ...activeTest,

        completed:true,

        score,

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


    $("testBuilderMessage")
        &&
        (
            $("testBuilderMessage")
                .textContent =
                `Test completed. Your score is ${score}%.`
        );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(
    text
){

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

export function initTests(){

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

export function renderTests(){

    populateSubjects();

    renderStats();

    renderHistory();

}