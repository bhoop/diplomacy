export function isSameProvince(a, b) {
    return a && b && a.substr(0, 3) === b.substr(0, 3);
}
