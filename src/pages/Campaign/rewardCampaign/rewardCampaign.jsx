// src/features/rewardCampaigns/RewardCampaign.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchRewardCampaignList } from
    "../../../stores/thunks/Campaign/rewardCampaignThunk";

import {
    selectRewardCampaignList,
    selectRewardCampaignLoading,
    selectRewardCampaignError,
    selectRewardCampaignPagination,
} from "../../../stores/selectors/Campaign/rewardCampaignSelectors";

import CampaignRow from "./CampaignRow";
import CampaignTableHeader from "./campaignTableHeader";
import styles from "./rewardCampaign.module.scss";

const RewardCampaign = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const campaigns = useSelector(selectRewardCampaignList);
    const loading = useSelector(selectRewardCampaignLoading);
    const error = useSelector(selectRewardCampaignError);
    const pagination = useSelector(selectRewardCampaignPagination);

    useEffect(() => {
        dispatch(fetchRewardCampaignList({ page: 1, limit: 10 }));
    }, [dispatch]);

    if (loading) {
        return <div className={styles.wrapper}>🔄 Đang tải campaigns…</div>;
    }

    if (error) {
        return <div className={styles.wrapper}>❌ Lỗi: {error}</div>;
    }

    return (
        <div className={styles.wrapper}>
            {/* ===== Header ===== */}
            <div className={styles.header}>
                <h2>🎯 Reward Campaigns</h2>
                <button
                    className={styles.createBtn}
                    onClick={() => navigate("/campaign/create")}
                >
                    + Tạo campaign
                </button>
            </div>

            {/* ===== Table ===== */}
            {campaigns.length === 0 ? (
                <p>Chưa có campaign nào</p>
            ) : (
                <div className={styles.table}>
                    <CampaignTableHeader />

                    {campaigns.map((c) => (
                        <CampaignRow
                            key={c._id}
                            campaign={c}
                        />
                    ))}
                </div>
            )}

            {/* ===== Pagination ===== */}
            {pagination && (
                <div className={styles.pagination}>
                    Page {pagination.page} / {pagination.totalPages}
                </div>
            )}
        </div>
    );
};

export default RewardCampaign;
