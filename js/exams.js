/* =====================================================
   SYNAPTIQ - EXAM HUB
   Modular version for examsPage / recommendedExams /
   examDirectory / examCards
   ===================================================== */

const $ = (id) => document.getElementById(id);

const getArray = (key) => {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
};

const saveArray = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const esc = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const makeId = () =>
    Date.now().toString(36) +
    Math.random().toString(36).slice(2);

const normalizeURL = (url) => {
    const value = String(url ?? "").trim();

    if (!value) return "";

    return /^https?:\/\//i.test(value)
        ? value
        : `https://${value}`;
};

const formatDate = (value) => {
    if (!value) return "Date not set";

    const d = new Date(
        `${value}T00:00:00`
    );

    if (Number.isNaN(d.getTime())) {
        return "Date not set";
    }

    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
};

const daysLeft = (value) => {

    if (!value) return null;

    const now = new Date();

    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const target = new Date(
        `${value}T00:00:00`
    );

    if (Number.isNaN(target.getTime())) {
        return null;
    }

    const targetDay = new Date(
        target.getFullYear(),
        target.getMonth(),
        target.getDate()
    );

    return Math.ceil(
        (targetDay - today) / 86400000
    );
};


/* =====================================================
   OFFICIAL PORTALS
   ===================================================== */

const OFFICIAL_PORTALS = [

    {
        name: "GATE 2027",
        short: "GATE",
        category: "Engineering",
        url: "https://gate2027.iitm.ac.in/"
    },

    {
        name: "JEE Main",
        short: "JEE Main",
        category: "Engineering",
        url: "https://jeemain.nta.nic.in/"
    },

    {
        name: "JEE Advanced",
        short: "JEE Advanced",
        category: "Engineering",
        url: "https://jeeadv.ac.in/"
    },

    {
        name: "NEET UG",
        short: "NEET",
        category: "Medical",
        url: "https://neet.nta.nic.in/"
    },

    {
        name: "UPSC",
        short: "UPSC",
        category: "UPSC",
        url: "https://upsc.gov.in/"
    },

    {
        name: "SSC",
        short: "SSC",
        category: "SSC",
        url: "https://ssc.gov.in/"
    },

    {
        name: "IBPS",
        short: "IBPS",
        category: "Banking",
        url: "https://www.ibps.in/"
    },

    {
        name: "SBI Careers",
        short: "SBI",
        category: "Banking",
        url: "https://sbi.bank.in/web/careers"
    },

    {
        name: "CAT",
        short: "CAT",
        category: "Management",
        url: "https://iimcat.ac.in/"
    },

    {
        name: "XAT",
        short: "XAT",
        category: "Management",
        url: "https://xatonline.in/"
    },

    {
        name: "MAT",
        short: "MAT",
        category: "Management",
        url: "https://mat.aima.in/"
    },

    {
        name: "CLAT",
        short: "CLAT",
        category: "Law",
        url: "https://consortiumofnlus.ac.in/"
    },

    {
        name: "NIFT",
        short: "NIFT",
        category: "Design",
        url: "https://www.nift.ac.in/"
    },

    {
        name: "UGC NET",
        short: "UGC NET",
        category: "Education",
        url: "https://ugcnet.nta.nic.in/"
    },

    {
        name: "CTET",
        short: "CTET",
        category: "Education",
        url: "https://ctet.nic.in/"
    }

];


/* =====================================================
   COMPLETE EXAM DIRECTORY
   ===================================================== */

