import type { PopupRequest, RPCCallPayload } from "@pexip/plugin-api";

import {
  myName,
} from "./index";

export const WorkFlowOne_Group: RPCCallPayload<"ui:button:add"> = {
  id: "workflowOne",
  position: "toolbar",
  icon: "IconMeetings",
  tooltip: "Workflow One",
  roles: ["chair"],
  isActive: true,
  group: [
    {
      id: "manage-participant",
      position: "toolbar",
      icon: "IconMeetingRoom",
      tooltip: "Manage Participant",
      roles: ["chair"],
    },
    {
      id: "location-request",
      position: "toolbar",
      icon: "IconRemoteControl",
      tooltip: "Request Location",
      roles: ["chair"],
    },
    {
      id: "share-statement",
      position: "toolbar",
      icon: "IconEdit",
      tooltip: "Share Statement",
      roles: ["chair"],
      isActive: false,
    },
    {
      id: "approve-statement",
      icon: "IconTranscript",
      position: "toolbar",
      roles: ["chair"],
      tooltip: "Approve Statement",
    },
    {
      id: "meeting-wrapup",
      icon: "IconLeave",
      position: "toolbar",
      roles: ["chair"],
      tooltip: "Meeting Wrap-up",
    },
  ],
};

export const GeolocationPrompt: RPCCallPayload<"ui:prompt:open"> = {
  title: "Location Sharing Request",
  description:
    "Please accept this location request for evidence validation purposes.",
  prompt: {
    primaryAction: "Accept",
    secondaryAction: "Dismiss",
  },
};

export const StatementForm = {
  title: "Statement Approval",
  description:
    "I confirm the provided statement as being accurate and true.",
  form: {
    elements: {
      name: {
        placeholder: "Your Full Legal Name",
        type: "text",
        isOptional: false,
      },
      agreement: {
        type: "checklist",
        options: [
          {
            id: "falseStatementCheck",
            label:
              "I understand the concequences of making a false police report.",
          },
        ],
        isOptional: false,
      },
    },
    id: "submit-signing",
    submitBtnTitle: "SUBMIT",
  },
} as const;

export const FeccButton: RPCCallPayload<"ui:button:add"> = {
  position: "toolbar",
  icon: "IconVideoSystems",
  tooltip: "FECC Control",
  roles: ["chair"],
};

export const DirectoryButton: RPCCallPayload<"ui:button:add"> = {
  position: "toolbar",
  icon: "IconGroup",
  tooltip: "Phonebook",
  roles: ["chair"],
};

export const WorkFlowTwo_Group: RPCCallPayload<"ui:button:add"> = {
  id: "workflowTwo",
  position: "toolbar",
  icon: "IconVideoSystems",
  tooltip: "Workflow Two",
  roles: ["chair"],
  isActive: true,
  group: [
    {
      id: "video-phonebook",
      position: "toolbar",
      icon: "IconMeetingRoom",
      tooltip: "Phonebook",
      roles: ["chair"],
    },
    {
      id: "video-fecc",
      position: "toolbar",
      icon: "IconSearch",
      tooltip: "Camera Control",
      roles: ["chair"],
    },
  ],
};

export const roomDirectory = {
  locations: [
    {
      id: "01",
      label: "Metro 1",
    },
    {
      id: "02",
      label: "Metro 2",
    },
    {
      id: "03",
      label: "Metro 3",
    },
    {
      id: "04",
      label: "Remote 1",
    },
  ],
  videoRooms: [
    {
      label: "Pexip Sydney - Building B01",
      location: "Pexip Sydney Office",
      description: "Building B01, Ground Floor",
      id: "syd-sx80@pexip.com",
    },
    {
      label: "Metro 1 - MedKart A03 Teams",
      location: "Metro 1",
      description: "Building A - Teams Basement",
      id: "teams@pexip.com",
    },
    {
      label: "Metro 1 - MedKart A06 ICU",
      location: "Metro 1",
      description: "Building A",
      id: "greggie-trio8800@gw.onpexip.com",
    },
    {
      label: "Metro 1 - MedKart B63 ED",
      location: "Metro 1",
      description: "Building B - Ward #17",
      id: "123433",
    },
    {
      label: "Metro 2 - MedKart B83 Ward7",
      location: "Metro 2",
      description: "Building B - Ward #83",
      id: "123455",
    },
    {
      label: "Metro 2 - MedKart B13 Ward9",
      location: "Metro 2",
      description: "Building B - Ward #13",
      id: "123458",
    },
    {
      label: "Metro 1 - MedKart C3 Ward99",
      location: "Metro 1",
      description: "Building C - General #1",
      id: "123477",
    },
    {
      label: "Remote 1 - MedKart A1 General",
      location: "Remote 1",
      description: "Building A - General - #1",
      id: "123521",
    },
    {
      label: "Remote 1 - MedKart A2 General",
      location: "Remote 1",
      description: "Building A - General - #2",
      id: "123522",
    },
    {
      label: "Metro 1 - MedKart B2 Z99 Training",
      location: "Metro 1",
      description: "Building Z - Ground Floor",
      id: "123422",
    },
    {
      label: "Metro 2 - MedKart M2 G99 Engineering",
      location: "Metro 2",
      description: "Building K - Ground Floor",
      id: "123442",
    },
    {
      label: "Metro 2 - Chemo G4 C1",
      location: "Metro 2",
      description: "Building A - 8th Floor",
      id: "123442",
    },
  ],
} as const;

export const PromptButton: RPCCallPayload<"ui:button:add"> = {
  position: "toolbar",
  icon: "IconSupport",
  tooltip: "Open action",
  roles: ["chair", "guest"],
};

export const FormPrompt: RPCCallPayload<"ui:prompt:open"> = {
  title: "Popup Confirmation",
  description: "Please confirm access camera control" ,
  prompt: {
    primaryAction: "Access",
    secondaryAction: "Close",
  },
  opensPopup: {
    id: "form-docs",
    openParams: [
      "https://au.pextest.com/sapol-local/m/sapol",
      "",
      "width=200,height=200",
    ],
  },
};
