import {
    get,
    set,
    uid,
    $,
    esc,
    dateText
} from "./storage.js";


let filter = "all";

let editingTaskId = null;


/* =====================================================
   RENDER TASKS
===================================================== */

export function renderTasks() {

    let t =
        get(
            "tasks",
            []
        );


    const searchBox =
        $("taskSearch");


    const s =
        searchBox
            ? searchBox.value
                .trim()
                .toLowerCase()
            : "";


    t =
        t.filter(
            x =>
                String(
                    x.name || ""
                )
                    .toLowerCase()
                    .includes(s)
                &&
                (
                    filter === "all"
                    ||
                    (
                        filter === "pending"
                        &&
                        !x.done
                    )
                    ||
                    (
                        filter === "done"
                        &&
                        x.done
                    )
                )
        );


    const list =
        $("taskList");


    if (!list)
        return;


    list.innerHTML =
        t.length
            ?

            t.map(
                x =>
                    `

                    <div
                        class="
                            task-row
                            ${x.done ? "done" : ""}
                        "
                        style="
                            color:var(--text,#10233f);
                            background:var(--card,#ffffff);
                        "
                    >

                        <input
                            type="checkbox"
                            data-task="${x.id}"
                            ${x.done ? "checked" : ""}
                            aria-label="Mark task complete"
                        >


                        <div
                            style="
                                min-width:0;
                                flex:1;
                            "
                        >

                            <div
                                class="task-title"
                                style="
                                    color:var(--text,#10233f) !important;
                                    font-weight:700;
                                "
                            >
                                ${esc(
                                    x.name || ""
                                )}
                            </div>


                            <div
                                class="task-meta"
                                style="
                                    color:var(--muted,#64748b) !important;
                                "
                            >

                                ${
                                    x.deadline
                                        ?
                                        dateText(
                                            x.deadline
                                        )
                                        :
                                        "No deadline"
                                }

                            </div>

                        </div>


                        <span
                            class="tag"
                            style="
                                flex-shrink:0;
                            "
                        >
                            ${esc(
                                x.priority || "Medium"
                            )}
                        </span>


                        <div
                            class="task-actions"
                            style="
                                display:flex;
                                gap:7px;
                                align-items:center;
                                flex-shrink:0;
                            "
                        >

                            <button
                                type="button"
                                class="task-edit-btn"
                                data-edit-task="${x.id}"
                                style="
                                    padding:7px 10px;
                                    border-radius:8px;
                                    border:1px solid var(--border,#cbd5e1);
                                    background:transparent;
                                    color:var(--text,#10233f);
                                    cursor:pointer;
                                "
                            >
                                Edit
                            </button>


                            <button
                                type="button"
                                class="task-delete-btn"
                                data-delete-task="${x.id}"
                                style="
                                    padding:7px 10px;
                                    border-radius:8px;
                                    border:1px solid rgba(239,68,68,.35);
                                    background:transparent;
                                    color:#ef4444;
                                    cursor:pointer;
                                "
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                    `
            ).join("")

            :

            `
            <div class="item">
                No tasks.
            </div>
            `;
}


/* =====================================================
   RESET TASK FORM
===================================================== */

function resetTaskForm() {

    editingTaskId =
        null;


    const form =
        $("taskForm");


    if (form)
        form.reset();


    const title =
        $("taskModal")
            ?.querySelector("h2");


    if (title)
        title.textContent =
            "Add Task";


    const button =
        $("taskForm")
            ?.querySelector(
                "button[type='submit']"
            );


    if (button)
        button.textContent =
            "Create Task";

}


/* =====================================================
   EDIT TASK
===================================================== */

function editTask(id) {

    const tasks =
        get(
            "tasks",
            []
        );


    const task =
        tasks.find(
            x =>
                x.id === id
        );


    if (!task)
        return;


    editingTaskId =
        id;


    const name =
        $("taskName");


    const priority =
        $("taskPriority");


    const deadline =
        $("taskDeadline");


    if (name)
        name.value =
            task.name || "";


    if (priority)
        priority.value =
            task.priority || "Medium";


    if (deadline)
        deadline.value =
            task.deadline || "";


    const title =
        $("taskModal")
            ?.querySelector("h2");


    if (title)
        title.textContent =
            "Edit Task";


    const button =
        $("taskForm")
            ?.querySelector(
                "button[type='submit']"
            );


    if (button)
        button.textContent =
            "Save Changes";


    $("taskModal")
        ?.classList
        .remove(
            "hidden"
        );

}