const EXAM_DIRECTORY = [

    /* ENGINEERING */

    {
        name: "GATE",
        fullName:
            "Graduate Aptitude Test in Engineering",
        category: "Engineering",
        tags: [
            "gate",
            "engineering",
            "btech",
            "mtech",
            "iit",
            "technology"
        ],
        official:
            "https://gate2027.iitm.ac.in/",
        pyq:
            "https://gate2027.iitm.ac.in/"
    },

    {
        name: "JEE Main",
        fullName:
            "Joint Entrance Examination Main",
        category: "Engineering",
        tags: [
            "jee",
            "engineering",
            "nta",
            "school"
        ],
        official:
            "https://jeemain.nta.nic.in/",
        pyq:
            "https://jeemain.nta.nic.in/"
    },

    {
        name: "JEE Advanced",
        fullName:
            "Joint Entrance Examination Advanced",
        category: "Engineering",
        tags: [
            "jee",
            "advanced",
            "engineering",
            "iit"
        ],
        official:
            "https://jeeadv.ac.in/",
        pyq:
            "https://jeeadv.ac.in/"
    },

    {
        name: "BITSAT",
        fullName:
            "Birla Institute of Technology and Science Admission Test",
        category: "Engineering",
        tags: [
            "bitsat",
            "bits",
            "engineering"
        ],
        official:
            "https://www.bitsadmission.com/",
        pyq:
            "https://www.bitsadmission.com/"
    },

    {
        name: "VITEEE",
        fullName:
            "VIT Engineering Entrance Examination",
        category: "Engineering",
        tags: [
            "viteee",
            "vit",
            "engineering"
        ],
        official:
            "https://viteee.vit.ac.in/",
        pyq:
            "https://viteee.vit.ac.in/"
    },

    {
        name: "WBJEE",
        fullName:
            "West Bengal Joint Entrance Examination",
        category: "Engineering",
        tags: [
            "wbjee",
            "engineering",
            "west bengal"
        ],
        official:
            "https://wbjeeb.nic.in/",
        pyq:
            "https://wbjeeb.nic.in/"
    },


    /* MEDICAL */

    {
        name: "NEET UG",
        fullName:
            "National Eligibility cum Entrance Test",
        category: "Medical",
        tags: [
            "neet",
            "medical",
            "mbbs",
            "biology",
            "nta"
        ],
        official:
            "https://neet.nta.nic.in/",
        pyq:
            "https://neet.nta.nic.in/"
    },

    {
        name: "NEET PG",
        fullName:
            "National Eligibility cum Entrance Test Postgraduate",
        category: "Medical",
        tags: [
            "neet pg",
            "medical",
            "postgraduate"
        ],
        official:
            "https://natboard.edu.in/",
        pyq:
            "https://natboard.edu.in/"
    },


    /* UPSC */

    {
        name: "UPSC Civil Services",
        fullName:
            "Civil Services Examination",
        category: "UPSC",
        tags: [
            "upsc",
            "ias",
            "civil services",
            "government"
        ],
        official:
            "https://upsc.gov.in/",
        pyq:
            "https://www.upsc.gov.in/examinations/previous-question-papers"
    },

    {
        name: "UPSC CDS",
        fullName:
            "Combined Defence Services Examination",
        category: "UPSC",
        tags: [
            "upsc",
            "cds",
            "defence"
        ],
        official:
            "https://upsc.gov.in/",
        pyq:
            "https://www.upsc.gov.in/examinations/previous-question-papers"
    },

    {
        name: "UPSC NDA",
        fullName:
            "National Defence Academy and Naval Academy Examination",
        category: "UPSC",
        tags: [
            "upsc",
            "nda",
            "defence",
            "school"
        ],
        official:
            "https://upsc.gov.in/",
        pyq:
            "https://www.upsc.gov.in/examinations/previous-question-papers"
    },


    /* SSC */

    {
        name: "SSC CGL",
        fullName:
            "Staff Selection Commission Combined Graduate Level",
        category: "SSC",
        tags: [
            "ssc",
            "cgl",
            "government",
            "graduate"
        ],
        official:
            "https://ssc.gov.in/",
        pyq:
            "https://ssc.gov.in/"
    },

    {
        name: "SSC CHSL",
        fullName:
            "Staff Selection Commission Combined Higher Secondary Level",
        category: "SSC",
        tags: [
            "ssc",
            "chsl",
            "government",
            "school"
        ],
        official:
            "https://ssc.gov.in/",
        pyq:
            "https://ssc.gov.in/"
    },

    {
        name: "SSC GD",
        fullName:
            "SSC General Duty Constable Examination",
        category: "SSC",
        tags: [
            "ssc",
            "gd",
            "government",
            "defence"
        ],
        official:
            "https://ssc.gov.in/",
        pyq:
            "https://ssc.gov.in/"
    },

    {
        name: "SSC MTS",
        fullName:
            "SSC Multi Tasking Staff Examination",
        category: "SSC",
        tags: [
            "ssc",
            "mts",
            "government"
        ],
        official:
            "https://ssc.gov.in/",
        pyq:
            "https://ssc.gov.in/"
    },


    /* BANKING */

    {
        name: "IBPS PO",
        fullName:
            "IBPS Probationary Officer",
        category: "Banking",
        tags: [
            "ibps",
            "po",
            "banking",
            "graduate"
        ],
        official:
            "https://www.ibps.in/",
        pyq:
            "https://www.ibps.in/"
    },

    {
        name: "IBPS Clerk",
        fullName:
            "IBPS Clerk",
        category: "Banking",
        tags: [
            "ibps",
            "clerk",
            "banking"
        ],
        official:
            "https://www.ibps.in/",
        pyq:
            "https://www.ibps.in/"
    },

    {
        name: "SBI PO",
        fullName:
            "State Bank of India Probationary Officer",
        category: "Banking",
        tags: [
            "sbi",
            "po",
            "banking"
        ],
        official:
            "https://sbi.bank.in/web/careers",
        pyq:
            "https://sbi.bank.in/web/careers"
    },

    {
        name: "SBI Clerk",
        fullName:
            "State Bank of India Junior Associate",
        category: "Banking",
        tags: [
            "sbi",
            "clerk",
            "banking"
        ],
        official:
            "https://sbi.bank.in/web/careers",
        pyq:
            "https://sbi.bank.in/web/careers"
    },


    /* MANAGEMENT */

    {
        name: "CAT",
        fullName:
            "Common Admission Test",
        category: "Management",
        tags: [
            "cat",
            "mba",
            "management",
            "iim"
        ],
        official:
            "https://iimcat.ac.in/",
        pyq:
            "https://iimcat.ac.in/"
    },

    {
        name: "XAT",
        fullName:
            "Xavier Aptitude Test",
        category: "Management",
        tags: [
            "xat",
            "mba",
            "management"
        ],
        official:
            "https://xatonline.in/",
        pyq:
            "https://xatonline.in/"
    },

    {
        name: "CMAT",
        fullName:
            "Common Management Admission Test",
        category: "Management",
        tags: [
            "cmat",
            "mba",
            "management",
            "nta"
        ],
        official:
            "https://exams.nta.ac.in/",
        pyq:
            "https://exams.nta.ac.in/"
    },

    {
        name: "MAT",
        fullName:
            "Management Aptitude Test",
        category: "Management",
        tags: [
            "mat",
            "mba",
            "management",
            "aima"
        ],
        official:
            "https://mat.aima.in/",
        pyq:
            "https://mat.aima.in/"
    },

    {
        name: "SNAP",
        fullName:
            "Symbiosis National Aptitude Test",
        category: "Management",
        tags: [
            "snap",
            "mba",
            "symbiosis"
        ],
        official:
            "https://www.snaptest.org/",
        pyq:
            "https://www.snaptest.org/"
    },


    /* UNIVERSITY */

    {
        name: "CUET UG",
        fullName:
            "Common University Entrance Test Undergraduate",
        category: "University",
        tags: [
            "cuet",
            "university",
            "nta",
            "school"
        ],
        official:
            "https://exams.nta.ac.in/",
        pyq:
            "https://exams.nta.ac.in/"
    },

    {
        name: "CUET PG",
        fullName:
            "Common University Entrance Test Postgraduate",
        category: "University",
        tags: [
            "cuet",
            "pg",
            "university",
            "nta"
        ],
        official:
            "https://exams.nta.ac.in/",
        pyq:
            "https://exams.nta.ac.in/"
    },


    /* LAW */

    {
        name: "CLAT",
        fullName:
            "Common Law Admission Test",
        category: "Law",
        tags: [
            "clat",
            "law",
            "nlu"
        ],
        official:
            "https://consortiumofnlus.ac.in/",
        pyq:
            "https://consortiumofnlus.ac.in/"
    },

    {
        name: "AILET",
        fullName:
            "All India Law Entrance Test",
        category: "Law",
        tags: [
            "ailet",
            "law",
            "nlud"
        ],
        official:
            "https://nationallawuniversitydelhi.in/",
        pyq:
            "https://nationallawuniversitydelhi.in/"
    },


    /* DESIGN */

    {
        name: "NIFT Entrance",
        fullName:
            "National Institute of Fashion Technology Entrance Examination",
        category: "Design",
        tags: [
            "nift",
            "design",
            "fashion"
        ],
        official:
            "https://www.nift.ac.in/",
        pyq:
            "https://www.nift.ac.in/"
    },

    {
        name: "NID DAT",
        fullName:
            "National Institute of Design Design Aptitude Test",
        category: "Design",
        tags: [
            "nid",
            "dat",
            "design"
        ],
        official:
            "https://admissions.nid.edu/",
        pyq:
            "https://admissions.nid.edu/"
    },


    /* EDUCATION */

    {
        name: "UGC NET",
        fullName:
            "University Grants Commission National Eligibility Test",
        category: "Education",
        tags: [
            "ugc",
            "net",
            "teaching",
            "research",
            "nta"
        ],
        official:
            "https://ugcnet.nta.nic.in/",
        pyq:
            "https://ugcnet.nta.nic.in/"
    },

    {
        name: "CTET",
        fullName:
            "Central Teacher Eligibility Test",
        category: "Education",
        tags: [
            "ctet",
            "teaching",
            "teacher",
            "school"
        ],
        official:
            "https://ctet.nic.in/",
        pyq:
            "https://ctet.nic.in/"
    }

];


