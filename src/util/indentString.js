module.exports = function indentString(str, count = 1, indent = ' ', includeEmptyLines = true) {
	if (count === 0) {
		return str;
	}
	const regex = includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
	return str.replace(regex, indent.repeat(count));
}