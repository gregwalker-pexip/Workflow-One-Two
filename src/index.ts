import { registerPlugin } from "@pexip/plugin-api";
import { ChecklistElement } from "@pexip/plugin-api";

import {
  WorkFlowOne_Group,
  WorkFlowTwo_Group,
  StatementForm,
  GeolocationPrompt,
  PromptButton,
  FormPrompt,
  roomDirectory,
} from "./data";
//import { logger } from "./logger";

//https://gitlab.com/pexip/zoo/-/tree/main/src/aquila/examples

const plugin = await registerPlugin({
  id: "workflow-demo-plugin",
  version: 0,
});

let selfUiid = "";
let selfName = "";
let selfRole = "";

let conferenceAlias = "";

let selectedParticipant = "";
let selectedParticipantName = "";

let rosterList = null;
let RosterListCount = 0;
let geolocation = null;
let participantListOptions: ChecklistElement["options"]; //Select drop-down
let feccListOptions: ChecklistElement["options"]; //Select drop-down
let directorylistOptions = roomDirectory; //Select drop-down

plugin.events.directMessage.add((message) => {
  void plugin.ui.showToast({
    message: `${message.displayName}: ${message.message}`,
  });
  console.log("Direct Message Recieved: ", message);
});

plugin.events.message.add((message) => {
  console.log("Chat Message Recieved:", message);
});

plugin.events.participants.add((participants) => {
  rosterList = participants;
  RosterListCount = participants.length;
});

const workflowOne_Button = await plugin.ui
  .addButton(WorkFlowOne_Group)
  .catch((e) => {
    console.warn(e);
  });

const workflowTwo_Button = await plugin.ui
  .addButton(WorkFlowTwo_Group)
  .catch((e) => {
    console.warn(e);
  });

workflowOne_Button?.onClick.add(async ({ buttonId }) => {
  if (buttonId === "share-statement") {
    console.log("Share document link");

    plugin.conference.sendMessage({
      payload:
        "Your Statement: " + "https://cms.docs.gov.au/doc-123456789.pdf/",
    });
    plugin.ui.showToast({
      message: "Document link has been shared via chat 💬",
    });

    plugin.conference.sendApplicationMessage({
      payload: { pexCommand: "sharingStatement" },
      participantUuid: selectedParticipant,
    });
  }
  if (buttonId === "approve-statement") {
    console.log("Request statement approval");

    plugin.conference.sendApplicationMessage({
      payload: { pexCommand: "requestSignStatement" },
      participantUuid: selectedParticipant,
    });
    plugin.ui.showToast({
      message: "Approval request sent...",
    });
  }

  if (buttonId === "location-request") {
    plugin.conference.sendApplicationMessage({
      payload: { pexCommand: "requestGeolocation" },
      participantUuid: selectedParticipant,
    });
    plugin.ui.showToast({ message: "Location request pending 📌" });
  }

  if (buttonId === "meeting-wrapup") {
    const input = await plugin.ui.addForm({
      title: "Meeting Wrap-up",
      description: "What would you like to do?",
      form: {
        elements: {
          actionList: {
            name: "Action List:",
            type: "select",
            options: [
              { id: "endMeeting", label: "End Meeting" },
              { id: "leaveMeeting", label: "Leave Meeting" },
              { id: "somethingElse", label: "Something Else Perhaps" },
            ],
          },
        },
        submitBtnTitle: "Apply",
      },
    });

    input.onInput.add((formInput) => {
      var selectedWrapupOption = formInput.actionList;
      console.log("Wrap-up Selection: ", selectedWrapupOption);

      input.remove();

      if (selectedWrapupOption === "endMeeting") {
        var disconnectAll = plugin.conference.disconnectAll({});
        plugin.ui.showToast({ message: "The meeting is ending..." });
      }

      if (selectedWrapupOption === "leaveMeeting") {
        //This needs some attention as not working (me = uuid)

        var disconnectSelf = plugin.conference.disconnect({
          participantUuid: selfUiid,
        });
        plugin.ui.showToast({ message: "You are leaving the meeting..." });
      }

      if (selectedWrapupOption === "somethingElse") {
        plugin.ui.showToast({
          message: "Have a great day 🎈",
        });
      }
    });
  }

  if (buttonId === "manage-participant") {
    console.log("Checklist Options: ", participantListOptions);

    const input = await plugin.ui.addForm({
      title: "Manage Participant",
      description: "Select participant for interaction.",
      form: {
        elements: {
          participantList: {
            name: "Participant:",
            type: "select",
            options: participantListOptions,
          },
          meetingOptions: {
            name: "Meeting Options:",
            type: "checklist",
            options: [
              { id: "spotlightUser", label: "Spotlight User", checked: true },
              {
                id: "spotlightSelf",
                label: "Spotlight Self (secondary)",
                checked: true,
              },
              { id: "focusLayout", label: "Focussed Layout (1:1)" },
              { id: "lockConference", label: "Lock Meeting" },
            ],
          },
        },
        submitBtnTitle: "Apply",
      },
    });

    input.onInput.add((formInput) => {
      selectedParticipant = formInput.participantList;
      input.remove();
      const meetingOptions = formInput.meetingOptions;
      setConference(meetingOptions);
      setSpotlight(meetingOptions);
    });
    //logger.debug(input);
  }
});