let directoryCategory =
    "all";

let directorySearch =
    "";


/* =====================================================
   USER PROFILE / RECOMMENDATIONS
   ===================================================== */

function getUser() {

    const keys = [
        "currentUser",
        "user",
        "synaptiqUser"
    ];


    for (
        const key of keys
    ) {

        try {

            const value =
                JSON.parse(
                    sessionStorage.getItem(
                        key
                    )
                );

            if (value) {
                return value;
            }

        } catch {}


        try {

            const value =
                JSON.parse(
                    localStorage.getItem(
                        key
                    )
                );

            if (value) {
                return value;
            }

        } catch {}

    }


    return {};

}


function profileText() {

    const user =
        getUser();

    return [

        user.name,

        user.type,

        user.studentType,

        user.category,

        user.stream,

        user.degree,

        user.branch,

        user.college,

        user.collegeName,

        user.school,

        user.schoolName,

        user.profession,

        user.targetExam,

        user.target,

        user.goal,

        user.subjects

    ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

}


function scoreExam(
    exam
) {

    const profile =
        profileText();

    if (!profile) {
        return 0;
    }


    let score = 0;


    [
        exam.name,
        exam.fullName,
        exam.category,
        ...exam.tags
    ]
    .forEach(
        word => {

            const value =
                String(word)
                .toLowerCase();

            if (
                value.length > 2 &&
                profile.includes(value)
            ) {

                score += 3;

            }

        }
    );


    const user =
        getUser();

    const target =
        String(
            user.targetExam ||
            user.target ||
            ""
        )
        .toLowerCase()
        .trim();


    if (
        target &&
        (
            exam.name
                .toLowerCase()
                .includes(
                    target
                ) ||

            target.includes(
                exam.name
                    .toLowerCase()
            )
        )
    ) {

        score += 10;

    }


    return score;

}


function getRecommended() {

    const ranked =
        EXAM_DIRECTORY
        .map(
            exam => ({

                exam,

                score:
                    scoreExam(
                        exam
                    )

            })
        )
        .sort(
            (
                a,
                b
            ) =>
                b.score -
                a.score
        );


    const matched =
        ranked.filter(
            item =>
                item.score > 0
        );


    return (
        matched.length
            ? matched
            : ranked
    )
    .slice(
        0,
        6
    );

}


function renderRecommended() {

    const container =
        $("recommendedExams");

    if (!container) {
        return;
    }


    const count =
        $("recommendedExamCount");

    const data =
        getRecommended();


    if (count) {

        count.textContent =
            `${data.length} matches`;

    }


    container.innerHTML =
        data
        .map(
            ({
                exam,
                score
            }) => {

                const reason =
                    score >= 10

                        ? "Strong match for your target"

                        : score > 0

                            ? "Matches your profile"

                            : "Popular exam option";


                return `

                    <article
                        class="
                            directory-card
                            recommended-card
                        "
                    >

                        <div
                            class="
                                directory-card-top
                            "
                        >

                            <span
                                class="
                                    directory-category
                                "
                            >
                                ${esc(
                                    exam.category
                                )}
                            </span>


                            <span
                                class="
                                    recommended-badge
                                "
                            >
                                ⭐ Recommended
                            </span>

                        </div>


                        <h3>
                            ${esc(
                                exam.name
                            )}
                        </h3>


                        <p>
                            ${esc(
                                exam.fullName
                            )}
                        </p>


                        <p
                            class="
                                recommended-reason
                            "
                        >
                            ${esc(
                                reason
                            )}
                        </p>


                        <div
                            class="
                                recommended-actions
                            "
                        >

                            <a
                                class="official"

                                href="${normalizeURL(
                                    exam.official
                                )}"

                                target="_blank"

                                rel="
                                    noopener
                                    noreferrer
                                "
                            >
                                Official ↗
                            </a>


                            <a
                                class="pyq"

                                href="${normalizeURL(
                                    exam.pyq
                                )}"

                                target="_blank"

                                rel="
                                    noopener
                                    noreferrer
                                "
                            >
                                PYQs ↗
                            </a>

                        </div>

                    </article>

                `;

            }
        )
        .join("");

}


/* =====================================================
   DIRECTORY
   ===================================================== */

function renderCategories() {

    const container =
        $("directoryCategories");

    if (!container) {
        return;
    }


    const categories = [

        "all",

        "Engineering",

        "Medical",

        "UPSC",

        "SSC",

        "Banking",

        "Management",

        "University",

        "Law",

        "Design",

        "Education"

    ];


    container.innerHTML =
        categories
        .map(
            category => `

                <button
                    type="button"

                    class="
                        directory-category-btn
                        ${
                            directoryCategory ===
                            category
                                ? "active"
                                : ""
                        }
                    "

                    data-category="${esc(
                        category
                    )}"
                >

                    ${
                        category ===
                        "all"
                            ? "All"
                            : esc(
                                category
                            )
                    }

                </button>

            `
        )
        .join("");


    container
        .querySelectorAll(
            "[data-category]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        directoryCategory =
                            button.dataset
                                .category;

                        renderDirectory();

                    };

            }
        );

}


