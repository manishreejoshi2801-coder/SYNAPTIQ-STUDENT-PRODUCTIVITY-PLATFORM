import {
    $,
    initStorage
} from "./storage.js";


/* =====================================================
   MODULE FUNCTIONS
   ===================================================== */

let authInit = null;
let currentUser = null;

let visualsInit = null;

let dashboardInit = null;
let dashboardRender = null;

let subjectsInit = null;
let questionsInit = null;
let tasksInit = null;

let examsInit = null;
let examsRender = null;

let testsInit = null;
let plannerInit = null;

let timerInit = null;

let analyticsRender = null;

let resourcesInit = null;
let resourcesRender = null;

let rewardsRender = null;

let aiInit = null;

let snapshotInit = null;
let snapshotRender = null;

let pyqInit = null;


/* =====================================================
   SAFE MODULE LOADER
   ===================================================== */

async function loadFunction(
    path,
    names = []
){

    try{

        const module =
            await import(path);


        for(
            const name of names
        ){

            if(
                typeof module[name] ===
                "function"
            ){

                return module[name];

            }

        }

    }
    catch(error){

        console.error(
            `Synaptiq: failed to load ${path}`,
            error
        );

    }


    return null;

}


/* =====================================================
   LOAD ALL MODULES
   ===================================================== */

async function loadModules(){

    authInit =
        await loadFunction(
            "./auth.js",
            [
                "initAuth"
            ]
        );


    currentUser =
        await loadFunction(
            "./auth.js",
            [
                "currentUser"
            ]
        );


    visualsInit =
        await loadFunction(
            "./visuals.js",
            [
                "initVisuals"
            ]
        );


    dashboardInit =
        await loadFunction(
            "./dashboard.js",
            [
                "initDashboard"
            ]
        );


    dashboardRender =
        await loadFunction(
            "./dashboard.js",
            [
                "renderDashboard",
                "updateDashboard"
            ]
        );


    subjectsInit =
        await loadFunction(
            "./subjects.js",
            [
                "initSubjects"
            ]
        );


    questionsInit =
        await loadFunction(
            "./questions.js",
            [
                "initQuestions"
            ]
        );


    tasksInit =
        await loadFunction(
            "./tasks.js",
            [
                "initTasks"
            ]
        );


    examsInit =
        await loadFunction(
            "./exams.js",
            [
                "initExams"
            ]
        );


    examsRender =
        await loadFunction(
            "./exams.js",
            [
                "renderExams"
            ]
        );


    testsInit =
        await loadFunction(
            "./tests.js",
            [
                "initTests"
            ]
        );


    plannerInit =
        await loadFunction(
            "./planner.js",
            [
                "initPlanner"
            ]
        );


    timerInit =
        await loadFunction(
            "./timer.js",
            [
                "initTimer"
            ]
        );


    analyticsRender =
        await loadFunction(
            "./analytics.js",
            [
                "renderAnalytics"
            ]
        );


    resourcesInit =
        await loadFunction(
            "./resources.js",
            [
                "initResources"
            ]
        );


    resourcesRender =
        await loadFunction(
            "./resources.js",
            [
                "renderResources"
            ]
        );


    rewardsRender =
        await loadFunction(
            "./rewards.js",
            [
                "renderRewards"
            ]
        );


    aiInit =
        await loadFunction(
            "./ai.js",
            [
                "initAI"
            ]
        );


    snapshotInit =
        await loadFunction(
            "./snapshot.js",
            [
                "initSnapshot"
            ]
        );


    snapshotRender =
        await loadFunction(
            "./snapshot.js",
            [
                "renderSnapshot"
            ]
        );


    pyqInit =
        await loadFunction(
            "./pyq.js",
            [
                "initPYQ"
            ]
        );

}


/* =====================================================
   HOME
   ===================================================== */

