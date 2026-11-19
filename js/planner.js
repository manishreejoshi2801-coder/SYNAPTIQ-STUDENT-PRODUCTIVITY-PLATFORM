import {
    get,
    set,
    $,
    esc,
    uid
} from "./storage.js";


let plannerData = null;


/* =====================================================
   HELPERS
===================================================== */

function todayDate() {
    return new Date()
        .toISOString()
        .slice(0, 10);
}


function daysUntil(dateValue) {

    if (!dateValue)
        return 1;

    const today = new Date();

    const target = new Date(
        dateValue + "T00:00:00"
    );

    const diff =
        target.getTime() -
        today.getTime();

    return Math.max(
        1,
        Math.ceil(diff / 86400000)
    );
}


function splitSubjects(value) {

    return String(value || "")
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
}


/* =====================================================
   READ CUSTOM INSTRUCTIONS
===================================================== */

function readPlannerInstructions(
    text,
    subjects = []
) {

    const value =
        String(text || "")
            .toLowerCase()
            .trim();

    const preferences = {

        prioritySubjects: [],
        extraRevision: false,
        revisionEveryThreeDays: false,
        lightSunday: false,
        difficultMorning: false,
        shortSessions: false,
        longSessions: false,
        moreBreaks: false,
        morePractice: false,
        moreConcepts: false

    };


    if (!value)
        return preferences;


    /* SUBJECT PRIORITY */

    subjects.forEach(subject => {

        const name =
            String(subject)
                .toLowerCase()
                .trim();

        if (!name)
            return;

        const patterns = [

            `more time to ${name}`,
            `more time for ${name}`,
            `focus more on ${name}`,
            `focus on ${name}`,
            `prioritize ${name}`,
            `priority ${name}`,
            `give priority to ${name}`,
            `extra time to ${name}`,
            `extra time for ${name}`,
            `study ${name} more`

        ];


        if (
            patterns.some(
                pattern =>
                    value.includes(pattern)
            )
        ) {

            if (
                !preferences.prioritySubjects
                    .includes(name)
            ) {

                preferences.prioritySubjects
                    .push(name);

            }

        }

    });


    /* REVISION */

    if (
        value.includes("revision") ||
        value.includes("revise")
    ) {

        preferences.extraRevision = true;

    }


    if (
        value.includes("every 3 days") ||
        value.includes("every three days")
    ) {

        preferences.extraRevision = true;
        preferences.revisionEveryThreeDays = true;

    }


    /* SUNDAY */

    if (
        value.includes("light sunday") ||
        value.includes("keep sunday light") ||
        value.includes("sunday light") ||
        value.includes("less study on sunday")
    ) {

        preferences.lightSunday = true;

    }


    /* MORNING */

    if (
        value.includes("morning") &&
        (
            value.includes("difficult") ||
            value.includes("hard") ||
            value.includes("weak")
        )
    ) {

        preferences.difficultMorning = true;

    }


    /* SESSION LENGTH */

    if (
        value.includes("short sessions") ||
        value.includes("short study sessions") ||
        value.includes("smaller sessions") ||
        value.includes("shorter sessions")
    ) {

        preferences.shortSessions = true;

    }


    if (
        value.includes("long sessions") ||
        value.includes("long study sessions")
    ) {

        preferences.longSessions = true;

    }


    /* BREAKS */

    if (
        value.includes("more breaks") ||
        value.includes("frequent breaks") ||
        value.includes("more break")
    ) {

        preferences.moreBreaks = true;

    }


    /* PRACTICE */

    if (
        value.includes("more practice") ||
        value.includes("more questions") ||
        value.includes("more pyq") ||
        value.includes("more previous year") ||
        value.includes("more previous-year")
    ) {

        preferences.morePractice = true;

    }


    /* CONCEPTS */

    if (
        value.includes("more concepts") ||
        value.includes("more theory") ||
        value.includes("focus on concepts")
    ) {

        preferences.moreConcepts = true;

    }


    return preferences;

}


/* =====================================================
   CREATE PLANNER PAGE
===================================================== */