function renderDirectory() {

    const container =
        $("examDirectory");

    if (!container) {
        return;
    }


    const count =
        $("examDirectoryCount");


    const search =
        directorySearch
        .trim()
        .toLowerCase();


    const results =
        EXAM_DIRECTORY
        .filter(
            exam => {

                if (
                    directoryCategory !==
                    "all" &&

                    exam.category !==
                    directoryCategory
                ) {

                    return false;

                }


                if (!search) {
                    return true;
                }


                const text =
                    [
                        exam.name,
                        exam.fullName,
                        exam.category,
                        ...exam.tags
                    ]
                    .join(" ")
                    .toLowerCase();


                return text.includes(
                    search
                );

            }
        );


    if (count) {

        count.textContent =
            `${results.length} exams`;

    }


    container.innerHTML =
        results.length

            ?

            results
            .map(
                exam => `

                    <article
                        class="
                            directory-card
                        "
                    >

                        <div
                            class="
                                directory-card-top
                            "
                        >

                            <span
                                class="
                                    directory-category
                                "
                            >
                                ${esc(
                                    exam.category
                                )}
                            </span>

                        </div>


                        <h3>
                            ${esc(
                                exam.name
                            )}
                        </h3>


                        <p>
                            ${esc(
                                exam.fullName
                            )}
                        </p>


                        <div
                            class="
                                directory-links
                            "
                        >

                            <a
                                class="
                                    directory-link
                                "

                                href="${normalizeURL(
                                    exam.official
                                )}"

                                target="_blank"

                                rel="
                                    noopener
                                    noreferrer
                                "
                            >
                                Official ↗
                            </a>


                            <a
                                class="
                                    directory-pyq
                                "

                                href="${normalizeURL(
                                    exam.pyq
                                )}"

                                target="_blank"

                                rel="
                                    noopener
                                    noreferrer
                                "
                            >
                                PYQs ↗
                            </a>


                            <button
                                type="button"

                                class="
                                    directory-pyq
                                    track-directory-exam
                                "

                                data-exam="${esc(
                                    exam.name
                                )}"
                            >
                                + Track
                            </button>

                        </div>

                    </article>

                `
            )
            .join("")

            :

            `

            <div
                class="
                    directory-card
                    exam-empty-state
                "
            >

                <h3>
                    No matching exams
                </h3>

                <p>
                    Try another keyword or category.
                </p>

            </div>

            `;


    container
        .querySelectorAll(
            ".track-directory-exam"
        )
        .forEach(
            button => {

                button.onclick =
                    () =>
                        openExamModal(
                            button.dataset
                                .exam
                        );

            }
        );

}


