import {
    get,
    set,
    uid,
    $,
    esc
} from "./storage.js";

import {
    getProfile
} from "./profile.js";


/* =========================================================
   RESOURCE DIRECTORY
   ========================================================= */

const RESOURCE_DIRECTORY = [

    {
        name:"NPTEL",
        type:"Courses",

        subjects:[
            "computer networks",
            "operating systems",
            "dbms",
            "programming",
            "algorithms",
            "computer science",
            "engineering"
        ],

        exams:[
            "gate",
            "engineering",
            "btech"
        ],

        url:
            "https://www.nptel.ac.in/courses",

        reason:
            "IIT/IISc courses for strong conceptual preparation."
    },


    {
        name:"SWAYAM",
        type:"Courses",

        subjects:[
            "computer science",
            "programming",
            "engineering",
            "mathematics",
            "management"
        ],

        exams:[
            "gate",
            "engineering",
            "cat",
            "university"
        ],

        url:
            "https://swayam.gov.in/search_courses",

        reason:
            "Online courses from universities and national coordinators."
    },


    {
        name:"MIT OpenCourseWare",
        type:"Concepts",

        subjects:[
            "computer science",
            "algorithms",
            "programming",
            "mathematics",
            "operating systems"
        ],

        exams:[
            "gate",
            "engineering"
        ],

        url:
            "https://ocw.mit.edu/search/",

        reason:
            "Detailed university-level material for difficult concepts."
    },


    {
        name:"GeeksforGeeks",
        type:"Practice",

        subjects:[
            "dsa",
            "data structures",
            "algorithms",
            "computer networks",
            "operating systems",
            "dbms",
            "programming",
            "coding"
        ],

        exams:[
            "gate",
            "engineering",
            "placement"
        ],

        url:
            "https://www.geeksforgeeks.org/",

        reason:
            "Useful explanations, coding practice and technical problems."
    },


    {
        name:"Physics Wallah",
        type:"Exam Preparation",

        subjects:[
            "physics",
            "chemistry",
            "mathematics",
            "biology"
        ],

        exams:[
            "jee",
            "neet",
            "engineering",
            "medical"
        ],

        url:
            "https://www.pw.live/",

        reason:
            "Courses, practice and exam-preparation material."
    },


    {
        name:"Coursera",
        type:"Courses",

        subjects:[
            "computer science",
            "programming",
            "data science",
            "ai",
            "machine learning",
            "management"
        ],

        exams:[
            "engineering",
            "management",
            "university"
        ],

        url:
            "https://www.coursera.org/",

        reason:
            "Structured courses from universities and industry."
    },


    {
        name:"Khan Academy",
        type:"Concepts",

        subjects:[
            "mathematics",
            "physics",
            "chemistry",
            "statistics"
        ],

        exams:[
            "jee",
            "neet",
            "university",
            "engineering"
        ],

        url:
            "https://www.khanacademy.org/",

        reason:
            "Clear explanations and concept-building practice."
    },


    {
        name:"GATE Previous Papers",
        type:"PYQ",

        subjects:[
            "engineering",
            "computer science",
            "programming",
            "computer networks",
            "operating systems",
            "dbms"
        ],

        exams:[
            "gate",
            "engineering"
        ],

        url:
            "https://gate2027.iitm.ac.in/download",

        reason:
            "Official GATE downloads and previous-paper material."
    },


    {
        name:"JEE Main Official",
        type:"Official Papers",

        subjects:[
            "physics",
            "chemistry",
            "mathematics"
        ],

        exams:[
            "jee",
            "jee main"
        ],

        url:
            "https://jeemain.nta.nic.in/",

        reason:
            "Official JEE Main portal and Question Papers section."
    },


    {
        name:"JEE Advanced Previous Papers",
        type:"PYQ",

        subjects:[
            "physics",
            "chemistry",
            "mathematics"
        ],

        exams:[
            "jee advanced",
            "jee",
            "engineering"
        ],

        url:
            "https://jeeadv.ac.in/archive.html",

        reason:
            "Official JEE Advanced previous-question-paper archive."
    },


    {
        name:"UPSC Previous Papers",
        type:"PYQ",

        subjects:[
            "general studies",
            "history",
            "geography",
            "polity",
            "economics"
        ],

        exams:[
            "upsc",
            "civil services",
            "nda",
            "cds"
        ],

        url:
            "https://www.upsc.gov.in/examinations/previous-question-papers",

        reason:
            "Official UPSC previous-question-paper archive."
    },


    {
        name:"CTET Previous Papers",
        type:"PYQ",

        subjects:[
            "teaching",
            "education",
            "child development"
        ],

        exams:[
            "ctet",
            "teaching"
        ],

        url:
            "https://ctet.nic.in/archive/",

        reason:
            "Official CTET archive containing previous question papers."
    },


    {
        name:"UGC NET Archive",
        type:"PYQ / Archive",

        subjects:[
            "research",
            "teaching",
            "computer science",
            "commerce",
            "management"
        ],

        exams:[
            "ugc net",
            "net",
            "teaching"
        ],

        url:
            "https://ugcnet.nta.nic.in/archive/",

        reason:
            "Official UGC-NET archive and examination material."
    },


    {
        name:"CUET UG Documents",
        type:"PYQ / Papers",

        subjects:[
            "general test",
            "english",
            "mathematics",
            "science",
            "commerce",
            "humanities"
        ],

        exams:[
            "cuet",
            "cuet ug",
            "university"
        ],

        url:
            "https://cuet.nta.nic.in/documents/",

        reason:
            "Official CUET document area."
    },


    {
        name:"CMAT Official",
        type:"Official Papers",

        subjects:[
            "management",
            "aptitude",
            "logical reasoning",
            "quantitative aptitude"
        ],

        exams:[
            "cmat",
            "management",
            "mba"
        ],

        url:
            "https://cmat.nta.nic.in/",

        reason:
            "Official CMAT portal and examination documents."
    }

];