function ensurePlannerPage() {

    const page =
        $("plannerPage");

    if (!page)
        return;

    if (
        page.dataset.plannerReady ===
        "true"
    )
        return;

    page.dataset.plannerReady =
        "true";


    page.innerHTML = `

        <div class="page-head">

            <div>

                <small>
                    ADAPTIVE PLANNER
                </small>

                <h1>
                    Study Planner
                </h1>

                <p>
                    Build a personalized plan around your exam date,
                    available time and study priorities.
                </p>

            </div>

            <button
                id="plannerBuildButton"
                class="primary"
                type="button"
            >
                + Build New Plan
            </button>

        </div>


        <div
            id="plannerSummary"
            class="planner-summary"
        ></div>


        <div
            id="plannerCards"
            class="planner-grid"
        ></div>


        <div
            id="plannerEmpty"
            class="panel planner-empty"
        >

            <small>
                READY TO PLAN
            </small>

            <h2>
                No study plan yet.
            </h2>

            <p>
                Create an adaptive study plan by entering
                your exam details and study preferences.
            </p>

            <button
                id="plannerEmptyButton"
                class="primary"
                type="button"
            >
                Generate Adaptive Plan
            </button>

        </div>

    `;

}


/* =====================================================
   ADD EXTRA PLANNER FIELDS
===================================================== */

function ensurePlannerFields() {

    const form =
        $("plannerForm");

    if (!form)
        return;


    /* STRONG */

    if (!$("plannerStrong")) {

        const wrap =
            document.createElement("div");

        wrap.innerHTML = `
            <label>
                Strong Subjects
            </label>

            <input
                id="plannerStrong"
                placeholder="Example: DBMS, Maths"
            >
        `;

        form.appendChild(
            wrap.firstElementChild
        );

        form.appendChild(
            wrap.lastElementChild
        );

    }


    /* WEAK */

    if (!$("plannerWeak")) {

        const wrap =
            document.createElement("div");

        wrap.innerHTML = `
            <label>
                Weak Subjects
            </label>

            <input
                id="plannerWeak"
                placeholder="Example: OS, COA"
            >
        `;

        form.appendChild(
            wrap.firstElementChild
        );

        form.appendChild(
            wrap.lastElementChild
        );

    }


    /* DAYS */

    if (!$("plannerDays")) {

        const wrap =
            document.createElement("div");

        wrap.innerHTML = `
            <label>
                Study Days / Week
            </label>

            <input
                id="plannerDays"
                type="number"
                min="1"
                max="7"
                value="6"
            >
        `;

        form.appendChild(
            wrap.firstElementChild
        );

        form.appendChild(
            wrap.lastElementChild
        );

    }


    /* TARGET */

    if (!$("plannerTarget")) {

        const wrap =
            document.createElement("div");

        wrap.innerHTML = `
            <label>
                Target Score
            </label>

            <input
                id="plannerTarget"
                type="number"
                min="1"
                max="100"
                value="70"
            >
        `;

        form.appendChild(
            wrap.firstElementChild
        );

        form.appendChild(
            wrap.lastElementChild
        );

    }


    /* NEW PLAN CUSTOMIZATION */

    if (!$("plannerInstructions")) {

        const box =
            document.createElement("div");

        box.id =
            "plannerCustomizationBox";

        box.style.cssText = `
            margin-top:18px;
            padding:18px;
            border-radius:16px;
            border:1px solid rgba(255,255,255,.15);
            background:rgba(255,255,255,.05);
            width:100%;
            box-sizing:border-box;
        `;

        box.innerHTML = `

            <label
                style="
                    display:block;
                    font-weight:700;
                    margin-bottom:7px;
                "
            >
                Customize Your Study Plan
            </label>

            <p
                style="
                    margin:0 0 12px;
                    font-size:13px;
                    opacity:.75;
                    line-height:1.5;
                "
            >
                Tell Synaptiq how you want your plan
                to be customized.
            </p>

            <textarea
                id="plannerInstructions"
                rows="6"
                placeholder="Example:
Give more time to DBMS.
Keep Sunday light.
Add revision every 3 days.
Focus more on weak subjects.
Study difficult topics in the morning.
Add more PYQs.
Keep sessions short.
Take more breaks."
                style="
                    width:100%;
                    box-sizing:border-box;
                    min-height:130px;
                    padding:13px;
                    resize:vertical;
                    border-radius:11px;
                    border:1px solid rgba(255,255,255,.2);
                    background:rgba(255,255,255,.08);
                    color:inherit;
                    font:inherit;
                    line-height:1.5;
                    outline:none;
                "
            ></textarea>

        `;

        form.appendChild(box);

    }

}


