// Labels to use
const human = [
    "human",
    "instructor",
    "developer",

    "Human",
    "Instructor",
    "Developer"
];
const assistant = [
    "assitant",
    "Assitant",
    "AI assistant",
    "AI Assistant",
    "AI Agent",
    "AI agent",
    "AI"
]

/**
 * Given the spec object, get the respective human and assitant labels,
 * We intentionally rotate among a few labels to avoid overtraining a keyword.
 * 
 * @param {Object} specObj 
 */
module.exports = function getAgentLabels( specObj ) {
    let keyId = ((specObj && specObj.name) || "").length;
    return {
        human: human[ keyId % human.length ] || human[0],
        assistant: assistant[ keyId % assistant.length ] || assistant[0]
    }
}