/* =====================================================
   DELETE TASK
===================================================== */

function deleteTask(id) {

    const tasks =
        get(
            "tasks",
            []
        );


    const task =
        tasks.find(
            x =>
                x.id === id
        );


    if (!task)
        return;


    const confirmed =
        confirm(
            `Delete task "${task.name}"?`
        );


    if (!confirmed)
        return;


    const updated =
        tasks.filter(
            x =>
                x.id !== id
        );


    set(
        "tasks",
        updated
    );


    if (
        editingTaskId === id
    ) {

        resetTaskForm();

        $("taskModal")
            ?.classList
            .add(
                "hidden"
            );

    }


    renderTasks();

}


/* =====================================================
   INITIALIZE TASKS
===================================================== */

export function initTasks() {


    /* =================================================
       ADD TASK
    ================================================= */

    $("addTask").onclick =
        () => {

            resetTaskForm();

            $("taskModal")
                ?.classList
                .remove(
                    "hidden"
                );

        };


    /* =================================================
       SEARCH
    ================================================= */

    $("taskSearch").oninput =
        renderTasks;


    /* =================================================
       FILTERS
    ================================================= */

    document
        .querySelectorAll(
            ".task-filter"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        document
                            .querySelectorAll(
                                ".task-filter"
                            )
                            .forEach(
                                item =>
                                    item.classList
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


                        renderTasks();

                    };

            }
        );


    /* =================================================
       TASK FORM
    ================================================= */

    $("taskForm").onsubmit =
        event => {

            event.preventDefault();


            const tasks =
                get(
                    "tasks",
                    []
                );


            const name =
                $("taskName")
                    ?.value
                    ?.trim()
                    || "";


            const priority =
                $("taskPriority")
                    ?.value
                    || "Medium";


            const deadline =
                $("taskDeadline")
                    ?.value
                    || "";


            if (!name) {

                alert(
                    "Please enter a task name."
                );

                return;

            }


            /* =========================================
               EDIT EXISTING TASK
            ========================================= */

            if (editingTaskId) {

                const task =
                    tasks.find(
                        x =>
                            x.id ===
                            editingTaskId
                    );


                if (task) {

                    task.name =
                        name;


                    task.priority =
                        priority;


                    task.deadline =
                        deadline;

                }


                set(
                    "tasks",
                    tasks
                );


                resetTaskForm();


                $("taskModal")
                    ?.classList
                    .add(
                        "hidden"
                    );


                renderTasks();

                return;

            }


            /* =========================================
               CREATE NEW TASK
            ========================================= */

            tasks.push({

                id:
                    uid(),

                name,

                priority,

                deadline,

                done:
                    false

            });


            set(
                "tasks",
                tasks
            );


            resetTaskForm();


            $("taskModal")
                ?.classList
                .add(
                    "hidden"
                );


            renderTasks();

        };


    /* =================================================
       CHECKBOX + EDIT + DELETE
    ================================================= */

    document.addEventListener(
        "click",
        event => {

            const editId =
                event.target
                    .dataset
                    .editTask;


            if (editId) {

                editTask(
                    editId
                );

                return;

            }


            const deleteId =
                event.target
                    .dataset
                    .deleteTask;


            if (deleteId) {

                deleteTask(
                    deleteId
                );

                return;

            }

        }
    );


    /* =================================================
       COMPLETION
    ================================================= */

    document.addEventListener(
        "change",
        event => {

            const id =
                event.target
                    ?.dataset
                    ?.task;


            if (!id)
                return;


            const tasks =
                get(
                    "tasks",
                    []
                );


            const task =
                tasks.find(
                    x =>
                        x.id === id
                );


            if (task) {

                task.done =
                    event.target.checked;

            }


            set(
                "tasks",
                tasks
            );


            renderTasks();

        }
    );


    /* =================================================
       CLOSE / RESET WHEN MODAL CLOSE BUTTON IS USED
    ================================================= */

    document
        .querySelectorAll(
            '[data-close="taskModal"]'
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        resetTaskForm();

                    }
                );

            }
        );


    /* =================================================
       FIRST RENDER
    ================================================= */

    renderTasks();

}
