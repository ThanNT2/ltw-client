// src/components/common/PasswordInput.jsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "../../pages/Auth/Auth.module.scss";

function PasswordInput({ id, name, label, value, onChange, required = false }) {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.formGroup}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={styles.passwordWrapper}>
        <input
          type={show ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          className={styles.showPasswordBtn}
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
