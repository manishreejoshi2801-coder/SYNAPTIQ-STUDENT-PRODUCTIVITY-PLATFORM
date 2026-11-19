import {
    get,
    set,
    uid,
    $,
    esc
} from "./storage.js";


let filter = "all";
let view = "all";

let revision = [];
let ri = 0;

let flash = null;

let editingQuestionId = null;


/* =====================================================
   FILL SUBJECT DROPDOWN
===================================================== */

function fill() {

    const subjects =
        get(
            "subjects",
            []
        );


    $("questionSubject").innerHTML =
        subjects.length
            ?

            subjects
                .map(
                    subject =>
                        `
                        <option
                            value="${esc(subject.name)}"
                        >
                            ${esc(subject.name)}
                        </option>
                        `
                )
                .join("")

            :

            `
            <option value="General">
                General
            </option>
            `;

}


/* =====================================================
   OPEN QUESTION MODAL
===================================================== */

function openQuestionModal() {

    const modal =
        $("questionModal");


    if (!modal)
        return;


    modal.classList
        .remove("hidden");

}


/* =====================================================
   CLOSE QUESTION MODAL
===================================================== */

function closeQuestionModal() {

    const modal =
        $("questionModal");


    if (!modal)
        return;


    modal.classList
        .add("hidden");


    resetQuestionForm();

}


/* =====================================================
   RESET QUESTION FORM
===================================================== */

function resetQuestionForm() {

    editingQuestionId =
        null;


    const form =
        $("questionForm");


    if (form)
        form.reset();


    const title =
        $("questionModal")
            ?.querySelector("h2");


    if (title) {

        title.textContent =
            "Add a revision question";

    }


    const small =
        $("questionModal")
            ?.querySelector("small");


    if (small) {

        small.textContent =
            "NEW QUESTION";

    }


    const submitButton =
        $("questionForm")
            ?.querySelector(
                "button[type='submit']"
            );


    if (submitButton) {

        submitButton.textContent =
            "Save Question";

    }

}


/* =====================================================
   OPEN EDIT MODE
===================================================== */

function editQuestion(id) {

    const questions =
        get(
            "questions",
            []
        );


    const question =
        questions.find(
            item =>
                item.id === id
        );


    if (!question)
        return;


    editingQuestionId =
        id;


    fill();


    $("questionText")
        .value =
        question.text || "";


    if ($("questionAnswer")) {

        $("questionAnswer")
            .value =
            question.answer || "";

    }


    $("questionSubject")
        .value =
        question.subject || "General";


    $("questionTopic")
        .value =
        question.topic || "";


    $("questionDifficulty")
        .value =
        question.difficulty || "Medium";


    $("questionTag")
        .value =
        question.tag || "REVISION";


    if ($("questionImportant")) {

        $("questionImportant")
            .checked =
            Boolean(
                question.important
            );

    }


    const title =
        $("questionModal")
            ?.querySelector("h2");


    if (title) {

        title.textContent =
            "Edit Question";

    }


    const small =
        $("questionModal")
            ?.querySelector("small");


    if (small) {

        small.textContent =
            "EDIT QUESTION";

    }


    const submitButton =
        $("questionForm")
            ?.querySelector(
                "button[type='submit']"
            );


    if (submitButton) {

        submitButton.textContent =
            "Update Question";

    }


    openQuestionModal();

}


/* =====================================================
   RENDER QUESTIONS
===================================================== */

