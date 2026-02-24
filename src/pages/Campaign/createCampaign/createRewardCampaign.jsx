import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createRewardCampaign } from
    "../../../stores/thunks/Campaign/rewardCampaignThunk";

import { CAMPAIGN_TYPE_CONFIG } from "./campaignTypeConfig";
import DynamicField from "./components/DynamicField";
import styles from "./createRewardCampaign.module.scss";

const CreateRewardCampaign = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        type: "daily_checkin",
        visibility: "public",

        // ✅ NEW: budget + ui
        totalBudget: "",        // input string (so you can type)
        banner: "",             // string url/path
        themeColor: "",         // string like #ff0000

        startDate: "",
        endDate: null,
    });

    const [errors, setErrors] = useState({});

    const typeConfig = CAMPAIGN_TYPE_CONFIG[form.type];

    /* ------------------ VALIDATION ------------------ */
    const validate = () => {
        const e = {};

        if (!form.name.trim()) e.name = "Name is required";
        if (!form.startDate) e.startDate = "Start date is required";

        // ✅ validate totalBudget (optional, but if has value -> must be >= 0)
        if (form.totalBudget !== "" && form.totalBudget !== null && form.totalBudget !== undefined) {
            const n = Number(form.totalBudget);
            if (!Number.isFinite(n) || n < 0) {
                e.totalBudget = "Total budget must be a number >= 0";
            }
        }

        typeConfig.fields.forEach((f) => {
            if (f.required && !form[f.name]) {
                e[f.name] = `${f.label} is required`;
            }
        });

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ------------------ SUBMIT ------------------ */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const normalizedBanner = form.banner?.trim() ? form.banner.trim() : null;
        const normalizedThemeColor = form.themeColor?.trim()
            ? form.themeColor.trim()
            : null;

        // ✅ totalBudget:
        // - empty => null
        // - number => Number(...)
        // - allow "0" => 0 (you can treat it as unlimited server-side if you want)
        const normalizedTotalBudget =
            form.totalBudget === "" || form.totalBudget === null || form.totalBudget === undefined
                ? null
                : Number(form.totalBudget);

        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            type: form.type,
            visibility: form.visibility,

            // ✅ NEW
            totalBudget: normalizedTotalBudget,
            banner: normalizedBanner,
            themeColor: normalizedThemeColor,

            startDate: form.startDate,
            endDate: form.endDate || null,

            // ⭐ KEY POINT
            rules: typeConfig.buildRules(form),
        };

        const res = await dispatch(createRewardCampaign(payload));
        if (createRewardCampaign.fulfilled.match(res)) {
            navigate("/campaign");
        }
    };

    return (
        <div className={styles.wrapper}>
            <h2>Create Reward Campaign</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* BASIC */}
                <section className={styles.section}>
                    <label>
                        Name
                        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                    </label>

                    <label>
                        Description
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                    </label>

                    <label>
                        Type
                        <select
                            value={form.type}
                            onChange={(e) =>
                                setForm({ ...form, type: e.target.value })
                            }
                        >
                            {Object.entries(CAMPAIGN_TYPE_CONFIG).map(([k, v]) => (
                                <option key={k} value={k}>{v.label}</option>
                            ))}
                        </select>
                    </label>

                    {/* ✅ NEW: TOTAL BUDGET */}
                    <label>
                        Total Budget (optional)
                        {errors.totalBudget && (
                            <span className={styles.errorText}>{errors.totalBudget}</span>
                        )}
                        <input
                            type="number"
                            min="0"
                            placeholder="Leave empty = Unlimited"
                            value={form.totalBudget}
                            onChange={(e) =>
                                setForm({ ...form, totalBudget: e.target.value })
                            }
                        />
                    </label>

                    {/* ✅ NEW: BANNER */}
                    <label>
                        Banner (optional)
                        <input
                            type="text"
                            placeholder="https://... or /uploads/..."
                            value={form.banner}
                            onChange={(e) =>
                                setForm({ ...form, banner: e.target.value })
                            }
                        />
                    </label>

                    {/* ✅ NEW: THEME COLOR */}
                    <label>
                        Theme Color (optional)
                        <input
                            type="text"
                            placeholder="#22c55e"
                            value={form.themeColor}
                            onChange={(e) =>
                                setForm({ ...form, themeColor: e.target.value })
                            }
                        />
                    </label>
                </section>

                {/* REWARD */}
                <section className={styles.section}>
                    <h3>Reward Config</h3>
                    {typeConfig.fields.map((field) => (
                        <DynamicField
                            key={field.name}
                            field={field}
                            form={form}
                            setForm={setForm}
                            error={errors[field.name]}
                        />
                    ))}
                </section>

                {/* TIME */}
                <section className={styles.section}>
                    <label>
                        Start Date
                        {errors.startDate && (
                            <span className={styles.errorText}>{errors.startDate}</span>
                        )}
                        <input
                            type="date"
                            value={form.startDate}
                            onChange={(e) =>
                                setForm({ ...form, startDate: e.target.value })
                            }
                        />
                    </label>

                    <label>
                        End Date
                        <input
                            type="date"
                            onChange={(e) =>
                                setForm({ ...form, endDate: e.target.value || null })
                            }
                        />
                    </label>
                </section>

                <button type="submit" className={styles.submit}>
                    Create Campaign
                </button>
            </form>
        </div>
    );
};

export default CreateRewardCampaign;
