const parseConfidence = (c) => {
    if (!c) return 0;
    c = c.toLowerCase();
    if (c === "h") return 90;
    if (c === "m") return 60;
    if (c === "l") return 30;
    const n = parseFloat(c);
    return isNaN(n) ? 0 : n;
};

export default parseConfidence