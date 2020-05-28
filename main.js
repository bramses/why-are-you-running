let currentSpeed
let aX, aY, aZ
let mainDiv
let accU = 0
let banner
const RUNNING_THRESHOLD = 2.5


const checkForAccelerometer = () => {
    if (window.DeviceMotionEvent == undefined) {
        //No accelerometer is present.
        return new Error('No accelerometer found. This app requires an accelerometer.')
    }
    else {
        // Check if is IOS 13 when page loads.
        if ( window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === 'function' ){

            // Everything here is just a lazy banner. You can do the banner your way.
            banner = document.createElement('div')
            banner.innerHTML = `<div style="z-index: 1; position: absolute; width: 100%; background-color:#fff; color: #000; top: 0; height: 20%; text-align: center;"><p style="padding: 10px; padding-top: 1%; font-size: xx-large; font-family: 'Helvetica';">This app uses your accelerometer. <u>Click this banner to enable it.</u> <br/><br/> And be sure to check your surroundings.<br/><br /> <b>Don't run into anything or anyone!</b></p></div>`
            banner.onclick = ClickRequestDeviceMotionEvent // You NEED to bind the function into a onClick event. An artificial 'onClick' will NOT work.
            document.querySelector('body').appendChild(banner)
        } else {
            return new Error('This app will not work on this device.')
        }
        return 'Accelerometer found'
    }
}

function ClickRequestDeviceMotionEvent () {
    window.DeviceMotionEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          window.addEventListener('devicemotion',
            (e) => { 
                banner.innerHTML = ''
                accelerometerUpdate(e)
            },
            (e) => { throw e }
        )} else {
          console.log('DeviceMotion permissions not granted.')
          mainDiv.innerHTML = `<div class="chilling">DeviceMotion permissions not granted.</div>`
        }
      })
      .catch(e => {
        mainDiv.innerHTML = `<div class="chilling">Error: ${e}</div>`
      })
}

function accelerometerUpdate(event) {
    aX = event.accelerationIncludingGravity.x*1
    aY = event.accelerationIncludingGravity.y*1
    aZ = event.accelerationIncludingGravity.z*1
}

// running can happen along the X or Z axis
const calculateCurrentSpeed = () => {
    if (aX == undefined || aZ == undefined) return 0
    
    return Math.abs(Math.max(aX, aZ))
}

const isRunning = (currentSpeed, runningThreshold = RUNNING_THRESHOLD) => {
    return currentSpeed > runningThreshold
}

const loadDesktopHTML = () => {
    return `
    <div class="chilling">
        <h1>This experience requires a mobile device.</h1>
    </div>
    `
}
     

const loadRunningHTML = () => {
    return `
    <div class="running">
        <h1>WHY ARE YOU RUNNING!?</h1>
        <img src="assets/why-are-you-running.jpg" class="img" alt="why are you running guy" />
    </div>`
}

const loadChillinHTML = () => {
    return `
    <div class="chilling">
        <h1>We cool. Don't start running or anything...</h1>
    </div>
    `
}

const errorHTML = (err) => {
    return`
    <div class="chilling">
        <h1>${err}</h1>
    </div>`
}

const loadDiv = (id) => {
    return document.getElementById(id)
}


const main = () => {
    // setup 
    mainDiv = loadDiv('main')
    const message = checkForAccelerometer()

    if (message instanceof Error) {
        mainDiv.innerHTML = errorHTML(message)
    } else { // normal workflow
        mainDiv.innerHTML = loadChillinHTML()
        setInterval(() => {
            currentSpeed = calculateCurrentSpeed()
            if(isRunning(currentSpeed)) {
                mainDiv.innerHTML = loadRunningHTML()
            } else {
                mainDiv.innerHTML = loadChillinHTML()
            }
        }, 1000)
    }
    
    
    
}

window.addEventListener("load", main)