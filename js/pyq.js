import {
    get,
    set,
    uid,
    $
} from "./storage.js";

export function initPYQ(refresh) {

    $("savePYQ").onclick =
        () =>
            $("pyqModal")
                .classList
                .remove("hidden");

    $("pyqForm").onsubmit =
        e => {

            e.preventDefault();

            const file =
                $("pyqImage").files[0];

            if (!file)
                return alert(
                    "Select a snapshot first."
                );

            const r =
                new FileReader();

            r.onload = () => {

                const p =
                    get("pyqs");

                p.push({

                    id: uid(),

                    exam:
                        $("pyqExam")
                            .value
                            .trim(),

                    subject:
                        $("pyqSubject")
                            .value
                            .trim(),

                    topic:
                        $("pyqTopic")
                            .value
                            .trim(),

                    image:
                        r.result,

                    notes:
                        $("pyqNotes")
                            .value
                            .trim(),

                    date:
                        new Date()
                            .toISOString()
                });

                set("pyqs", p);


                const q =
                    get("questions");

                q.push({

                    id: uid(),

                    text:
                        `Saved PYQ • ${
                            $("pyqSubject")
                                .value
                                .trim()
                        }`,

                    subject:
                        $("pyqSubject")
                            .value
                            .trim(),

                    topic:
                        $("pyqTopic")
                            .value
                            .trim(),

                    tag: "PYQ",

                    difficulty: "Medium",

                    done: false,

                    important: true
                });

                set("questions", q);

                e.target.reset();

                $("pyqModal")
                    .classList
                    .add("hidden");

                refresh();

                alert(
                    "PYQ snapshot saved."
                );
            };

            r.readAsDataURL(file);
        };
}