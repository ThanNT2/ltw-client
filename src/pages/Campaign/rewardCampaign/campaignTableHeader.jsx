// src/features/rewardCampaigns/CampaignTableHeader.jsx
import styles from "./rewardCampaign.module.scss";
import { CAMPAIGN_COLUMNS } from "./campaignColums";

const CampaignTableHeader = () => {
    return (
        <div className={styles.tableHeader}>
            {CAMPAIGN_COLUMNS.map((col) => (
                <span key={col.key}>
                    {col.label}
                </span>
            ))}
        </div>
    );
};

export default CampaignTableHeader;
