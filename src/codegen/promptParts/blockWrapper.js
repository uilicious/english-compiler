/**
 * Wrap the data within a block delimiter,
 * adapted according to the input data, to avoid accidental "block escape"
 * 
 * @param {String} type 
 * @param {String} data 
 */
function blockWrapper(type, data) {
    // Trim the data provided
    data = data.trim();

    // Handle markdown escape
    if( data.indexOf("```") >= 0 ) {
        // Block wrapper line, intentionally split apart, so that this code can eventually be....
        // parsed by the code-ai-project
        let codeLineBreak = "<<" + "{{" + "~~" + "}}" + ">>";

        // Wrap it using special character code lines
        return [
            `${type} (between the \`${codeLineBreak}\` lines) :`,
            codeLineBreak,
            data.replace(/\<\<\{\{/g, "\\<\\<\\{\\{").replace(/\>\>\}\}/g, "\\>\\>\\}\\}"),
            codeLineBreak
        ].join("\n")
    }

    // Wrap it using markdown code block
    return [
        `${type} :`,
        "```",
        data,
        "```"
    ].join("\n")
}
module.exports = blockWrapper;