export function renderQuestions() {

    let questions =
        get(
            "questions",
            []
        );


    const searchBox =
        $("questionSearch");


    const search =
        searchBox
            ?
            searchBox
                .value
                .trim()
                .toLowerCase()
            :
            "";


    questions =
        questions.filter(
            question => {

                const text =
                    String(
                        question.text || ""
                    )
                        .toLowerCase();


                const subject =
                    String(
                        question.subject || ""
                    )
                        .toLowerCase();


                const matchesSearch =
                    text.includes(search)
                    ||
                    subject.includes(search);


                const matchesFilter =
                    filter === "all"
                    ||
                    question.tag === filter;


                const matchesView =
                    view === "all"

                    ||

                    (
                        view === "pyq"
                        &&
                        question.tag === "PYQ"
                    )

                    ||

                    (
                        view === "mistake"
                        &&
                        question.tag === "MISTAKE"
                    );


                return (
                    matchesSearch &&
                    matchesFilter &&
                    matchesView
                );

            }
        );


    const cards =
        $("questionCards");


    if (!cards)
        return;


    cards.innerHTML =
        questions.length

            ?

            questions
                .map(
                    question => `

                        <div
                            class="question-card"
                        >

                            <div
                                class="question-head"
                            >

                                <div
                                    class="question-text"
                                >

                                    ${
                                        question.important
                                            ? "⭐ "
                                            : ""
                                    }

                                    ${esc(
                                        question.text || ""
                                    )}

                                </div>


                                <span
                                    class="tag"
                                >

                                    ${esc(
                                        question.tag ||
                                        "REVISION"
                                    )}

                                </span>

                            </div>


                            <!-- ANSWER -->

                            <div
                                class="
                                    question-answer-box
                                    hidden
                                "
                                id="answer-${question.id}"
                            >

                                <div
                                    class="answer-label"
                                >
                                    ANSWER
                                </div>


                                <div
                                    class="question-answer"
                                >

                                    ${esc(
                                        question.answer ||
                                        "No answer added."
                                    )}

                                </div>

                            </div>


                            <!-- META -->

                            <div
                                class="meta"
                            >

                                ${esc(
                                    question.subject ||
                                    "General"
                                )}

                                ${
                                    question.topic
                                        ?
                                        " • " +
                                        esc(
                                            question.topic
                                        )
                                        :
                                        ""
                                }

                                ${
                                    question.difficulty
                                        ?
                                        " • " +
                                        esc(
                                            question.difficulty
                                        )
                                        :
                                        ""
                                }

                            </div>


                            <!-- ACTIONS -->

                            <div
                                class="question-actions"
                            >

                                <button
                                    type="button"
                                    data-qanswer="${question.id}"
                                >
                                    👁 Show Answer
                                </button>


                                <button
                                    type="button"
                                    data-qedit="${question.id}"
                                >
                                    ✏️ Edit
                                </button>


                                <button
                                    type="button"
                                    data-qdone="${question.id}"
                                >

                                    ${
                                        question.done
                                            ?
                                            "✅ Done"
                                            :
                                            "○ Mark Done"
                                    }

                                </button>


                                <button
                                    type="button"
                                    data-qmistake="${question.id}"
                                >
                                    ❌ Mistake
                                </button>


                                <button
                                    type="button"
                                    data-qflash="${question.id}"
                                >
                                    🧠 Flashcard
                                </button>


                                <button
                                    type="button"
                                    data-qdelete="${question.id}"
                                >
                                    🗑 Delete
                                </button>

                            </div>

                        </div>

                    `
                )
                .join("")

            :

            `
            <div class="item">
                No questions found.
            </div>
            `;

}


/* =====================================================
   REVISION
===================================================== */

function showRevision() {

    const question =
        revision[ri];


    if (!question)
        return;


    $("revisionTitle")
        .textContent =
        question.subject ||
        "General";


    $("revisionCount")
        .textContent =
        `Question ${ri + 1} / ${revision.length}`;


    $("revisionQuestion")
        .textContent =
        question.text;


    $("revisionModal")
        .classList
        .remove("hidden");

}


/* =====================================================
   INITIALIZE
===================================================== */