function setupSearch() {

    const input =
        $("examDirectorySearch");

    if (!input) {
        return;
    }


    input.oninput =
        () => {

            directorySearch =
                input.value;

            renderDirectory();

        };

}


/* =====================================================
   OFFICIAL PORTALS
   ===================================================== */

function renderOfficialPortals() {

    const box =
        document.querySelector(
            "#examsPage .official-box"
        );

    if (!box) {
        return;
    }


    const custom =
        getArray(
            "portals"
        );


    const portals = [

        ...OFFICIAL_PORTALS,

        ...custom.map(
            item => ({

                name:
                    item.name,

                short:
                    item.name,

                url:
                    normalizeURL(
                        item.link
                    )

            })
        )

    ];


    box.innerHTML = `

        <b>
            Official Portals
        </b>


        <div
            class="
                official-portal-links
            "
        >

            ${portals
                .map(
                    portal => `

                        <a
                            class="
                                official-portal-link
                            "

                            href="${normalizeURL(
                                portal.url
                            )}"

                            target="_blank"

                            rel="
                                noopener
                                noreferrer
                            "
                        >

                            ${esc(
                                portal.short ||
                                portal.name
                            )}

                            ↗

                        </a>

                    `
                )
                .join("")
            }


            <button
                id="addPortal"

                class="small-btn"

                type="button"
            >
                + Add Portal
            </button>

        </div>

    `;


    $("addPortal")
        ?.addEventListener(
            "click",
            () => {

                $("portalModal")
                    ?.classList
                    .remove(
                        "hidden"
                    );

            }
        );

}