workflowTwo_Button?.onClick.add(async ({ buttonId }) => {
  if (buttonId === "video-phonebook") {
    const input = await plugin.ui.addForm({
      title: "Video System Phonebook",
      description: "Select a video system to call.",
      form: {
        elements: {
          directoryList: {
            name: "",
            type: "select",
            options: roomDirectory.videoRooms,
          },
        },
        submitBtnTitle: "Call",
      },
    });

    await input.onInput.add((formInput) => {
      const selectedRoom = formInput.directoryList;
      if (selectedRoom) {
        plugin.conference.dialOut({ destination: selectedRoom, role: "GUEST" });
        plugin.ui.showToast({
          message: "📞 Calling " + selectedRoom,
        });
      }
      input.remove();
    });
  }
  if (buttonId === "video-fecc") {
    let urlPop;
    const input = await plugin.ui.addForm({
      title: "Far End Camera Control",
      description: "Control video systems remote camera",
      form: {
        elements: {
          feccList: {
            name: "Select video system (FECC enabled):",
            type: "select",
            options: feccListOptions,
          },
          hostPIN: {
            name: "Host PIN (if required):",
            type: "password",
          },
        },
        opensPopup: {
          id: "mypopUpId",
          openParams: [urlPop, "", "width=200,height=200"],
        },
        submitBtnTitle: "Select",
      },
    });

    await input.onInput.add((formInput) => {
      var feccSelection = formInput.feccList;
      var hostPIN = formInput.hostPIN;

      if (feccSelection && feccSelection !== "0") {
        urlPop =
          //"https://sandbox.pex.me/greg/fecc/?u=" +

          "https://au.pextest.com/sapol-fecc-web-v3/branding/plugins/sapol-plugin/fecc.web/?u=" +
          feccSelection +
          "&c=" +
          conferenceAlias +
          "&n=" +
          selfName +
          "&x=" +
          btoa(hostPIN);

        console.log("Dynamic URL -> Pop-up: ", urlPop);
      }

      input.remove();
    });
  }
});

plugin.events.me.add((self) => {
  selfUiid = self.uuid;
  selfName = self.displayName;
  selfRole = self.role;
  //console.log("Self: ", self);
});

plugin.events.connected.add(() => {
  //plugin.ui.showToast({ message: "You are connected!!!!!" });
});

function setConference(meetingOptions) {
  if (meetingOptions["focusLayout"] === true) {
    var setLayout = plugin.conference.setLayout({
      transforms: { layout: "1:0" },
    });
  } else {
    var setLayout = plugin.conference.setLayout({
      transforms: { layout: "1:7" },
    });
  }

  if (meetingOptions["lockConference"] === true) {
    var lockconference = plugin.conference.lock({
      lock: true,
    });
  } else {
    var lockconference = plugin.conference.lock({
      lock: false,
    });
  }
}

function setSpotlight(meetingOptions) {
  clearAllSpotlights();

  //Spotlight Participants
  if (meetingOptions["spotlightUser"] === true) {
    var setSpotlight = plugin.conference.spotlight({
      enable: true,
      participantUuid: selectedParticipant,
    });
  } else {
    var setSpotlight = plugin.conference.spotlight({
      enable: false,
      participantUuid: selectedParticipant,
    });
  }

  //Spotlight Self
  if (meetingOptions["spotlightSelf"] === true) {
    var setSpotlight = plugin.conference.spotlight({
      enable: true,
      participantUuid: selfUiid,
    });
  } else {
    var setSpotlight = plugin.conference.spotlight({
      enable: false,
      participantUuid: selfUiid,
    });
  }
}

