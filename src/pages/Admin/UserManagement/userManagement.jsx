import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  getAllUsersByAdminThunk,
  softDeleteUserByAdminThunk,
  restoreUserByAdminThunk,
  updateUserByAdminThunk,

} from "../../../stores/thunks/userManagementThunks";
import {
  selectUserList,
  selectUserPagination,
  selectUserManagementLoading,
} from "../../../stores/selectors/userManagementSelectors";
import { selectCurrentUser } from "../../../stores/selectors/userSelectors";
import { setPagination } from "../../../stores/slices/userManagementSlice";
import styles from "./userManagement.module.scss";
import UserFilter from "../UserFilter/UserFilter";
import UserTable from "../UserTable/UserTable";

// Resolve server/base URLs in Vite
const API_BASE_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || "http://localhost:9000/api";
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

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

/** --- Main Component --- */
const UserManagement = ({
  onEditUser,
  onChangeRole,
  onRestoreUser
}) => {
  const dispatch = useDispatch();
  const handleChangeRole = (userId, newRole, oldRole) => {
    console.log(userId, newRole, oldRole);
    if (!userId || newRole === oldRole) return; // chỉ bỏ qua nếu không có thay đổi
    dispatch(updateUserByAdminThunk({ userId, payload: { role: newRole } }));
  }
  const handleSoftDeleteUser = (userId) => {
    if (!userId) return;
    dispatch(softDeleteUserByAdminThunk(userId));
  };

  const handleRestoreUser = (userId) => {
    if (!userId) return;
    dispatch(restoreUserByAdminThunk(userId));
  };

  const users = useSelector(selectUserList);
  const pagination = useSelector(selectUserPagination);
  const loading = useSelector(selectUserManagementLoading);
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
        onChangeRole={handleChangeRole}
        onSoftDeleteUser={handleSoftDeleteUser}
        onRestoreUser={handleRestoreUser}
      />
    </div>
  );
};

UserManagement.propTypes = {
  onEditUser: PropTypes.func,
  onChangeRole: PropTypes.func,
  onRestoreUser: PropTypes.func,
};

export default UserManagement;