/* =====================================================
   TRACKED EXAMS
   ===================================================== */

function renderTrackedExams() {

    const container =
        $("examCards");

    if (!container) {
        return;
    }


    const exams =
        getArray(
            "exams"
        );


    if (!exams.length) {

        container.innerHTML = `

            <div
                class="
                    directory-card
                    exam-empty-state
                "
            >

                <h3>
                    No tracked exams yet
                </h3>

                <p>
                    Select an exam from the directory
                    or click Track My Exam.
                </p>


                <button
                    class="primary"

                    id="emptyTrackExam"

                    type="button"
                >
                    + Track My Exam
                </button>

            </div>

        `;


        $("emptyTrackExam")
            ?.addEventListener(
                "click",
                () =>
                    openExamModal()
            );


        return;

    }


    container.innerHTML =
        exams
        .map(
            exam => {

                const days =
                    daysLeft(
                        exam.date
                    );


                const remaining =
                    days === null
                        ? "--"
                        : Math.max(
                            0,
                            days
                        );


                const status =
                    days !== null &&
                    days < 0

                        ? "DATE PASSED"

                        : days !== null &&
                          days <= 7

                            ? "FINAL REVISION"

                            : days !== null &&
                              days <= 30

                                ? "EXAM APPROACHING"

                                : "ON TRACK";


                const statusClass =
                    days !== null &&
                    days < 0

                        ? "passed"

                        : days !== null &&
                          days <= 7

                            ? "urgent"

                            : days !== null &&
                              days <= 30

                                ? "soon"

                                : "ontrack";


                return `

                    <article
                        class="
                            exam-card
                            tracked-exam-card
                        "
                    >

                        <div
                            class="
                                exam-card-top
                            "
                        >

                            <span
                                class="
                                    exam-category-badge
                                "
                            >
                                ${esc(
                                    exam.category ||
                                    "Other"
                                )}
                            </span>


                            <button
                                class="
                                    exam-delete
                                "

                                type="button"

                                data-delete-exam="${esc(
                                    exam.id
                                )}"

                                title="
                                    Remove exam
                                "
                            >
                                🗑
                            </button>

                        </div>


                        <h3>
                            ${esc(
                                exam.name
                            )}
                        </h3>


                        <div
                            class="
                                exam-days
                            "
                        >
                            ${remaining}
                        </div>


                        <small>
                            DAYS LEFT
                        </small>


                        <div
                            class="
                                exam-status
                                ${statusClass}
                            "
                        >
                            ${status}
                        </div>


                        <p>
                            📅
                            ${esc(
                                formatDate(
                                    exam.date
                                )
                            )}
                        </p>


                        ${
                            exam.target
                                ?

                                `
                                <p>
                                    🎯 Target:
                                    ${esc(
                                        exam.target
                                    )}
                                </p>
                                `

                                :

                                ""
                        }


                        <div
                            class="
                                exam-actions
                            "
                        >

                            ${
                                exam.official

                                    ?

                                    `
                                    <a
                                        href="${normalizeURL(
                                            exam.official
                                        )}"

                                        target="_blank"

                                        rel="
                                            noopener
                                            noreferrer
                                        "
                                    >
                                        Official ↗
                                    </a>
                                    `

                                    :

                                    ""
                            }


                            ${
                                exam.pyq

                                    ?

                                    `
                                    <a
                                        href="${normalizeURL(
                                            exam.pyq
                                        )}"

                                        target="_blank"

                                        rel="
                                            noopener
                                            noreferrer
                                        "
                                    >
                                        PYQs ↗
                                    </a>
                                    `

                                    :

                                    ""
                            }


                            <button
                                type="button"

                                data-delete-exam="${esc(
                                    exam.id
                                )}"
                            >
                                Remove
                            </button>

                        </div>

                    </article>

                `;

            }
        )
        .join("");


    container
        .querySelectorAll(
            "[data-delete-exam]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        const id =
                            button.dataset
                                .deleteExam;


                        const updated =
                            getArray(
                                "exams"
                            )
                            .filter(
                                exam =>
                                    String(
                                        exam.id
                                    ) !==
                                    String(
                                        id
                                    )
                            );


                        saveArray(
                            "exams",
                            updated
                        );


                        renderTrackedExams();


                        window.dispatchEvent(
                            new CustomEvent(
                                "synaptiqExamsUpdated"
                            )
                        );

                    };

            }
        );

}


