const getMedia = (path) => {
    return `${import.meta.env.VITE_PUBLIC_BASE_URL}/media/${path}`
}

export default getMedia