/* =====================================================
   NEW PLAN MODAL
===================================================== */

function openPlannerModal() {

    ensurePlannerFields();

    $("plannerModal")
        ?.classList
        .remove("hidden");

}


function closePlannerModal() {

    $("plannerModal")
        ?.classList
        .add("hidden");

}


/* =====================================================
   GENERATE NEW PLAN
===================================================== */

function generatePlan(data) {

    const days =
        daysUntil(data.date);

    const totalWeeks =
        Math.max(
            1,
            Math.min(
                12,
                Math.ceil(days / 7)
            )
        );


    const strong =
        splitSubjects(data.strong);

    const weak =
        splitSubjects(data.weak);


    const subjects =
        get(
            "subjects",
            []
        );


    let allSubjects =
        subjects.map(
            subject =>
                subject.name
        );


    if (!allSubjects.length) {

        allSubjects = [
            ...weak,
            ...strong
        ];

    }


    const uniqueSubjects = [
        ...new Set(
            allSubjects
                .filter(Boolean)
                .map(
                    subject =>
                        String(subject)
                            .trim()
                )
        )
    ];


    const preferences =
        readPlannerInstructions(
            data.instructions,
            uniqueSubjects
        );


    const generatedWeeks = [];


    for (
        let index = 0;
        index < totalWeeks;
        index++
    ) {

        const progress =
            index /
            Math.max(
                1,
                totalWeeks - 1
            );


        let phase;


        if (progress < 0.45) {

            phase =
                "Concept Study";

        }
        else if (progress < 0.75) {

            phase =
                "PYQ + Practice";

        }
        else {

            phase =
                "Revision + Mock";

        }


        if (preferences.morePractice)
            phase =
                "PYQ + Practice";


        if (
            preferences.moreConcepts &&
            progress < 0.60
        ) {

            phase =
                "Concept Study";

        }


        const weekItems = [];


        /* PRIORITY */

        if (
            preferences
                .prioritySubjects
                .length
        ) {

            const priority =
                preferences
                    .prioritySubjects[
                        index %
                        preferences.prioritySubjects.length
                    ];

            weekItems.push(
                `Priority Study: ${priority}`
            );

            weekItems.push(
                `Extra Time: ${priority}`
            );

        }
        else if (weak.length) {

            weekItems.push(
                `Weak Area: ${
                    weak[
                        index %
                        weak.length
                    ]
                }`
            );

        }
        else if (uniqueSubjects.length) {

            weekItems.push(
                `Priority Study: ${
                    uniqueSubjects[
                        index %
                        uniqueSubjects.length
                    ]
                }`
            );

        }
        else {

            weekItems.push(
                "Identify and study weak topics"
            );

        }


        /* SECOND SUBJECT */

        if (strong.length) {

            weekItems.push(
                `Strengthen: ${
                    strong[
                        index %
                        strong.length
                    ]
                }`
            );

        }
        else if (
            uniqueSubjects.length > 1
        ) {

            weekItems.push(
                `Core Study: ${
                    uniqueSubjects[
                        (index + 1) %
                        uniqueSubjects.length
                    ]
                }`
            );

        }
        else {

            weekItems.push(
                "Core subject study"
            );

        }


        /* PHASE */

        if (phase === "Concept Study") {

            weekItems.push(
                "Concept learning + short notes"
            );

            weekItems.push(
                "Daily question practice"
            );

        }
        else if (
            phase === "PYQ + Practice"
        ) {

            weekItems.push(
                "Previous-year questions"
            );

            weekItems.push(
                "Timed practice session"
            );

        }
        else {

            weekItems.push(
                "Full revision"
            );

            weekItems.push(
                "Mock test + mistake analysis"
            );

        }


        /* REVISION */

        if (
            preferences.extraRevision
        ) {

            weekItems.push(
                preferences.revisionEveryThreeDays
                    ?
                    "Revision session every 3 days"
                    :
                    "Additional revision session"
            );

        }


        /* MORNING */

        if (
            preferences.difficultMorning
        ) {

            weekItems.push(
                "Study difficult / weak topics in the morning"
            );

        }


        /* SUNDAY */

        if (
            preferences.lightSunday
        ) {

            weekItems.push(
                "Keep Sunday light"
            );

            weekItems.push(
                "Use Sunday mainly for light revision"
            );

        }


        let sessionHours =
            Number(data.hours) || 3;


        /* SHORT */

        if (
            preferences.shortSessions
        ) {

            sessionHours =
                Math.max(
                    1,
                    Math.round(
                        sessionHours *
                        0.75 *
                        10
                    ) / 10
                );

            weekItems.push(
                "Use shorter study sessions"
            );

        }


        /* LONG */

        if (
            preferences.longSessions
        ) {

            sessionHours =
                Math.max(
                    1,
                    Math.round(
                        sessionHours *
                        1.25 *
                        10
                    ) / 10
                );

            weekItems.push(
                "Use longer focused study sessions"
            );

        }


        /* BREAKS */

        if (
            preferences.moreBreaks
        ) {

            weekItems.push(
                "Take short breaks between study sessions"
            );

        }


        generatedWeeks.push({

            id:
                uid(),

            week:
                index + 1,

            phase,

            hours:
                sessionHours,

            items:
                weekItems,

            completed:
                false

        });

    }


    plannerData = {

        id:
            uid(),

        exam:
            data.exam,

        date:
            data.date,

        hours:
            Number(data.hours),

        strong,

        weak,

        days:
            Number(data.days),

        target:
            Number(data.target),

        instructions:
            data.instructions || "",

        preferences,

        totalWeeks,

        weeks:
            generatedWeeks,

        createdAt:
            todayDate()

    };


    set(
        "planner",
        plannerData
    );


    renderPlanner();


    showToast(
        "Adaptive study plan generated."
    );

}


