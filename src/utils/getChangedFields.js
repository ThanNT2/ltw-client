/**
 * So sánh 2 object (deep compare) và chỉ trả về các field thay đổi.
 * @param {Object} original - dữ liệu gốc (vd: userData)
 * @param {Object} updated - dữ liệu mới (vd: formData)
 * @returns {Object} các field thay đổi
 */
export function getChangedFields(original, updated) {
    const changed = {};

    for (const key in updated) {
        const originalValue = original?.[key];
        const updatedValue = updated[key];

        // Nếu cả 2 đều là object → đệ quy
        if (
            typeof originalValue === "object" &&
            typeof updatedValue === "object" &&
            originalValue !== null &&
            updatedValue !== null &&
            !(updatedValue instanceof File) // tránh so sánh file blob
        ) {
            const nestedChanges = getChangedFields(originalValue, updatedValue);
            if (Object.keys(nestedChanges).length > 0) {
                changed[key] = nestedChanges;
            }
        } else if (originalValue !== updatedValue) {
            // So sánh primitive (string, number, boolean, null, undefined)
            changed[key] = updatedValue;
        }
    }

    return changed;
}
