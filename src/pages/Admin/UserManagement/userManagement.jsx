import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
// import { toast } from "react-toastify";
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
import { emitSocketEvent } from "../../../socket/socketMiddleware"; // ✅ thêm emit socket event
import styles from "./userManagement.module.scss";
import UserFilter from "../UserFilter/UserFilter";
import UserTable from "../UserTable/userTable";
import UserModal from "../Modal/userUpdateModal";

/** --- ENV setup --- */
const API_BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL || "http://localhost:9000/api";
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

/** --- Export helper --- */
const exportUserData = (data, type, filename) => {
  if (!data?.length) return;
  let content, mimeType, ext;

  const headers = [
    "Email",
    "Fullname",
    "Phone",
    "Coin",
    "Role",
    "CreatedAt",
    "LastLogin",
    "Status",
  ];
  const csvRows = data.map((u) =>
    [
      u.email,
      u.fullname || "—",
      u.phone || "—",
      u.coin || 0,
      u.role,
      u.createdAt,
      u.lastLogin,
      u.status,
    ]
      .map((v) => `"${v}"`)
      .join(",")
  );
  const joined = [headers.join(","), ...csvRows].join("\n");

  switch (type) {
    case "csv":
      content = joined;
      mimeType = "text/csv";
      ext = "csv";
      break;
    case "excel":
      content = joined;
      mimeType = "text/csv";
      ext = "xlsx";
      break;
    case "json":
      content = JSON.stringify(data, null, 2);
      mimeType = "application/json";
      ext = "json";
      break;
    default:
      return;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.${ext}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/** --- Component --- */
const UserManagement = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUserList);
  const pagination = useSelector(selectUserPagination);
  const loading = useSelector(selectUserManagementLoading);
  const currentUser = useSelector(selectCurrentUser);

  const { page, limit, total } = pagination;
  const totalPages = Math.ceil((total || 0) / limit);
  const totalUsers = total || 0;
  const currentUserRole = currentUser?.role || "user";

  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    isDeleted: "undefined",
    sortField: "createdAt",
    sortOrder: "desc",
    fromDate: "",
    toDate: "",
    onlineStatus: "all",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);

  /** --- Fetch users --- */
  useEffect(() => {
    const query = {
      page,
      limit,
      ...(filters.search && { search: filters.search }),
      ...(filters.role !== "all" && { role: filters.role }),
      ...(filters.isDeleted !== "undefined" && {
        isDeleted: filters.isDeleted === "true",
      }),
      ...(filters.onlineStatus !== "all" && {
        onlineStatus: filters.onlineStatus,
      }),
      ...(filters.fromDate && { fromDate: filters.fromDate }),
      ...(filters.toDate && { toDate: filters.toDate }),
      sort: `${filters.sortField}:${filters.sortOrder}`,
    };

    setIsFiltering(true);
    dispatch(getAllUsersByAdminThunk(query)).finally(() =>
      setIsFiltering(false)
    );
  }, [dispatch, page, limit, filters]);

  /** --- Handlers --- */
  const handleChangeRole = async (userId, newRole, oldRole) => {
    if (!userId || newRole === oldRole) return;

    try {
      await dispatch(
        updateUserByAdminThunk({ userId, payload: { role: newRole } })
      ).unwrap();

      // toast.success("✅ Cập nhật quyền người dùng thành công");

      // ⚡ Emit realtime event để client user nhận cập nhật role ngay
      emitSocketEvent("update_role", { userId, newRole });
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật role:", error);
      // toast.error("Không thể cập nhật quyền người dùng");
    }
  };

  const handleSoftDelete = (userId) => {
    if (userId) dispatch(softDeleteUserByAdminThunk(userId));
  };

  const handleRestore = (userId) => {
    if (userId) dispatch(restoreUserByAdminThunk(userId));
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = (updated) => {
    if (updated?._id)
      dispatch(
        updateUserByAdminThunk({ userId: updated._id, payload: updated })
      );
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handlePageChange = (p) => {
    if (p < 1 || p > totalPages) return;
    dispatch(setPagination({ page: p }));
  };

  const handleLimitChange = (newLimit) => {
    dispatch(setPagination({ limit: Number(newLimit) || 10, page: 1 }));
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    dispatch(setPagination({ page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      role: "all",
      isDeleted: "undefined",
      sortField: "createdAt",
      sortOrder: "desc",
      fromDate: "",
      toDate: "",
      onlineStatus: "all",
    });
    dispatch(setPagination({ page: 1 }));
  };

  const handleExport = (type) => {
    if (!users?.length) return;
    const formatted = users.map((u) => ({
      email: u.email,
      fullname: u.username || u.name || "—",
      phone: u.phone || "—",
      coin: u.coin || 0,
      role: u.role || "user",
      createdAt: u.createdAt
        ? new Date(u.createdAt).toLocaleDateString("vi-VN")
        : "—",
      lastLogin: u.lastOnline
        ? new Date(u.lastOnline).toLocaleString("vi-VN")
        : "—",
      status: u.isActive ? "Hoạt động" : "Bị khóa",
    }));
    exportUserData(formatted, type, "users_export");
  };

  return (
    <div className={styles.container}>
      <UserFilter
        search={filters.search}
        role={filters.role}
        isDeleted={filters.isDeleted}
        sortField={filters.sortField}
        sortOrder={filters.sortOrder}
        fromDate={filters.fromDate}
        toDate={filters.toDate}
        onlineStatus={filters.onlineStatus}
        onSearchChange={(v) => handleFilterChange("search", v)}
        onRoleChange={(v) => handleFilterChange("role", v)}
        onIncludeDeletedChange={(v) => handleFilterChange("isDeleted", v)}
        onSortFieldChange={(v) => handleFilterChange("sortField", v)}
        onSortOrderToggle={() =>
          handleFilterChange(
            "sortOrder",
            filters.sortOrder === "asc" ? "desc" : "asc"
          )
        }
        onFromDateChange={(v) => handleFilterChange("fromDate", v)}
        onToDateChange={(v) => handleFilterChange("toDate", v)}
        onOnlineStatusChange={(v) => handleFilterChange("onlineStatus", v)}
        onResetFilters={handleResetFilters}
      />

      <div className={styles.exportWrapper}>
        <button onClick={() => handleExport("csv")} className={styles.exportButton}>
          Export CSV
        </button>
        <button onClick={() => handleExport("excel")} className={styles.exportButton}>
          Export Excel
        </button>
        <button onClick={() => handleExport("json")} className={styles.exportButton}>
          Export JSON
        </button>
      </div>

      <div className={styles.tableContainer}>
        <UserTable
          users={users}
          loading={loading || isFiltering}
          page={page}
          totalPages={totalPages}
          totalUsers={totalUsers}
          limit={limit}
          serverBaseUrl={SERVER_BASE_URL}
          currentUserRole={currentUserRole}
          currentUserId={currentUser?._id || currentUser?.id}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onEditUser={handleEdit}
          onChangeRole={handleChangeRole}
          onSoftDeleteUser={handleSoftDelete}
          onRestoreUser={handleRestore}
        />
      </div>

      {isModalOpen && selectedUser && (
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userData={selectedUser}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

UserManagement.propTypes = {
  onEditUser: PropTypes.func,
  onChangeRole: PropTypes.func,
  onRestoreUser: PropTypes.func,
};

export default UserManagement;
