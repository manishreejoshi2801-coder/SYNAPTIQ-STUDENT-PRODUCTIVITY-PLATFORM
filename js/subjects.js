import {
    get,
    set,
    uid,
    $,
    esc
} from "./storage.js";


let editingSubjectId = null;
let selectedSubjectId = null;
let editingChapterId = null;


/* =====================================================
   SUBJECT COLOURS
===================================================== */

const subjectColors = {
    blue: "#4f7cff",
    cyan: "#20b8c5",
    violet: "#7b68ee",
    pink: "#ef7aa8",
    green: "#19ad8d"
};


/* =====================================================
   GET SUBJECT CONTAINER
   Supports both current and older HTML versions.
===================================================== */

function getSubjectContainer() {

    return (
        $("subjectCards")
        ||
        $("subjects")
    );

}


/* =====================================================
   RENDER SUBJECTS
===================================================== */

export function renderSubjects() {

    const container =
        getSubjectContainer();


    if (!container) {

        console.error(
            "Synaptiq: Subject container not found."
        );

        return;

    }


    const subjects =
        get(
            "subjects",
            []
        );


    /* -------------------------------------------------
       EMPTY STATE
    ------------------------------------------------- */

    if (!Array.isArray(subjects) || !subjects.length) {

        container.innerHTML = `
            <div class="item">
                No subjects yet.
            </div>
        `;

        return;

    }


    /* -------------------------------------------------
       RENDER SUBJECT CARDS
    ------------------------------------------------- */

    container.innerHTML =
        subjects
            .map(
                subject => {

                    const chapters =
                        Array.isArray(
                            subject.chapters
                        )
                            ? subject.chapters
                            : [];


                    const total =
                        chapters.length;


                    const completed =
                        chapters.filter(
                            chapter =>
                                chapter.done === true
                        ).length;


                    const percent =
                        total
                            ?
                            Math.round(
                                (
                                    completed /
                                    total
                                ) *
                                100
                            )
                            :
                            0;


                    const color =
                        subjectColors[
                            subject.color
                        ]
                        ||
                        (
                            typeof subject.color ===
                            "string"
                            &&
                            subject.color.startsWith("#")
                                ?
                                subject.color
                                :
                                "#4f7cff"
                        );


                    return `

                        <div
                            class="subject-card"
                            data-subject-id="${esc(
                                subject.id
                            )}"
                        >

                            <!-- TOP -->

                            <div
                                class="subject-top"
                            >

                                <span
                                    class="subject-dot"
                                    style="
                                        background:${color};
                                    "
                                ></span>


                                <div
                                    class="subject-actions"
                                >

                                    <button
                                        class="subject-edit-btn"
                                        type="button"
                                        data-edit-subject="${esc(
                                            subject.id
                                        )}"
                                        title="Edit subject"
                                    >
                                        ✏️
                                    </button>


                                    <button
                                        class="subject-delete-btn"
                                        type="button"
                                        data-delete-subject="${esc(
                                            subject.id
                                        )}"
                                        title="Delete subject"
                                    >
                                        🗑
                                    </button>

                                </div>

                            </div>


                            <!-- NAME -->

                            <h3>
                                ${esc(
                                    subject.name ||
                                    "Untitled Subject"
                                )}
                            </h3>


                            <!-- CHAPTER COUNT -->

                            <small>
                                ${total}
                                chapter${
                                    total === 1
                                        ? ""
                                        : "s"
                                }
                            </small>


                            <!-- PROGRESS -->

                            <div
                                class="progress"
                            >

                                <div
                                    style="
                                        width:${percent}%;
                                        background:${color};
                                    "
                                ></div>

                            </div>


                            <div
                                class="subject-progress-text"
                            >
                                ${completed}
                                /
                                ${total}
                                chapters completed
                            </div>


                            <!-- NOTES -->

                            ${
                                subject.notes
                                    ?

                                    `
                                    <div
                                        class="item subject-notes"
                                    >
                                        🗒
                                        ${esc(
                                            subject.notes
                                        )}
                                    </div>
                                    `

                                    :

                                    ""
                            }


                            <!-- CHAPTERS -->

                            <div
                                class="subject-chapters"
                            >

                                ${
                                    chapters.length

                                        ?

                                        chapters
                                            .map(
                                                chapter => `

                                                    <div
                                                        class="chapter-row"
                                                    >

                                                        <label
                                                            class="chapter"
                                                        >

                                                            <input
                                                                type="checkbox"
                                                                ${
                                                                    chapter.done
                                                                        ? "checked"
                                                                        : ""
                                                                }

                                                                data-toggle-chapter="${esc(
                                                                    subject.id
                                                                )}"

                                                                data-chapter-id="${esc(
                                                                    chapter.id
                                                                )}"
                                                            >

                                                            <span>
                                                                ${esc(
                                                                    chapter.name ||
                                                                    "Untitled Chapter"
                                                                )}
                                                            </span>

                                                        </label>


                                                        <div
                                                            class="chapter-actions"
                                                        >

                                                            <button
                                                                type="button"
                                                                class="chapter-edit-btn"
                                                                data-edit-chapter="${esc(
                                                                    subject.id
                                                                )}"
                                                                data-chapter-id="${esc(
                                                                    chapter.id
                                                                )}"
                                                                title="Edit chapter"
                                                            >
                                                                ✏️
                                                            </button>


                                                            <button
                                                                type="button"
                                                                class="chapter-delete-btn"
                                                                data-delete-chapter="${esc(
                                                                    subject.id
                                                                )}"
                                                                data-chapter-id="${esc(
                                                                    chapter.id
                                                                )}"
                                                                title="Delete chapter"
                                                            >
                                                                🗑
                                                            </button>

                                                        </div>

                                                    </div>

                                                `
                                            )
                                            .join("")

                                        :

                                        `
                                        <div
                                            class="chapter empty-chapter"
                                        >
                                            No chapters added yet.
                                        </div>
                                        `
                                }

                            </div>


                            <!-- ADD CHAPTER -->

                            <button
                                class="add-chapter"
                                type="button"
                                data-add-chapter="${esc(
                                    subject.id
                                )}"
                            >
                                + Add Chapter
                            </button>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =====================================================
   RESET SUBJECT FORM
===================================================== */

function resetSubjectForm() {

    editingSubjectId = null;


    $("subjectForm")
        ?.reset();


    const title =
        $("subjectModal")
            ?.querySelector("h2");


    if (title) {

        title.textContent =
            "Add Subject";

    }


    const button =
        $("subjectForm")
            ?.querySelector(
                "button[type='submit']"
            );


    if (button) {

        button.textContent =
            "Create Subject";

    }

}


/* =====================================================
   EDIT SUBJECT
===================================================== */

function editSubject(id) {

    const subjects =
        get(
            "subjects",
            []
        );


    const subject =
        subjects.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!subject)
        return;


    editingSubjectId =
        subject.id;


    $("subjectName")
        ?.setAttribute(
            "value",
            subject.name || ""
        );


    if ($("subjectName")) {

        $("subjectName").value =
            subject.name || "";

    }


    if ($("subjectColor")) {

        $("subjectColor").value =
            subject.color || "#4f7cff";

    }


    if ($("subjectNotes")) {

        $("subjectNotes").value =
            subject.notes || "";

    }


    const title =
        $("subjectModal")
            ?.querySelector("h2");


    if (title) {

        title.textContent =
            "Edit Subject";

    }


    const button =
        $("subjectForm")
            ?.querySelector(
                "button[type='submit']"
            );


    if (button) {

        button.textContent =
            "Save Changes";

    }


    $("subjectModal")
        ?.classList
        .remove("hidden");

}


/* =====================================================
   DELETE SUBJECT
===================================================== */

function deleteSubject(id) {

    const subjects =
        get(
            "subjects",
            []
        );


    const subject =
        subjects.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!subject)
        return;


    const confirmed =
        confirm(
            `Delete "${subject.name}" and all its chapters?`
        );


    if (!confirmed)
        return;


    set(
        "subjects",

        subjects.filter(
            item =>
                String(item.id) !==
                String(id)
        )
    );


    renderSubjects();

}


/* =====================================================
   RESET CHAPTER FORM
===================================================== */

function resetChapterForm() {

    selectedSubjectId = null;
    editingChapterId = null;


    $("chapterForm")
        ?.reset();


    const title =
        $("chapterModal")
            ?.querySelector("h2");


    if (title) {

        title.textContent =
            "Add Chapter";

    }


    const button =
        $("chapterForm")
            ?.querySelector(
                "button[type='submit']"
            );


    if (button) {

        button.textContent =
            "Add Chapter";

    }

}


/* =====================================================
   OPEN ADD CHAPTER
===================================================== */

function openAddChapter(
    subjectId
) {

    resetChapterForm();


    selectedSubjectId =
        subjectId;


    $("chapterModal")
        ?.classList
        .remove("hidden");

}


/* =====================================================
   EDIT CHAPTER
===================================================== */

function editChapter(
    subjectId,
    chapterId
) {

    const subjects =
        get(
            "subjects",
            []
        );


    const subject =
        subjects.find(
            item =>
                String(item.id) ===
                String(subjectId)
        );


    if (!subject)
        return;


    const chapter =
        (
            subject.chapters ||
            []
        )
        .find(
            item =>
                String(item.id) ===
                String(chapterId)
        );


    if (!chapter)
        return;


    selectedSubjectId =
        subject.id;


    editingChapterId =
        chapter.id;


    if ($("chapterName")) {

        $("chapterName").value =
            chapter.name || "";

    }


    if ($("chapterNotes")) {

        $("chapterNotes").value =
            chapter.notes || "";

    }


    const title =
        $("chapterModal")
            ?.querySelector("h2");


    if (title) {

        title.textContent =
            "Edit Chapter";

    }


    const button =
        $("chapterForm")
            ?.querySelector(
                "button[type='submit']"
            );


    if (button) {

        button.textContent =
            "Save Changes";

    }


    $("chapterModal")
        ?.classList
        .remove("hidden");

}


/* =====================================================
   DELETE CHAPTER
===================================================== */

function deleteChapter(
    subjectId,
    chapterId
) {

    const subjects =
        get(
            "subjects",
            []
        );


    const subject =
        subjects.find(
            item =>
                String(item.id) ===
                String(subjectId)
        );


    if (!subject)
        return;


    const chapter =
        (
            subject.chapters ||
            []
        )
        .find(
            item =>
                String(item.id) ===
                String(chapterId)
        );


    if (!chapter)
        return;


    const confirmed =
        confirm(
            `Delete chapter "${chapter.name}"?`
        );


    if (!confirmed)
        return;


    subject.chapters =
        (
            subject.chapters ||
            []
        )
        .filter(
            item =>
                String(item.id) !==
                String(chapterId)
        );


    set(
        "subjects",
        subjects
    );


    renderSubjects();

}


/* =====================================================
   INITIALIZE
===================================================== */

export function initSubjects(
    refresh
) {

    /* -------------------------------------------------
       ADD SUBJECT
    ------------------------------------------------- */

    $("addSubject")
        ?.addEventListener(
            "click",
            () => {

                resetSubjectForm();


                $("subjectModal")
                    ?.classList
                    .remove("hidden");

            }
        );


    /* -------------------------------------------------
       QUICK SUBJECT
    ------------------------------------------------- */

    $("quickSubject")
        ?.addEventListener(
            "click",
            () => {

                resetSubjectForm();


                $("subjectsPage")
                    ?.classList
                    .remove("hidden");


                renderSubjects();


                $("subjectModal")
                    ?.classList
                    .remove("hidden");

            }
        );


    /* -------------------------------------------------
       SUBJECT FORM
    ------------------------------------------------- */

    $("subjectForm")
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    $("subjectName")
                        ?.value
                        .trim();


                if (!name)
                    return;


                const subjects =
                    get(
                        "subjects",
                        []
                    );


                /* EDIT */

                if (editingSubjectId) {

                    const subject =
                        subjects.find(
                            item =>
                                String(item.id) ===
                                String(
                                    editingSubjectId
                                )
                        );


                    if (subject) {

                        subject.name =
                            name;


                        subject.color =
                            $("subjectColor")
                                ?.value
                            ||
                            "#4f7cff";


                        subject.notes =
                            $("subjectNotes")
                                ?.value
                                .trim()
                            ||
                            "";

                    }

                }


                /* ADD */

                else {

                    const exists =
                        subjects.some(
                            item =>
                                String(
                                    item.name || ""
                                )
                                .toLowerCase()
                                ===
                                name.toLowerCase()
                        );


                    if (exists) {

                        alert(
                            "This subject already exists."
                        );

                        return;

                    }


                    subjects.push({

                        id:
                            uid(),

                        name,

                        color:
                            $("subjectColor")
                                ?.value
                            ||
                            "#4f7cff",

                        notes:
                            $("subjectNotes")
                                ?.value
                                .trim()
                            ||
                            "",

                        chapters:
                            []

                    });

                }


                set(
                    "subjects",
                    subjects
                );


                editingSubjectId =
                    null;


                event.target.reset();


                $("subjectModal")
                    ?.classList
                    .add("hidden");


                renderSubjects();


                if (
                    typeof refresh ===
                    "function"
                ) {

                    refresh();

                }

            }
        );


    /* -------------------------------------------------
       CHAPTER FORM
    ------------------------------------------------- */

    $("chapterForm")
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    $("chapterName")
                        ?.value
                        .trim();


                if (
                    !name ||
                    !selectedSubjectId
                )
                    return;


                const subjects =
                    get(
                        "subjects",
                        []
                    );


                const subject =
                    subjects.find(
                        item =>
                            String(
                                item.id
                            ) ===
                            String(
                                selectedSubjectId
                            )
                    );


                if (!subject)
                    return;


                subject.chapters =
                    subject.chapters ||
                    [];


                /* EDIT CHAPTER */

                if (editingChapterId) {

                    const chapter =
                        subject.chapters.find(
                            item =>
                                String(
                                    item.id
                                ) ===
                                String(
                                    editingChapterId
                                )
                        );


                    if (chapter) {

                        chapter.name =
                            name;


                        chapter.notes =
                            $("chapterNotes")
                                ?.value
                                .trim()
                            ||
                            "";

                    }

                }


                /* ADD CHAPTER */

                else {

                    subject.chapters.push({

                        id:
                            uid(),

                        name,

                        notes:
                            $("chapterNotes")
                                ?.value
                                .trim()
                            ||
                            "",

                        done:
                            false

                    });

                }


                set(
                    "subjects",
                    subjects
                );


                event.target.reset();


                $("chapterModal")
                    ?.classList
                    .add("hidden");


                resetChapterForm();


                renderSubjects();


                if (
                    typeof refresh ===
                    "function"
                ) {

                    refresh();

                }

            }
        );


    /* -------------------------------------------------
       CARD CLICK ACTIONS
    ------------------------------------------------- */

    document.addEventListener(
        "click",
        event => {

            const target =
                event.target.closest(
                    "button"
                );


            if (!target)
                return;


            /* EDIT SUBJECT */

            const editSubjectId =
                target.dataset
                    .editSubject;


            if (editSubjectId) {

                editSubject(
                    editSubjectId
                );

                return;

            }


            /* DELETE SUBJECT */

            const deleteSubjectId =
                target.dataset
                    .deleteSubject;


            if (deleteSubjectId) {

                deleteSubject(
                    deleteSubjectId
                );


                if (
                    typeof refresh ===
                    "function"
                ) {

                    refresh();

                }

                return;

            }


            /* ADD CHAPTER */

            const addChapterId =
                target.dataset
                    .addChapter;


            if (addChapterId) {

                openAddChapter(
                    addChapterId
                );

                return;

            }


            /* EDIT CHAPTER */

            const editChapterSubjectId =
                target.dataset
                    .editChapter;


            const editChapterId =
                target.dataset
                    .chapterId;


            if (
                editChapterSubjectId &&
                editChapterId
            ) {

                editChapter(
                    editChapterSubjectId,
                    editChapterId
                );

                return;

            }


            /* DELETE CHAPTER */

            const deleteChapterSubjectId =
                target.dataset
                    .deleteChapter;


            const deleteChapterId =
                target.dataset
                    .chapterId;


            if (
                deleteChapterSubjectId &&
                deleteChapterId
            ) {

                deleteChapter(
                    deleteChapterSubjectId,
                    deleteChapterId
                );


                if (
                    typeof refresh ===
                    "function"
                ) {

                    refresh();

                }

            }

        }
    );


    /* -------------------------------------------------
       CHAPTER CHECKBOX
    ------------------------------------------------- */

    document.addEventListener(
        "change",
        event => {

            const input =
                event.target;


            if (
                !input.matches(
                    "input[data-toggle-chapter]"
                )
            )
                return;


            const subjectId =
                input.dataset
                    .toggleChapter;


            const chapterId =
                input.dataset
                    .chapterId;


            if (
                !subjectId ||
                !chapterId
            )
                return;


            const subjects =
                get(
                    "subjects",
                    []
                );


            const subject =
                subjects.find(
                    item =>
                        String(
                            item.id
                        ) ===
                        String(
                            subjectId
                        )
                );


            if (!subject)
                return;


            const chapter =
                (
                    subject.chapters ||
                    []
                )
                .find(
                    item =>
                        String(
                            item.id
                        ) ===
                        String(
                            chapterId
                        )
                );


            if (!chapter)
                return;


            chapter.done =
                input.checked;


            set(
                "subjects",
                subjects
            );


            renderSubjects();


            if (
                typeof refresh ===
                "function"
            ) {

                refresh();

            }

        }
    );


    /* -------------------------------------------------
       IMPORTANT:
       RENDER IMMEDIATELY
    ------------------------------------------------- */

    renderSubjects();

}


/* =====================================================
   AUTO RENDER WHEN MODULE LOADS
   This fixes the blank Subjects page even if app.js
   loads the module without calling renderSubjects().
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            renderSubjects();

        },
        {
            once: true
        }
    );

}
else {

    renderSubjects();

}