/* =====================================================
   CURRENT PLAN CUSTOMIZATION MODAL
===================================================== */

function ensureCurrentPlanModal() {

    if ($("currentPlanCustomizeModal"))
        return;


    const modal =
        document.createElement("div");

    modal.id =
        "currentPlanCustomizeModal";

    modal.className =
        "hidden";


    modal.innerHTML = `

        <div
            style="
                position:fixed;
                inset:0;
                z-index:9999;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:20px;
                background:rgba(0,0,0,.7);
            "
        >

            <div
                style="
                    width:min(620px,100%);
                    max-height:90vh;
                    overflow:auto;
                    padding:24px;
                    border-radius:18px;
                    background:#111827;
                    color:#fff;
                    box-shadow:0 20px 60px rgba(0,0,0,.5);
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                    "
                >

                    <div>

                        <small>
                            CURRENT PLAN
                        </small>

                        <h2
                            style="
                                margin:5px 0 0;
                            "
                        >
                            Customize Current Plan
                        </h2>

                    </div>

                    <button
                        type="button"
                        id="closeCurrentPlanCustomize"
                        class="small-btn"
                    >
                        ✕
                    </button>

                </div>


                <p
                    style="
                        opacity:.75;
                        line-height:1.5;
                    "
                >
                    Give new instructions to modify
                    your existing plan.
                </p>


                <textarea
                    id="currentPlanInstructions"
                    rows="7"
                    placeholder="Example:
Give more time to DBMS.
Add revision every 3 days.
Focus more on OS.
Add more PYQs.
Keep sessions short.
Take more breaks."
                    style="
                        width:100%;
                        min-height:150px;
                        box-sizing:border-box;
                        padding:14px;
                        border-radius:12px;
                        resize:vertical;
                        background:rgba(255,255,255,.08);
                        border:1px solid rgba(255,255,255,.2);
                        color:#fff;
                        font:inherit;
                        line-height:1.5;
                        outline:none;
                    "
                ></textarea>


                <div
                    style="
                        display:flex;
                        justify-content:flex-end;
                        gap:10px;
                        margin-top:16px;
                    "
                >

                    <button
                        type="button"
                        id="cancelCurrentPlanCustomize"
                        class="small-btn"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        id="applyCurrentPlanCustomize"
                        class="primary"
                    >
                        Apply Changes
                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(modal);

}


/* =====================================================
   OPEN CURRENT PLAN CUSTOMIZATION
===================================================== */

function openCurrentPlanCustomization() {

    ensureCurrentPlanModal();


    const saved =
        get(
            "planner",
            null
        );


    if (!saved) {

        alert(
            "Create a study plan first."
        );

        return;

    }


    const box =
        $("currentPlanInstructions");


    if (box) {

        box.value = "";

    }


    $("currentPlanCustomizeModal")
        ?.classList
        .remove("hidden");

}


/* =====================================================
   APPLY CURRENT PLAN CHANGES
===================================================== */

function applyCurrentPlanCustomization() {

    const saved =
        get(
            "planner",
            null
        );


    if (!saved)
        return;


    const box =
        $("currentPlanInstructions");


    const instructions =
        box?.value?.trim() || "";


    if (!instructions) {

        alert(
            "Please enter what you want to change."
        );

        return;

    }


    const subjects =
        get(
            "subjects",
            []
        )
        .map(
            subject =>
                subject.name
        )
        .filter(Boolean);


    const allSubjects = [
        ...new Set([
            ...subjects,
            ...(saved.strong || []),
            ...(saved.weak || [])
        ])
    ];


    const preferences =
        readPlannerInstructions(
            instructions,
            allSubjects
        );


    /*
       Modify the existing plan.
       Week numbers and completed status stay unchanged.
    */

    (saved.weeks || [])
        .forEach(
            week => {

                let items =
                    Array.isArray(week.items)
                        ?
                        [...week.items]
                        :
                        [];


                /* PRIORITY */

                if (
                    preferences
                        .prioritySubjects
                        .length
                ) {

                    const priority =
                        preferences
                            .prioritySubjects[0];


                    items =
                        items.filter(
                            item => {

                                const text =
                                    String(item)
                                        .toLowerCase();

                                return !(
                                    text.startsWith(
                                        "priority study:"
                                    ) ||
                                    text.startsWith(
                                        "extra time:"
                                    )
                                );

                            }
                        );


                    items.unshift(
                        `Extra Time: ${priority}`
                    );

                    items.unshift(
                        `Priority Study: ${priority}`
                    );

                }


                /* WEAK */

                if (
                    !preferences
                        .prioritySubjects
                        .length &&
                    (
                        instructions
                            .toLowerCase()
                            .includes("weak")
                    )
                ) {

                    const weak =
                        saved.weak || [];


                    if (weak.length) {

                        items =
                            items.filter(
                                item =>
                                    !String(item)
                                        .toLowerCase()
                                        .startsWith(
                                            "weak area:"
                                        )
                            );


                        items.unshift(
                            `Weak Area: ${
                                weak[
                                    (week.week - 1) %
                                    weak.length
                                ]
                            }`
                        );

                    }

                }


                /* PYQ */

                if (
                    preferences.morePractice
                ) {

                    items =
                        items.filter(
                            item => {

                                const text =
                                    String(item)
                                        .toLowerCase();

                                return !(
                                    text.includes(
                                        "previous-year"
                                    ) ||
                                    text.includes(
                                        "timed practice"
                                    ) ||
                                    text.includes(
                                        "pyq"
                                    )
                                );

                            }
                        );


                    items.push(
                        "Previous-year questions"
                    );

                    items.push(
                        "Extra PYQ + timed practice"
                    );


                    week.phase =
                        "PYQ + Practice";

                }


                /* CONCEPT */

                if (
                    preferences.moreConcepts
                ) {

                    items.push(
                        "Extra concept-learning session"
                    );


                    week.phase =
                        "Concept Study";

                }


                /* REVISION */

                if (
                    preferences.extraRevision
                ) {

                    items =
                        items.filter(
                            item =>
                                !String(item)
                                    .toLowerCase()
                                    .includes(
                                        "revision session"
                                    )
                        );


                    items.push(
                        preferences
                            .revisionEveryThreeDays
                            ?
                            "Revision session every 3 days"
                            :
                            "Additional revision session"
                    );

                }


                /* MORNING */

                if (
                    preferences.difficultMorning
                ) {

                    items.push(
                        "Study difficult / weak topics in the morning"
                    );

                }


                /* SUNDAY */

                if (
                    preferences.lightSunday
                ) {

                    items.push(
                        "Keep Sunday light"
                    );

                    items.push(
                        "Use Sunday mainly for light revision"
                    );

                }


                /* SHORT */

                if (
                    preferences.shortSessions
                ) {

                    week.hours =
                        Math.max(
                            1,
                            Math.round(
                                (
                                    Number(saved.hours) ||
                                    3
                                ) *
                                .75 *
                                10
                            ) / 10
                        );


                    items.push(
                        "Use shorter study sessions"
                    );

                }


                /* LONG */

                if (
                    preferences.longSessions
                ) {

                    week.hours =
                        Math.max(
                            1,
                            Math.round(
                                (
                                    Number(saved.hours) ||
                                    3
                                ) *
                                1.25 *
                                10
                            ) / 10
                        );


                    items.push(
                        "Use longer focused study sessions"
                    );

                }


                /* BREAKS */

                if (
                    preferences.moreBreaks
                ) {

                    items.push(
                        "Take short breaks between study sessions"
                    );

                }


                week.items =
                    [
                        ...new Set(
                            items
                        )
                    ];

            }
        );


    saved.instructions =
        instructions;


    saved.preferences =
        preferences;


    saved.modifiedAt =
        todayDate();


    set(
        "planner",
        saved
    );


    closeCurrentPlanCustomization();


    renderPlanner();


    showToast(
        "Current study plan updated."
    );

}


/* =====================================================
   RENDER PLAN
===================================================== */

export function renderPlanner() {

    ensurePlannerPage();


    const saved =
        get(
            "planner",
            null
        );


    plannerData =
        saved;


    const summary =
        $("plannerSummary");


    const cards =
        $("plannerCards");


    const empty =
        $("plannerEmpty");


    if (
        !summary ||
        !cards ||
        !empty
    )
        return;


    if (!saved) {

        summary.innerHTML = "";
        cards.innerHTML = "";

        empty.classList
            .remove("hidden");

        return;

    }


    empty.classList
        .add("hidden");


    const completedWeeks =
        (
            saved.weeks || []
        )
        .filter(
            week =>
                week.completed
        )
        .length;


    const completion =
        saved.weeks?.length
            ?
            Math.round(
                completedWeeks /
                saved.weeks.length *
                100
            )
            :
            0;


    summary.innerHTML = `

        <div
            class="planner-summary-card"
        >

            <div>

                <small>
                    CURRENT PLAN
                </small>

                <h2>
                    ${esc(saved.exam)}
                </h2>

                <p>
                    Exam:
                    ${esc(saved.date)}
                    •
                    Target:
                    ${esc(saved.target)}%
                </p>

            </div>


            <div
                class="planner-summary-stat"
            >

                <strong>
                    ${saved.totalWeeks}
                </strong>

                <span>
                    weeks
                </span>

            </div>


            <div
                class="planner-summary-stat"
            >

                <strong>
                    ${saved.hours}
                </strong>

                <span>
                    hrs/day
                </span>

            </div>


            <div
                class="planner-summary-stat"
            >

                <strong>
                    ${completion}%
                </strong>

                <span>
                    complete
                </span>

            </div>

        </div>


        <div
            style="
                display:flex;
                justify-content:flex-end;
                margin-top:12px;
            "
        >

            <button
                type="button"
                class="primary"
                id="customizeCurrentPlanButton"
            >
                ✏ Customize Current Plan
            </button>

        </div>


        ${
            saved.instructions
                ?
                `
                <div
                    style="
                        margin-top:12px;
                        padding:14px 16px;
                        border-radius:12px;
                        background:rgba(255,255,255,.05);
                        border:1px solid rgba(255,255,255,.12);
                    "
                >

                    <small>
                        LAST CUSTOMIZATION
                    </small>

                    <p
                        style="
                            margin:6px 0 0;
                            line-height:1.5;
                        "
                    >
                        ${esc(saved.instructions)}
                    </p>

                </div>
                `
                :
                ""
        }

    `;


    cards.innerHTML =
        (
            saved.weeks || []
        )
        .map(
            week => `

                <article
                    class="plan-card ${
                        week.completed
                            ? "completed"
                            : ""
                    }"
                >

                    <div
                        class="plan-card-head"
                    >

                        <div>

                            <small>
                                WEEK ${week.week}
                            </small>

                            <h3>
                                ${esc(
                                    week.phase
                                )}
                            </h3>

                        </div>


                        <button
                            type="button"
                            class="plan-complete-btn"
                            data-plan-week="${week.week}"
                        >
                            ${
                                week.completed
                                    ?
                                    "✅ Completed"
                                    :
                                    "○ Complete"
                            }
                        </button>

                    </div>


                    <p>
                        ${week.hours}
                        study hours per day
                    </p>


                    <div
                        class="plan-items"
                    >

                        ${
                            week.items
                                .map(
                                    item =>
                                        `
                                        <div
                                            class="plan-item"
                                        >
                                            ✓
                                            ${esc(item)}
                                        </div>
                                        `
                                )
                                .join("")
                        }

                    </div>


                    <div
                        class="plan-actions"
                    >

                        <button
                            type="button"
                            class="small-btn"
                            data-add-plan="${week.week}"
                        >
                            + Add Revision
                        </button>


                        <button
                            type="button"
                            class="small-btn"
                            data-remove-plan="${week.week}"
                        >
                            − Remove
                        </button>

                    </div>

                </article>

            `
        )
        .join("");

}


/* =====================================================
   INITIALIZE
===================================================== */

export function initPlanner(
    refresh
) {

    ensurePlannerPage();

    ensurePlannerFields();

    ensureCurrentPlanModal();


    /* OPEN BUTTONS */

    $("buildPlan")
        ?.addEventListener(
            "click",
            openPlannerModal
        );


    $("quickPlanner")
        ?.addEventListener(
            "click",
            openPlannerModal
        );


    $("qaPlanner")
        ?.addEventListener(
            "click",
            openPlannerModal
        );


    $("plannerBuildButton")
        ?.addEventListener(
            "click",
            openPlannerModal
        );


    $("plannerEmptyButton")
        ?.addEventListener(
            "click",
            openPlannerModal
        );


    /* CLOSE NEW PLAN */

    $("closePlanner")
        ?.addEventListener(
            "click",
            closePlannerModal
        );


    /* CURRENT PLAN CUSTOMIZATION */

    document.addEventListener(
        "click",
        event => {

            const target =
                event.target;


            if (
                target.id ===
                "customizeCurrentPlanButton"
            ) {

                openCurrentPlanCustomization();
                return;

            }


            if (
                target.id ===
                "closeCurrentPlanCustomize"
            ) {

                closeCurrentPlanCustomization();
                return;

            }


            if (
                target.id ===
                "cancelCurrentPlanCustomize"
            ) {

                closeCurrentPlanCustomization();
                return;

            }


            if (
                target.id ===
                "applyCurrentPlanCustomize"
            ) {

                applyCurrentPlanCustomization();
                return;

            }


            /* -----------------------------------------
               CURRENT PLAN QUICK INSTRUCTIONS
            ----------------------------------------- */

            const currentExample =
                target.dataset
                    .currentExample;


            if (currentExample) {

                const box =
                    $("currentPlanInstructions");

                if (!box)
                    return;


                const examples = {

                    revision:
                        "Add revision every 3 days.",

                    priority:
                        "Give more time to my priority subject.",

                    pyq:
                        "Add more PYQs and practice.",

                    breaks:
                        "Add more breaks between study sessions."

                };


                const text =
                    examples[
                        currentExample
                    ];


                if (text) {

                    box.value =
                        box.value
                            ?
                            `${box.value}
