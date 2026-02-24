// src/features/rewardCampaigns/CampaignRow.jsx
import { useNavigate } from "react-router-dom";
import { CAMPAIGN_COLUMNS } from "./campaignColums";
import styles from "./rewardCampaign.module.scss";

const CampaignRow = ({ campaign }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.row}>
            {CAMPAIGN_COLUMNS.map((col) => {
                if (col.key === "actions") {
                    return (
                        <button
                            key={col.key}
                            className={styles.detailBtn}
                            onClick={() =>
                                navigate(`/campaign/${campaign._id}`)
                            }
                        >
                            Chi tiết
                        </button>
                    );
                }

                return (
                    <span
                        key={col.key}
                        className={
                            col.key === "status"
                                ? `${styles.status} ${styles[campaign.status]}`
                                : undefined
                        }
                    >
                        {col.render(campaign)}
                    </span>
                );
            })}
        </div>
    );
};

export default CampaignRow;
