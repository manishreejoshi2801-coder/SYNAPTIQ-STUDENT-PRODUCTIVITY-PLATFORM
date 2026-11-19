import {
    get,
    $
} from "./storage.js";


/* =========================================================
   PROFILE
   ========================================================= */

function getProfile(){

    return get(
        "profile",
        {}
    );

}


/* =========================================================
   BUILD AI PAGE
   ========================================================= */

function buildAIPage(){

    const page =
        $("aiPage");


    if(!page)
        return;


    page.innerHTML = `

        <div class="page-head">

            <div>

                <small>
                    AI STUDY ASSISTANT
                </small>

                <h1>
                    AI Study Lab
                </h1>

                <p>
                    Build personalized prompts for explanations,
                    revision, practice and exam preparation.
                </p>

            </div>

        </div>


        <div class="ai-custom-grid">

            <div class="panel">

                <small>
                    YOUR STUDY CONTEXT
                </small>

                <div
                    id="aiProfileSummary"
                    class="ai-profile-summary"
                ></div>

            </div>


            <div class="panel">

                <small>
                    QUICK TOOLS
                </small>

                <div
                    class="ai-tool-grid"
                >

                    <button
                        class="ai-tool active"
                        data-ai-tool="explain"
                        type="button"
                    >
                        🧠 Explain
                    </button>

                    <button
                        class="ai-tool"
                        data-ai-tool="solve"
                        type="button"
                    >
                        ✏️ Solve
                    </button>

                    <button
                        class="ai-tool"
                        data-ai-tool="quiz"
                        type="button"
                    >
                        📝 Quiz Me
                    </button>

                    <button
                        class="ai-tool"
                        data-ai-tool="flashcards"
                        type="button"
                    >
                        🗂 Flashcards
                    </button>

                    <button
                        class="ai-tool"
                        data-ai-tool="summarize"
                        type="button"
                    >
                        📚 Summarize
                    </button>

                    <button
                        class="ai-tool"
                        data-ai-tool="hint"
                        type="button"
                    >
                        💡 Give Hint
                    </button>

                    <button
                        class="ai-tool"
                        data-ai-tool="revision"
                        type="button"
                    >
                        🔁 Revision Plan
                    </button>

                    <button
                        class="ai-tool"
                        data-ai-tool="exam"
                        type="button"
                    >
                        🎯 Exam Strategy
                    </button>

                </div>

            </div>

        </div>


        <div class="panel">

            <small>
                YOUR QUESTION / CONTENT
            </small>

            <h2>
                What do you want help with?
            </h2>


            <textarea
                id="aiInput"
                class="ai-main-input"
                placeholder="Paste a question, topic, notes or concept here..."
            ></textarea>


            <div
                id="aiSuggestions"
                class="ai-suggestions"
            ></div>


            <div class="ai-actions">

                <button
                    id="generateAIPrompt"
                    class="primary"
                    type="button"
                >
                    ✨ Generate Personalized Prompt
                </button>


                <button
                    id="copyAIPrompt"
                    class="outline"
                    type="button"
                >
                    Copy Prompt
                </button>

            </div>

        </div>


        <div class="panel">

            <small>
                GENERATED PROMPT
            </small>


            <textarea
                id="aiOutput"
                class="ai-output"
                readonly
            ></textarea>


            <div class="ai-service-grid">

                <a
                    href="https://chatgpt.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    🤖 Open ChatGPT ↗
                </a>


                <a
                    href="https://gemini.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ✨ Open Gemini ↗
                </a>


                <a
                    href="https://claude.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    🧠 Open Claude ↗
                </a>

            </div>

        </div>


        <div class="panel">

            <small>
                STUDY ACTIONS
            </small>


            <div class="ai-action-cards">

                <div class="ai-action-card">

                    <strong>
                        Concept Tutor
                    </strong>

                    <p>
                        Ask the AI to explain a difficult topic
                        from basic to advanced level.
                    </p>

                </div>


                <div class="ai-action-card">

                    <strong>
                        Exam Practice
                    </strong>

                    <p>
                        Generate questions according to your
                        selected exam and difficulty.
                    </p>

                </div>


                <div class="ai-action-card">

                    <strong>
                        Mistake Analysis
                    </strong>

                    <p>
                        Paste a wrong answer and ask the AI
                        to identify the exact mistake.
                    </p>

                </div>


                <div class="ai-action-card">

                    <strong>
                        Revision Coach
                    </strong>

                    <p>
                        Turn your weak topics into a focused
                        revision schedule.
                    </p>

                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   TOOL PROMPTS
   ========================================================= */

const TOOL_TEXT = {

    explain:
        "Explain the following topic clearly from basic to advanced level. Use simple language, examples, important points, and a short summary at the end.",

    solve:
        "Solve the following problem step by step. Explain the reasoning behind each step and verify the final answer.",

    quiz:
        "Act as my personal quiz master. Create 10 questions based on the topic below. Ask one question at a time, wait for my answer, then evaluate it.",

    flashcards:
        "Convert the following topic into concise revision flashcards. Include definitions, formulas, important facts, common mistakes, and exam-focused points.",

    summarize:
        "Summarize the following content into clear exam-oriented notes. Highlight definitions, formulas, key concepts and points that are easy to revise.",

    hint:
        "Do not directly solve the following problem. Give me progressive hints so I can solve it myself.",

    revision:
        "Create a personalized revision plan for the following topic. Divide it into concepts, practice, active recall, PYQs and final revision.",

    exam:
        "Analyze the following topic from an exam perspective. Tell me its importance, common question patterns, likely mistakes and the best way to prepare it."

};


/* =========================================================
   PROFILE CONTEXT
   ========================================================= */

function profileContext(){

    const profile =
        getProfile();


    const subjects =
        Array.isArray(
            profile.subjects
        )
            ? profile.subjects.join(
                ", "
            )
            : "Not specified";


    return `

Student Type:
${profile.type || "Not specified"}

Degree / Class:
${profile.degree || profile.classYear || "Not specified"}

Branch / Stream:
${profile.branch || profile.stream || "Not specified"}

Target Exam:
${profile.targetExam || "Not specified"}

Subjects:
${subjects}

Daily Goal:
${profile.dailyGoal || 120} minutes

Preferred Time:
${profile.preferredTime || "Flexible"}

`;

}


/* =========================================================
   RENDER PROFILE
   ========================================================= */

function renderProfile(){

    const box =
        $("aiProfileSummary");


    if(!box)
        return;


    const profile =
        getProfile();


    box.innerHTML = `

        <div class="ai-profile-line">

            <span>
                Student Type
            </span>

            <strong>
                ${escapeHtml(
                    profile.type ||
                    "Not specified"
                )}
            </strong>

        </div>


        <div class="ai-profile-line">

            <span>
                Target Exam
            </span>

            <strong>
                ${escapeHtml(
                    profile.targetExam ||
                    "Not specified"
                )}
            </strong>

        </div>


        <div class="ai-profile-line">

            <span>
                Subjects
            </span>

            <strong>
                ${escapeHtml(
                    Array.isArray(
                        profile.subjects
                    )
                        ? profile.subjects.join(
                            ", "
                        )
                        : "Not specified"
                )}
            </strong>

        </div>

    `;

}


/* =========================================================
   ACTIVE TOOL
   ========================================================= */

let activeTool =
    "explain";


function setupTools(){

    document
        .querySelectorAll(
            "[data-ai-tool]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                "[data-ai-tool]"
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


                        activeTool =
                            button.dataset
                                .aiTool;


                        renderSuggestion();

                    }
                );

            }
        );

}


/* =========================================================
   SUGGESTION
   ========================================================= */

function renderSuggestion(){

    const box =
        $("aiSuggestions");


    if(!box)
        return;


    const suggestions = {

        explain:
            "Example: Explain TCP three-way handshake simply.",

        solve:
            "Example: Solve this DBMS normalization problem step by step.",

        quiz:
            "Example: Quiz me on Computer Networks.",

        flashcards:
            "Example: Create flashcards for Operating Systems.",

        summarize:
            "Example: Summarize these notes for GATE revision.",

        hint:
            "Example: Give me a hint for this DSA problem.",

        revision:
            "Example: Make a 7-day revision plan for DBMS.",

        exam:
            "Example: Tell me the most important GATE topics in OS."

    };


    box.textContent =
        suggestions[
            activeTool
        ];

}


/* =========================================================
   GENERATE PROMPT
   ========================================================= */

function generatePrompt(){

    const input =
        $("aiInput")
            ?.value
            .trim();


    if(!input){

        $("aiOutput")
            &&
            (
                $("aiOutput")
                    .value =
                    "Enter a topic, question or notes first."
            );

        return;

    }


    const instruction =
        TOOL_TEXT[
            activeTool
        ] ||
        TOOL_TEXT.explain;


    const prompt = `

You are my personal AI study assistant.

Here is my Synaptiq study context:

${profileContext()}

My selected task:

${instruction}

My content/question:

${input}

Please tailor the response to my student profile and target exam.
Keep the explanation useful for exam preparation and clearly structured.

`;


    $("aiOutput")
        .value =
        prompt
            .trim();

}


/* =========================================================
   COPY
   ========================================================= */

async function copyPrompt(){

    const output =
        $("aiOutput");


    if(!output ||
       !output.value)
        return;


    try{

        await navigator.clipboard.writeText(
            output.value
        );


        $("copyAIPrompt")
            .textContent =
            "✓ Copied";

        setTimeout(
            () => {

                $("copyAIPrompt")
                    .textContent =
                    "Copy Prompt";

            },
            1500
        );

    }
    catch(error){

        output.select();

        document.execCommand(
            "copy"
        );

    }

}


/* =========================================================
   ESCAPE
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

export function initAI(){

    buildAIPage();

    renderProfile();

    setupTools();

    renderSuggestion();


    $("generateAIPrompt")
        ?.addEventListener(
            "click",
            generatePrompt
        );


    $("copyAIPrompt")
        ?.addEventListener(
            "click",
            copyPrompt
        );


    window.addEventListener(
        "synaptiqProfileUpdated",
        renderProfile
    );

}