/* =========================================================
   FILTER STATE
   ========================================================= */

let resourceFilter =
    "all";


/* =========================================================
   DATA
   ========================================================= */

function savedResources(){

    const resources =
        get(
            "resources",
            []
        );


    return Array.isArray(
        resources
    )
        ? resources
        : [];

}


/* =========================================================
   PROFILE SCORE
   ========================================================= */

function resourceScore(
    resource
){

    let score = 0;


    const profile =
        getProfile();


    const target =
        String(
            profile.targetExam ||
            ""
        ).toLowerCase();


    const profileText = `
        ${profile.type || ""}
        ${profile.degree || ""}
        ${profile.branch || ""}
        ${profile.stream || ""}
        ${profile.profession || ""}
        ${profile.learningGoal || ""}
    `.toLowerCase();


    const subjects =
        Array.isArray(
            profile.subjects
        )
            ? profile.subjects
            : [];


    /* Target exam */

    resource.exams.forEach(
        exam => {

            const key =
                exam.toLowerCase();


            if(
                target.includes(key) ||
                key.includes(target)
            ){

                if(target)
                    score += 8;

            }


            if(
                profileText.includes(key)
            ){

                score += 3;

            }

        }
    );


    /* Subject matching */

    subjects.forEach(
        subject => {

            const name =
                String(
                    subject
                ).toLowerCase();


            resource.subjects.forEach(
                keyword => {

                    const key =
                        keyword.toLowerCase();


                    if(
                        name.includes(key) ||
                        key.includes(name)
                    ){

                        score += 5;

                    }

                }
            );

        }
    );


    /* Student type */

    if(
        profile.type ===
        "College / University Student"
    ){

        if(
            resource.exams.some(
                exam =>
                    [
                        "gate",
                        "engineering",
                        "university",
                        "management"
                    ].includes(
                        exam.toLowerCase()
                    )
            )
        ){

            score += 2;

        }

    }


    if(
        profile.type ===
        "School Student"
    ){

        if(
            resource.exams.some(
                exam =>
                    [
                        "jee",
                        "neet",
                        "university"
                    ].includes(
                        exam.toLowerCase()
                    )
            )
        ){

            score += 2;

        }

    }


    return score;

}


/* =========================================================
   RECOMMENDED RESOURCES
   ========================================================= */

function recommendedResources(){

    let results =
        RESOURCE_DIRECTORY
            .map(
                resource => ({
                    resource,
                    score:
                        resourceScore(
                            resource
                        )
                })
            );


    if(
        resourceFilter !==
        "all"
    ){

        results =
            results.filter(
                item =>
                    item.resource.type
                        .toLowerCase()
                        .includes(
                            resourceFilter
                                .toLowerCase()
                        )
            );

    }


    results =
        results
            .sort(
                (a,b) =>
                    b.score -
                    a.score
            )
            .slice(
                0,
                6
            );


    return results;

}


