/* =========================================================
   SYNAPTIQ VISUALS
   Slow, subtle and eye-friendly space background
   ========================================================= */

const canvases = new Map();

let animationFrame = null;

let lastFrame = 0;

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;


/* =========================================================
   THEME COLORS
   ========================================================= */

function getTheme(){

    const dark =
        document.body.classList.contains("dark");

    return dark
        ? {
            glow1:"rgba(79,124,255,.08)",
            glow2:"rgba(32,184,197,.05)",
            star:"rgba(160,205,255,.65)"
        }
        : {
            glow1:"rgba(79,124,255,.055)",
            glow2:"rgba(32,184,197,.035)",
            star:"rgba(70,110,170,.35)"
        };

}


/* =========================================================
   CREATE CANVAS
   ========================================================= */

function getCanvas(
    id,
    fixed = false
){

    let canvas =
        document.getElementById(id);


    if(!canvas){

        canvas =
            document.createElement("canvas");

        canvas.id = id;


        if(
            id ===
            "dashboardSpaceCanvas"
        ){

            const dashboard =
                document.getElementById(
                    "dashboard"
                );

            dashboard?.prepend(canvas);

        }
        else{

            document
                .querySelector(".hero")
                ?.prepend(canvas);

        }

    }


    canvas.style.pointerEvents =
        "none";

    canvas.style.userSelect =
        "none";


    canvas.style.position =
        fixed
            ? "fixed"
            : "absolute";


    canvas.style.inset = "0";

    canvas.style.width = "100%";

    canvas.style.height = "100%";

    canvas.style.zIndex =
        fixed ? "0" : "0";


    return canvas;

}


/* =========================================================
   CREATE STARS
   ========================================================= */

function createStars(
    visual
){

    const count =
        Math.min(
            120,
            Math.max(
                45,
                Math.floor(
                    visual.width *
                    visual.height /
                    12000
                )
            )
        );


    visual.stars = [];


    for(
        let i = 0;
        i < count;
        i++
    ){

        visual.stars.push({

            x:
                Math.random() *
                visual.width,

            y:
                Math.random() *
                visual.height,

            r:
                .25 +
                Math.random() *
                1.15,

            alpha:
                .15 +
                Math.random() *
                .45,

            speed:
                .01 +
                Math.random() *
                .025

        });

    }

}


/* =========================================================
   RESIZE
   ========================================================= */

function resizeCanvas(
    visual
){

    const rect =
        visual.canvas.getBoundingClientRect();


    const ratio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    visual.canvas.width =
        Math.max(
            1,
            Math.round(
                rect.width *
                ratio
            )
        );


    visual.canvas.height =
        Math.max(
            1,
            Math.round(
                rect.height *
                ratio
            )
        );


    visual.ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );


    visual.width =
        rect.width;


    visual.height =
        rect.height;


    createStars(
        visual
    );

}


/* =========================================================
   DRAW
   ========================================================= */

function draw(
    visual
){

    const {
        ctx,
        width,
        height,
        stars
    } = visual;


    const theme =
        getTheme();


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* Very soft fixed glows */

    const glow1 =
        ctx.createRadialGradient(
            width * .78,
            height * .18,
            0,
            width * .78,
            height * .18,
            Math.max(
                width,
                height
            ) * .55
        );


    glow1.addColorStop(
        0,
        theme.glow1
    );


    glow1.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        glow1;


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    const glow2 =
        ctx.createRadialGradient(
            width * .20,
            height * .80,
            0,
            width * .20,
            height * .80,
            Math.max(
                width,
                height
            ) * .45
        );


    glow2.addColorStop(
        0,
        theme.glow2
    );


    glow2.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        glow2;


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* Slow stars */

    stars.forEach(
        star => {

            star.y +=
                star.speed;


            if(
                star.y >
                height
            ){

                star.y = 0;

            }


            ctx.beginPath();


            ctx.arc(
                star.x,
                star.y,
                star.r,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                theme.star;


            ctx.fill();

        }
    );

}


/* =========================================================
   POINTER PARALLAX
   ========================================================= */

function setupPointer(){

    window.addEventListener(
        "pointermove",
        event => {

            targetX =
                (
                    event.clientX /
                    window.innerWidth -
                    .5
                ) * 8;


            targetY =
                (
                    event.clientY /
                    window.innerHeight -
                    .5
                ) * 6;

        },
        {
            passive:true
        }
    );

}


function updateParallax(){

    mouseX +=
        (
            targetX -
            mouseX
        ) * .02;


    mouseY +=
        (
            targetY -
            mouseY
        ) * .02;


    document
        .querySelectorAll(
            ".space-card"
        )
        .forEach(
            (element,index) => {

                const amount =
                    (index + 1) * .12;


                element.style.transform =
                    `translate3d(
                        ${mouseX * amount}px,
                        ${mouseY * amount}px,
                        0
                    )`;

            }
        );

}


/* =========================================================
   ANIMATION
   ========================================================= */

function animate(
time
){

    /*
       24 FPS is enough for this background.
       This prevents unnecessary rapid movement.
    */

    if(
        time -
        lastFrame
        >=
        1000 / 24
    ){

        canvases.forEach(
            visual =>
                draw(visual)
        );


        lastFrame =
            time;

    }


    updateParallax();


    animationFrame =
        requestAnimationFrame(
            animate
        );

}


/* =========================================================
   INIT
   ========================================================= */

export function initVisuals(){

    if(
        document.body.dataset.visualsReady ===
        "true"
    ){

        return;

    }


    document.body.dataset.visualsReady =
        "true";


    const home =
        getCanvas(
            "spaceCanvas",
            false
        );


    const dashboard =
        getCanvas(
            "dashboardSpaceCanvas",
            true
        );


    [home,dashboard]
        .forEach(
            canvas => {

                if(!canvas)
                    return;


                const ctx =
                    canvas.getContext(
                        "2d"
                    );


                if(!ctx)
                    return;


                const visual = {

                    canvas,

                    ctx,

                    width:0,

                    height:0,

                    stars:[]

                };


                canvases.set(
                    canvas.id,
                    visual
                );


                resizeCanvas(
                    visual
                );

            }
        );


    setupPointer();


    window.addEventListener(
        "resize",
        () => {

            canvases.forEach(
                resizeCanvas
            );

        }
    );


    animationFrame =
        requestAnimationFrame(
            animate
        );

}


/* =========================================================
   STOP
   ========================================================= */

export function stopVisuals(){

    if(
        animationFrame
    ){

        cancelAnimationFrame(
            animationFrame
        );

    }


    animationFrame =
        null;

}