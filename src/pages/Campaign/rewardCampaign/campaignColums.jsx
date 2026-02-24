// src/features/rewardCampaigns/campaignColumns.js
export const CAMPAIGN_COLUMNS = [
    {
        key: "name",
        label: "Name",
        render: (c) => c.name,
    },
    {
        key: "type",
        label: "Type",
        hideOnMobile: true,
        render: (c) => c.type,
    },
    {
        key: "status",
        label: "Status",
        render: (c) => c.status,
    },
    {
        key: "time",
        label: "Time",
        hideOnMobile: true,
        render: (c) =>
            `${formatDate(c.startDate)} – ${formatDate(c.endDate)}`,
    },
    {
        key: "vault",
        label: "Vault",
        render: (c) => c.vault?.name || "-",
    },
    {
        key: "budget",
        label: "Budget",
        hideOnMobile: true,
        render: (c) =>
            c.totalBudget === null ? "∞" : c.totalBudget.toLocaleString(),
    },
    {
        key: "distributed",
        label: "Distributed",
        render: (c) => c.distributed.toLocaleString(),
    },
    {
        key: "remaining",
        label: "Remaining",
        hideOnMobile: true,
        render: (c) =>
            c.totalBudget === null
                ? "∞"
                : (c.totalBudget - c.distributed).toLocaleString(),
    },
    {
        key: "participants",
        label: "Participants",
        hideOnMobile: true,
        render: (c) => c.participants,
    },
    {
        key: "actions",
        label: "Actions",
        render: () => null, // xử lý riêng
    },
];

/* helper */
const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "∞";
