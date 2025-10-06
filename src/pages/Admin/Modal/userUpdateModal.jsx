import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../stores/selectors/userSelectors";
import styles from "./userUpdateModal.module.scss";
import { getChangedFields } from "../../../utils/getChangedFields";

const UserUpdateModal = ({ isOpen, onClose, userData, onSave }) => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const initialized = useRef(false);
    const currentUser = useSelector(selectCurrentUser);

    /** --- CHỈ KHỞI TẠO DỮ LIỆU 1 LẦN KHI MỞ MODAL --- */
    useEffect(() => {
        if (isOpen && userData && !initialized.current) {
            const baseUrl =
                import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
                "http://localhost:9000";

            setFormData({
                username: userData.username || "",
                email: userData.email || "",
                phone: userData.phone || "",
                coin: userData.coin || 0,
                isActive: userData.isActive ?? true,
                role: userData.role || "user",
                avatar: null,
                avatarPreview: userData.avatar
                    ? `${baseUrl}${userData.avatar}`
                    : `${baseUrl}/uploads/avatars/default_avatar.png`,
                removeAvatar: false,
            });

            initialized.current = true;
            console.log("✅ Modal initialized for:", userData.username);
        }

        if (!isOpen) {
            initialized.current = false;
        }
    }, [isOpen, userData]);

    if (!isOpen || !formData) return null;

    /** --- HANDLE INPUT CHANGE --- */
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (name === "avatar" && files.length > 0) {
            const file = files[0];
            setFormData((prev) => ({
                ...prev,
                avatar: file,
                avatarPreview: URL.createObjectURL(file),
                removeAvatar: false,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleRemoveAvatar = () => {
        setFormData((prev) => ({
            ...prev,
            avatar: "/uploads/avatars/default-avatar.png",
            avatarPreview: null,
            removeAvatar: true,
        }));
    };

    const validate = () => {
        if (!formData.username.trim()) {
            alert("Họ tên không được để trống");
            return false;
        }
        if (isNaN(formData.coin) || Number(formData.coin) < 0) {
            alert("Coin phải là số không âm");
            return false;
        }
        return true;
    };

    /** --- CHỈ ADMIN ĐƯỢC CHỈNH ROLE (trừ chính mình) --- */
    const isRoleEditable =
        currentUser?.role === "admin" && currentUser?._id !== userData?._id;

    /** --- SUBMIT FORM --- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const changedFields = getChangedFields(userData, formData);
        console.log(changedFields);
        // luôn đính kèm _id để backend biết user nào
        changedFields._id = userData._id;

        // avatar logic
        if (formData.avatar instanceof File) {
            changedFields.avatar = formData.avatar;
        } else if (formData.removeAvatar) {
            changedFields.removeAvatar = true;
        }

        // Không có thay đổi → bỏ qua update
        if (Object.keys(changedFields).length === 0) {
            alert("Không có thay đổi nào để cập nhật.");
            setLoading(false);
            onClose();
            return;
        }

        await onSave(changedFields);
        setLoading(false);
    };

    return (
        <>
            <div className={styles.overlay} onClick={onClose}></div>
            <div className={styles.modal}>
                <h3>Cập nhật người dùng</h3>
                <form
                    onSubmit={handleSubmit}
                    className={styles.form}
                    encType="multipart/form-data"
                >
                    <label>
                        Họ tên:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Email:
                        <input type="email" name="email" value={formData.email} disabled />
                    </label>

                    <label>
                        Số điện thoại:
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Coin:
                        <input
                            type="number"
                            name="coin"
                            value={formData.coin}
                            onChange={handleChange}
                            disabled
                        />
                    </label>

                    <label>
                        Vai trò:
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={!isRoleEditable}
                            className={!isRoleEditable ? styles.disabledSelect : ""}
                        >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                        </select>
                        {!isRoleEditable && (
                            <small className={styles.note}>
                                Chỉ Admin có thể chỉnh role, không thể đổi role của chính mình
                            </small>
                        )}
                    </label>

                    <label>
                        Avatar:
                        <div className={styles.avatarGroup}>
                            {formData.avatarPreview ? (
                                <img
                                    src={formData.avatarPreview}
                                    alt="avatar preview"
                                    className={styles.avatar}
                                />
                            ) : (
                                <div className={styles.noAvatar}>Không có ảnh</div>
                            )}
                            <button
                                type="button"
                                onClick={handleRemoveAvatar}
                                className={styles.removeAvatar}
                            >
                                Xóa avatar
                            </button>
                        </div>
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </label>

                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                        Đang hoạt động
                    </label>

                    <div className={styles.actions}>
                        <button type="submit" className={styles.save} disabled={loading}>
                            {loading ? "Đang lưu..." : "Lưu"}
                        </button>
                        <button
                            type="button"
                            className={styles.cancel}
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

UserUpdateModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userData: PropTypes.object,
    onSave: PropTypes.func.isRequired,
};

export default UserUpdateModal;