${text}`
                            :
                            text;

                }

                return;

            }

        }
    );


    /* NEW PLAN FORM */

    $("plannerForm")
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const exam =
                    $("plannerExam")
                        ?.value
                        ?.trim();


                const date =
                    $("plannerDate")
                        ?.value;


                const hours =
                    Number(
                        $("plannerHours")
                            ?.value
                    ) || 3;


                const strong =
                    $("plannerStrong")
                        ?.value
                        || "";


                const weak =
                    $("plannerWeak")
                        ?.value
                        || "";


                const days =
                    Number(
                        $("plannerDays")
                            ?.value
                    ) || 6;


                const target =
                    Number(
                        $("plannerTarget")
                            ?.value
                    ) || 70;


                const instructions =
                    $("plannerInstructions")
                        ?.value
                        ?.trim()
                        || "";


                if (!exam) {

                    alert(
                        "Please enter the exam name."
                    );

                    return;

                }


                if (!date) {

                    alert(
                        "Please select the exam date."
                    );

                    return;

                }


                generatePlan({

                    exam,
                    date,
                    hours,
                    strong,
                    weak,
                    days,
                    target,
                    instructions

                });


                closePlannerModal();


                const plannerPage =
                    $("plannerPage");


                if (plannerPage) {

                    document
                        .querySelectorAll(
                            "#dashboard .page"
                        )
                        .forEach(
                            page =>
                                page.classList
                                    .add("hidden")
                        );


                    plannerPage
                        .classList
                        .remove("hidden");

                }


                document
                    .querySelectorAll(
                        ".menu"
                    )
                    .forEach(
                        button => {

                            button.classList
                                .toggle(
                                    "active",
                                    button.dataset.page ===
                                    "plannerPage"
                                );

                        }
                    );


                if (
                    typeof refresh ===
                    "function"
                ) {

                    refresh();

                }

            }
        );


    /* PLAN ACTIONS */

    document.addEventListener(
        "click",
        event => {

            const target =
                event.target;


            /* COMPLETE */

            let weekNumber =
                target.dataset
                    .planWeek;


            if (weekNumber) {

                const saved =
                    get(
                        "planner",
                        null
                    );


                if (!saved)
                    return;


                const item =
                    saved.weeks
                        ?.find(
                            x =>
                                String(x.week) ===
                                String(weekNumber)
                        );


                if (item) {

                    item.completed =
                        !item.completed;

                }


                set(
                    "planner",
                    saved
                );


                renderPlanner();

                return;

            }


            /* ADD REVISION */

            weekNumber =
                target.dataset
                    .addPlan;


            if (weekNumber) {

                const saved =
                    get(
                        "planner",
                        null
                    );


                if (!saved)
                    return;


                const item =
                    saved.weeks
                        ?.find(
                            x =>
                                String(x.week) ===
                                String(weekNumber)
                        );


                if (item) {

                    item.items.push(
                        "Additional Revision Session"
                    );

                }


                set(
                    "planner",
                    saved
                );


                renderPlanner();

                return;

            }


            /* REMOVE */

            weekNumber =
                target.dataset
                    .removePlan;


            if (weekNumber) {

                const saved =
                    get(
                        "planner",
                        null
                    );


                if (!saved)
                    return;


                const item =
                    saved.weeks
                        ?.find(
                            x =>
                                String(x.week) ===
                                String(weekNumber)
                        );


                if (
                    item &&
                    item.items.length > 1
                ) {

                    item.items.pop();

                }


                set(
                    "planner",
                    saved
                );


                renderPlanner();

            }

        }
    );


    renderPlanner();

}


/* =====================================================
   TOAST
===================================================== */

function showToast(
    message
) {

    const toast =
        $("toast");


    if (!toast) {

        alert(message);

        return;

    }


    toast.textContent =
        message;


    toast.classList
        .add("show");


    setTimeout(
        () => {

            toast.classList
                .remove("show");

        },
        2200
    );

}