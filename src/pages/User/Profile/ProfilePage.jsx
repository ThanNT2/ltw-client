import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../stores/selectors/userSelectors";
import styles from "./ProfilePage.module.scss";
import { useState, useMemo } from "react";

function ProfilePage() {
  const user = useSelector(selectCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

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
    if (isEditing) {
      // TODO: call API to update profile
      // console.log("Update payload", formData)
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({ name: user.username || "", phone: user.phone || "" });
    }
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
            src={user.avatar || "/default_avatar.png"}
            alt="Avatar"
            className={styles.avatar}
            onError={(e) => {
              e.target.src = "/vite.svg";
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
              <div className={styles.value}>{user.phone || "Chưa cập nhật"}</div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button className={styles.btn} onClick={handleCancel}>Hủy</button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleUpdateClick}>Lưu thay đổi</button>
            </>
          ) : (
            <>
              <button className={styles.btn} onClick={handleUpdateClick}>Cập nhật thông tin</button>
              <a href="/change-password" className={`${styles.btn} ${styles.btnPrimary}`}>Đổi mật khẩu</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
