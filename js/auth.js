import {
    get,
    set,
    $
} from "./storage.js";


const USERS_KEY =
    "synaptiqUsers";

const CURRENT_USER_KEY =
    "synaptiqCurrentUser";


/* =====================================================
   USERS
   ===================================================== */

function getUsers(){

    const users =
        get(
            USERS_KEY,
            []
        );

    return Array.isArray(users)
        ? users
        : [];

}


function saveUsers(
    users
){

    set(
        USERS_KEY,
        users
    );

}


/* =====================================================
   CURRENT USER
   ===================================================== */

export function currentUser(){

    return get(
        CURRENT_USER_KEY,
        null
    );

}


export function isLoggedIn(){

    return Boolean(
        currentUser()
    );

}


function saveCurrentUser(
    user
){

    set(
        CURRENT_USER_KEY,
        user
    );

}


/* =====================================================
   MESSAGE
   ===================================================== */

function clearMessage(){

    const message =
        $("message");


    if(!message)
        return;


    message.textContent =
        "";

    message.classList.remove(
        "success"
    );

}


function showMessage(
    text,
    success = false
){

    const message =
        $("message");


    if(!message)
        return;


    message.textContent =
        text;


    message.classList.toggle(
        "success",
        success
    );

}


/* =====================================================
   USER NAME
   ===================================================== */

export function updateUserName(){

    const user =
        currentUser();


    const profile =
        get(
            "profile",
            {}
        );


    const name =
        user?.name ||
        profile?.name ||
        "Student";


    $("userName")
        ?.replaceChildren(
            document.createTextNode(
                name
            )
        );


    document
        .querySelectorAll(
            "[data-user-name]"
        )
        .forEach(
            element =>
                element.textContent =
                    name
        );

}


/* =====================================================
   OPEN DASHBOARD
   ===================================================== */

function openDashboard(){

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


    updateUserName();


    window.dispatchEvent(
        new CustomEvent(
            "synaptiqLogin"
        )
    );

}


/* =====================================================
   REGISTRATION CATEGORY
   ===================================================== */

function updateRegistrationFields(){

    const type =
        $("registerType")
            ?.value;


    const groups = [

        $("registerSchoolFields"),

        $("registerCollegeFields"),

        $("registerProfessionalFields"),

        $("registerLearnerFields")

    ];


    groups.forEach(
        group => {

            group?.classList.add(
                "hidden"
            );

        }
    );


    if(
        type ===
        "School Student"
    ){

        $("registerSchoolFields")
            ?.classList
            .remove(
                "hidden"
            );

    }


    if(
        type ===
        "College / University Student"
    ){

        $("registerCollegeFields")
            ?.classList
            .remove(
                "hidden"
            );

    }


    if(
        type ===
        "Working Professional"
    ){

        $("registerProfessionalFields")
            ?.classList
            .remove(
                "hidden"
            );

    }


    if(
        type ===
        "Self-Learner"
    ){

        $("registerLearnerFields")
            ?.classList
            .remove(
                "hidden"
            );

    }

}


/* =====================================================
   DAILY GOAL
   ===================================================== */

function setupDailyGoal(){

    const type =
        $("registerDailyGoalType");


    const customBox =
        $("customStudyGoalBox");


    if(!type)
        return;


    type.addEventListener(
        "change",
        () => {

            if(
                type.value ===
                "custom"
            ){

                customBox
                    ?.classList
                    .remove(
                        "hidden"
                    );

            }
            else{

                customBox
                    ?.classList
                    .add(
                        "hidden"
                    );

            }

        }
    );

}


/* =====================================================
   GET DAILY GOAL
   ===================================================== */

function getDailyGoal(){

    const type =
        $("registerDailyGoalType")
            ?.value;


    if(
        type ===
        "custom"
    ){

        const custom =
            Number(
                $("registerCustomDailyGoal")
                    ?.value
            );


        if(
            !Number.isFinite(custom) ||
            custom < 15
        ){

            return null;

        }


        return Math.min(
            custom,
            1440
        );

    }


    return (
        Number(type) ||
        120
    );

}


