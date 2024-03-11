
const swDev = async () => {
    let swUrl = `${process.env.PUBLIC_URL}/sw.js`
    
    const resp = await navigator.serviceWorker.register(swUrl)
    if (resp) {
        console.warn("Response: ",resp)
    }
}

export default swDev