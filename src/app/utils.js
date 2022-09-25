import dayjs from "dayjs";

const dateFormatter = 'MM/DD/YYYY'
const jsonPrefix = 'data:text/json;charset=utf-8,'
const uuidPattern = /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}/
const urlPattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z\d.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z\d.-]+)((?:\/[+~%/.\w\-_]*)?\??[-+=&;%@.\w_]*#?[.!/\\\w]*)?)/


export const formatDate = (date) => dayjs(date).format(dateFormatter)

export const getClassName = (clazz) => {
    if (!clazz) return null
    if (clazz.includes('.')) {
        let packages = clazz.split('.')
        let className = packages[packages.length - 1]
        return className.trim()
    } else {
        return clazz.trim()
    }
}

export const getDownloadableJson = (data) => jsonPrefix + encodeURIComponent(JSON.stringify(data))

export const getToastMessage = (msg) => {
    if (msg.data) {
        console.log(msg.data)
        return msg.data
    } else {
        console.error(msg.error)
        return msg.error
    }
}

export const isValidUuid = (str) => {
    return uuidPattern.test(str)
}

export const isValidUrl = (url) => {
    return urlPattern.test(url)
}