function setupHome(){

    $("startBtn")
        ?.addEventListener(
            "click",
            () => {

                $("home")
                    ?.classList
                    .add(
                        "hidden"
                    );


                $("auth")
                    ?.classList
                    .remove(
                        "hidden"
                    );

            }
        );


    $("loginBtn")
        ?.addEventListener(
            "click",
            () => {

                $("home")
                    ?.classList
                    .add(
                        "hidden"
                    );


                $("auth")
                    ?.classList
                    .remove(
                        "hidden"
                    );

            }
        );


    $("backBtn")
        ?.addEventListener(
            "click",
            () => {

                $("auth")
                    ?.classList
                    .add(
                        "hidden"
                    );


                $("home")
                    ?.classList
                    .remove(
                        "hidden"
                    );

            }
        );


    $("exploreBtn")
        ?.addEventListener(
            "click",
            () => {

                $("features")
                    ?.scrollIntoView({
                        behavior:
                            "smooth"
                    });

            }
        );

}


/* =====================================================
   SHOW DASHBOARD
   ===================================================== */

function showDashboard(){

    $("home")
        ?.classList
        .add(
            "hidden"
        );


    $("auth")
        ?.classList
        .add(
            "hidden"
        );


    $("dashboard")
        ?.classList
        .remove(
            "hidden"
        );


    setTimeout(
        () => {

            dashboardRender?.();

            examsRender?.();

            resourcesRender?.();

            analyticsRender?.();

            rewardsRender?.();

            snapshotRender?.();

        },
        50
    );

}


/* =====================================================
   NAVIGATION
   ===================================================== */

function setupNavigation(){

    document
        .querySelectorAll(
            "[data-page]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const page =
                            button.dataset
                                .page;


                        showPage(
                            page
                        );


                        document
                            .querySelectorAll(
                                ".menu"
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


                        refreshPage(
                            page
                        );

                    }
                );

            }
        );

}


export function showPage(
    pageId
){

    document
        .querySelectorAll(
            "#dashboard .page"
        )
        .forEach(
            page =>
                page.classList
                    .add(
                        "hidden"
                    )
        );


    $(pageId)
        ?.classList
        .remove(
            "hidden"
        );

}


/* =====================================================
   PAGE REFRESH
   ===================================================== */

function refreshPage(
    pageId
){

    switch(
        pageId
    ){

        case "dashboardPage":

            dashboardRender?.();

            break;


        case "examsPage":

            examsRender?.();

            break;


        case "analyticsPage":

            analyticsRender?.();

            break;


        case "resourcesPage":

            resourcesRender?.();

            break;


        case "snapshotPage":

            snapshotRender?.();

            break;


        case "rewardsPage":

            rewardsRender?.();

            break;

    }

}


/* =====================================================
   MODALS
   ===================================================== */

function setupModals(){

    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        $(
                            button.dataset
                                .close
                        )
                        ?.classList
                        .add(
                            "hidden"
                        );

                    }
                );

            }
        );


    document.addEventListener(
        "click",
        event => {

            if(
                event.target.classList
                    .contains(
                        "modal"
                    )
            ){

                event.target.classList
                    .add(
                        "hidden"
                    );

            }

        }
    );

}


/* =====================================================
   THEME
   ===================================================== */

function setupTheme(){

    function toggleTheme(){

        document.body
            .classList
            .toggle(
                "dark"
            );


        localStorage.setItem(
            "synaptiqTheme",
            document.body.classList
                .contains(
                    "dark"
                )
                ? "dark"
                : "light"
        );

    }


    $("homeTheme")
        ?.addEventListener(
            "click",
            toggleTheme
        );


    $("dashTheme")
        ?.addEventListener(
            "click",
            toggleTheme
        );


    if(
        localStorage.getItem(
            "synaptiqTheme"
        ) ===
        "dark"
    ){

        document.body
            .classList
            .add(
                "dark"
            );

    }

}


/* =====================================================
   QUICK ACTIONS
   ===================================================== */

function setupQuickActions(){

    const actions = {

        qaSubject:
            "subjectModal",

        qaQuestion:
            "questionModal",

        qaTask:
            "taskModal",

        qaExam:
            "examModal",

        qaPlanner:
            "plannerModal",

        goalBtn:
            "goalModal"

    };


    Object.entries(
        actions
    )
    .forEach(
        (
            [
                buttonId,
                modalId
            ]
        ) => {

            $(
                buttonId
            )
            ?.addEventListener(
                "click",
                () => {

                    $(
                        modalId
                    )
                    ?.classList
                    .remove(
                        "hidden"
                    );

                }
            );

        }
    );


    $("qaSnapshot")
        ?.addEventListener(
            "click",
            () => {

                document
                    .querySelector(
                        '[data-page="snapshotPage"]'
                    )
                    ?.click();

            }
        );

}


