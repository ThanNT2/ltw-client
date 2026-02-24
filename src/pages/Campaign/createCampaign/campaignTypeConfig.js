// src/features/rewardCampaigns/campaignTypeConfig.js

export const CAMPAIGN_TYPE_CONFIG = {
    register: {
        label: "Register",
        buildRules: (form) => ({
            type: "fixed",
            amount: String(form.rewardAmount),
        }),
        fields: [
            {
                name: "rewardAmount",
                label: "Reward Amount",
                type: "number",
                required: true,
            },
        ],
    },

    event: {
        label: "Event",
        buildRules: (form) => ({
            type: "fixed",
            amount: String(form.rewardAmount),
        }),
        fields: [
            {
                name: "rewardAmount",
                label: "Reward Amount",
                type: "number",
                required: true,
            },
        ],
    },

    daily_checkin: {
        label: "Daily Check-in",
        buildRules: (form) => ({
            type: "daily",
            values: Array.isArray(form.dailyRewards)
                ? form.dailyRewards.map((v) => String(v))
                : [],
        }),
        fields: [
            {
                name: "dailyRewards",
                label: "Daily Rewards (comma separated)",
                type: "array:number",
                required: true,
            },
        ],
    },

    game: {
        label: "Game",
        buildRules: (form) => ({
            type: "game",
            win: String(form.winReward),
            lose: String(form.losePenalty),
        }),
        fields: [
            {
                name: "winReward",
                label: "Win Reward",
                type: "number",
                required: true,
            },
            {
                name: "losePenalty",
                label: "Lose Penalty",
                type: "number",
                required: true,
            },
        ],
    },

    invite: {
        label: "Invite",
        buildRules: (form) => ({
            type: "invite",
            perInvite: String(form.inviteReward),
            maxInvite:
                form.maxInvite !== undefined &&
                    form.maxInvite !== null &&
                    form.maxInvite !== ""
                    ? Number(form.maxInvite)
                    : null,
        }),
        fields: [
            {
                name: "inviteReward",
                label: "Invite Reward",
                type: "number",
                required: true,
            },
            {
                name: "maxInvite",
                label: "Max Invite",
                type: "number",
            },
        ],
    },

    mission: {
        label: "Mission",
        buildRules: (form) => ({
            type: "mission",
            amount: String(form.missionReward),
        }),
        fields: [
            {
                name: "missionReward",
                label: "Mission Reward",
                type: "number",
                required: true,
            },
        ],
    },
};
