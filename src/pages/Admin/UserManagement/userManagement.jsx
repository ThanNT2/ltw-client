import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
getAllUsersByAdminThunk,
} from "../../../stores/thunks/userManagementThunks";
import {
selectUserList,
selectUserPagination,
selectUserManagementLoading,
selectUserManagementError,
} from "../../../stores/selectors/userManagementSelectors";
import { selectCurrentUser } from "../../../stores/selectors/userSelectors";
import { setPagination } from "../../../stores/slices/userManagementSlice";
import styles from "./userManagement.module.scss";
import UserFilter from "../UserFilter/UserFilter";
import UserTable from "../UserTable/UserTable";

// Resolve server/base URLs in Vite
const API_BASE_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || "http://localhost:9000/api";
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const ROLES = ["admin", "moderator", "user"];

// Export helper function
const exportUserData = (data, type, filename) => {
  if (!data || data.length === 0) return;

  let content, mimeType, fileExtension;

  switch (type) {
    case "csv":
      const csvContent = [
        "Email,Fullname,Phone,Coin,Role,CreatedAt,LastLogin,Status",
        ...data.map(user => 
          `"${user.email}","${user.fullname}","${user.phone}","${user.coin}","${user.role}","${user.createdAt}","${user.lastLogin}","${user.status}"`
        )
      ].join("\n");
      content = csvContent;
      mimeType = "text/csv";
      fileExtension = "csv";
      break;
    case "excel":
      // For Excel, we'll create a simple CSV that can be opened in Excel
      const excelContent = [
        "Email,Fullname,Phone,Coin,Role,CreatedAt,LastLogin,Status",
        ...data.map(user => 
          `"${user.email}","${user.fullname}","${user.phone}","${user.coin}","${user.role}","${user.createdAt}","${user.lastLogin}","${user.status}"`
        )
      ].join("\n");
      content = excelContent;
      mimeType = "text/csv";
      fileExtension = "xlsx";
      break;
    case "json":
      content = JSON.stringify(data, null, 2);
      mimeType = "application/json";
      fileExtension = "json";
      break;
    default:
      return;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.${fileExtension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/** --- Sub Components --- */

const UserTableRow = ({ user, index, onEditUser, onChangeRole, onSoftDeleteUser, onRestoreUser }) => {
  const roleLabel = user.role || "user";
  const roleClass = styles[roleLabel] || styles.user;
  const onlineClass = user.onlineStatus === "online" ? styles.online : styles.offline;

  return (
    <tr key={user._id || user.id}>
      <td data-label="Avatar">
        <div className={styles.avatarWrapper}>
          <img
            src={
              user.avatar
                ? `${SERVER_BASE_URL}${user.avatar}`
                : `${SERVER_BASE_URL}/uploads/avatars/default-avatar.png`
            }
            alt="avatar"
            className={styles.avatar}
          />
          <span className={`${styles.statusDot} ${onlineClass}`}></span>
        </div>
      </td>
      <td data-label="Email">{user.email}</td>
      <td data-label="Họ & tên">{user.username || user.name || "—"}</td>
      <td data-label="Điện thoại">{user.phone || "—"}</td>
      <td data-label="Coin">
        {user.coin?.toLocaleString("vi-VN") || "0"}
      </td>
      <td data-label="Phân quyền">
        <div className={styles.roleCell}>
          <select
            value={roleLabel}
            onChange={(e) => onChangeRole?.(user._id || user.id, e.target.value)}
            className={`${styles.role} ${roleClass}`}
            disabled={user.isDeleted}
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
        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "—"}
      </td>
      <td data-label="Cập nhật">
        {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString("vi-VN") : "—"}
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
            <button
              className={styles.edit}
              onClick={() => onEditUser?.(user)}
            >
              Sửa
            </button>
            <button
              className={styles.delete}
              onClick={() => onSoftDeleteUser?.(user._id || user.id)}
            >
              Xóa
            </button>
          </>
        ) : (
          <button
            className={styles.restore}
            onClick={() => onRestoreUser?.(user._id || user.id)}
          >
            Khôi phục
          </button>
        )}
      </td>
    </tr>
  );
};

