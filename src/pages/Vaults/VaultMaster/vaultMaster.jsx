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
    selectVaultLoading,
    selectVaultError,
} from "../../../stores/selectors/Vaults/vaultMasterSelectors";

import styles from "./vaultMaster.module.scss";

const VaultMaster = () => {
    const dispatch = useDispatch();

    const balances = useSelector(selectVaultBalances);
    const loading = useSelector(selectVaultLoading);
    const error = useSelector(selectVaultError);

    // --- Input states ---
    const [mintBurnAmount, setMintBurnAmount] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [fromVault, setFromVault] = useState("");
    const [toVault, setToVault] = useState("");

    // --- Vault lock state ---
    const [vaultLocks, setVaultLocks] = useState({});

    // Load vault balances
    useEffect(() => {
        dispatch(getAllVaultBalances());
    }, [dispatch]);

    // Khởi tạo vaultLocks nếu balances thay đổi
    useEffect(() => {
        if (balances) {
            const initialLocks = {};
            Object.keys(balances).forEach((key) => {
                if (vaultLocks[key] === undefined) initialLocks[key] = false;
                else initialLocks[key] = vaultLocks[key];
            });
            setVaultLocks(initialLocks);
        }
    }, [balances]);

    // --- Handlers ---
    const handleMint = async () => {
        if (vaultLocks["MasterVault"]) return alert("Vault Master đang bị Lock! Không thể Mint.");
        await dispatch(mintMaster({ amount: Number(mintBurnAmount) }));
        dispatch(getAllVaultBalances());
        setMintBurnAmount("");
    };

    const handleBurn = async () => {
        if (vaultLocks["MasterVault"]) return alert("Vault Master đang bị Lock! Không thể Burn.");
        await dispatch(burnMaster({ amount: Number(mintBurnAmount) }));
        dispatch(getAllVaultBalances());
        setMintBurnAmount("");
    };

    const handleTransfer = async () => {
        if (!fromVault) return alert("Vui lòng chọn FROM VAULT!");
        if (!toVault) return alert("Vui lòng chọn TO VAULT!");
        if (fromVault === toVault) return alert("FROM và TO không được trùng nhau!");
        if (!transferAmount || transferAmount <= 0) return alert("Amount phải lớn hơn 0!");
        if (Number(transferAmount) > balances[fromVault]) return alert("Amount vượt quá số dư của Vault nguồn!");
        if (vaultLocks[fromVault]) return alert("Vault nguồn đang bị Lock! Không thể Transfer.");
        if (vaultLocks[toVault]) return alert("Vault đích đang bị Lock! Không thể Transfer.");

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
            if (vaultLocks[vaultKey]) {
                // Hiện đang locked, gọi unlock
                await dispatch(unlockVault(vaultKey));
                setVaultLocks((prev) => ({ ...prev, [vaultKey]: false }));
            } else {
                // Hiện đang unlocked, gọi lock
                await dispatch(lockVault(vaultKey));
                setVaultLocks((prev) => ({ ...prev, [vaultKey]: true }));
            }
            // Cập nhật lại balances nếu cần
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

            {/* --- ACTION CARDS --- */}
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

                {/* Transfer */}
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
                                {key} (Số dư: {value}) {vaultLocks[key] ? "[Locked]" : ""}
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
                                    {key} (Số dư: {value}) {vaultLocks[key] ? "[Locked]" : ""}
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

                {(!balances || Object.keys(balances).length === 0) ? (
                    <p>Không có dữ liệu vault.</p>
                ) : (
                    <div className={styles.vaultGrid}>
                        {Object.entries(balances).map(([key, value]) => (
                            <div key={key} className={styles.vaultCard}>
                                <h3 className={styles.vaultName}>{key}</h3>
                                <p className={styles.vaultBalance}>
                                    Số dư: <span>{value}</span>
                                </p>
                                <p className={styles.vaultType}>Loại: {key}</p>

                                {/* Lock / Unlock button từ server */}
                                <button
                                    onClick={() => handleToggleLock(key)}
                                    className={vaultLocks[key] ? styles.btnRed : styles.btnGreen}
                                >
                                    {vaultLocks[key] ? "Unlock" : "Lock"}
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
