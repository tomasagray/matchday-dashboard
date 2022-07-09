import moment from "moment";

const dateFormatter = 'MM/DD/YYYY'
const jsonPrefix = 'data:text/json;charset=utf-8,'

export function formatDate(date) {
    return moment(date).format(dateFormatter);
}

export const getClassName = (clazz) => {
    if (!clazz) return null
    if (clazz.includes('.')) {
        let packages = clazz.split('.')
        let className = packages[packages.length -1]
        return className.trim()
    } else {
        return clazz.trim()
    }
}

export const getDownloadableJson = (data) => {
    return jsonPrefix + encodeURIComponent(JSON.stringify(data))
}