/* =========================================================
   RENDER RECOMMENDED
   ========================================================= */

function renderRecommendedResources(){

    const container =
        $("recommendedResources");


    if(!container)
        return;


    const results =
        recommendedResources();


    if(
        $("resourceRecommendationCount")
    ){

        $("resourceRecommendationCount")
            .textContent =
            `${results.length} matches`;

    }


    container.innerHTML =
        results
            .map(
                item => {

                    const resource =
                        item.resource;


                    const label =
                        item.score > 0
                            ? "MATCHED TO YOUR PROFILE"
                            : "STARTER RESOURCE";


                    return `

                        <div
                            class="recommended-resource"
                        >

                            <span
                                class="resource-match"
                            >
                                ${esc(
                                    label
                                )}
                            </span>


                            <h3>
                                ${esc(
                                    resource.name
                                )}
                            </h3>


                            <span
                                class="resource-type"
                            >
                                ${esc(
                                    resource.type
                                )}
                            </span>


                            <p
                                class="resource-reason"
                            >
                                ${esc(
                                    resource.reason
                                )}
                            </p>


                            <div
                                class="resource-actions"
                            >

                                <a
                                    href="${esc(
                                        resource.url
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Explore ↗
                                </a>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   RENDER SAVED
   ========================================================= */

function renderSavedResources(){

    const container =
        $("resourceCards");


    if(!container)
        return;


    const resources =
        savedResources();


    container.innerHTML =
        resources.length

            ? resources
                .map(
                    resource => `

                        <div
                            class="resource-card"
                        >

                            <span
                                class="resource-type"
                            >
                                ${esc(
                                    resource.type ||
                                    "Resource"
                                )}
                            </span>


                            <h3>
                                ${esc(
                                    resource.name
                                )}
                            </h3>


                            <p>
                                ${esc(
                                    resource.description ||
                                    `Saved for ${
                                        resource.subject ||
                                        "study"
                                    }.`
                                )}
                            </p>


                            <div
                                class="resource-actions"
                            >

                                <a
                                    href="${esc(
                                        resource.link
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open ↗
                                </a>

                            </div>

                        </div>

                    `
                )
                .join("")

            : `
                <div
                    class="empty-dashboard-message"
                >
                    No saved resources yet.
                </div>
              `;

}


/* =========================================================
   RESOURCE FILTERS
   ========================================================= */

function setupResourceFilters(){

    document
        .querySelectorAll(
            ".resource-filter"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".resource-filter"
                            )
                            .forEach(
                                item =>
                                    item.classList
                                        .remove(
                                            "active"
                                        )
                            );


                        button.classList.add(
                            "active"
                        );


                        resourceFilter =
                            button.dataset
                                .resourceFilter;


                        renderRecommendedResources();

                    }
                );

            }
        );

}


/* =========================================================
   INIT
   ========================================================= */

export function initResources(){

    $("addResource")
        ?.addEventListener(
            "click",
            () => {

                $("resourceModal")
                    ?.classList
                    .remove(
                        "hidden"
                    );

            }
        );


    $("resourceForm")
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const resources =
                    savedResources();


                resources.push({

                    id:
                        uid(),

                    name:
                        $("resourceName")
                            .value
                            .trim(),

                    subject:
                        $("resourceSubjectInput")
                            .value
                            .trim(),

                    type:
                        $("resourceTypeInput")
                            .value,

                    link:
                        $("resourceLink")
                            .value
                            .trim(),

                    description:
                        $("resourceDescription")
                            .value
                            .trim()

                });


                set(
                    "resources",
                    resources
                );


                event.target.reset();


                $("resourceModal")
                    ?.classList
                    .add(
                        "hidden"
                    );


                renderSavedResources();

            }
        );


    setupResourceFilters();


    window.addEventListener(
        "synaptiqProfileUpdated",
        () => {

            renderRecommendedResources();

        }
    );


    renderRecommendedResources();

    renderSavedResources();

}


/* =========================================================
   REFRESH
   ========================================================= */

export function renderResources(){

    renderRecommendedResources();

    renderSavedResources();

}


/* =========================================================
   EXPORT
   ========================================================= */

export function getResourceDirectory(){

    return [
        ...RESOURCE_DIRECTORY
    ];

}