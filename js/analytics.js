import {
    get,
    $
} from "./storage.js";

export function readiness() {

    const q =
        get("questions", []);

    const t =
        get("tests", []);

    const s =
        get("subjects", []);

    const c =
        s.flatMap(
            x => x.chapters
        );

    const sy =
        c.length
            ? c.filter(
                x => x.done
            ).length /
              c.length *
              100
            : 0;

    const qs =
        Math.min(
            q.length / 30 * 100,
            100
        );

    const ts =
        t.length
            ? t.reduce(
                (a,x) =>
                    a + x.percent,
                0
              ) / t.length
            : 0;

    return Math.round(
        sy * .3 +
        qs * .3 +
        ts * .4
    );
}

export function renderAnalytics() {

    const t =
        get("tests", []);

    const avg =
        t.length
            ? Math.round(
                t.reduce(
                    (a,x) =>
                        a + x.percent,
                    0
                ) / t.length
              )
            : 0;

    $("analyticsReadiness")
        .textContent =
        readiness() + "%";

    $("analyticsQuestions")
        .textContent =
        get("questions").length;

    $("analyticsTests")
        .textContent =
        t.length;

    $("analyticsAccuracy")
        .textContent =
        avg + "%";


    const w =
        get("weekly", {});

    const a = [];

    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        let d =
            new Date();

        d.setDate(
            d.getDate() - i
        );

        let k =
            d.toISOString()
             .slice(0,10);

        a.push({
            d:
                d.toLocaleDateString(
                    "en-IN",
                    {weekday:"short"}
                ),
            m:
                w[k] || 0
        });
    }


    $("analyticsChart").innerHTML =
        a.map(
            x =>
                `
                <div class="bar-day">

                    <div class="bar-wrap">

                        <div
                            class="bar"
                            style="
                                height:
                                ${Math.max(
                                    5,
                                    x.m / 60 * 100
                                )}%
                            ">
                        </div>

                    </div>

                    <small>
                        ${x.d}
                    </small>

                    <small>
                        ${x.m}m
                    </small>

                </div>
                `
        ).join("");


    const tasks =
        get("tasks", []);

    const done =
        tasks.filter(
            x => x.done
        ).length;

    const p =
        tasks.length
            ? Math.round(
                done / tasks.length * 100
            )
            : 0;


    $("analyticsTaskPercent")
        .textContent =
        p + "%";

    $("analyticsTaskText")
        .textContent =
        `${done} / ${tasks.length}`;

    $("analyticsDonut")
        .style.background =
        `conic-gradient(
            var(--cyan)
            ${p * 3.6}deg,
            #dce7f4
            ${p * 3.6}deg
        )`;


    const subjects =
        get("subjects", []);


    $("analyticsSubjects")
        .innerHTML =
        subjects.length
            ? subjects.map(
                s => {

                    const n =
                        s.chapters.length;

                    const d =
                        s.chapters.filter(
                            x => x.done
                        ).length;

                    const p =
                        n
                            ? Math.round(
                                d / n * 100
                              )
                            : 0;

                    return `
                        <div class="subject-progress">

                            <div class="subject-progress-head">

                                <span>
                                    ${s.name}
                                </span>

                                <b>
                                    ${p}%
                                </b>

                            </div>

                            <div class="progress-line">
                                <div
                                    style="
                                      width:${p}%
                                    ">
                                </div>
                            </div>

                        </div>
                    `;
                }
              ).join("")
            : "<div class='item'>Add subjects.</div>";
}