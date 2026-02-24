import ChangePasswordPage from "../pages/Auth/ChangedPasswordPage";
import UserProfilePage from "../pages/User/Profile/ProfilePage";
import UserLayout from "../layouts/UserLayout/UserLayout";
import UserManagement from "../pages/Admin/UserManagement/userManagement";
import VaultMaster from "../pages/Vaults/VaultMaster/vaultMaster";
import VaultAirdrop from "../pages/Vaults/VaultAirdrop/vaultAirdrop";
import VaultGameRewards from "../pages/Vaults/VaultGameReward/vaultGameReward";
import VaultMarketing from "../pages/Vaults/VaultMarketing/vaultMarketing";
import VaultReserve from "../pages/Vaults/VaultReserve/vaultReserve";
import RewardCampaign from "../pages/Campaign/rewardCampaign/rewardCampaign";
import CreateCampaign from "../pages/Campaign/createCampaign/createRewardCampaign";
import CampaignDetailPage from "../pages/Campaign/DetailCampaign/CampaignDetailPage";
import { Vault } from "lucide-react";

const privateRoutes = [
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "profile",
        element: <UserProfilePage />,
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
      },
      {
        path: "admin/users",
        element: <UserManagement />,
      },
      {
        path: "vaults/master",
        element: <VaultMaster />,
      },
      {
        path: "vaults/airdrop",
        element: <VaultAirdrop />,
      },
      {
        path: "vaults/gamerewards",
        element: <VaultGameRewards />,
      },
      {
        path: "vaults/marketing",
        element: <VaultMarketing />,
      },
      {
        path: "vaults/reserve",
        element: <VaultReserve />,
      },
      {
        path: "/campaign",
        element: <RewardCampaign />,
      },
      {
        path: "/campaign/rewardlog",
        element: <VaultReserve />,
      },
      {
        path: "/campaign/userrewardhistory",
        element: <VaultReserve />,
      },
      {
        path: "/campaign/create",
        element: <CreateCampaign />,
      },
      {
        path: "/campaign/:id",
        element: <CampaignDetailPage />,
      },

    ],
  },
];

export default privateRoutes;
