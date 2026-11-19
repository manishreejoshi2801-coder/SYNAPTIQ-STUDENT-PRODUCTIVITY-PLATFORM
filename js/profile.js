import {
    get,
    set,
    $
} from "./storage.js";


const PROFILE_KEY =
    "profile";


const CURRENT_USER_KEY =
    "synaptiqCurrentUser";


const DEFAULT_PROFILE = {

    name:"",
    photo:"",

    type:"",

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

    targetExam:"",

    subjects:[],

    dailyGoal:120,

    preferredTime:"Flexible"

};


/* =========================================================
   PROFILE
   ========================================================= */

export function getProfile(){

    return {

        ...DEFAULT_PROFILE,

        ...get(
            PROFILE_KEY,
            {}
        )

    };

}


export function saveProfile(
    profile
){

    set(
        PROFILE_KEY,
        {
            ...DEFAULT_PROFILE,
            ...profile
        }
    );


    updateUserName();


    window.dispatchEvent(
        new CustomEvent(
            "synaptiqProfileUpdated"
        )
    );

}


/* =========================================================
   CURRENT USER
   ========================================================= */

function currentUser(){

    return get(
        CURRENT_USER_KEY,
        null
    );

}


/* =========================================================
   USER NAME
   ========================================================= */

function updateUserName(){

    const user =
        currentUser();


    const profile =
        getProfile();


    const name =
        user?.name ||
        profile.name ||
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


/* =========================================================
   CREATE MODAL
   ========================================================= */

function createProfileModal(){

    if(
        $("profileSetupModal")
    ){

        return;

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "profileSetupModal";


    modal.className =
        "modal hidden";


    modal.innerHTML = `

        <div
            class="modal-box
                   profile-modal-box"
        >

            <button
                class="close"
                id="profileClose"
                type="button"
            >
                ×
            </button>


            <div
                class="profile-modal-head"
            >

                <small>
                    PERSONALIZATION
                </small>

                <h2>
                    Tell us about yourself
                </h2>

                <p>
                    This helps Synaptiq personalize
                    exams, resources and study plans.
                </p>

            </div>


            <form
                id="profileForm"
            >


                <div
                    class="profile-photo-area"
                >

                    <div
                        id="profilePreview"
                        class="profile-preview"
                    >
                        👤
                    </div>


                    <label
                        class="profile-upload"
                    >

                        📷 Change Photo

                        <input
                            id="profilePhoto"
                            type="file"
                            accept="image/*"
                            hidden
                        >

                    </label>

                </div>


                <label>Name</label>

                <input
                    id="profileName"
                    required
                >


                <label>I am a</label>

                <select
                    id="profileType"
                    required
                >

                    <option value="">
                        Select
                    </option>

                    <option>
                        School Student
                    </option>

                    <option>
                        College / University Student
                    </option>

                    <option>
                        Working Professional
                    </option>

                    <option>
                        Self-Learner
                    </option>

                </select>


                <label>
                    Age
                    <span class="optional">
                        Optional
                    </span>
                </label>

                <input
                    id="profileAge"
                    type="number"
                    min="5"
                    max="100"
                >


                <label>
                    Gender
                    <span class="optional">
                        Optional
                    </span>
                </label>

                <select
                    id="profileGender"
                >

                    <option>
                        Prefer not to say
                    </option>

                    <option>
                        Female
                    </option>

                    <option>
                        Male
                    </option>

                    <option>
                        Other
                    </option>

                </select>


                <div
                    id="schoolFields"
                    class="profile-context hidden"
                >

                    <h3>
                        School Details
                    </h3>


                    <label>Class</label>

                    <select id="schoolClass">

                        <option value="">
                            Select class
                        </option>

                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>

                    </select>


                    <label>Stream</label>

                    <select id="schoolStream">

                        <option value="">
                            Select stream
                        </option>

                        <option>
                            Science
                        </option>

                        <option>
                            Commerce
                        </option>

                        <option>
                            Humanities
                        </option>

                    </select>


                    <label>School</label>

                    <input
                        id="schoolName"
                    >

                </div>


                <div
                    id="collegeFields"
                    class="profile-context hidden"
                >

                    <h3>
                        College Details
                    </h3>


                    <label>Degree</label>

                    <select id="collegeDegree">

                        <option value="">
                            Select degree
                        </option>

                        <option>B.Tech</option>
                        <option>BCA</option>
                        <option>B.Sc</option>
                        <option>BBA</option>
                        <option>B.Com</option>
                        <option>BA</option>
                        <option>MBA</option>
                        <option>M.Tech</option>
                        <option>M.Sc</option>
                        <option>Other</option>

                    </select>


                    <label>Year</label>

                    <select id="collegeYear">

                        <option value="">
                            Select year
                        </option>

                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                        <option>Postgraduate</option>

                    </select>


                    <label>
                        Branch / Specialization
                    </label>

                    <input
                        id="collegeBranch"
                    >


                    <label>
                        College / University
                    </label>

                    <input
                        id="collegeName"
                    >

                </div>


                <div
                    id="professionalFields"
                    class="profile-context hidden"
                >

                    <h3>
                        Professional Details
                    </h3>


                    <label>
                        Field
                    </label>

                    <input
                        id="professionalField"
                        placeholder="IT, Finance, Government..."
                    >


                    <label>
                        Experience
                    </label>

                    <input
                        id="professionalExperience"
                    >


                    <label>
                        Available Study Time
                    </label>

                    <select
                        id="professionalTime"
                    >

                        <option>
                            1 hour/day
                        </option>

                        <option selected>
                            2 hours/day
                        </option>

                        <option>
                            3 hours/day
                        </option>

                        <option>
                            4+ hours/day
                        </option>

                    </select>

                </div>


                <div
                    id="learnerFields"
                    class="profile-context hidden"
                >

                    <h3>
                        Learning Goal
                    </h3>


                    <label>
                        What are you preparing for?
                    </label>

                    <input
                        id="learnerGoal"
                    >

                </div>


                <label>
                    Target Exam
                </label>

                <input
                    id="profileExam"
                    placeholder="GATE, UPSC, JEE, CAT..."
                >


                <label>
                    Subjects
                </label>

                <input
                    id="profileSubjects"
                    placeholder="DBMS, OS, CN, Maths..."
                >


                <label>
                    Daily Study Goal
                </label>

                <input
                    id="profileGoal"
                    type="number"
                    min="15"
                    value="120"
                >


                <label>
                    Preferred Study Time
                </label>

                <select
                    id="profilePreferredTime"
                >

                    <option>
                        Flexible
                    </option>

                    <option>
                        Morning
                    </option>

                    <option>
                        Afternoon
                    </option>

                    <option>
                        Evening
                    </option>

                    <option>
                        Night
                    </option>

                </select>


                <button
                    class="primary full"
                    type="submit"
                >
                    Save My Study Profile
                </button>

            </form>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    setupProfileEvents();

}


/* =========================================================
   PROFILE EVENTS
   ========================================================= */

function setupProfileEvents(){

    $("profileType")
        ?.addEventListener(
            "change",
            updateFields
        );


    $("profilePhoto")
        ?.addEventListener(
            "change",
            previewPhoto
        );


    $("profileClose")
        ?.addEventListener(
            "click",
            closeProfileModal
        );


    $("profileForm")
        ?.addEventListener(
            "submit",
            saveProfileForm
        );


    updateFields();

}


/* =========================================================
   FIELDS
   ========================================================= */

function updateFields(){

    const type =
        $("profileType")
            ?.value;


    [
        $("schoolFields"),
        $("collegeFields"),
        $("professionalFields"),
        $("learnerFields")
    ]
    .forEach(
        field =>
            field?.classList
                .add("hidden")
    );


    if(
        type ===
        "School Student"
    ){

        $("schoolFields")
            ?.classList
            .remove("hidden");

    }


    if(
        type ===
        "College / University Student"
    ){

        $("collegeFields")
            ?.classList
            .remove("hidden");

    }


    if(
        type ===
        "Working Professional"
    ){

        $("professionalFields")
            ?.classList
            .remove("hidden");

    }


    if(
        type ===
        "Self-Learner"
    ){

        $("learnerFields")
            ?.classList
            .remove("hidden");

    }

}


/* =========================================================
   PHOTO
   ========================================================= */

function previewPhoto(
    event
){

    const file =
        event.target.files?.[0];


    if(!file)
        return;


    const reader =
        new FileReader();


    reader.onload =
        () => {

            $("profilePreview")
                .innerHTML = `

                    <img
                        src="${reader.result}"
                        alt="Profile"
                    >

                `;

        };


    reader.readAsDataURL(
        file
    );

}


/* =========================================================
   SAVE PROFILE
   ========================================================= */

function saveProfileForm(
    event
){

    event.preventDefault();


    const old =
        getProfile();


    const profile = {

        ...old,

        name:
            $("profileName")
                .value
                .trim(),

        type:
            $("profileType")
                .value,

        age:
            $("profileAge")
                .value,

        gender:
            $("profileGender")
                .value,

        targetExam:
            $("profileExam")
                .value
                .trim(),

        subjects:
            $("profileSubjects")
                .value
                .split(",")
                .map(
                    item =>
                        item.trim()
                )
                .filter(Boolean),

        dailyGoal:
            Number(
                $("profileGoal")
                    .value
            ) || 120,

        preferredTime:
            $("profilePreferredTime")
                .value

    };


    if(
        profile.type ===
        "School Student"
    ){

        profile.classYear =
            $("schoolClass")
                .value;

        profile.stream =
            $("schoolStream")
                .value;

        profile.institution =
            $("schoolName")
                .value
                .trim();

    }


    if(
        profile.type ===
        "College / University Student"
    ){

        profile.degree =
            $("collegeDegree")
                .value;

        profile.classYear =
            $("collegeYear")
                .value;

        profile.branch =
            $("collegeBranch")
                .value
                .trim();

        profile.institution =
            $("collegeName")
                .value
                .trim();

    }


    if(
        profile.type ===
        "Working Professional"
    ){

        profile.profession =
            $("professionalField")
                .value
                .trim();

        profile.experience =
            $("professionalExperience")
                .value
                .trim();

        profile.availableTime =
            $("professionalTime")
                .value;

    }


    if(
        profile.type ===
        "Self-Learner"
    ){

        profile.learningGoal =
            $("learnerGoal")
                .value
                .trim();

    }


    const image =
        $("profilePreview")
            ?.querySelector(
                "img"
            );


    if(image){

        profile.photo =
            image.src;

    }


    saveProfile(
        profile
    );


    closeProfileModal();

}


/* =========================================================
   FILL
   ========================================================= */

function fillProfile(
    profile
){

    const values = {

        profileName:
            profile.name,

        profileType:
            profile.type,

        profileAge:
            profile.age,

        profileGender:
            profile.gender,

        profileExam:
            profile.targetExam,

        profileGoal:
            profile.dailyGoal,

        profilePreferredTime:
            profile.preferredTime,

        schoolClass:
            profile.classYear,

        schoolStream:
            profile.stream,

        schoolName:
            profile.institution,

        collegeDegree:
            profile.degree,

        collegeYear:
            profile.classYear,

        collegeBranch:
            profile.branch,

        collegeName:
            profile.institution,

        professionalField:
            profile.profession,

        professionalExperience:
            profile.experience,

        professionalTime:
            profile.availableTime,

        learnerGoal:
            profile.learningGoal

    };


    Object.entries(
        values
    )
    .forEach(
        ([id,value]) => {

            const field =
                $(id);


            if(
                field &&
                value !== null &&
                value !== undefined
            ){

                field.value =
                    value;

            }

        }
    );


    const subjects =
        $("profileSubjects");


    if(subjects){

        subjects.value =
            Array.isArray(
                profile.subjects
            )
                ? profile.subjects.join(
                    ", "
                )
                : "";

    }


    if(
        profile.photo
    ){

        $("profilePreview")
            .innerHTML = `

                <img
                    src="${profile.photo}"
                    alt="Profile"
                >

            `;

    }


    updateFields();

}


/* =========================================================
   OPEN PROFILE
   ========================================================= */

export function openProfileModal(){

    createProfileModal();


    fillProfile(
        getProfile()
    );


    $("profileSetupModal")
        ?.classList
        .remove(
            "hidden"
        );

}


/* =========================================================
   CLOSE PROFILE
   ========================================================= */

export function closeProfileModal(){

    $("profileSetupModal")
        ?.classList
        .add(
            "hidden"
        );

}


/* =========================================================
   SIDEBAR BUTTON
   ========================================================= */

function addProfileButton(){

    if(
        document.querySelector(
            "[data-profile-button]"
        )
    ){

        return;

    }


    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if(!sidebar)
        return;


    const button =
        document.createElement(
            "button"
        );


    button.className =
        "menu";


    button.dataset.profileButton =
        "true";


    button.type =
        "button";


    button.textContent =
        "👤 My Profile";


    button.addEventListener(
        "click",
        openProfileModal
    );


    const logout =
        $("logout");


    if(logout){

        logout.before(
            button
        );

    }
    else{

        sidebar.appendChild(
            button
        );

    }

}


/* =========================================================
   INIT
   ========================================================= */

export function initProfile(){

    createProfileModal();

    addProfileButton();

    updateUserName();


    /*
       Login changes the dashboard dynamically.
    */

    window.addEventListener(
        "synaptiqLogin",
        () => {

            setTimeout(
                () => {

                    addProfileButton();

                    updateUserName();

                },
                100
            );

        }
    );


    window.addEventListener(
        "synaptiqProfileUpdated",
        () => {

            updateUserName();

        }
    );


    /*
       The sidebar is created in the dashboard,
       so retry briefly after login.
    */

    let tries = 0;


    const interval =
        setInterval(
            () => {

                addProfileButton();

                updateUserName();


                tries++;


                if(
                    tries >= 20
                ){

                    clearInterval(
                        interval
                    );

                }

            },
            500
        );

}


/* =========================================================
   START
   ========================================================= */

initProfile();