// Mobile-first card for small screens
const UserCard = ({ user, index, onEditUser, onChangeRole, onSoftDeleteUser, onRestoreUser }) => {
  const roleLabel = user.role || "user";
  const roleClass = styles[roleLabel] || styles.user;
  const onlineClass = user.onlineStatus === "online" ? styles.online : styles.offline;

  return (
    <div className={styles.card} aria-label="User card">
      <div className={styles.cardHeader}>
        <div className={styles.avatarWrapper} aria-hidden="true">
          <img
            src={
              user.avatar
                ? `${SERVER_BASE_URL}${user.avatar}`
                : `${SERVER_BASE_URL}/uploads/avatars/default-avatar.png`
            }
            alt="avatar"
            className={styles.avatar}
          />
          <span className={`${styles.statusDot} ${onlineClass}`}></span>
        </div>
        <div className={styles.cardTitle}>
          <div className={styles.cardName}>{user.username || user.name || "—"}</div>
          <div className={styles.cardEmail}>{user.email || "—"}</div>
        </div>
        <div className={styles.cardIndex}>#{index}</div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Điện thoại</span>
            <span className={styles.fieldValue}>{user.phone || "—"}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Coin</span>
            <span className={styles.fieldValue}>{user.coin?.toLocaleString("vi-VN") || "0"}</span>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Phân quyền</span>
            <select
              value={roleLabel}
              onChange={(e) => onChangeRole?.(user._id || user.id, e.target.value)}
              className={`${styles.role} ${roleClass}`}
              disabled={user.isDeleted}
              aria-label="Change role"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Trạng thái</span>
            <span className={user.isActive ? styles.active : styles.blocked}>
              {user.isActive ? "Hoạt động" : "Bị khóa"}
            </span>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Ngày tạo</span>
            <span className={styles.fieldValue}>
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "—"}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Cập nhật</span>
            <span className={styles.fieldValue}>
              {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString("vi-VN") : "—"}
            </span>
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Last Login</span>
          <span className={styles.fieldValue}>
            {user.lastOnline ? new Date(user.lastOnline).toLocaleString("vi-VN") : "—"}
          </span>
        </div>

        <div className={styles.actions}>
          {!user.isDeleted ? (
            <>
              <button className={styles.edit} onClick={() => onEditUser?.(user)}>Sửa</button>
              <button className={styles.delete} onClick={() => onSoftDeleteUser?.(user._id || user.id)}>Xóa</button>
            </>
          ) : (
            <button className={styles.restore} onClick={() => onRestoreUser?.(user._id || user.id)}>Khôi phục</button>
          )}
        </div>
      </div>
    </div>
  );
};