/* =====================================================
   LOGIN
   ===================================================== */

function handleLogin(){

    const email =
        $("loginEmail")
            ?.value
            .trim()
            .toLowerCase();


    const password =
        $("loginPassword")
            ?.value;


    if(!email){

        showMessage(
            "Please enter your email."
        );

        return;

    }


    if(!password){

        showMessage(
            "Please enter your password."
        );

        return;

    }


    const users =
        getUsers();


    const user =
        users.find(
            item =>
                String(
                    item.email ||
                    ""
                )
                .toLowerCase()
                ===
                email
                &&
                String(
                    item.password ||
                    ""
                )
                ===
                password
        );


    if(!user){

        showMessage(
            "Invalid email or password."
        );

        return;

    }


    saveCurrentUser({

        id:
            user.id,

        name:
            user.name,

        email:
            user.email

    });


    const profile =
        get(
            "profile",
            {}
        );


    set(
        "profile",
        {
            ...profile,
            name:
                user.name
        }
    );


    openDashboard();

}


/* =====================================================
   REGISTER
   ===================================================== */

function handleRegister(){

    const name =
        $("registerName")
            ?.value
            .trim();


    const email =
        $("registerEmail")
            ?.value
            .trim()
            .toLowerCase();


    const password =
        $("registerPassword")
            ?.value;


    const confirmPassword =
        $("confirmPassword")
            ?.value;


    const type =
        $("registerType")
            ?.value;


    if(!name){

        showMessage(
            "Please enter your name."
        );

        return;

    }


    if(!email){

        showMessage(
            "Please enter your email."
        );

        return;

    }


    if(!password){

        showMessage(
            "Please enter a password."
        );

        return;

    }


    if(
        password.length < 4
    ){

        showMessage(
            "Password must contain at least 4 characters."
        );

        return;

    }


    if(!confirmPassword){

        showMessage(
            "Please confirm your password."
        );

        return;

    }


    if(
        password !==
        confirmPassword
    ){

        showMessage(
            "Passwords do not match."
        );

        return;

    }


    if(!type){

        showMessage(
            "Please select who you are."
        );

        return;

    }


    const dailyGoal =
        getDailyGoal();


    if(
        dailyGoal === null
    ){

        showMessage(
            "Please enter a custom study goal of at least 15 minutes."
        );

        return;

    }


    const users =
        getUsers();


    const exists =
        users.some(
            user =>
                String(
                    user.email ||
                    ""
                )
                .toLowerCase()
                ===
                email
        );


    if(exists){

        showMessage(
            "An account with this email already exists."
        );

        return;

    }


    /* =================================================
       PROFILE
       ================================================= */

    const profile = {

        name,

        photo:"",

        type,

        age:"",

        gender:
            "Prefer not to say",

        institution:"",

        classYear:"",

        stream:"",

        degree:"",

        branch:"",

        profession:"",

        experience:"",

        availableTime:"",

        learningGoal:"",

        targetExam:
            $("registerTargetExam")
                ?.value
                .trim()
                ||
                "",

        subjects:
            $("registerSubjects")
                ?.value
                .split(",")
                .map(
                    item =>
                        item.trim()
                )
                .filter(Boolean)
                ||
                [],

        dailyGoal,

        preferredTime:
            $("registerPreferredTime")
                ?.value
                ||
                "Flexible"

    };


    /* SCHOOL */

    if(
        type ===
        "School Student"
    ){

        profile.classYear =
            $("registerSchoolClass")
                ?.value
                ||
                "";


        profile.stream =
            $("registerSchoolStream")
                ?.value
                ||
                "";


        profile.institution =
            $("registerSchoolName")
                ?.value
                .trim()
                ||
                "";

    }


    /* COLLEGE */

    if(
        type ===
        "College / University Student"
    ){

        profile.degree =
            $("registerDegree")
                ?.value
                ||
                "";


        profile.classYear =
            $("registerCollegeYear")
                ?.value
                ||
                "";


        profile.branch =
            $("registerBranch")
                ?.value
                .trim()
                ||
                "";


        profile.institution =
            $("registerCollegeName")
                ?.value
                .trim()
                ||
                "";

    }


    /* PROFESSIONAL */

    if(
        type ===
        "Working Professional"
    ){

        profile.profession =
            $("registerProfession")
                ?.value
                .trim()
                ||
                "";


        profile.experience =
            $("registerExperience")
                ?.value
                .trim()
                ||
                "";


        profile.availableTime =
            $("registerStudyTime")
                ?.value
                ||
                "";

    }


    /* SELF LEARNER */

    if(
        type ===
        "Self-Learner"
    ){

        profile.learningGoal =
            $("registerLearningGoal")
                ?.value
                .trim()
                ||
                "";

    }


    /* =================================================
       USER
       ================================================= */

    const user = {

        id:
            `${Date.now()}_${Math.random()
                .toString(36)
                .slice(2,8)}`,

        name,

        email,

        password

    };


    users.push(
        user
    );


    saveUsers(
        users
    );


    saveCurrentUser({

        id:
            user.id,

        name:
            user.name,

        email:
            user.email

    });


    set(
        "profile",
        profile
    );


    openDashboard();

}