/* =====================================================
   MODALS / FORMS
   ===================================================== */

function openExamModal(
    examName = ""
) {

    const modal =
        $("examModal");

    if (!modal) {
        return;
    }


    modal
        .classList
        .remove(
            "hidden"
        );


    const exam =
        EXAM_DIRECTORY
        .find(
            item =>
                item.name ===
                examName
        );


    if (
        $("examName") &&
        examName
    ) {

        $("examName")
            .value =
            examName;

    }


    if (exam) {

        if (
            $("examCategory")
        ) {

            $("examCategory")
                .value =
                exam.category;

        }


        if (
            $("examOfficial")
        ) {

            $("examOfficial")
                .value =
                exam.official;

        }


        if (
            $("examPYQ")
        ) {

            $("examPYQ")
                .value =
                exam.pyq;

        }

    }

}


function closeExamModal() {

    $("examModal")
        ?.classList
        .add(
            "hidden"
        );

}


function openPortalModal() {

    $("portalModal")
        ?.classList
        .remove(
            "hidden"
        );

}


function closePortalModal() {

    $("portalModal")
        ?.classList
        .add(
            "hidden"
        );

}


function handleExamSubmit(
    event
) {

    event.preventDefault();


    const name =
        $("examName")
            ?.value
            .trim() ||
        "";


    const category =
        $("examCategory")
            ?.value ||
        "Other";


    const date =
        $("examDate")
            ?.value ||
        "";


    const target =
        $("examTarget")
            ?.value
            .trim() ||
        "";


    const official =
        normalizeURL(
            $("examOfficial")
                ?.value ||
            ""
        );


    const pyq =
        normalizeURL(
            $("examPYQ")
                ?.value ||
            ""
        );


    if (
        !name ||
        !date
    ) {

        alert(
            "Please enter the exam name and exam date."
        );

        return;

    }


    const exams =
        getArray(
            "exams"
        );


    if (
        exams.some(
            exam =>
                String(
                    exam.name
                )
                .toLowerCase() ===
                name.toLowerCase()
        )
    ) {

        alert(
            "This exam is already being tracked."
        );

        return;

    }


    exams.push({

        id:
            makeId(),

        name,

        category,

        date,

        target,

        official,

        pyq

    });


    saveArray(
        "exams",
        exams
    );


    event.target.reset();


    closeExamModal();


    renderTrackedExams();


    window.dispatchEvent(
        new CustomEvent(
            "synaptiqExamsUpdated"
        )
    );

}


