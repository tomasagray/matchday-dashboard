import dayjs from "dayjs";


const dateFormatter = 'MM/DD/YYYY'
const dateTimeFormatter = 'YYYY-MM-DDTHH:mm:ss'
const uuidPattern = /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}/

export const compareVersions = (v1, v2) => {
    return v1.localeCompare(v2, undefined, {numeric: true, sensitivity: 'base'})
}

export const copyToClipboard = (txt) => {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(txt)
    } else {
        // non-SSL
        let textArea = document.createElement('textarea')
        textArea.value = txt
        // make the textarea out of viewport
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        return new Promise((res, rej) => {
            document.execCommand('copy') ? res() : rej()
            textArea.remove()
        })
    }
}

export const createEnum = (values) => {
    const enumObject = {}
    for (let i = 0; i < values.length; i++) {
        let key = values[i]
        enumObject[key] = i
    }
    return Object.freeze(enumObject)
}

export const downloadData = (data, filename) => {
    const a = document.createElement('a')
    a.href = 'data:text;charset=utf-8,' + data
    a.setAttribute('download', filename)
    a.click()
}

export const formatArtworkData = (art) => {
    let collection = []
    let {collection: artwork, ...metadata} = art
    if (artwork !== null) {
        let {_embedded: embedded} = artwork
        collection = embedded ? embedded['artworks'] : []
    }
    return {...metadata, collection}
}

export const formatDate = (date) => dayjs(date).format(dateFormatter)

export const formatDateTime = (date) => dayjs(date).format(dateTimeFormatter)

export const formatTime = (s) => {
    if (isNaN(s) || s === Infinity) {
        return 0
    }
    let seconds = Math.round(s);
    let dateStr = new Date(seconds * 1000).toISOString()
    if (seconds < 3600) {
        return dateStr.substring(14, 19)
    } else {
        return dateStr.substring(11, 16)
    }
}

export const getArtworkUrl = (entity, role, hash) => {
    if (entity) {
        let {_links: links} = entity
        if (links) {
            let link = new URL(links[role]['href'])
            if (hash) link.searchParams.set('hash', hash)
            return link.toString()
        }
    }
}

export const getUploadArtwork = (collection) => {
    let artworks = collection ? [...collection.collection] : []
    return {
        ...collection,
        collection: {
            _embedded: {
                artworks,
            }
        }
    }
}

export const getClassName = (clazz) => {
    if (!clazz) {
        return null
    }
    if (clazz.includes('.')) {
        let packages = clazz.split('.')
        let className = packages[packages.length - 1]
        return className.trim()
    } else {
        return clazz.trim()
    }
}

export const getDownloadableJson = (data, pretty = true) => {
    return pretty ?
        encodeURIComponent(JSON.stringify(data, null, 1)) :
        encodeURIComponent(JSON.stringify(data))
}

export const getToastMessage = (msg) => {
    try {
        if (msg.data) {
            if (typeof msg.data === 'object') {
                return `(${msg.data.status}) ${msg.data.message}`
            }
            return msg.data;
        } else {
            console.error(msg.error)
            return msg.error
        }
    } catch (e) {
        console.error('error processing toast message', e)
        return msg
    }
}

export const isValidUrl = (url) => {
    let _url
    try {
        _url = new URL(url)
    } catch (_) {
        return false
    }
    return _url.protocol === 'http:' || _url.protocol === 'https:'
}

export const isValidUuid = (str) => {
    return uuidPattern.test(str)
}

export const setBackgroundImage = (url) => {
    const bg = document.getElementsByClassName('Background-container')[0]
    if (bg) {
        bg['style'].backgroundImage = `url(${url})`
    }
}

export const updateSelectedArtwork = (selectedId, artworkCollection) => {
    let collection = Object.values(artworkCollection)
    let selectedIndex = 0
    let updatedCollection = []
    for (let i = 0; i < collection.length; i++) {
        if (collection[i].id === selectedId) {
            selectedIndex = i
            updatedCollection[i] = {
                ...collection[i],
                selected: true,
            }
        } else {
            updatedCollection[i] = {
                ...collection[i],
                selected: false,
            }
        }
    }
    return {selectedIndex, updatedCollection}
}
