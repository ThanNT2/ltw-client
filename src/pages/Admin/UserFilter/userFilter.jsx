import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./userFilter.module.scss";
import {
  FaSearch,
  FaSyncAlt,
  FaSortAmountDownAlt,
  FaSortAmountUpAlt,
} from "react-icons/fa";

const ROLES = ["admin", "moderator", "user"];

const UserFilter = ({
  search,
  role,
  isDeleted,
  sortField,
  sortOrder,
  fromDate,
  toDate,
  onlineStatus,
  onSearchChange,
  onRoleChange,
  onIncludeDeletedChange,
  onSortFieldChange,
  onSortOrderToggle,
  onFromDateChange,
  onToDateChange,
  onOnlineStatusChange,
  onResetFilters,
}) => {
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchInput !== search) {
        onSearchChange?.(searchInput);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [searchInput, onSearchChange, search]);

  const sortIcon =
    sortOrder === "asc" ? <FaSortAmountUpAlt /> : <FaSortAmountDownAlt />;

  return (
    <div className={styles.filterContainer}>
      <div className={styles.row}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.iconLeft} />
          <input
            type="text"
            placeholder="Tìm theo email hoặc tên..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className={styles.roleBox}>
          <label>Phân quyền:</label>
          <select value={role} onChange={(e) => onRoleChange?.(e.target.value)}>
            <option value="all">Tất cả</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.deletedBox}>
          <label>Trạng thái xoá:</label>
          <select
            value={isDeleted}
            onChange={(e) => onIncludeDeletedChange?.(e.target.value)}
          >
            <option value="undefined">Tất cả</option>
            <option value="false">Chưa bị xoá</option>
            <option value="true">Đã bị xoá</option>
          </select>
        </div>

        <div className={styles.onlineBox}>
          <label>Online:</label>
          <select
            value={onlineStatus}
            onChange={(e) => onOnlineStatusChange?.(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.dateBox}>
          <label>Ngày tạo từ:</label>
          <input
            type="date"
            value={fromDate || ""}
            onChange={(e) => onFromDateChange?.(e.target.value)}
          />
          <label>Đến:</label>
          <input
            type="date"
            value={toDate || ""}
            onChange={(e) => onToDateChange?.(e.target.value)}
          />
        </div>

        <div className={styles.sortBox}>
          <label>Sắp xếp theo:</label>
          <select
            value={sortField}
            onChange={(e) => onSortFieldChange?.(e.target.value)}
          >
            <option value="createdAt">Ngày tạo</option>
            <option value="username">Tên người dùng</option>
            <option value="email">Email</option>
            <option value="coin">Coin</option>
          </select>
          <button className={styles.sortBtn} onClick={onSortOrderToggle}>
            {sortIcon}
          </button>
        </div>

        <button className={styles.resetBtn} onClick={onResetFilters}>
          <FaSyncAlt /> Reset
        </button>
      </div>
    </div>
  );
};

UserFilter.propTypes = {
  search: PropTypes.string,
  role: PropTypes.string,
  isDeleted: PropTypes.string,
  sortField: PropTypes.string,
  sortOrder: PropTypes.string,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  onlineStatus: PropTypes.string,
  onSearchChange: PropTypes.func,
  onRoleChange: PropTypes.func,
  onIncludeDeletedChange: PropTypes.func,
  onSortFieldChange: PropTypes.func,
  onSortOrderToggle: PropTypes.func,
  onFromDateChange: PropTypes.func,
  onToDateChange: PropTypes.func,
  onOnlineStatusChange: PropTypes.func,
  onResetFilters: PropTypes.func,
};

export default UserFilter;