/* =====================================================
   NOTIFICATIONS
   ===================================================== */

function setupNotifications(){

    $("notificationBtn")
        ?.addEventListener(
            "click",
            () => {

                $("notificationBox")
                    ?.classList
                    .toggle(
                        "hidden"
                    );

            }
        );

}


/* =====================================================
   PYQ
   ===================================================== */

function setupPYQ(){

    if(
        !pyqInit
    ){

        return;

    }


    try{

        pyqInit(
            () => {

                dashboardRender?.();

                analyticsRender?.();

            }
        );

    }
    catch(error){

        console.error(
            "PYQ initialization failed:",
            error
        );

    }

}


/* =====================================================
   PROFILE EVENTS
   ===================================================== */

function setupProfileEvents(){

    window.addEventListener(
        "synaptiqProfileUpdated",
        () => {

            dashboardRender?.();

            examsRender?.();

            resourcesRender?.();

            analyticsRender?.();

            rewardsRender?.();

            snapshotRender?.();

        }
    );


    window.addEventListener(
        "synaptiqLogin",
        () => {

            showDashboard();

        }
    );

}


/* =====================================================
   INITIALIZE
   ===================================================== */

async function initialize(){

    try{

        initStorage();

    }
    catch(error){

        console.error(
            "Storage initialization failed:",
            error
        );

    }


    await loadModules();


    try{
        authInit?.();
    }
    catch(error){
        console.error(
            "Auth initialization failed:",
            error
        );
    }


    try{
        visualsInit?.();
    }
    catch(error){
        console.error(
            "Visual initialization failed:",
            error
        );
    }


    try{
        dashboardInit?.();
    }
    catch(error){
        console.error(
            "Dashboard initialization failed:",
            error
        );
    }


    try{
        subjectsInit?.();
    }
    catch(error){
        console.error(
            "Subjects initialization failed:",
            error
        );
    }


    try{
        questionsInit?.();
    }
    catch(error){
        console.error(
            "Questions initialization failed:",
            error
        );
    }


    try{
        tasksInit?.();
    }
    catch(error){
        console.error(
            "Tasks initialization failed:",
            error
        );
    }


    try{

        examsInit?.(
            () => {
                dashboardRender?.();
            }
        );

    }
    catch(error){

        console.error(
            "Exam initialization failed:",
            error
        );

    }


    try{
        testsInit?.();
    }
    catch(error){
        console.error(
            "Tests initialization failed:",
            error
        );
    }


    try{
        plannerInit?.();
    }
    catch(error){
        console.error(
            "Planner initialization failed:",
            error
        );
    }


    try{
        timerInit?.();
    }
    catch(error){
        console.error(
            "Timer initialization failed:",
            error
        );
    }


    try{
        resourcesInit?.();
    }
    catch(error){
        console.error(
            "Resources initialization failed:",
            error
        );
    }


    try{
        aiInit?.();
    }
    catch(error){
        console.error(
            "AI initialization failed:",
            error
        );
    }


    try{
        snapshotInit?.();
    }
    catch(error){
        console.error(
            "Snapshot initialization failed:",
            error
        );
    }


    setupPYQ();


    try{
        dashboardRender?.();
    }
    catch(error){
        console.error(
            "Dashboard render failed:",
            error
        );
    }


    try{
        analyticsRender?.();
    }
    catch(error){
        console.error(
            "Analytics render failed:",
            error
        );
    }


    try{
        rewardsRender?.();
    }
    catch(error){
        console.error(
            "Rewards render failed:",
            error
        );
    }


    try{
        snapshotRender?.();
    }
    catch(error){
        console.error(
            "Snapshot render failed:",
            error
        );
    }

}


/* =====================================================
   START
   ===================================================== */

function start(){

    setupHome();

    setupNavigation();

    setupModals();

    setupTheme();

    setupQuickActions();

    setupNotifications();

    setupProfileEvents();

    initialize();

}


start();