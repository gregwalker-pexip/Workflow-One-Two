export const statementFormConfig = {
  title: "Statement Approval",
  description: "I confirm the provided statement as being accurate and true.",
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
              "I understand the consequences of making a false police report.",
          },
        ],
        isOptional: false,
      },
    },
    id: "submit-signing",
    submitBtnTitle: "SUBMIT",
  },
};
