import React, { memo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux"; // 👈 Thêm dòng này
import styles from "./userTable.module.scss";

const ROLES = ["admin", "moderator", "user"];

const UserTableRow = memo(
  ({
    user,
    index,
    serverBaseUrl,
    currentUserRole,
    currentUserId,
    onEditUser,
    onChangeRole,
    onSoftDeleteUser,
    onRestoreUser,
    onlineUsers, // 👈 nhận thêm từ props
  }) => {
    console.log("onlineUsers =", onlineUsers);
    const roleLabel = user.role || "user";
    const isOnline = onlineUsers?.includes(String(user._id || user.id));
    const onlineClass = isOnline ? styles.online : styles.offline; // 👈 xác định trạng thái online/offline

    const isAdmin = currentUserRole === "admin";
    const canModify = isAdmin && !user.isDeleted;
    const isSelf = String(user._id || user.id) === String(currentUserId);

    return (
      <tr key={user._id || user.id}>
        <td data-label="Avatar">
          <div className={styles.avatarWrapper}>
            <img
              src={
                user.avatar
                  ? `${serverBaseUrl}${user.avatar}`
                  : `${serverBaseUrl}/uploads/avatars/default-avatar.png`
              }
              alt="avatar"
              className={styles.avatar}
            />
            <span className={`${styles.statusDot} ${onlineClass}`}></span> {/* 👈 Dot trạng thái */}
          </div>
        </td>
        <td data-label="Email">{user.email}</td>
        <td data-label="Họ & tên">{user.username || user.name || "—"}</td>
        <td data-label="Điện thoại">{user.phone || "—"}</td>
        <td data-label="Coin">{user.coin?.toLocaleString("vi-VN") || "0"}</td>
        <td data-label="Phân quyền">
          <div className={styles.roleCell}>
            <select
              value={roleLabel}
              onChange={(e) =>
                onChangeRole?.(user._id || user.id, e.target.value, user.role)
              }
              className={`${styles.role} ${styles[roleLabel] || styles.user}`}
              disabled={!canModify}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </td>
        <td data-label="Ngày tạo">
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString("vi-VN")
            : "—"}
        </td>
        <td data-label="Cập nhật">
          {user.updatedAt
            ? new Date(user.updatedAt).toLocaleDateString("vi-VN")
            : "—"}
        </td>
        <td data-label="Last Login">
          {user.lastOnline
            ? new Date(user.lastOnline).toLocaleString("vi-VN")
            : "—"}
        </td>
        <td
          data-label="Trạng thái"
          className={user.isActive ? styles.active : styles.blocked}
        >
          {user.isActive ? "Hoạt động" : "Bị khóa"}
        </td>
        <td data-label="Đã xóa">
          <span className={user.isDeleted ? styles.deleted : styles.normal}>
            {user.isDeleted ? "Đã xóa" : "Bình thường"}
          </span>
        </td>
        <td data-label="Thao tác">
          {!user.isDeleted ? (
            <>
              {!isSelf && (
                <>
                  <button
                    className={styles.edit}
                    onClick={() => onEditUser?.(user)}
                    disabled={!isAdmin}
                  >
                    Sửa
                  </button>
                  <button
                    className={styles.delete}
                    onClick={() =>
                      onSoftDeleteUser?.(user._id || user.id)
                    }
                    disabled={!isAdmin}
                  >
                    Xóa
                  </button>
                </>
              )}
            </>
          ) : (
            <button
              className={styles.restore}
              onClick={() => onRestoreUser?.(user._id || user.id)}
              disabled={!isAdmin}
            >
              Khôi phục
            </button>
          )}
        </td>
      </tr>
    );
  }
);

const UserTable = ({
  users,
  loading,
  page,
  totalPages,
  totalUsers,
  limit,
  serverBaseUrl,
  currentUserRole,
  onPageChange,
  onLimitChange,
  onEditUser,
  onChangeRole,
  currentUserId,
  onSoftDeleteUser,
  onRestoreUser,
}) => {
  const onlineUsers = useSelector((state) => state.userManagement.onlineUsers);// 👈 lấy danh sách user online từ Redux
  console.log("dkm user online =", onlineUsers);

  if (loading)
    return <p className={styles.loading}>Đang tải dữ liệu...</p>;
  if (!users || users.length === 0)
    return <p className={styles.empty}>Không tìm thấy người dùng phù hợp.</p>;

  return (
    <>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Email</th>
              <th>Họ & tên</th>
              <th>Điện thoại</th>
              <th>Coin</th>
              <th className={styles.roleCol}>Phân quyền</th>
              <th>Ngày tạo</th>
              <th>Cập nhật</th>
              <th>Last Login</th>
              <th>Trạng thái</th>
              <th>Đã xóa</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <UserTableRow
                key={u.id || u._id || idx}
                user={u}
                index={(page - 1) * limit + idx + 1}
                serverBaseUrl={serverBaseUrl}
                currentUserRole={currentUserRole}
                currentUserId={currentUserId}
                onEditUser={onEditUser}
                onChangeRole={onChangeRole}
                onSoftDeleteUser={onSoftDeleteUser}
                onRestoreUser={onRestoreUser}
                onlineUsers={onlineUsers} // 👈 truyền xuống Row
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Pagination --- */}
      <div className={styles.pagination}>
        <div className={styles.pageControls}>
          <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            «
          </button>
          <span>
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            »
          </button>
        </div>
        <div className={styles.limitSelectWrapper}>
          <span>Tổng: {totalUsers?.toLocaleString("vi-VN")} người dùng</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange?.(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((l) => (
              <option key={l} value={l}>
                {l}/page
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

UserTable.propTypes = {
  users: PropTypes.array,
  loading: PropTypes.bool,
  page: PropTypes.number,
  totalPages: PropTypes.number,
  totalUsers: PropTypes.number,
  limit: PropTypes.number,
  serverBaseUrl: PropTypes.string,
  currentUserRole: PropTypes.string,
  onPageChange: PropTypes.func,
  onLimitChange: PropTypes.func,
  onEditUser: PropTypes.func,
  onChangeRole: PropTypes.func,
  onSoftDeleteUser: PropTypes.func,
  onRestoreUser: PropTypes.func,
  currentUserId: PropTypes.string,
};

UserTable.displayName = "UserTable";
export default memo(UserTable);
