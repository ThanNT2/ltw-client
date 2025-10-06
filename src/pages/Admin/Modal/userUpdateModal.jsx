import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../stores/selectors/userSelectors";
import styles from "./userModal.module.scss";
import { getChangedFields } from "../../../utils/getChangedFields";

const UserModal = ({ isOpen, onClose, userData, onSave }) => {
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

            console.log("✅ Modal mounted once for user:", userData.username);
            initialized.current = true;
        }

        if (!isOpen) {
            initialized.current = false;
        }
    }, [isOpen, userData]);

    /** --- KHÔNG RENDER KHI CHƯA MỞ HOẶC CHƯA CÓ DỮ LIỆU --- */
    if (!isOpen || !formData) return null;

    /** --- CÁC HÀM XỬ LÝ FORM --- */
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
            avatar: null,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        const updatedFields = {
            _id: userData._id,
            username: formData.username,
            phone: formData.phone,
            coin: formData.coin,
            isActive: formData.isActive,
            role: formData.role,
        };

        if (formData.avatar instanceof File) {
            updatedFields.avatar = formData.avatar;
        } else if (formData.removeAvatar) {
            updatedFields.removeAvatar = true;
        }

        await onSave(updatedFields);
        setLoading(false);
    };

    /** --- CHỈ ADMIN ĐƯỢC PHÉP CHỈNH ROLE, NHƯNG KHÔNG ĐƯỢC CHỈNH ROLE CỦA CHÍNH MÌNH --- */
    const isRoleEditable =
        currentUser?.role === "admin" && currentUser?._id !== userData?._id;

    /** --- JSX --- */
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

                    {/* --- Role: chỉ admin được chỉnh --- */}
                    <label>
                        Vai trò:
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={styles.select}
                            disabled={!isRoleEditable}
                            style={{
                                backgroundColor: !isRoleEditable ? "#f3f3f3" : "white",
                                cursor: !isRoleEditable ? "not-allowed" : "pointer",
                            }}
                        >
                            <option value="user">user</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">admin</option>
                        </select>
                        {!isRoleEditable && (
                            <small className={styles.note}>
                                Chỉ admin có thể chỉnh role, và không thể đổi role của chính
                                mình
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

UserModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userData: PropTypes.object,
    onSave: PropTypes.func.isRequired,
};

export default UserModal;