/* =====================================================
   LOGIN / REGISTER SWITCH
   ===================================================== */

function setupSwitch(){

    const loginForm =
        $("loginForm");


    const registerForm =
        $("registerForm");


    const switchButton =
        $("switchBtn");


    const switchText =
        $("switchText");


    const title =
        $("authTitle");


    const subtitle =
        $("authSub");


    if(!switchButton)
        return;


    switchButton.addEventListener(
        "click",
        () => {

            clearMessage();


            const registerVisible =
                !registerForm
                    ?.classList
                    .contains(
                        "hidden"
                    );


            if(registerVisible){

                registerForm
                    ?.classList
                    .add(
                        "hidden"
                    );


                loginForm
                    ?.classList
                    .remove(
                        "hidden"
                    );


                title.textContent =
                    "Welcome back";


                subtitle.textContent =
                    "Login to continue.";


                switchText.textContent =
                    "Don't have an account?";


                switchButton.textContent =
                    "Register";

            }
            else{

                loginForm
                    ?.classList
                    .add(
                        "hidden"
                    );


                registerForm
                    ?.classList
                    .remove(
                        "hidden"
                    );


                title.textContent =
                    "Create your account";


                subtitle.textContent =
                    "Tell us about yourself to personalize Synaptiq.";


                switchText.textContent =
                    "Already have an account?";


                switchButton.textContent =
                    "Login";

            }

        }
    );

}


/* =====================================================
   LOGOUT
   ===================================================== */

export function logoutUser(){

    localStorage.removeItem(
        CURRENT_USER_KEY
    );


    $("dashboard")
        ?.classList
        .add(
            "hidden"
        );


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


    clearMessage();

}


/* =====================================================
   FORMS
   ===================================================== */

function setupForms(){

    $("loginForm")
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                clearMessage();

                handleLogin();

            }
        );


    $("registerForm")
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                clearMessage();

                handleRegister();

            }
        );


    $("registerType")
        ?.addEventListener(
            "change",
            updateRegistrationFields
        );

}


/* =====================================================
   LOGOUT BUTTON
   ===================================================== */

function setupLogout(){

    $("logout")
        ?.addEventListener(
            "click",
            logoutUser
        );

}


/* =====================================================
   INIT
   ===================================================== */

export function initAuth(){

    setupForms();

    setupSwitch();

    setupLogout();

    setupDailyGoal();

    updateRegistrationFields();

    updateUserName();

}