export function initQuestions(
    refresh
) {


    /* -------------------------------------------------
       ADD QUESTION
    ------------------------------------------------- */

    $("addQuestion")
        ?.addEventListener(
            "click",
            () => {

                resetQuestionForm();

                fill();

                openQuestionModal();

            }
        );


    /* -------------------------------------------------
       CLOSE QUESTION MODAL
    ------------------------------------------------- */

    document
        .querySelectorAll(
            '[data-close="questionModal"]'
        )
        .forEach(
            button => {

                button.onclick =
                    event => {

                        event.preventDefault();

                        event.stopPropagation();

                        closeQuestionModal();

                    };

            }
        );


    /*
       Extra fallback in case the close button
       is specifically identified by ID.
    */

    $("closeQuestion")
        ?.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                closeQuestionModal();

            }
        );


    /* -------------------------------------------------
       SEARCH
    ------------------------------------------------- */

    $("questionSearch")
        ?.addEventListener(
            "input",
            renderQuestions
        );


    /* -------------------------------------------------
       FILTERS
    ------------------------------------------------- */

    document
        .querySelectorAll(
            ".filter"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        document
                            .querySelectorAll(
                                ".filter"
                            )
                            .forEach(
                                x =>
                                    x.classList
                                        .remove(
                                            "active"
                                        )
                            );


                        button.classList
                            .add(
                                "active"
                            );


                        filter =
                            button.dataset
                                .filter;


                        renderQuestions();

                    };

            }
        );


    /* -------------------------------------------------
       ALL QUESTIONS
    ------------------------------------------------- */

    $("showAllQuestions")
        ?.addEventListener(
            "click",
            () => {

                view =
                    "all";


                document
                    .querySelectorAll(
                        ".tab"
                    )
                    .forEach(
                        x =>
                            x.classList
                                .remove(
                                    "active"
                                )
                    );


                $("showAllQuestions")
                    ?.classList
                    .add(
                        "active"
                    );


                renderQuestions();

            }
        );


    /* -------------------------------------------------
       PYQ
    ------------------------------------------------- */

    $("showPYQQuestions")
        ?.addEventListener(
            "click",
            () => {

                view =
                    "pyq";


                document
                    .querySelectorAll(
                        ".tab"
                    )
                    .forEach(
                        x =>
                            x.classList
                                .remove(
                                    "active"
                                )
                    );


                $("showPYQQuestions")
                    ?.classList
                    .add(
                        "active"
                    );


                renderQuestions();

            }
        );


    /* -------------------------------------------------
       MISTAKES
    ------------------------------------------------- */

    $("showMistakes")
        ?.addEventListener(
            "click",
            () => {

                view =
                    "mistake";


                document
                    .querySelectorAll(
                        ".tab"
                    )
                    .forEach(
                        x =>
                            x.classList
                                .remove(
                                    "active"
                                )
                    );


                $("showMistakes")
                    ?.classList
                    .add(
                        "active"
                    );


                renderQuestions();

            }
        );


    /* -------------------------------------------------
       ADD SUBJECT FROM QUESTION BANK
    ------------------------------------------------- */

    $("addSubjectFromQuestion")
        ?.addEventListener(
            "click",
            () => {

                $("questionNewSubjectBox")
                    ?.classList
                    .remove(
                        "hidden"
                    );


                $("questionNewSubjectName")
                    ?.focus();

            }
        );


    /* -------------------------------------------------
       CANCEL NEW SUBJECT
    ------------------------------------------------- */

    $("cancelQuestionSubject")
        ?.addEventListener(
            "click",
            () => {

                $("questionNewSubjectBox")
                    ?.classList
                    .add(
                        "hidden"
                    );


                if (
                    $("questionNewSubjectName")
                ) {

                    $("questionNewSubjectName")
                        .value =
                        "";

                }

            }
        );


    /* -------------------------------------------------
       SAVE NEW SUBJECT
    ------------------------------------------------- */

    $("saveQuestionSubject")
        ?.addEventListener(
            "click",
            () => {

                const name =
                    $("questionNewSubjectName")
                        ?.value
                        ?.trim();


                if (!name)
                    return;


                const subjects =
                    get(
                        "subjects",
                        []
                    );


                const existing =
                    subjects.find(
                        subject =>
                            String(
                                subject.name
                            )
                                .toLowerCase()
                            ===
                            name
                                .toLowerCase()
                    );


                if (existing) {

                    fill();


                    $("questionSubject")
                        .value =
                        existing.name;

                }
                else {

                    subjects.push({

                        id:
                            uid(),

                        name,

                        color:
                            "#4f7cff",

                        chapters:
                            []

                    });


                    set(
                        "subjects",
                        subjects
                    );


                    fill();


                    $("questionSubject")
                        .value =
                        name;

                }


                $("questionNewSubjectName")
                    .value =
                    "";


                $("questionNewSubjectBox")
                    ?.classList
                    .add(
                        "hidden"
                    );


                if (
                    typeof refresh ===
                    "function"
                ) {

                    refresh();

                }

            }
        );


    /* =================================================
       SAVE / UPDATE QUESTION
    ================================================= */

    $("questionForm")
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const text =
                    $("questionText")
                        ?.value
                        ?.trim()
                        || "";


                const answer =
                    $("questionAnswer")
                        ?
                        $("questionAnswer")
                            .value
                            .trim()
                        :
                        "";


                if (!text)
                    return;


                const questions =
                    get(
                        "questions",
                        []
                    );


                /* -----------------------------------------
                   EDIT EXISTING QUESTION
                ----------------------------------------- */

                if (editingQuestionId) {

                    const question =
                        questions.find(
                            item =>
                                item.id ===
                                editingQuestionId
                        );


                    if (question) {

                        question.text =
                            text;


                        question.answer =
                            answer;


                        question.subject =
                            $("questionSubject")
                                .value;


                        question.topic =
                            $("questionTopic")
                                .value
                                .trim();


                        question.tag =
                            $("questionTag")
                                .value;


                        question.difficulty =
                            $("questionDifficulty")
                                .value;


                        question.important =
                            $("questionImportant")
                                ?
                                $("questionImportant")
                                    .checked
                                :
                                false;

                    }

                }


                /* -----------------------------------------
                   ADD NEW QUESTION
                ----------------------------------------- */

                else {

                    questions.push({

                        id:
                            uid(),

                        text,

                        answer,

                        subject:
                            $("questionSubject")
                                .value,

                        topic:
                            $("questionTopic")
                                .value
                                .trim(),

                        tag:
                            $("questionTag")
                                .value,

                        difficulty:
                            $("questionDifficulty")
                                .value,

                        done:
                            false,

                        important:
                            $("questionImportant")
                                ?
                                $("questionImportant")
                                    .checked
                                :
                                false

                    });

                }


                set(
                    "questions",
                    questions
                );


                editingQuestionId =
                    null;


                event.target.reset();


                closeQuestionModal();


                renderQuestions();


                if (
                    typeof refresh ===
                    "function"
                ) {

                    refresh();

                }

            }
        );


    /* =================================================
       QUESTION ACTIONS
    ================================================= */

    document.addEventListener(
        "click",
        event => {

            let id;


            /* -----------------------------------------
               SHOW / HIDE ANSWER
            ----------------------------------------- */

            id =
                event.target
                    ?.dataset
                    ?.qanswer;


            if (id) {

                const answerBox =
                    document.getElementById(
                        `answer-${id}`
                    );


                if (!answerBox)
                    return;


                const hidden =
                    answerBox
                        .classList
                        .toggle(
                            "hidden"
                        );


                event.target.textContent =
                    hidden
                        ?
                        "👁 Show Answer"
                        :
                        "🙈 Hide Answer";

                return;

            }


            /* -----------------------------------------
               EDIT QUESTION
            ----------------------------------------- */

            id =
                event.target
                    ?.dataset
                    ?.qedit;


            if (id) {

                editQuestion(id);

                return;

            }


            /* -----------------------------------------
               MARK DONE
            ----------------------------------------- */

            id =
                event.target
                    ?.dataset
                    ?.qdone;


            if (id) {

                const questions =
                    get(
                        "questions",
                        []
                    );


                const question =
                    questions.find(
                        x =>
                            x.id === id
                    );


                if (question) {

                    question.done =
                        !question.done;

                }


                set(
                    "questions",
                    questions
                );


                renderQuestions();


                if (
                    typeof refresh ===
                    "function"
                ) {

                    refresh();

                }


                return;

            }


            /* -----------------------------------------
               MISTAKE
            ----------------------------------------- */

            id =
                event.target
                    ?.dataset
                    ?.qmistake;


            if (id) {

                const questions =
                    get(
                        "questions",
                        []
                    );


                const question =
                    questions.find(
                        x =>
                            x.id === id
                    );


                if (question) {

                    question.tag =
                        "MISTAKE";


                    question.done =
                        false;

                }


                set(
                    "questions",
                    questions
                );


                renderQuestions();

                return;

            }


            /* -----------------------------------------
               DELETE
            ----------------------------------------- */

            id =
                event.target
                    ?.dataset
                    ?.qdelete;


            if (id) {

                const questions =
                    get(
                        "questions",
                        []
                    );


                const question =
                    questions.find(
                        x =>
                            x.id === id
                    );


                if (!question)
                    return;


                const confirmed =
                    confirm(
                        "Delete this question?"
                    );


                if (!confirmed)
                    return;


                const updated =
                    questions.filter(
                        x =>
                            x.id !== id
                    );


                set(
                    "questions",
                    updated
                );


                renderQuestions();


                if (
                    typeof refresh ===
                    "function"
                ) {

                    refresh();

                }


                return;

            }


            /* -----------------------------------------
               FLASHCARD
            ----------------------------------------- */

            id =
                event.target
                    ?.dataset
                    ?.qflash;


            if (id) {

                flash =
                    get(
                        "questions",
                        []
                    )
                    .find(
                        x =>
                            x.id === id
                    );


                if (!flash)
                    return;


                $("flashContent")
                    .textContent =
                    flash.text;


                $("flashModal")
                    ?.classList
                    .remove(
                        "hidden"
                    );

            }

        }
    );


    /* =================================================
       QUICK REVISION
    ================================================= */

    $("quickRevision")
        ?.addEventListener(
            "click",
            () => {

                revision =
                    get(
                        "questions",
                        []
                    )
                    .filter(
                        x =>
                            !x.done
                    );


                if (!revision.length) {

                    alert(
                        "No pending questions."
                    );


                    return;

                }


                ri =
                    0;


                showRevision();

            }
        );


    /* =================================================
       EXAM REVISION
    ================================================= */

    $("examRevision")
        ?.addEventListener(
            "click",
            () => {

                revision =
                    get(
                        "questions",
                        []
                    )
                    .filter(
                        x =>
                            x.tag === "PYQ"
                            ||
                            x.tag === "IMPORTANT"
                    );


                if (!revision.length) {

                    alert(
                        "No exam questions saved."
                    );


                    return;

                }


                ri =
                    0;


                showRevision();

            }
        );


    /* =================================================
       REVISION PREVIOUS
    ================================================= */

    $("revisionPrev")
        ?.addEventListener(
            "click",
            () => {

                if (
                    ri > 0
                ) {

                    ri--;

                    showRevision();

                }

            }
        );


    /* =================================================
       REVISION NEXT
    ================================================= */

    $("revisionNext")
        ?.addEventListener(
            "click",
            () => {

                if (
                    ri <
                    revision.length - 1
                ) {

                    ri++;

                    showRevision();

                }

            }
        );


    /* =================================================
       REVISE AGAIN
    ================================================= */

    $("revisionAgain")
        ?.addEventListener(
            "click",
            () => {

                showRevision();

            }
        );


    /* =================================================
       I KNOW THIS
    ================================================= */

    $("revisionKnow")
        ?.addEventListener(
            "click",
            () => {

                if (!revision[ri])
                    return;


                const questions =
                    get(
                        "questions",
                        []
                    );


                const question =
                    questions.find(
                        x =>
                            x.id ===
                            revision[ri].id
                    );


                if (question) {

                    question.done =
                        true;

                }


                set(
                    "questions",
                    questions
                );


                revision.splice(
                    ri,
                    1
                );


                if (
                    !revision.length
                ) {

                    $("revisionModal")
                        ?.classList
                        .add(
                            "hidden"
                        );


                    renderQuestions();


                    return;

                }


                ri =
                    Math.min(
                        ri,
                        revision.length - 1
                    );


                showRevision();


                renderQuestions();

            }
        );


    /* =================================================
       FLASHCARD
    ================================================= */

    $("flashFlip")
        ?.addEventListener(
            "click",
            () => {

                if (!flash)
                    return;


                if (flash.answer) {

                    $("flashContent")
                        .textContent =
                        `Answer:\n\n${flash.answer}`;

                }
                else {

                    $("flashContent")
                        .textContent =
                        `Subject: ${
                            flash.subject ||
                            "General"
                        }

Topic: ${
    flash.topic ||
    "General"
}

Difficulty: ${
    flash.difficulty ||
    "Medium"
}`;

                }

            }
        );


    /* =================================================
       INITIAL RENDER
    ================================================= */

    fill();

    renderQuestions();

}