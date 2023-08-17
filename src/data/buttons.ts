import { RPCCallPayload } from "@pexip/plugin-api";

export enum WorkflowOneButtonId {
  ManageParticipant = 'manage-participant',
  RequestLocation = 'request-location',
  ShareStatement = 'share-statement',
  ApproveStatement = 'approve-statement',
  WrapUpMeeting = 'wrap-up-meeting'
}

export enum WorkflowTwoButtonId {
  VideoPhonebook = 'video-phonebook',
  VideoFecc = 'video-fecc',
}

export const workFlowOneButtonConfig: RPCCallPayload<"ui:button:add"> = {
  position: "toolbar",
  icon: "IconMeetings",
  tooltip: "Workflow One",
  roles: ["chair"],
  isActive: true,
  group: [
    {
      id: WorkflowOneButtonId.ManageParticipant,
      position: "toolbar",
      icon: "IconMeetingRoom",
      tooltip: "Manage Participant",
      roles: ["chair"],
    }, {
      id: WorkflowOneButtonId.RequestLocation,
      position: "toolbar",
      icon: "IconRemoteControl",
      tooltip: "Request Location",
      roles: ["chair"],
    }, {
      id: WorkflowOneButtonId.ShareStatement,
      position: "toolbar",
      icon: "IconEdit",
      tooltip: "Share Statement",
      roles: ["chair"],
      isActive: false,
    }, {
      id: WorkflowOneButtonId.ApproveStatement,
      icon: "IconTranscript",
      position: "toolbar",
      roles: ["chair"],
      tooltip: "Approve Statement",
    }, {
      id: WorkflowOneButtonId.WrapUpMeeting,
      icon: "IconLeave",
      position: "toolbar",
      roles: ["chair"],
      tooltip: "Meeting Wrap-up",
    },
  ],
};

export const workFlowTwoButtonConfig: RPCCallPayload<"ui:button:add"> = {
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
    }, {
      id: "video-fecc",
      position: "toolbar",
      icon: "IconSearch",
      tooltip: "Camera Control",
      roles: ["chair"],
    },
  ],
};

export const feccButtonConfig: RPCCallPayload<"ui:button:add"> = {
  position: "toolbar",
  icon: "IconVideoSystems",
  tooltip: "FECC Control",
  roles: ["chair"],
};

export const directoryButtonConfig: RPCCallPayload<"ui:button:add"> = {
  position: "toolbar",
  icon: "IconGroup",
  tooltip: "Phonebook",
  roles: ["chair"],
};

export const promptButtonConfig: RPCCallPayload<"ui:button:add"> = {
  position: "toolbar",
  icon: "IconSupport",
  tooltip: "Open action",
  roles: ["chair", "guest"],
};
