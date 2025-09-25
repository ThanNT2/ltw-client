import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../stores/selectors/userSelectors";
import styles from "./ProfilePage.module.scss";
import { useState, useMemo, useEffect } from "react";
import { updateProfileThunk } from "../../../stores/thunks/userThunks";
import axiosInstance from "../../../services/axiosInstance";

function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [message, setMessage] = useState("");

  const hasProfileChanges = (() => {
    const currentName = user?.username || "";
    const currentPhone = user?.phone || "";
    return (
      (formData.name ?? "") !== currentName ||
      (formData.phone ?? "") !== currentPhone
    );
  })();

  const hasAvatarChange = !!avatarFile || !!removeAvatar;

  useMemo(() => {
    if (user) {
      setFormData({ name: user.username || "", phone: user.phone || "" });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateClick = () => {
    setMessage("");
    if (isEditing) {
      if (!hasProfileChanges && !hasAvatarChange) {
        setMessage("Không có thay đổi để cập nhật");
        return;
      }
      handleSubmitUpdate();
    } else {
      setIsEditing(true);
    }
  };

  const serverOrigin = (() => {
    try {
      const baseURL = axiosInstance?.defaults?.baseURL || "";
      const origin = new URL(baseURL).origin;
      return origin || "http://localhost:9000";
    } catch (_) {
      return "http://localhost:9000";
    }
  })();

  const resolveAvatarUrl = (src) => {
    if (!src) return `${serverOrigin}/uploads/avatars/default-avatar.png`;
    if (src.startsWith("http")) return src;
    if (src.startsWith("/")) return `${serverOrigin}${src}`;
    return `${serverOrigin}/${src}`;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setMessage("Ảnh vượt quá 2MB");
      return;
    }
    setAvatarFile(file);
    setRemoveAvatar(false);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setRemoveAvatar(true);
    setMessage("Đã chọn xóa avatar. Nhấn Lưu thay đổi để áp dụng.");
  };

  const handleSubmitUpdate = async () => {
    setMessage("");
    try {
      const payload = {
        avatarFile,
        removeAvatar,
      };
      const currentName = user?.username || "";
      const currentPhone = user?.phone || "";
      if ((formData.name ?? "") !== currentName)
        payload.username = formData.name;
      if ((formData.phone ?? "") !== currentPhone)
        payload.phone = formData.phone;

      const action = await dispatch(updateProfileThunk(payload));
      if (action.meta.requestStatus === "fulfilled") {
        setIsEditing(false);
        setAvatarFile(null);
        setRemoveAvatar(false);
        setMessage("Cập nhật thành công");
      } else {
        setMessage(action.payload?.message || "Cập nhật thất bại");
      }
    } catch (err) {
      setMessage(err?.message || "Cập nhật thất bại");
    }
  };

  // Tự ẩn thông báo sau 2.5s và dọn dẹp khi rời trang/unmount
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 2500);
    return () => clearTimeout(timer);
  }, [message]);

  const handleCancel = () => {
    if (user) {
      setFormData({ name: user.username || "", phone: user.phone || "" });
    }
    setAvatarFile(null);
    setRemoveAvatar(false);
    setIsEditing(false);
  };

  if (!user) {
    return <p>Đang tải thông tin người dùng...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img
            src={
              isEditing
                ? avatarFile
                  ? URL.createObjectURL(avatarFile)
                  : removeAvatar
                  ? `${serverOrigin}/uploads/avatars/default-avatar.png`
                  : resolveAvatarUrl(user.avatar)
                : resolveAvatarUrl(user.avatar)
            }
            alt="Avatar"
            className={styles.avatar}
            onError={(e) => {
              e.target.src = `${serverOrigin}/uploads/avatars/default-avatar.png`;
            }}
          />
          <div className={styles.userMeta}>
            <div className={styles.name}>{user.username}</div>
            <div className={styles.email}>{user.email}</div>
            <div className={styles.coin}>{user.coin} coin</div>
            <div className={styles.created}>
              Ngày tạo: {new Date(user.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.item}>
            <div className={styles.label}>Tên</div>
            {isEditing ? (
              <div className={styles.control}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên"
                />
              </div>
            ) : (
              <div className={styles.value}>{user.username}</div>
            )}
          </div>
          <div className={styles.item}>
            <div className={styles.label}>Email</div>
            {isEditing ? (
              <div className={styles.control}>
                <input type="email" value={user.email} disabled />
              </div>
            ) : (
              <div className={styles.value}>{user.email}</div>
            )}
          </div>
          <div className={styles.item}>
            <div className={styles.label}>Số điện thoại</div>
            {isEditing ? (
              <div className={styles.control}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            ) : (
              <div className={styles.value}>
                {user.phone || "Chưa cập nhật"}
              </div>
            )}
          </div>
          <div className={styles.item}>
            <div className={styles.label}>Ảnh đại diện</div>
            {isEditing ? (
              <div className={styles.control}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                {avatarFile && (
                  <div className={styles.preview}>
                    <img
                      src={URL.createObjectURL(avatarFile)}
                      alt="Preview"
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginTop: 8,
                      }}
                    />
                  </div>
                )}
                <button
                  type="button"
                  className={styles.btn}
                  onClick={handleRemoveAvatar}
                  style={{ marginTop: 8 }}
                >
                  Xóa avatar
                </button>
              </div>
            ) : (
              <div className={styles.value}>—</div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button className={styles.btn} onClick={handleCancel}>
                Hủy
              </button>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleUpdateClick}
                disabled={!hasProfileChanges && !hasAvatarChange}
              >
                Lưu thay đổi
              </button>
            </>
          ) : (
            <>
              <button className={styles.btn} onClick={handleUpdateClick}>
                Cập nhật thông tin
              </button>
              <a
                href="/change-password"
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Đổi mật khẩu
              </a>
            </>
          )}
        </div>

        {message && (
          <div
            style={{
              marginTop: 12,
              background: message.includes("thất bại")
                ? "rgba(239, 68, 68, 0.1)"
                : "rgba(34, 197, 94, 0.1)",
              border: message.includes("thất bại")
                ? "1px solid rgba(239, 68, 68, 0.3)"
                : "1px solid rgba(34, 197, 94, 0.3)",
              color: message.includes("thất bại") ? "#fca5a5" : "#86efac",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
