const asciiGenerator = (stringValue) => {
    const asciiValues = Array.from(stringValue, char => char.charCodeAt(0));
    const codeData = asciiValues?.reduce((acc, elm) => acc + elm, 0)
    return codeData
}

export default asciiGenerator