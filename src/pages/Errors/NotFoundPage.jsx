// src/pages/Errors/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import styles from "./NotFoundPage.module.scss";

const NotFoundPage = () => {
    return (
        <div className={styles.notFound}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.errorCode}>404</div>
                    <h1 className={styles.title}>Page Not Found</h1>
                    <p className={styles.description}>
                        Sorry, the page you are looking for doesn't exist or has been moved.
                    </p>
                    <div className={styles.actions}>
                        <Link to="/" className={styles.homeBtn}>
                            <Home size={20} />
                            Go Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className={styles.backBtn}
                        >
                            <ArrowLeft size={20} />
                            Go Back
                        </button>
                    </div>
                </div>
                <div className={styles.illustration}>
                    <div className={styles.robot}>🤖</div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;

