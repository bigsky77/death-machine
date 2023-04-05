import {
  ZkConnectButton,
  ZkConnectClientConfig,
  ZkConnectResponse,
  AuthType,
} from "@sismo-core/zk-connect-react";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import axios from "axios";

export const zkConnectConfig: ZkConnectClientConfig = {
  appId: "0x97f25a024703a13d6cf18b84639e4c02",
  devMode: {
    // enable or disable dev mode here to create development groups and use the development vault.
    enabled: true, //process.env.NEXT_PUBLIC_ENV_NAME === "LOCAL" ? true : false,
    devGroups: [
      {
        groupId: "0x7aa0bdfe70617900baa6e45beb5f49f0",
        // Add your dev addresses here to become eligible in the DEV env
        data: [
          "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
        ],
      },
    ],
  },
};

enum followerStatus {
  AlreadyFollower = "already-follower",
  NotFollower = "not-follower",
}

export default function ZKConnectApp({handleWelcomeClose}) {
  const [verifying, setVerifying] = useState(false);
  const [followerStatus, setFollowerStatus] =
    useState<followerStatus | null>(null);
  const [zkConnectResponse, setZkConnectResponse] =
    useState<ZkConnectResponse | null>(null);

  useEffect(() => {
    console.log("followerStatus", followerStatus);
    if (followerStatus === "success") {
      handleWelcomeClose();
    }
  }, [followerStatus]);

  return (
    <>
       <ZkConnectButton
            config={zkConnectConfig}
            claimRequest={{
              groupId: "0x7aa0bdfe70617900baa6e45beb5f49f0",
            }}
            authRequest={{authType: AuthType.ANON}}
            onResponse={(response) => {
              setVerifying(true);
              setZkConnectResponse(response);
              axios
                .post(`/api/subscribe`, {
                  zkConnectResponse: response,
                })
                .then((res) => {
                  setVerifying(false);
                  setFollowerStatus(res.data.status);
                })
                .catch((err) => {
                  setVerifying(false);
                });
            }}
            verifying={verifying}
            overrideStyle={{
              backgroundColor: "#FEB239",
              borderRadius: 2,
              border: '1px solid black',
              boxShadow: '2px 2px 0px #000000',
            }}
          />
    </>
  );
}


