import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../stores/selectors/userSelectors";

function ProfilePage() {
  const user = useSelector(selectCurrentUser);


  if (!user) {
    return <p>Đang tải thông tin người dùng...</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: 960, margin: "0 auto" }}>
      <h1>Thông tin cá nhân</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
        <img
          src={user.avatar || "/default_avatar.png"}
          alt="Avatar"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #007bff",
          }}
        />
        <div>
          <p><strong>👤 Username:</strong> {user.username}</p>
          <p><strong>📧 Email:</strong> {user.email}</p>
          <p><strong>📱 Phone:</strong> {user.phone || "Chưa cập nhật"}</p>
          <p><strong>💰 Số dư:</strong> {user.coin} coin</p>
          <p><strong>📅 Ngày tạo:</strong> {new Date(user.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
