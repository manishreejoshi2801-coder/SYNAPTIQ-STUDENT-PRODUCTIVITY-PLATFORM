import {
    get,
    $
} from "./storage.js";

export function renderRewards() {

    const xp =
        +(localStorage.xp || 0);

    const st =
        +(localStorage.streak || 0);

    const q =
        get("questions", []);

    const b = [

        [
            "🎯",
            "First Focus",
            "Complete a focus session.",
            +(localStorage.sprints || 0) > 0
        ],

        [
            "🔥",
            "Streak Builder",
            "Study for 3 days.",
            st >= 3
        ],

        [
            "📚",
            "Scholar",
            "Save 10 questions.",
            q.length >= 10
        ],

        [
            "🏆",
            "XP Hunter",
            "Earn 100 XP.",
            xp >= 100
        ]
    ];

    $("rewardXP")
        .textContent =
        xp;

    $("rewardStreak")
        .textContent =
        st;

    $("rewardBadges")
        .textContent =
        b.filter(
            x => x[3]
        ).length;

    $("rewardCards")
        .innerHTML =
        b.map(
            x =>
                `
                <div
                    class="
                    reward
                    ${x[3] ? "" : "locked"}">

                    <div class="reward-icon">
                        ${
                            x[3]
                                ? x[0]
                                : "🔒"
                        }
                    </div>

                    <h3>
                        ${x[1]}
                    </h3>

                    <p>
                        ${x[2]}
                    </p>

                </div>
                `
        ).join("");
}