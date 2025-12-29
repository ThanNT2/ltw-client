// src/features/vaults/VaultAirdrop.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchVaultAirdropDetails } from
    "../../../stores/thunks/Vaults/vaultAirdropThunks";

import { clearVaultAirdropError } from
    "../../../stores/slices/Vaults/vaultAirdropSlice";

import {
    selectVaultAirdropDetails,
    selectVaultAirdropLoading,
    selectVaultAirdropActionLoading,
    selectVaultAirdropError,
} from "../../../stores/selectors/Vaults/vaultAirdropSelectors";

import styles from "./vaultAirdrop.module.scss";

const VaultAirdrop = () => {
    const dispatch = useDispatch();

    /* -----------------------------
     * Select state
     * ---------------------------- */
    const details = useSelector(selectVaultAirdropDetails);
    const loading = useSelector(selectVaultAirdropLoading);
    const actionLoading = useSelector(selectVaultAirdropActionLoading);
    const error = useSelector(selectVaultAirdropError);

    /* -----------------------------
     * Fetch on mount
     * ---------------------------- */
    useEffect(() => {
        dispatch(fetchVaultAirdropDetails());

        return () => {
            dispatch(clearVaultAirdropError());
        };
    }, [dispatch]);

    /* -----------------------------
     * Render states
     * ---------------------------- */
    if (loading) {
        return <div className={styles.wrapper}>🔄 Đang tải Vault Airdrop…</div>;
    }

    if (error) {
        return (
            <div className={styles.wrapper} style={{ color: "red" }}>
                ❌ Lỗi: {error}
            </div>
        );
    }

    if (!details) {
        return (
            <div className={styles.wrapper}>
                ⚠️ Không có dữ liệu Vault Airdrop
            </div>
        );
    }

    const {
        id,
        name,
        description,
        type,
        status,
        balance,
        locked,
        fromVault,
        campaigns = [],
        totalAllocated,
        totalDistributed,
        createdAt,
        updatedAt,
    } = details;

    return (
        <div className={styles.wrapper}>
            {/* ===== Header ===== */}
            <div className={styles.header}>
                <h2>{name}</h2>
                <span className={`${styles.status} ${styles[status]}`}>
                    {status}
                </span>
            </div>

            {/* ===== Vault Info ===== */}
            <div className={styles.card}>
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <label>Vault ID</label>
                        <span>{id}</span>
                    </div>

                    <div className={styles.infoItem}>
                        <label>Type</label>
                        <span>{type}</span>
                    </div>

                    <div className={styles.infoItem}>
                        <label>Balance</label>
                        <span className={styles.balance}>{balance}</span>
                    </div>

                    <div className={styles.infoItem}>
                        <label>Locked</label>
                        <span>{locked ? "Yes" : "No"}</span>
                    </div>

                    <div className={styles.infoItem}>
                        <label>Total Allocated</label>
                        <span>{totalAllocated}</span>
                    </div>

                    <div className={styles.infoItem}>
                        <label>Total Distributed</label>
                        <span>{totalDistributed}</span>
                    </div>

                    <div className={styles.infoItem}>
                        <label>From Vault</label>
                        <span>
                            {fromVault?.name} ({fromVault?.balance})
                        </span>
                    </div>

                    <div className={styles.infoItem}>
                        <label>Description</label>
                        <span>{description || "-"}</span>
                    </div>
                </div>
            </div>

            {/* ===== Campaigns ===== */}
            <div className={styles.card}>
                <h3>📦 Campaigns ({campaigns.length})</h3>

                {campaigns.length === 0 ? (
                    <p>Chưa có campaign nào</p>
                ) : (
                    <div className={styles.campaignList}>
                        {campaigns.map((c) => (
                            <div key={c._id} className={styles.campaignItem}>
                                <h4>{c.name}</h4>
                                <p>Type: {c.type}</p>
                                <p>Distributed: {c.distributed}</p>
                                <span className={styles.campaignStatus}>
                                    {c.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ===== Meta ===== */}
            <div className={styles.meta}>
                Created: {new Date(createdAt).toLocaleString()} <br />
                Updated: {new Date(updatedAt).toLocaleString()}
            </div>

            {/* ===== Action loading ===== */}
            {actionLoading && (
                <div className={styles.meta}>
                    ⏳ Đang xử lý hành động…
                </div>
            )}
        </div>
    );
};

export default VaultAirdrop;
