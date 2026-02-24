import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./CampaignDetailPage.module.scss";

import {
    fetchRewardCampaignById,
    activateRewardCampaign,
    pauseRewardCampaign,
    resumeRewardCampaign,
    inactivateRewardCampaign,
    endRewardCampaign,
    allocateRewardCampaignBudget,
} from "../../../stores/thunks/Campaign/rewardCampaignThunk";

const formatDateTime = (d) => {
    if (!d) return "-";
    try {
        return new Date(d).toLocaleString();
    } catch (_) {
        return "-";
    }
};

const Badge = ({ variant = "default", children }) => {
    return (
        <span className={`${styles.badge} ${styles[`badge_${variant}`]}`}>
            {children}
        </span>
    );
};

export default function CampaignDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const campaign = useSelector((state) => state.rewardCampaign?.current);
    const loading = useSelector((state) => state.rewardCampaign?.loading);
    const actionLoading = useSelector((state) => state.rewardCampaign?.actionLoading);

    const [error, setError] = React.useState(null);

    const fetchCampaign = React.useCallback(async () => {
        if (!id) return;

        setError(null);
        try {
            await dispatch(fetchRewardCampaignById(id)).unwrap();
        } catch (err) {
            // thunk rejectWithValue thường là string message
            setError(typeof err === "string" ? err : "Load campaign failed");
        }
    }, [dispatch, id]);

    React.useEffect(() => {
        fetchCampaign();
    }, [fetchCampaign]);

    const runAction = async (actionThunk) => {
        setError(null);
        try {
            await dispatch(actionThunk).unwrap();
            // ✅ không cần fetch lại vì slice đã update current từ fulfilled payload
            // nhưng nếu BE update nhiều field khác và thunk không trả full object => bật lại fetch
            // await fetchCampaign();
        } catch (err) {
            setError(typeof err === "string" ? err : "Action failed");
        }
    };
    const vaultObj =
        campaign?.vault && typeof campaign.vault === "object"
            ? campaign.vault
            : null;

    const isBusy = loading || actionLoading;

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.skeletonHeader} />
                <div className={styles.skeletonGrid}>
                    <div className={styles.skeletonCard} />
                    <div className={styles.skeletonCard} />
                    <div className={styles.skeletonCard} />
                    <div className={styles.skeletonCard} />
                </div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className={styles.page}>
                <div className={styles.topbar}>
                    <button className={styles.btn} onClick={() => navigate("/campaign")}>
                        ← Back
                    </button>
                </div>

                <div className={styles.empty}>
                    <h2>Campaign not found</h2>
                    <p>Không tìm thấy campaign hoặc đã bị xoá.</p>

                    {error && (
                        <div className={styles.alertError} style={{ marginTop: 12 }}>
                            <b>Error:</b> {error}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const reward = campaign?.rules?.reward || {};
    const unlimited = campaign?.totalBudget === null;

    const statusVariant =
        campaign.status === "active"
            ? "success"
            : campaign.status === "paused"
                ? "warning"
                : campaign.status === "ended"
                    ? "danger"
                    : "default";

    return (
        <div className={styles.page}>
            {/* TOPBAR */}
            <div className={styles.topbar}>
                <div className={styles.titleBlock}>
                    <div className={styles.titleRow}>
                        <h1 className={styles.title}>{campaign.name || "Campaign Detail"}</h1>

                        <div className={styles.badges}>
                            <Badge variant="info">{campaign.type}</Badge>
                            <Badge variant={statusVariant}>{campaign.status}</Badge>
                            {campaign.visibility === "public" ? (
                                <Badge variant="success">public</Badge>
                            ) : (
                                <Badge variant="default">{campaign.visibility}</Badge>
                            )}
                        </div>
                    </div>

                    <div className={styles.subTitle}>
                        <span className={styles.muted}>
                            <b>ID:</b> {campaign._id}
                        </span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.btn}
                        onClick={() => navigate("/campaign")}
                        disabled={isBusy}
                    >
                        ← Back
                    </button>

                    <div className={styles.actionsGroup}>
                        <button
                            className={`${styles.btn} ${styles.btnPrimary}`}
                            disabled={isBusy}
                            onClick={() => runAction(activateRewardCampaign(campaign._id))}
                        >
                            Activate
                        </button>

                        <button
                            className={styles.btn}
                            disabled={isBusy}
                            onClick={() => runAction(pauseRewardCampaign(campaign._id))}
                        >
                            Pause
                        </button>

                        <button
                            className={styles.btn}
                            disabled={isBusy}
                            onClick={() => runAction(resumeRewardCampaign(campaign._id))}
                        >
                            Resume
                        </button>

                        <button
                            className={styles.btn}
                            disabled={isBusy}
                            onClick={() => runAction(inactivateRewardCampaign(campaign._id))}
                        >
                            Inactivate
                        </button>

                        <button
                            className={`${styles.btn} ${styles.btnDanger}`}
                            disabled={isBusy}
                            onClick={() => runAction(endRewardCampaign(campaign._id))}
                        >
                            End
                        </button>
                    </div>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className={styles.alertError}>
                    <b>Error:</b> {error}
                </div>
            )}

            {/* CONTENT GRID */}
            <div className={styles.grid}>
                {/* CARD: Info */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3>Campaign Info</h3>
                    </div>

                    <div className={styles.kv}>
                        <div className={styles.k}>
                            <span>Description</span>
                        </div>
                        <div className={styles.v}>
                            {campaign.description || (
                                <span className={styles.muted}>(empty)</span>
                            )}
                        </div>

                        <div className={styles.k}>
                            <span>Start Date</span>
                        </div>
                        <div className={styles.v}>{formatDateTime(campaign.startDate)}</div>

                        <div className={styles.k}>
                            <span>End Date</span>
                        </div>
                        <div className={styles.v}>{formatDateTime(campaign.endDate)}</div>

                        <div className={styles.k}>
                            <span>Timezone</span>
                        </div>
                        <div className={styles.v}>{campaign.timezone || "UTC"}</div>
                    </div>
                </div>

                {/* CARD: Budget */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3>Budget / Metrics</h3>
                    </div>

                    <div className={styles.kv}>
                        <div className={styles.k}>
                            <span>Budget Mode</span>
                        </div>
                        <div className={styles.v}>
                            {unlimited ? (
                                <Badge variant="success">UNLIMITED</Badge>
                            ) : (
                                <Badge variant="warning">LIMITED</Badge>
                            )}
                        </div>

                        <div className={styles.k}>
                            <span>Total Budget</span>
                        </div>
                        <div className={styles.v}>
                            {unlimited ? "Unlimited" : campaign.totalBudget}
                        </div>

                        <div className={styles.k}>
                            <span>Distributed</span>
                        </div>
                        <div className={styles.v}>{campaign.distributed}</div>

                        <div className={styles.k}>
                            <span>Participants</span>
                        </div>
                        <div className={styles.v}>{campaign.participants}</div>

                        <div className={styles.k}>
                            <span>Total Actions</span>
                        </div>
                        <div className={styles.v}>{campaign.totalActions}</div>

                        {!unlimited && (
                            <>
                                <div className={styles.k}>
                                    <span>Budget Allocated</span>
                                </div>
                                <div className={styles.v}>
                                    {campaign.isBudgetAllocated ? (
                                        <Badge variant="success">YES</Badge>
                                    ) : (
                                        <Badge variant="danger">NO</Badge>
                                    )}
                                </div>

                                <div className={styles.k}>
                                    <span>Action</span>
                                </div>
                                <div className={styles.v}>
                                    <button
                                        className={`${styles.btn} ${styles.btnPrimary}`}
                                        disabled={isBusy || campaign.isBudgetAllocated}
                                        onClick={() =>
                                            runAction(allocateRewardCampaignBudget(campaign._id))
                                        }
                                    >
                                        Allocate Budget
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* CARD: Vault */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3>Vault</h3>
                    </div>

                    <div className={styles.kv}>
                        <div className={styles.k}>
                            <span>Vault ID</span>
                        </div>
                        <div className={styles.v}>{campaign.vault?._id || campaign.vault}</div>

                        {vaultObj && (
                            <>
                                <div className={styles.k}>
                                    <span>Balance</span>
                                </div>
                                <div className={styles.v}>{vaultObj.balance}</div>

                                <div className={styles.k}>
                                    <span>Locked</span>
                                </div>
                                <div className={styles.v}>
                                    {vaultObj.locked ? (
                                        <Badge variant="danger">YES</Badge>
                                    ) : (
                                        <Badge variant="success">NO</Badge>
                                    )}
                                </div>
                            </>
                        )}


                    </div>
                </div>

                {/* CARD: Reward */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3>Reward</h3>
                    </div>

                    <div className={styles.kv}>
                        <div className={styles.k}>
                            <span>Type</span>
                        </div>
                        <div className={styles.v}>
                            <Badge variant="info">{reward.type || "-"}</Badge>
                        </div>

                        <div className={styles.k}>
                            <span>Currency</span>
                        </div>
                        <div className={styles.v}>{reward.currency || "coin"}</div>

                        {reward.type === "fixed" && (
                            <>
                                <div className={styles.k}>
                                    <span>Amount</span>
                                </div>
                                <div className={styles.v}>{reward.amount}</div>
                            </>
                        )}

                        {reward.type === "daily" && (
                            <>
                                <div className={styles.k}>
                                    <span>Values</span>
                                </div>
                                <div className={styles.v}>
                                    <code className={styles.inlineCode}>
                                        {JSON.stringify(reward.values || [])}
                                    </code>
                                </div>
                            </>
                        )}

                        {reward.type === "game" && (
                            <>
                                <div className={styles.k}>
                                    <span>Win</span>
                                </div>
                                <div className={styles.v}>{reward.win}</div>

                                <div className={styles.k}>
                                    <span>Lose</span>
                                </div>
                                <div className={styles.v}>{reward.lose}</div>
                            </>
                        )}

                        {reward.type === "invite" && (
                            <>
                                <div className={styles.k}>
                                    <span>Per Invite</span>
                                </div>
                                <div className={styles.v}>{reward.perInvite}</div>

                                <div className={styles.k}>
                                    <span>Max Invite</span>
                                </div>
                                <div className={styles.v}>{reward.maxInvite ?? "∞"}</div>
                            </>
                        )}

                        {reward.type === "mission" && (
                            <>
                                <div className={styles.k}>
                                    <span>Amount</span>
                                </div>
                                <div className={styles.v}>{reward.amount}</div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* RULES RAW */}
            <div className={styles.card} style={{ marginTop: 16 }}>
                <div className={styles.cardHeader}>
                    <h3>Rules JSON (Raw)</h3>
                </div>

                <pre className={styles.jsonBox}>
                    {JSON.stringify(campaign.rules || {}, null, 2)}
                </pre>
            </div>
        </div>
    );
}