/** --- Main Component --- */
const UserManagement = ({
  onEditUser,
  onChangeRole,
  onSoftDeleteUser,
  onRestoreUser,
}) => {
  const dispatch = useDispatch();

  const users = useSelector(selectUserList);
  const pagination = useSelector(selectUserPagination);
  const loading = useSelector(selectUserManagementLoading);
  const error = useSelector(selectUserManagementError);
  const currentUser = useSelector(selectCurrentUser);

  const { page, limit } = pagination;
  const totalPages = Math.ceil((pagination.total || 0) / limit);
  const totalUsers = pagination.total || 0;
  const currentUserRole = currentUser?.role || "user";

  const [filters, setFilters] = React.useState({ 
    keyword: "", 
    role: "all", 
    status: "all",
    search: "",
    isDeleted: "undefined",
    sortField: "createdAt",
    sortOrder: "desc",
    fromDate: "",
    toDate: "",
    onlineStatus: "all"
  });
  const [isFiltering, setIsFiltering] = React.useState(false);

  useEffect(() => {
    // Build query parameters from filters
    const queryParams = {
      page,
      limit,
    };

    // Add search filter
    if (filters.search && filters.search.trim()) {
      queryParams.search = filters.search.trim();
    }

    // Add role filter
    if (filters.role && filters.role !== "all") {
      queryParams.role = filters.role;
    }

    // Add deleted status filter
    if (filters.isDeleted !== "undefined") {
      queryParams.isDeleted = filters.isDeleted === "true";
    }

    // Add online status filter
    if (filters.onlineStatus && filters.onlineStatus !== "all") {
      queryParams.onlineStatus = filters.onlineStatus;
    }

    // Add date range filters
    if (filters.fromDate) {
      queryParams.fromDate = filters.fromDate;
    }
    if (filters.toDate) {
      queryParams.toDate = filters.toDate;
    }

    // Add sort parameters
    if (filters.sortField) {
      queryParams.sort = `${filters.sortField}:${filters.sortOrder}`;
    }

    // Set filtering state
    setIsFiltering(true);
    
    dispatch(getAllUsersByAdminThunk(queryParams))
      .finally(() => {
        setIsFiltering(false);
      });
  }, [dispatch, page, limit, filters]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    dispatch(setPagination({ page: nextPage }));
  };

  const handleLimitChange = (newLimit) => {
    const limitValue = Number(newLimit) || 10;
    dispatch(setPagination({ limit: limitValue, page: 1 }));
  };

  const handleExport = (type) => {
    if (!users || users.length === 0) return;

    const data = users.map((u) => ({
      email: u.email,
      fullname: u.username || u.name || "—",
      phone: u.phone || "—",
      coin: u.coin || 0,
      role: u.role || "user",
      createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—",
      lastLogin: u.lastOnline
        ? new Date(u.lastOnline).toLocaleString("vi-VN")
        : "—",
      status: u.isActive ? "Hoạt động" : "Bị khóa",
    }));

    exportUserData(data, type, "users_export");
  };

  const handleResetFilters = () => {
    setFilters({ 
      keyword: "", 
      role: "all", 
      status: "all",
      search: "",
      isDeleted: "undefined",
      sortField: "createdAt",
      sortOrder: "desc",
      fromDate: "",
      toDate: "",
      onlineStatus: "all"
    });
    // Reset to page 1 when filters are reset
    dispatch(setPagination({ page: 1 }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    // Reset to page 1 when filters change
    dispatch(setPagination({ page: 1 }));
  };

  return (
    <div className={styles.tableWrapper}>
      <UserFilter 
        search={filters.search}
        role={filters.role}
        isDeleted={filters.isDeleted}
        sortField={filters.sortField}
        sortOrder={filters.sortOrder}
        fromDate={filters.fromDate}
        toDate={filters.toDate}
        onlineStatus={filters.onlineStatus}
        onSearchChange={(value) => handleFilterChange('search', value)}
        onRoleChange={(value) => handleFilterChange('role', value)}
        onIncludeDeletedChange={(value) => handleFilterChange('isDeleted', value)}
        onSortFieldChange={(value) => handleFilterChange('sortField', value)}
        onSortOrderToggle={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
        onFromDateChange={(value) => handleFilterChange('fromDate', value)}
        onToDateChange={(value) => handleFilterChange('toDate', value)}
        onOnlineStatusChange={(value) => handleFilterChange('onlineStatus', value)}
        onResetFilters={handleResetFilters}
      />

      <div className={styles.exportWrapper}>
        <button onClick={() => handleExport("csv")} className={styles.exportButton}>Export CSV</button>
        <button onClick={() => handleExport("excel")} className={styles.exportButton}>Export Excel</button>
        <button onClick={() => handleExport("json")} className={styles.exportButton}>Export JSON</button>
      </div>

      <UserTable
        users={users}
        loading={loading || isFiltering}
        page={page}
        totalPages={totalPages}
        totalUsers={totalUsers}
        limit={limit}
        serverBaseUrl={SERVER_BASE_URL}
        currentUserRole={currentUserRole}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onEditUser={onEditUser}
        onChangeRole={onChangeRole}
        onSoftDeleteUser={onSoftDeleteUser}
        onRestoreUser={onRestoreUser}
      />
    </div>
  );
};

UserManagement.propTypes = {
  onEditUser: PropTypes.func,
  onChangeRole: PropTypes.func,
  onSoftDeleteUser: PropTypes.func,
  onRestoreUser: PropTypes.func,
};

export default UserManagement;
