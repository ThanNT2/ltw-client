import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getAllVaultBalances,
    mintMaster,
    burnMaster,
    transferBetweenVaults,
    lockVault,
    unlockVault,
} from "../../../stores/thunks/Vaults/vaultMasterThunks";

import {
    selectVaultBalances,
    selectVaultLocks,
    selectVaultLoading,
    selectVaultError,
} from "../../../stores/selectors/Vaults/vaultMasterSelectors";

import styles from "./vaultMaster.module.scss";

const VaultMaster = () => {
    const dispatch = useDispatch();

    const balances = useSelector(selectVaultBalances);
    const locks = useSelector(selectVaultLocks);
    const loading = useSelector(selectVaultLoading);
    const error = useSelector(selectVaultError);

    const [mintBurnAmount, setMintBurnAmount] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [fromVault, setFromVault] = useState("");
    const [toVault, setToVault] = useState("");

    // Load data on mount
    useEffect(() => {
        dispatch(getAllVaultBalances());
    }, [dispatch]);

    // ========= HANDLERS =========

    const handleMint = async () => {
        if (locks?.master) return alert("MasterVault đang bị LOCK! Không thể Mint.");
        await dispatch(mintMaster({ amount: Number(mintBurnAmount) }));
        dispatch(getAllVaultBalances());
        setMintBurnAmount("");
    };

    const handleBurn = async () => {
        if (locks?.master) return alert("MasterVault đang bị LOCK! Không thể Burn.");
        await dispatch(burnMaster({ amount: Number(mintBurnAmount) }));
        dispatch(getAllVaultBalances());
        setMintBurnAmount("");
    };

    const handleTransfer = async () => {
        if (!fromVault) return alert("Vui lòng chọn FROM VAULT!");
        if (!toVault) return alert("Vui lòng chọn TO VAULT!");
        if (fromVault === toVault) return alert("FROM và TO không được trùng nhau!");
        if (!transferAmount || transferAmount <= 0) return alert("Amount phải lớn hơn 0!");

        if (Number(transferAmount) > balances[fromVault])
            return alert("Amount vượt quá số dư của Vault nguồn!");

        if (locks?.[fromVault]) return alert("Vault nguồn đang bị LOCK!");
        if (locks?.[toVault]) return alert("Vault đích đang bị LOCK!");

        await dispatch(
            transferBetweenVaults({
                amount: Number(transferAmount),
                fromVaultType: fromVault,
                toVaultType: toVault,
            })
        );

        dispatch(getAllVaultBalances());
        setTransferAmount("");
        setFromVault("");
        setToVault("");
    };

    const handleToggleLock = async (vaultKey) => {
        try {
            if (locks?.[vaultKey]) await dispatch(unlockVault(vaultKey));
            else await dispatch(lockVault(vaultKey));

            dispatch(getAllVaultBalances());
        } catch (err) {
            console.error("Lock/Unlock error:", err);
            alert("Có lỗi khi thay đổi trạng thái Vault.");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Vault Master Dashboard</h1>

            {loading && <p className={styles.loading}>Đang tải dữ liệu...</p>}
            {error && <p className={styles.errorText}>{error?.message || error}</p>}

            {/* --- ACTION SECTION --- */}
            <div className={styles.actionGrid}>
                {/* Mint & Burn */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Mint / Burn Coin</h2>

                    <input
                        type="number"
                        placeholder="Amount..."
                        value={mintBurnAmount}
                        onChange={(e) => setMintBurnAmount(e.target.value)}
                        className={styles.input}
                    />

                    <div className={styles.btnGroup}>
                        <button onClick={handleMint} className={styles.btnGreen}>
                            Mint
                        </button>
                        <button onClick={handleBurn} className={styles.btnRed}>
                            Burn
                        </button>
                    </div>
                </div>

                {/* Transfer Vault */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Transfer Vault</h2>

                    <select
                        value={fromVault}
                        onChange={(e) => setFromVault(e.target.value)}
                        className={styles.input}
                    >
                        <option value="">-- Chọn Vault nguồn --</option>
                        {Object.entries(balances).map(([key, value]) => (
                            <option key={key} value={key}>
                                {key} (Số dư: {value}) {locks?.[key] ? "[Locked]" : ""}
                            </option>
                        ))}
                    </select>

                    <select
                        value={toVault}
                        onChange={(e) => setToVault(e.target.value)}
                        className={styles.input}
                    >
                        <option value="">-- Chọn Vault đích --</option>
                        {Object.entries(balances)
                            .filter(([key]) => key !== fromVault)
                            .map(([key, value]) => (
                                <option key={key} value={key}>
                                    {key} (Số dư: {value}) {locks?.[key] ? "[Locked]" : ""}
                                </option>
                            ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Amount..."
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className={styles.input}
                    />

                    <button onClick={handleTransfer} className={styles.btnBlue}>
                        Transfer
                    </button>
                </div>
            </div>

            {/* --- VAULT LIST --- */}
            <div className={styles.vaultSection}>
                <h2 className={styles.sectionTitle}>Danh sách Vault</h2>

                {!balances ? (
                    <p>Không có dữ liệu vault.</p>
                ) : (
                    <div className={styles.vaultGrid}>
                        {Object.entries(balances).map(([key, value]) => (
                            <div key={key} className={styles.vaultCard}>
                                <h3 className={styles.vaultName}>{key}</h3>

                                <p className={styles.vaultBalance}>
                                    Số dư: <span>{value}</span>
                                </p>

                                <button
                                    onClick={() => handleToggleLock(key)}
                                    className={locks?.[key] ? styles.btnRed : styles.btnGreen}
                                >
                                    {locks?.[key] ? "Unlock" : "Lock"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VaultMaster;
