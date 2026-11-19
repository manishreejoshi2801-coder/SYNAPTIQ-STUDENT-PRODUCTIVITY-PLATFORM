import {
    get,
    set,
    uid,
    $,
    esc,
    dateText
} from "./storage.js";

let filter = "all";

export function renderTasks() {

    let t =
        get("tasks", []);

    const s =
        $("taskSearch")
            .value
            .trim()
            .toLowerCase();

    t =
        t.filter(
            x =>
                x.name
                    .toLowerCase()
                    .includes(s) &&
                (
                    filter === "all" ||
                    (
                        filter === "pending" &&
                        !x.done
                    ) ||
                    (
                        filter === "done" &&
                        x.done
                    )
                )
        );

    $("taskList").innerHTML =
        t.length
            ? t.map(
                x =>
                    `
                    <div
                        class="
                        task-row
                        ${x.done ? "done" : ""}">

                        <input
                            type="checkbox"
                            data-task="${x.id}"
                            ${x.done ? "checked" : ""}
                        >

                        <div>

                            <div class="task-title">
                                ${esc(x.name)}
                            </div>

                            <div class="task-meta">
                                ${
                                    x.deadline
                                        ? dateText(x.deadline)
                                        : "No deadline"
                                }
                            </div>

                        </div>

                        <span class="tag">
                            ${esc(x.priority)}
                        </span>

                    </div>
                    `
              ).join("")
            : "<div class='item'>No tasks.</div>";
}

export function initTasks() {

    $("addTask").onclick =
        () =>
            $("taskModal")
                .classList
                .remove("hidden");

    $("taskSearch").oninput =
        renderTasks;

    document
        .querySelectorAll(".task-filter")
        .forEach(
            b =>
                b.onclick = () => {

                    document
                        .querySelectorAll(
                            ".task-filter"
                        )
                        .forEach(
                            x =>
                                x.classList
                                 .remove("active")
                        );

                    b.classList.add("active");

                    filter =
                        b.dataset.filter;

                    renderTasks();
                }
        );

    $("taskForm").onsubmit =
        e => {

            e.preventDefault();

            const t =
                get("tasks");

            t.push({
                id: uid(),
                name:
                    $("taskName")
                        .value
                        .trim(),
                priority:
                    $("taskPriority")
                        .value,
                deadline:
                    $("taskDeadline")
                        .value,
                done: false
            });

            set("tasks", t);

            e.target.reset();

            $("taskModal")
                .classList
                .add("hidden");

            renderTasks();
        };

    document.addEventListener(
        "change",
        e => {

            const id =
                e.target.dataset.task;

            if (!id) return;

            const t =
                get("tasks");

            const x =
                t.find(
                    a => a.id === id
                );

            if (x)
                x.done =
                    e.target.checked;

            set("tasks", t);

            renderTasks();
        }
    );
}