function clearAllSpotlights() {
  try {
    //console.log("Participant List: ", participantListOptions)
    participantListOptions.forEach((element) => {
      var uuid = element.id;
      var setSpotlight = plugin.conference.spotlight({
        enable: false,
        participantUuid: uuid,
      });
    });
  } catch (error) {}
}

const applicationMessageReceiver = plugin.events.applicationMessage.add(
  async (message) => {
    let appMsg = JSON.stringify(message.message);
    console.log("Application Message:", message);

    const applicationSenderID = message.userId;

    if (appMsg.includes("requestGeolocation")) {
      void plugin.ui.showToast({
        message: `${message.displayName} has requested your location 📌`,
      });

      const input = await plugin.ui.showPrompt(GeolocationPrompt);

      if (input === "Accept") {
        const pos = null;
        const geoLoc = navigator.geolocation;

        if (geoLoc) {
          let id = geoLoc.watchPosition(
            (position: Position) => {
              console.log(position);

              let geoInfo =
                "Latitude/Longitude(Accuracy): " +
                position.coords.latitude +
                ", " +
                position.coords.longitude +
                " (" +
                position.coords.accuracy.toFixed() +
                "m)";

              let googleMapLink =
                "https://www.google.com/maps/search/?api=1&query=" +
                position.coords.latitude +
                "," +
                position.coords.longitude;

              console.log(geoInfo);
              console.log(googleMapLink);

              plugin.conference.sendMessage({
                payload:
                  "📌 Location (~" +
                  position.coords.accuracy.toFixed() +
                  "m): " +
                  googleMapLink,
              });

              geoLoc.clearWatch(id);
            },
            (err: PositionError) => {
              plugin.conference.sendMessage({
                payload: "📌 Location not available",

                // + err.message,
              });
              console.log("📌", err);
            },
            {
              enableHighAccuracy: true,
              timeout: 1000,
            }
          );
        }
      } else {
        //On dismiss button
        plugin.conference.sendMessage({
          payload: "📌 Location request denied",
        });
      }
    }

    if (appMsg.includes("sharingStatement")) {
      void plugin.ui.showToast({
        message: `${message.displayName} has shared statement via chat 💬`,
      });
      plugin.conference.sendMessage({
        payload: "🧾 User has recieved statement link for review",
      });
    }

    if (appMsg.includes("requestSignStatement")) {
      void plugin.ui.showToast({
        message: `${message.displayName} Please approve statement `,
      });
      const input = await plugin.ui.addForm(StatementForm);

      input.onInput.add((formInput) => {
        plugin.conference.sendMessage({
          payload: "✅ Statement has been signed: " + formInput.name,
        });
        plugin.conference.sendMessage({
          payload: "✅ Statement has been signed: " + formInput.name,
          participantUuid: applicationSenderID,
        });
        input.remove();
      });
    }
  }
);

// Populates drop-down select list based on active participant (optionally filtered)
plugin.events.participants.add((participants) => {
  const particpantRoster = participants.map((participant, index) => ({
    id: participant.uuid,
    label: participant.displayName.replace("sip:", ""),
  }));
  participantListOptions = particpantRoster;

  const feccParticipants = participants
    .filter((participant) => participant.canFecc === true)
    .map((participant, index) => ({
      id: participant.uuid,
      label: participant.displayName.replace("sip:", ""),
    }));

  if (feccParticipants.length === 0) {
    feccListOptions = [{ id: "0", label: "NONE" }]; //Empty FECC list - no FECC devices are in call
  } else {
    feccListOptions = feccParticipants;
  }
});

plugin.events.participantJoined.add((participant) => {
  if (participant.uuid !== selfUiid) {
    void plugin.ui.showToast({
      message: `${participant.displayName.replace(
        "sip:",
        ""
      )} has joined call 👋`,
    });
  }
});

plugin.events.participantLeft.add((participant) => {
  if (participant.uuid !== selfUiid) {
    void plugin.ui.showToast({
      message: `${participant.displayName.replace(
        "sip:",
        ""
      )} has left call 👋`,
    });
  }
});

plugin.events.authenticatedWithConference.add((alias) => {
  conferenceAlias = alias.conferenceAlias;
});

//Popups - Red squigggles Not Working!!!!!!

const promptBtn = await plugin.ui.addButton(PromptButton);
const onPromptButtonClick = async () => {
  await plugin.ui.showPrompt(FormPrompt);
};

await promptBtn.onClick.add(onPromptButtonClick);

window.plugin.popupManager.add("form-docs", (input) => {
  console.log("Popup MSDN");
  if (input.action === FormPrompt.prompt.primaryAction) {
    return true;
  }
  return false;
});