function handlePortalSubmit(
    event
) {

    event.preventDefault();


    const name =
        $("portalName")
            ?.value
            .trim() ||
        "";


    const link =
        normalizeURL(
            $("portalLink")
                ?.value ||
            ""
        );


    if (
        !name ||
        !link
    ) {

        alert(
            "Please enter the portal name and link."
        );

        return;

    }


    const portals =
        getArray(
            "portals"
        );


    portals.push({

        id:
            makeId(),

        name,

        link

    });


    saveArray(
        "portals",
        portals
    );


    event.target.reset();


    closePortalModal();


    renderOfficialPortals();

}


/* =====================================================
   EVENT SETUP
   ===================================================== */

function setupEvents() {

    $("addExam")
        ?.addEventListener(
            "click",
            () =>
                openExamModal()
        );


    $("examForm")
        ?.addEventListener(
            "submit",
            handleExamSubmit
        );


    $("portalForm")
        ?.addEventListener(
            "submit",
            handlePortalSubmit
        );


    $("closeExam")
        ?.addEventListener(
            "click",
            closeExamModal
        );


    $("closePortal")
        ?.addEventListener(
            "click",
            closePortalModal
        );


    $("addOfficial")
        ?.addEventListener(
            "click",
            openPortalModal
        );


    $("examModal")
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    event.currentTarget
                ) {

                    closeExamModal();

                }

            }
        );


    $("portalModal")
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    event.currentTarget
                ) {

                    closePortalModal();

                }

            }
        );


    setupSearch();

}


/* =====================================================
   PUBLIC API
   ===================================================== */

export function renderExams() {

    renderOfficialPortals();

    renderRecommended();

    renderCategories();

    renderDirectory();

    renderTrackedExams();

}


export function initExams() {

    setupEvents();

    renderExams();

}


export {

    openExamModal,

    closeExamModal,

    openPortalModal,

    closePortalModal,

    renderOfficialPortals,

    renderRecommended,

    renderDirectory,

    renderTrackedExams

};