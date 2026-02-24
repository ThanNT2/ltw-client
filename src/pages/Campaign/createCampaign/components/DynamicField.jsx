// src/features/rewardCampaigns/components/DynamicField.jsx
const DynamicField = ({ field, form, setForm, error }) => {
    const value = form[field.name] ?? "";

    if (field.type === "array:number") {
        return (
            <label>
                {field.label}
                {error && <span className="errorText">{error}</span>}
                <input
                    placeholder="5,10,20"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            [field.name]: e.target.value
                                .split(",")
                                .map((n) => Number(n.trim()))
                                .filter((n) => n > 0),
                        })
                    }
                />
            </label>
        );
    }

    return (
        <label>
            {field.label}
            {error && <span className="errorText">{error}</span>}
            <input
                type={field.type}
                value={value}
                onChange={(e) =>
                    setForm({ ...form, [field.name]: e.target.value })
                }
            />
        </label>
    );
};

export default DynamicField;
